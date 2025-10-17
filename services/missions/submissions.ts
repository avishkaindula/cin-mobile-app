import { supabase } from "@/lib/supabase";
import { Tables, Database } from "@/lib/database.types";

// Type definitions for mission submissions and evidence
export type MissionSubmission = Tables<"mission_submissions">;

export interface GuidanceStep {
  id: string;
  icon: string;
  title: string;
  description: string;
  requiredEvidence: string[]; // ["photo", "video", "text", "audio", "document"]
}

export interface EvidenceItem {
  type: "photo" | "video" | "text";
  data: string; // For photos/videos: storage path, for text: the text content
  metadata?: Record<string, any>; // Additional metadata like file size, duration, etc.
  uploadedAt: string;
}

export interface StepEvidence {
  stepId: string;
  evidence: EvidenceItem[];
  completedAt?: string;
  notes?: string;
}

export interface SubmissionProgress {
  submissionId: string;
  missionId: string;
  status: string;
  stepsCompleted: Record<string, StepEvidence>;
  currentStepIndex: number;
  totalSteps: number;
  progressPercentage: number;
  lastUpdated: string;
}

/**
 * Get or create a mission submission for the current user
 */
export async function getOrCreateMissionSubmission(
  missionId: string
): Promise<{ data: MissionSubmission | null; error: string | null }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { data: null, error: "Authentication required" };
    }

    // Check if submission already exists
    const { data: existingSubmission, error: fetchError } = await supabase
      .from("mission_submissions")
      .select("*")
      .eq("agent_id", user.id)
      .eq("mission_id", missionId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      return { data: null, error: fetchError.message };
    }

    if (existingSubmission) {
      return { data: existingSubmission, error: null };
    }

    // Create new submission if it doesn't exist
    const { data: newSubmission, error: createError } = await supabase
      .from("mission_submissions")
      .insert({
        agent_id: user.id,
        mission_id: missionId,
        status: "started",
        guidance_evidence: {},
      })
      .select()
      .single();

    if (createError) {
      return { data: null, error: createError.message };
    }

    return { data: newSubmission, error: null };
  } catch (error) {
    console.error("Error getting/creating mission submission:", error);
    return { data: null, error: "Failed to get or create submission" };
  }
}

/**
 * Get submission progress for a mission
 */
export async function getSubmissionProgress(
  missionId: string
): Promise<{ data: SubmissionProgress | null; error: string | null }> {
  try {
    const { data: submission, error: submissionError } = await getOrCreateMissionSubmission(missionId);
    
    if (submissionError || !submission) {
      return { data: null, error: submissionError };
    }

    // Get mission guidance steps
    const { data: mission, error: missionError } = await supabase
      .from("missions")
      .select("guidance_steps")
      .eq("id", missionId)
      .single();

    if (missionError) {
      return { data: null, error: missionError.message };
    }

    const guidanceSteps = (mission.guidance_steps as unknown as GuidanceStep[]) || [];
    const evidenceData = (submission.guidance_evidence as Record<string, any>) || {};

    // Process evidence into StepEvidence format
    const stepsCompleted: Record<string, StepEvidence> = {};
    let completedStepCount = 0;

    guidanceSteps.forEach((step) => {
      const stepEvidence = evidenceData[step.id];
      if (stepEvidence && Array.isArray(stepEvidence) && stepEvidence.length > 0) {
        stepsCompleted[step.id] = {
          stepId: step.id,
          evidence: stepEvidence,
          completedAt: stepEvidence[0]?.uploadedAt || new Date().toISOString(),
        };
        completedStepCount++;
      }
    });

    const progressPercentage = guidanceSteps.length > 0 
      ? Math.round((completedStepCount / guidanceSteps.length) * 100) 
      : 0;

    // Find current step index (first incomplete step)
    let currentStepIndex = 0;
    for (let i = 0; i < guidanceSteps.length; i++) {
      if (!stepsCompleted[guidanceSteps[i].id]) {
        currentStepIndex = i;
        break;
      }
      if (i === guidanceSteps.length - 1) {
        currentStepIndex = guidanceSteps.length; // All steps completed
      }
    }

    const progress: SubmissionProgress = {
      submissionId: submission.id,
      missionId: submission.mission_id,
      status: submission.status,
      stepsCompleted,
      currentStepIndex,
      totalSteps: guidanceSteps.length,
      progressPercentage,
      lastUpdated: submission.updated_at,
    };

    return { data: progress, error: null };
  } catch (error) {
    console.error("Error getting submission progress:", error);
    return { data: null, error: "Failed to get submission progress" };
  }
}

