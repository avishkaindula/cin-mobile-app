import { supabase } from "@/lib/supabase";
import { Mission, MissionWithStats } from "./index";

export interface MissionInstruction {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface GuidanceStep {
  id: string;
  icon: string;
  title: string;
  description: string;
  requiredEvidence: string[];
}

/**
 * Get detailed mission information including instructions and guidance steps
 */
export async function getMissionDetails(missionId: string): Promise<{
  data: MissionWithStats | null;
  error: string | null;
}> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { data: null, error: "Authentication required" };
    }

    const { data: mission, error: missionError } = await supabase
      .from("missions")
      .select(`
        *,
        organizations!inner(name),
        mission_submissions(
          id,
          agent_id,
          status,
          guidance_evidence,
          created_at,
          updated_at
        ),
        mission_bookmarks!left(
          id,
          agent_id
        )
      `)
      .eq("id", missionId)
      .single();

    if (missionError) {
      return { data: null, error: missionError.message };
    }

    // Transform to include stats and user-specific data
    const submissions = mission.mission_submissions || [];
    const bookmarks = mission.mission_bookmarks || [];
    
    const uniqueParticipants = new Set(submissions.map((s: any) => s.agent_id));
    const completedSubmissions = submissions.filter((s: any) => s.status === "reviewed");
    const isBookmarked = bookmarks.some((b: any) => b.agent_id === user.id);
    const userSubmission = submissions.find((s: any) => s.agent_id === user.id);
    
    const missionWithStats: MissionWithStats = {
      ...mission,
      organization_name: mission.organizations?.name || "Unknown Organization",
      participants_count: uniqueParticipants.size,
      submissions_count: submissions.length,
      completed_submissions_count: completedSubmissions.length,
      is_bookmarked: isBookmarked,
      submission_status: userSubmission?.status || null,
      submission_progress: userSubmission ? calculateSubmissionProgress(userSubmission, mission) : 0,
    };

    return { data: missionWithStats, error: null };
  } catch (error) {
    console.error("Error fetching mission details:", error);
    return { data: null, error: "Failed to fetch mission details" };
  }
}

/**
 * Get parsed instructions from mission data
 */
export function getMissionInstructions(mission: Mission): MissionInstruction[] {
  if (!mission.instructions || !Array.isArray(mission.instructions)) {
    return [];
  }

  try {
    return mission.instructions.map((instruction: any, index: number) => ({
      id: instruction.id || `instruction-${index}`,
      icon: instruction.icon || "target",
      title: instruction.title || `Step ${index + 1}`,
      description: instruction.description || "",
    }));
  } catch (error) {
    console.error("Error parsing mission instructions:", error);
    return [];
  }
}

/**
 * Get parsed guidance steps from mission data
 */
export function getMissionGuidanceSteps(mission: Mission): GuidanceStep[] {
  if (!mission.guidance_steps || !Array.isArray(mission.guidance_steps)) {
    return [];
  }

  try {
    return mission.guidance_steps.map((step: any, index: number) => ({
      id: step.id || `guidance-${index}`,
      icon: step.icon || "target",
      title: step.title || `Guidance Step ${index + 1}`,
      description: step.description || "",
      requiredEvidence: Array.isArray(step.requiredEvidence) ? step.requiredEvidence : [],
    }));
  } catch (error) {
    console.error("Error parsing mission guidance steps:", error);
    return [];
  }
}

/**
 * Calculate detailed submission progress based on guidance steps
 */
function calculateSubmissionProgress(submission: any, mission: Mission): number {
  const guidanceSteps = getMissionGuidanceSteps(mission);
  
  if (guidanceSteps.length === 0) {
    return submission.status === "reviewed" ? 100 : 0;
  }

  if (!submission.guidance_evidence || typeof submission.guidance_evidence !== "object") {
    return 0;
  }

  const evidence = submission.guidance_evidence as Record<string, any>;
  let completedSteps = 0;

  guidanceSteps.forEach((step) => {
    const stepEvidence = evidence[step.id];
    if (Array.isArray(stepEvidence) && stepEvidence.length > 0) {
      // Check if all required evidence types are provided
      const hasAllRequiredEvidence = step.requiredEvidence.length === 0 || 
        step.requiredEvidence.every(evidenceType => 
          stepEvidence.some((e: any) => e.type === evidenceType)
        );
      
      if (hasAllRequiredEvidence) {
        completedSteps++;
      }
    }
  });

  return Math.round((completedSteps / guidanceSteps.length) * 100);
}

/**
 * Get user's submission for a specific mission
 */
export async function getMissionSubmission(missionId: string): Promise<{
  data: any | null;
  error: string | null;
}> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { data: null, error: "Authentication required" };
    }

    const { data: submission, error: submissionError } = await supabase
      .from("mission_submissions")
      .select("*")
      .eq("agent_id", user.id)
      .eq("mission_id", missionId)
      .single();

    if (submissionError && submissionError.code !== "PGRST116") {
      return { data: null, error: submissionError.message };
    }

    return { data: submission, error: null };
  } catch (error) {
    console.error("Error fetching mission submission:", error);
    return { data: null, error: "Failed to fetch mission submission" };
  }
}
