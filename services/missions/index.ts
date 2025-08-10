import { supabase } from "@/lib/supabase";
import { Tables, Database } from "@/lib/database.types";

// Type definitions for missions with additional computed fields
export type Mission = Tables<"missions">;
export type MissionWithStats = Mission & {
  participants_count: number;
  submissions_count: number;
  completed_submissions_count: number;
  is_bookmarked?: boolean;
  submission_status?: string;
  submission_progress?: number;
  organization_name?: string;
};

export type MissionBookmark = Tables<"mission_bookmarks">;
export type MissionSubmission = Tables<"mission_submissions">;

/**
 * Get published missions for agents with stats and bookmark status
 */
export async function getPublishedMissions(
  searchQuery?: string,
  category?: string,
  difficulty?: string,
  limit: number = 20
): Promise<{ data: MissionWithStats[] | null; error: string | null }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { data: null, error: "Authentication required" };
    }

    // Build the query
    let query = supabase
      .from("missions")
      .select(`
        *,
        organizations!inner(name),
        mission_submissions(
          id,
          agent_id,
          status
        ),
        mission_bookmarks!left(
          id,
          agent_id
        )
      `)
      .eq("status", "published")
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });

    // Apply filters
    if (searchQuery && searchQuery.trim() !== "") {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data: missions, error: missionsError } = await query;

    if (missionsError) {
      return { data: null, error: missionsError.message };
    }

    // Transform data to include stats and bookmark status
    const missionsWithStats: MissionWithStats[] = missions.map((mission: any) => {
      const submissions = mission.mission_submissions || [];
      const bookmarks = mission.mission_bookmarks || [];
      
      // Calculate stats
      const uniqueParticipants = new Set(submissions.map((s: any) => s.agent_id));
      const completedSubmissions = submissions.filter((s: any) => s.status === "reviewed");
      
      // Check if current user has bookmarked this mission
      const isBookmarked = bookmarks.some((b: any) => b.agent_id === user.id);
      
      // Check user's submission status for this mission
      const userSubmission = submissions.find((s: any) => s.agent_id === user.id);
      
      return {
        ...mission,
        organization_name: mission.organizations?.name || "Unknown Organization",
        participants_count: uniqueParticipants.size,
        submissions_count: submissions.length,
        completed_submissions_count: completedSubmissions.length,
        is_bookmarked: isBookmarked,
        submission_status: userSubmission?.status || null,
        submission_progress: userSubmission ? getSubmissionProgress(userSubmission) : 0,
      };
    });

    return { data: missionsWithStats, error: null };
  } catch (error) {
    console.error("Error fetching missions:", error);
    return { data: null, error: "Failed to fetch missions" };
  }
}

/**
 * Get user's bookmarked missions
 */
export async function getBookmarkedMissions(): Promise<{ data: MissionWithStats[] | null; error: string | null }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { data: null, error: "Authentication required" };
    }

    const { data: bookmarks, error: bookmarksError } = await supabase
      .from("mission_bookmarks")
      .select(`
        mission_id,
        missions!inner(
          *,
          organizations!inner(name),
          mission_submissions(
            id,
            agent_id,
            status
          )
        )
      `)
      .eq("agent_id", user.id);

    if (bookmarksError) {
      return { data: null, error: bookmarksError.message };
    }

    // Transform bookmarks to missions with stats
    const missionsWithStats: MissionWithStats[] = bookmarks.map((bookmark: any) => {
      const mission = bookmark.missions;
      const submissions = mission.mission_submissions || [];
      
      const uniqueParticipants = new Set(submissions.map((s: any) => s.agent_id));
      const completedSubmissions = submissions.filter((s: any) => s.status === "reviewed");
      const userSubmission = submissions.find((s: any) => s.agent_id === user.id);
      
      return {
        ...mission,
        organization_name: mission.organizations?.name || "Unknown Organization",
        participants_count: uniqueParticipants.size,
        submissions_count: submissions.length,
        completed_submissions_count: completedSubmissions.length,
        is_bookmarked: true,
        submission_status: userSubmission?.status || null,
        submission_progress: userSubmission ? getSubmissionProgress(userSubmission) : 0,
      };
    });

    return { data: missionsWithStats, error: null };
  } catch (error) {
    console.error("Error fetching bookmarked missions:", error);
    return { data: null, error: "Failed to fetch bookmarked missions" };
  }
}

/**
 * Get user's active missions (with submissions)
 */