/**
 * Submit evidence for a specific step
 */
export async function submitStepEvidence(
  missionId: string,
  stepId: string,
  evidence: Omit<EvidenceItem, "uploadedAt">[]
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: "Authentication required" };
    }

    // Get existing submission
    const { data: submission, error: submissionError } = await getOrCreateMissionSubmission(missionId);
    
    if (submissionError || !submission) {
      return { success: false, error: submissionError };
    }

    // Add timestamp to evidence items
    const timestampedEvidence: EvidenceItem[] = evidence.map(item => ({
      ...item,
      uploadedAt: new Date().toISOString(),
    }));

    // Update guidance_evidence JSON
    const currentEvidence = (submission.guidance_evidence as Record<string, any>) || {};
    const updatedEvidence = {
      ...currentEvidence,
      [stepId]: timestampedEvidence,
    };

    // Check if this completes all steps
    const { data: mission, error: missionError } = await supabase
      .from("missions")
      .select("guidance_steps")
      .eq("id", missionId)
      .single();

    if (missionError) {
      return { success: false, error: missionError.message };
    }

    const guidanceSteps = (mission.guidance_steps as unknown as GuidanceStep[]) || [];
    const allStepsCompleted = guidanceSteps.every(step => updatedEvidence[step.id] && updatedEvidence[step.id].length > 0);

    // Determine new status
    let newStatus = submission.status;
    if (allStepsCompleted && submission.status !== "completed") {
      newStatus = "completed";
    } else if (Object.keys(updatedEvidence).length > 0 && submission.status === "started") {
      newStatus = "in_progress";
    }

    // Update submission
    const updateData: any = {
      guidance_evidence: updatedEvidence,
      status: newStatus,
      updated_at: new Date().toISOString(),
    };

    if (allStepsCompleted && submission.status !== "completed") {
      updateData.completed_at = new Date().toISOString();
    }

    const { error: updateError } = await supabase
      .from("mission_submissions")
      .update(updateData)
      .eq("id", submission.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    // If submission is completed, trigger point/energy transactions
    if (allStepsCompleted && submission.status !== "completed") {
      console.log("🚀 All steps completed! Triggering completion rewards...");
      console.log("Previous status:", submission.status, "New status:", newStatus);
      await triggerCompletionRewards(submission.id);
    } else {
      console.log("📝 Steps progress:", {
        completedSteps: Object.keys(updatedEvidence).length,
        totalSteps: guidanceSteps.length,
        allCompleted: allStepsCompleted,
        currentStatus: submission.status
      });
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error submitting step evidence:", error);
    return { success: false, error: "Failed to submit evidence" };
  }
}

/**
 * Upload a file to mission submissions storage
 */
