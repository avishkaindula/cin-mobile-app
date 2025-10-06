import { supabase } from "@/lib/supabase";

export interface Reward {
  id: string;
  title: string;
  description: string;
  type: 'digital-badge' | 'discount-voucher' | 'educational-access' | 'certificate' | 'physical-item' | 'experience';
  category: 'achievement' | 'environmental' | 'education' | 'recognition' | 'discount';
  value: string;
  points_cost: number;
  availability: 'unlimited' | 'limited';
  quantity_available: number | null;
  quantity_claimed: number;
  image_url: string | null;
  status: 'active' | 'draft' | 'paused' | 'expired';
  expiry_date: string | null;
  created_at: string;
  organization_id: string | null;
}

export interface RewardRedemption {
  id: string;
  reward_id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  points_spent: number;
  redemption_notes: string | null;
  review_notes: string | null;
  reviewed_at: string | null;
  fulfilled_at: string | null;
  created_at: string;
  reward?: Reward;
}

export interface UserPointsInfo {
  earned_points: number;
  spent_points: number;
  available_points: number;
}

/**
 * Get all active rewards
 */
export async function getActiveRewards(): Promise<{
  data: Reward[] | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching rewards:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getActiveRewards:', error);
    return { data: null, error: 'Failed to fetch rewards' };
  }
}

/**
 * Get reward details by ID
 */
export async function getRewardById(rewardId: string): Promise<{
  data: Reward | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('id', rewardId)
      .single();

    if (error) {
      console.error('Error fetching reward:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getRewardById:', error);
    return { data: null, error: 'Failed to fetch reward details' };
  }
}

/**
 * Get user's available points
 */
export async function getUserAvailablePoints(): Promise<{
  data: number | null;
  error: string | null;
}> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .rpc('get_user_available_points', { p_user_id: user.id });

    if (error) {
      console.error('Error fetching user points:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getUserAvailablePoints:', error);
    return { data: null, error: 'Failed to fetch user points' };
  }
}

/**
 * Get detailed user points information
 */
export async function getUserPointsInfo(): Promise<{
  data: UserPointsInfo | null;
  error: string | null;
}> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    // Get earned points from approved missions
    const { data: earnedData, error: earnedError } = await supabase
      .from('mission_submissions')
      .select('points_awarded')
      .eq('user_id', user.id)
      .eq('status', 'approved');

    if (earnedError) {
      console.error('Error fetching earned points:', earnedError);
      return { data: null, error: earnedError.message };
    }

    const earned_points = earnedData?.reduce((sum, submission) => sum + (submission.points_awarded || 0), 0) || 0;

    // Get spent points from approved/fulfilled redemptions
    const { data: spentData, error: spentError } = await supabase
      .from('reward_redemptions')
      .select('points_spent')
      .eq('user_id', user.id)
      .in('status', ['approved', 'fulfilled']);

    if (spentError) {
      console.error('Error fetching spent points:', spentError);
      return { data: null, error: spentError.message };
    }

    const spent_points = spentData?.reduce((sum, redemption) => sum + redemption.points_spent, 0) || 0;

    return {
      data: {
        earned_points,
        spent_points,
        available_points: earned_points - spent_points,
      },
      error: null,
    };
  } catch (error) {
    console.error('Error in getUserPointsInfo:', error);
    return { data: null, error: 'Failed to fetch user points information' };
  }
}

/**
 * Redeem a reward
 */
export async function redeemReward(
  rewardId: string,
  redemptionNotes?: string
): Promise<{
  success: boolean;
  error: string | null;
  redemptionId?: string;
}> {
  try {
    const { data, error } = await supabase
      .rpc('redeem_reward', {
        p_reward_id: rewardId,
        p_redemption_notes: redemptionNotes || null,
      });

    if (error) {
      console.error('Error redeeming reward:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null, redemptionId: data };
  } catch (error: any) {
    console.error('Error in redeemReward:', error);
    return { success: false, error: error.message || 'Failed to redeem reward' };
  }
}

/**
 * Get user's redemption history
 */
export async function getUserRedemptions(): Promise<{
  data: RewardRedemption[] | null;
  error: string | null;
}> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: 'User not authenticated' };
    }

    const { data, error } = await supabase
      .from('reward_redemptions')
      .select(`
        *,
        reward:rewards(*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching redemptions:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getUserRedemptions:', error);
    return { data: null, error: 'Failed to fetch redemption history' };
  }
}

/**
 * Get redemption details by ID
 */
export async function getRedemptionById(redemptionId: string): Promise<{
  data: RewardRedemption | null;
  error: string | null;
}> {
  try {
    const { data, error } = await supabase
      .from('reward_redemptions')
      .select(`
        *,
        reward:rewards(*)
      `)
      .eq('id', redemptionId)
      .single();

    if (error) {
      console.error('Error fetching redemption:', error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in getRedemptionById:', error);
    return { data: null, error: 'Failed to fetch redemption details' };
  }
}

/**
 * Check if user can afford a reward
 */
export async function canUserAffordReward(pointsCost: number): Promise<{
  canAfford: boolean;
  availablePoints: number;
  error: string | null;
}> {
  try {
    const { data: availablePoints, error } = await getUserAvailablePoints();

    if (error || availablePoints === null) {
      return { canAfford: false, availablePoints: 0, error: error || 'Failed to check points' };
    }

    return {
      canAfford: availablePoints >= pointsCost,
      availablePoints,
      error: null,
    };
  } catch (error) {
    console.error('Error in canUserAffordReward:', error);
    return { canAfford: false, availablePoints: 0, error: 'Failed to check if user can afford reward' };
  }
}