export async function getActiveMissions(): Promise<{ data: MissionWithStats[] | null; error: string | null }> {
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
          *,
          organizations!inner(name),
          mission_submissions(
            id,
            agent_id,
            status
          )
        )
      `)
      .eq("agent_id", user.id)
      .in("status", ["started", "in_progress"]);

    if (submissionsError) {
      return { data: null, error: submissionsError.message };
    }

    // Transform submissions to missions with stats
    const missionsWithStats: MissionWithStats[] = submissions.map((submission: any) => {
      const mission = submission.missions;
      const allSubmissions = mission.mission_submissions || [];
      
      const uniqueParticipants = new Set(allSubmissions.map((s: any) => s.agent_id));
      const completedSubmissions = allSubmissions.filter((s: any) => s.status === "reviewed");
      
      return {
        ...mission,
        organization_name: mission.organizations?.name || "Unknown Organization",
        participants_count: uniqueParticipants.size,
        submissions_count: allSubmissions.length,
        completed_submissions_count: completedSubmissions.length,
        is_bookmarked: false, // We'll need to check this separately if needed
        submission_status: submission.status,
        submission_progress: getSubmissionProgress(submission),
      };
    });

    return { data: missionsWithStats, error: null };
  } catch (error) {
    console.error("Error fetching active missions:", error);
    return { data: null, error: "Failed to fetch active missions" };
  }
}

/**
 * Bookmark or unbookmark a mission
 */
export async function toggleMissionBookmark(
  missionId: string
): Promise<{ success: boolean; error: string | null; is_bookmarked: boolean }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: "Authentication required", is_bookmarked: false };
    }

    // Check if already bookmarked
    const { data: existingBookmark, error: checkError } = await supabase
      .from("mission_bookmarks")
      .select("id")
      .eq("agent_id", user.id)
      .eq("mission_id", missionId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      return { success: false, error: checkError.message, is_bookmarked: false };
    }

    if (existingBookmark) {
      // Remove bookmark
      const { error: deleteError } = await supabase
        .from("mission_bookmarks")
        .delete()
        .eq("agent_id", user.id)
        .eq("mission_id", missionId);

      if (deleteError) {
        return { success: false, error: deleteError.message, is_bookmarked: true };
      }

      return { success: true, error: null, is_bookmarked: false };
    } else {
      // Add bookmark
      const { error: insertError } = await supabase
        .from("mission_bookmarks")
        .insert({
          agent_id: user.id,
          mission_id: missionId,
        });

      if (insertError) {
        return { success: false, error: insertError.message, is_bookmarked: false };
      }

      return { success: true, error: null, is_bookmarked: true };
    }
  } catch (error) {
    console.error("Error toggling mission bookmark:", error);
    return { success: false, error: "Failed to toggle bookmark", is_bookmarked: false };
  }
}

/**
 * Start a mission (create submission)
 */
export async function startMission(missionId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: "Authentication required" };
    }

    // Use the database function to bookmark or start mission
    const { data, error } = await supabase.rpc("bookmark_or_start_mission", {
      p_agent_id: user.id,
      p_mission_id: missionId,
      p_action: "start"
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error starting mission:", error);
    return { success: false, error: "Failed to start mission" };
  }
}

/**
 * Get mission thumbnail URL from storage
 */
export async function getMissionThumbnailUrl(thumbnailPath: string): Promise<string | null> {
  try {
    const { data } = await supabase.storage
      .from("mission-content")
      .createSignedUrl(thumbnailPath, 3600); // 1 hour expiry

    return data?.signedUrl || null;
  } catch (error) {
    console.error("Error getting mission thumbnail URL:", error);
    return null;
  }
}

/**
 * Get user's agent profile with stats
 */
export async function getAgentProfile(): Promise<{ data: Tables<"agents"> | null; error: string | null }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { data: null, error: "Authentication required" };
    }

    const { data: agent, error: agentError } = await supabase
      .from("agents")
      .select("*")
      .eq("id", user.id)
      .single();

    if (agentError) {
      return { data: null, error: agentError.message };
    }

    return { data: agent, error: null };
  } catch (error) {
    console.error("Error fetching agent profile:", error);
    return { data: null, error: "Failed to fetch agent profile" };
  }
}

/**
 * Calculate submission progress based on guidance steps completed
 */
function getSubmissionProgress(submission: any): number {
  if (!submission.guidance_evidence || typeof submission.guidance_evidence !== "object") {
    return 0;
  }

  const evidence = submission.guidance_evidence as Record<string, any>;
  const completedSteps = Object.keys(evidence).filter(step => {
    const stepEvidence = evidence[step];
    return Array.isArray(stepEvidence) && stepEvidence.length > 0;
  });

  // This is a rough calculation - in reality, you'd want to compare against
  // the total number of guidance steps in the mission
  const totalSteps = Math.max(Object.keys(evidence).length, 1);
  return Math.round((completedSteps.length / totalSteps) * 100);
}

/**
 * Get mission statistics for the user
 */
export async function getUserMissionStats(): Promise<{
  data: {
    completed: number;
    active: number;
    bookmarked: number;
    totalPoints: number;
    totalEnergy: number;
  } | null;
  error: string | null;
}> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { data: null, error: "Authentication required" };
    }

    // Get agent data for points and energy
    const { data: agent, error: agentError } = await supabase
      .from("agents")
      .select("points, energy")
      .eq("id", user.id)
      .single();

    if (agentError) {
      return { data: null, error: agentError.message };
    }

    // Get submission stats
    const { data: submissions, error: submissionsError } = await supabase
      .from("mission_submissions")
      .select("status")
      .eq("agent_id", user.id);

    if (submissionsError) {
      return { data: null, error: submissionsError.message };
    }

    // Get bookmark count
    const { count: bookmarkCount, error: bookmarkError } = await supabase
      .from("mission_bookmarks")
      .select("*", { count: "exact", head: true })
      .eq("agent_id", user.id);

    if (bookmarkError) {
      return { data: null, error: bookmarkError.message };
    }

    const completed = submissions.filter(s => s.status === "reviewed").length;
    const active = submissions.filter(s => ["started", "in_progress"].includes(s.status)).length;

    return {
      data: {
        completed,
        active,
        bookmarked: bookmarkCount || 0,
        totalPoints: agent.points,
        totalEnergy: agent.energy,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching user mission stats:", error);
    return { data: null, error: "Failed to fetch mission statistics" };
  }
}