export async function uploadEvidenceFile(
  file: File | Blob | Uint8Array | ArrayBuffer,
  fileName: string,
  missionId: string,
  stepId: string
): Promise<{ data: { path: string } | null; error: string | null }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { data: null, error: "Authentication required" };
    }

    // Create a unique file path
    const timestamp = Date.now();
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${timestamp}_${stepId}.${fileExtension}`;
    const filePath = `${user.id}/${missionId}/${uniqueFileName}`;

    // Determine content type from file extension
    const contentType = getContentType(fileExtension || '');

    const { data, error } = await supabase.storage
      .from("mission-submissions")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType,
      });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: { path: data.path }, error: null };
  } catch (error) {
    console.error("Error uploading evidence file:", error);
    return { data: null, error: "Failed to upload file" };
  }
}

/**
 * Helper function to determine content type from file extension
 */
function getContentType(extension: string): string {
  const ext = extension.toLowerCase();
  const types: Record<string, string> = {
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    // Videos
    'mp4': 'video/mp4',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
    'webm': 'video/webm',
    // Audio
    'm4a': 'audio/m4a',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    // Documents
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'txt': 'text/plain',
  };
  return types[ext] || 'application/octet-stream';
}

/**
 * Get a signed URL for an evidence file
 */
export async function getEvidenceFileUrl(filePath: string): Promise<string | null> {
  try {
    const { data } = await supabase.storage
      .from("mission-submissions")
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    return data?.signedUrl || null;
  } catch (error) {
    console.error("Error getting evidence file URL:", error);
    return null;
  }
}

/**
 * Delete evidence for a specific step (allows re-submission)
 */
export async function deleteStepEvidence(
  missionId: string,
  stepId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: "Authentication required" };
    }

    // Get existing submission
    const { data: submission, error: submissionError } = await getOrCreateMissionSubmission(missionId);
    
    if (submissionError || !submission) {
      return { success: false, error: submissionError };
    }

    // Update guidance_evidence JSON to remove the step
    const currentEvidence = (submission.guidance_evidence as Record<string, any>) || {};
    const updatedEvidence = { ...currentEvidence };
    delete updatedEvidence[stepId];

    // Update status based on remaining evidence
    let newStatus = "started";
    if (Object.keys(updatedEvidence).length > 0) {
      newStatus = "in_progress";
    }

    const { error: updateError } = await supabase
      .from("mission_submissions")
      .update({
        guidance_evidence: updatedEvidence,
        status: newStatus,
        completed_at: null, // Clear completion timestamp
      })
      .eq("id", submission.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting step evidence:", error);
    return { success: false, error: "Failed to delete evidence" };
  }
}

/**
 * Trigger completion rewards (points and energy transactions)
 */
async function triggerCompletionRewards(submissionId: string): Promise<void> {
  try {
    console.log("🎯 Triggering completion rewards for submission:", submissionId);
    
    // Use the new auto-completion function that awards points immediately
    const { data, error } = await supabase.rpc("auto_complete_mission_submission", {
      p_submission_id: submissionId,
    });

    if (error) {
      console.error("❌ Error triggering completion rewards:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
    } else if (data) {
      console.log("✅ Mission completion result:", JSON.stringify(data, null, 2));
      if (data.success && data.completed) {
        console.log(`🎉 Awarded ${data.points_awarded} points and ${data.energy_awarded} energy!`);
      } else {
        console.log("ℹ️ Mission not completed or already processed:", data.message);
      }
    } else {
      console.log("⚠️ No data returned from completion function");
    }
  } catch (error) {
    console.error("❌ Exception in triggerCompletionRewards:", error);
  }
}

/**
 * Get all submissions for a user (for tracking completed missions)
 */
export async function getUserSubmissions(): Promise<{
  data: (MissionSubmission & { mission_title?: string; mission_points?: number; mission_energy?: number })[] | null;
  error: string | null;
}> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { data: null, error: "Authentication required" };
    }

    const { data: submissions, error: submissionsError } = await supabase
      .from("mission_submissions")
      .select(`
        *,
        missions!inner(
          title,
          points_awarded,
          energy_awarded
        )
      `)
      .eq("agent_id", user.id)
      .order("updated_at", { ascending: false });

    if (submissionsError) {
      return { data: null, error: submissionsError.message };
    }

    // Transform data to include mission info
    const enrichedSubmissions = submissions.map((submission: any) => ({
      ...submission,
      mission_title: submission.missions?.title,
      mission_points: submission.missions?.points_awarded,
      mission_energy: submission.missions?.energy_awarded,
    }));

    return { data: enrichedSubmissions, error: null };
  } catch (error) {
    console.error("Error getting user submissions:", error);
    return { data: null, error: "Failed to get user submissions" };
  }
}
