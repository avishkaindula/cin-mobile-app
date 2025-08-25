import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';
import * as ImagePicker from 'expo-image-picker';

export type Agent = Database['public']['Tables']['agents']['Row'];
export type AgentUpdate = Database['public']['Tables']['agents']['Update'];

export interface ProfileServiceResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface ProfileUpdateData {
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
}

/**
 * Get current user profile from agents table
 */
export const getCurrentUserProfile = async (): Promise<ProfileServiceResponse<Agent>> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { 
        success: false, 
        error: userError?.message || 'No authenticated user found' 
      };
    }

    const { data: profile, error: profileError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return { 
        success: false, 
        error: `Failed to fetch profile: ${profileError.message}` 
      };
    }

    return { 
      success: true, 
      data: profile 
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { 
      success: false, 
      error: 'Unexpected error occurred while fetching profile' 
    };
  }
};

/**
 * Update user profile in agents table
 */
export const updateUserProfile = async (
  updates: ProfileUpdateData
): Promise<ProfileServiceResponse<Agent>> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { 
        success: false, 
        error: userError?.message || 'No authenticated user found'
      };
    }

    // Prepare update data
    const updateData: AgentUpdate = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    const { data: updatedProfile, error: updateError } = await supabase
      .from('agents')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      return { 
        success: false, 
        error: `Failed to update profile: ${updateError.message}` 
      };
    }

    return { 
      success: true, 
      data: updatedProfile 
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { 
      success: false, 
      error: 'Unexpected error occurred while updating profile' 
    };
  }
};

/**
 * Upload avatar image to Supabase Storage
 */
export const uploadAvatar = async (
  imageUri: string
): Promise<ProfileServiceResponse<{ avatarUrl: string }>> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { 
        success: false, 
        error: userError?.message || 'No authenticated user found'
      };
    }

    // Convert image to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    // Generate unique filename
    const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${user.id}/avatar_${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, blob, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      return { 
        success: false, 
        error: `Failed to upload avatar: ${uploadError.message}` 
      };
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(uploadData.path);

    return { 
      success: true, 
      data: { avatarUrl: publicUrl }
    };
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return { 
      success: false, 
      error: 'Unexpected error occurred while uploading avatar' 
    };
  }
};

/**
 * Request camera and media library permissions
 */
export const requestImagePermissions = async (): Promise<boolean> => {
  try {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    return cameraPermission.status === 'granted' && mediaPermission.status === 'granted';
  } catch (error) {
    console.error('Error requesting permissions:', error);
    return false;
  }
};

/**
 * Pick image from gallery or camera
 */
export const pickImage = async (useCamera: boolean = false): Promise<ProfileServiceResponse<{ uri: string }>> => {
  try {
    const hasPermissions = await requestImagePermissions();
    
    if (!hasPermissions) {
      return {
        success: false,
        error: 'Camera and media library permissions are required'
      };
    }

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    };

    let result;
    if (useCamera) {
      result = await ImagePicker.launchCameraAsync(options);
    } else {
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (result.canceled || !result.assets?.[0]) {
      return {
        success: false,
        error: 'Image selection was cancelled'
      };
    }

    return {
      success: true,
      data: { uri: result.assets[0].uri }
    };
  } catch (error) {
    console.error('Error picking image:', error);
    return {
      success: false,
      error: 'Unexpected error occurred while picking image'
    };
  }
};
