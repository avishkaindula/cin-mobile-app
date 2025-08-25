import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

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
 * Get current user profile with signed avatar URL
 */
export const getCurrentUserProfileWithAvatar = async (): Promise<ProfileServiceResponse<Agent & { avatarSignedUrl?: string }>> => {
  try {
    const profileResult = await getCurrentUserProfile();
    
    if (!profileResult.success || !profileResult.data) {
      return profileResult;
    }

    const profile = profileResult.data;
    
    // If profile has avatar_url (which is now a path), get signed URL
    if (profile.avatar_url) {
      const signedUrl = await getAvatarUrl(profile.avatar_url);
      return {
        success: true,
        data: {
          ...profile,
          avatarSignedUrl: signedUrl || undefined
        }
      };
    }

    return {
      success: true,
      data: profile
    };
  } catch (error) {
    console.error('Error fetching user profile with avatar:', error);
    return { 
      success: false, 
      error: 'Unexpected error occurred while fetching profile with avatar' 
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
 * Get avatar URL from storage with signed URL (similar to mission thumbnails)
 */
export const getAvatarUrl = async (avatarPath: string): Promise<string | null> => {
  try {
    const { data } = await supabase.storage
      .from('avatars')
      .createSignedUrl(avatarPath, 3600); // 1 hour expiry

    return data?.signedUrl || null;
  } catch (error) {
    console.error('Error getting avatar URL:', error);
    return null;
  }
};

/**
 * Upload avatar image to Supabase Storage
 */
export const uploadAvatar = async (
  imageUri: string
): Promise<ProfileServiceResponse<{ avatarUrl: string; avatarPath?: string }>> => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { 
        success: false, 
        error: userError?.message || 'No authenticated user found'
      };
    }

    // Generate unique filename
    const fileExt = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${user.id}/avatar_${Date.now()}.${fileExt}`;

    // Read file as base64
    console.log('Reading file:', imageUri);
    const base64Data = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    console.log('Base64 data length:', base64Data.length);

    // Convert base64 to binary for upload
    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    console.log('Binary data length:', binaryData.length);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, binaryData, {
        cacheControl: '3600',
        upsert: true,
        contentType: `image/${fileExt}`,
      });

    if (uploadError) {
      console.error('Upload error details:', uploadError);
      return { 
        success: false, 
        error: `Failed to upload avatar: ${uploadError.message}` 
      };
    }

    // Get signed URL (like mission thumbnails)
    const signedUrl = await getAvatarUrl(uploadData.path);
    
    if (!signedUrl) {
      return { 
        success: false, 
        error: 'Failed to generate avatar URL' 
      };
    }

    // Update the profile with the file path (not the signed URL)
    const { error: updateError } = await supabase
      .from('agents')
      .update({ avatar_url: uploadData.path })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile with avatar path:', updateError);
      return { 
        success: false, 
        error: 'Failed to update profile with avatar' 
      };
    }

    return { 
      success: true, 
      data: { avatarUrl: signedUrl, avatarPath: uploadData.path }
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
