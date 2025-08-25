import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, InputField } from "@/components/ui/input";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Pressable } from "@/components/ui/pressable";
import { useAppToast } from "@/lib/toast-utils";
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Camera,
  Save,
  Image as ImageIcon,
} from "lucide-react-native";
import { useSession } from "@/context/auth";
import {
  getCurrentUserProfile,
  getCurrentUserProfileWithAvatar,
  updateUserProfile,
  uploadAvatar,
  pickImage,
  Agent,
  ProfileUpdateData,
} from "@/services/profile/profile.service";

const EditProfilePage = () => {
  const { user } = useSession();
  const { showError, showSuccess } = useAppToast();
  
  const [profile, setProfile] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

    const loadProfile = async () => {
    try {
      setLoading(true);
      const result = await getCurrentUserProfileWithAvatar();
      
      if (result.success && result.data) {
        const profileData = result.data;
        setProfile(profileData);
        setFullName(profileData.full_name || "");
        setEmail(profileData.email || user?.email || "");
        setPhone(profileData.phone || "");
        setAddress(profileData.address || "");
        // Use the signed URL if available, otherwise keep empty
        setAvatarUrl(profileData.avatarSignedUrl || "");
      } else {
        showError("Error", result.error || "Failed to load profile");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      showError("Error", "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

    const handleSubmit = async () => {
    if (!fullName.trim()) {
      showError("Validation Error", "Full name is required");
      return;
    }

    try {
      setSaving(true);

      const updateData: ProfileUpdateData = {
        full_name: fullName.trim(),
        address: address.trim() || undefined,
        phone: phone.trim() || undefined,
      };

      await updateUserProfile(updateData);
      showSuccess("Success", "Profile updated successfully");
      router.back();
    } catch (error) {
      console.error("Error updating profile:", error);
      showError("Error", "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarPress = () => {
    Alert.alert(
      "Change Avatar",
      "Choose how you'd like to update your profile picture",
      [
        {
          text: "Camera",
          onPress: () => handlePickImage(true),
        },
        {
          text: "Photo Library",
          onPress: () => handlePickImage(false),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const handlePickImage = async (useCamera: boolean) => {
    try {
      setUploadingAvatar(true);

      const pickResult = await pickImage(useCamera);
      
      if (!pickResult.success || !pickResult.data) {
        if (pickResult.error !== "Image selection was cancelled") {
          showError("Error", pickResult.error || "Failed to pick image");
        }
        return;
      }

      const uploadResult = await uploadAvatar(pickResult.data.uri);
      
      if (uploadResult.success && uploadResult.data) {
        // Avatar is already updated in the database by uploadAvatar function
        // Just update the local state with the signed URL
        setAvatarUrl(uploadResult.data.avatarUrl);
        showSuccess("Success", "Avatar uploaded successfully!");
      } else {
        showError("Error", uploadResult.error || "Failed to upload avatar");
      }
    } catch (error) {
      console.error("Error handling avatar:", error);
      showError("Error", "Failed to update avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1 }}
        className="bg-white dark:bg-background-dark"
      >
        <Box className="flex-1 justify-center items-center">
          <Spinner size="large" />
          <Text className="mt-4 text-typography-600">Loading profile...</Text>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="bg-white dark:bg-background-dark"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView className="flex-1">
          <Box className="p-6">
            {/* Header */}
            <HStack className="items-center mb-6">
              <Button
                variant="link"
                size="sm"
                onPress={() => router.back()}
                className="p-2 -ml-2"
              >
                <Icon as={ArrowLeft} size="md" className="text-typography-600" />
              </Button>
              <VStack space="xs" className="ml-2">
                <Heading
                  size="xl"
                  className="text-typography-900 dark:text-typography-950"
                >
                  Edit Profile
                </Heading>
                <Text
                  size="sm"
                  className="text-typography-600 dark:text-typography-750"
                >
                  Update your personal information
                </Text>
              </VStack>
            </HStack>

            <VStack space="lg">
              {/* Avatar Section */}
              <Card className="p-6">
                <VStack space="lg" className="items-center">
                  <Text
                    size="lg"
                    className="text-typography-900 dark:text-typography-950 font-semibold"
                  >
                    Profile Picture
                  </Text>
                  
                  <Pressable onPress={handleAvatarPress} disabled={uploadingAvatar}>
                    <Box className="relative">
                      {avatarUrl || user?.user_metadata?.avatar_url || user?.user_metadata?.picture ? (
                        <Avatar size="2xl">
                          <AvatarImage
                            source={{
                              uri: avatarUrl || 
                                   user?.user_metadata?.avatar_url || 
                                   user?.user_metadata?.picture,
                            }}
                          />
                        </Avatar>
                      ) : (
                        <Box className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full items-center justify-center">
                          <Icon as={User} size="xl" className="text-green-600 dark:text-green-400" />
                        </Box>
                      )}
                      
                      <Box className="absolute -bottom-2 -right-2 bg-primary-500 rounded-full p-2">
                        {uploadingAvatar ? (
                          <Spinner size="small" color="white" />
                        ) : (
                          <Icon as={Camera} size="sm" className="text-white" />
                        )}
                      </Box>
                    </Box>
                  </Pressable>
                  
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750 text-center"
                  >
                    Tap to change your profile picture
                  </Text>
                </VStack>
              </Card>

              {/* Personal Information */}
              <Card className="p-6">
                <VStack space="lg">
                  <Text
                    size="lg"
                    className="text-typography-900 dark:text-typography-950 font-semibold"
                  >
                    Personal Information
                  </Text>

                  {/* Full Name */}
                  <VStack space="xs">
                    <Text
                      size="sm"
                      className="text-typography-600 dark:text-typography-750 font-medium"
                    >
                      Full Name *
                    </Text>
                    <Input>
                      <InputField
                        placeholder="Enter your full name"
                        value={fullName}
                        onChangeText={setFullName}
                        autoCapitalize="words"
                        textContentType="name"
                      />
                    </Input>
                  </VStack>

                  {/* Email (Read-only) */}
                  <VStack space="xs">
                    <Text
                      size="sm"
                      className="text-typography-600 dark:text-typography-750 font-medium"
                    >
                      Email
                    </Text>
                    <Box className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-outline-200 dark:border-outline-700">
                      <Text className="text-typography-600 dark:text-typography-400">
                        {email}
                      </Text>
                    </Box>
                    <Text
                      size="xs"
                      className="text-typography-500 dark:text-typography-400"
                    >
                      Email cannot be changed
                    </Text>
                  </VStack>

                  {/* Phone */}
                  <VStack space="xs">
                    <Text
                      size="sm"
                      className="text-typography-600 dark:text-typography-750 font-medium"
                    >
                      Phone Number
                    </Text>
                    <Input>
                      <InputField
                        placeholder="Enter your phone number"
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        textContentType="telephoneNumber"
                      />
                    </Input>
                  </VStack>

                  {/* Address */}
                  <VStack space="xs">
                    <Text
                      size="sm"
                      className="text-typography-600 dark:text-typography-750 font-medium"
                    >
                      Address
                    </Text>
                    <Textarea>
                      <TextareaInput
                        placeholder="Enter your full address"
                        value={address}
                        onChangeText={setAddress}
                        autoCapitalize="words"
                        textContentType="fullStreetAddress"
                        numberOfLines={3}
                        multiline={true}
                      />
                    </Textarea>
                  </VStack>
                </VStack>
              </Card>

              {/* Save Button */}
              <Button
                variant="solid"
                action="primary"
                size="lg"
                className="w-full"
                disabled={saving || uploadingAvatar}
                onPress={handleSubmit}
              >
                <HStack space="md" className="items-center">
                  {saving ? (
                    <Spinner size="small" color="white" />
                  ) : (
                    <Icon as={Save} size="md" className="text-white" />
                  )}
                  <Text size="lg" className="text-white font-semibold">
                    {saving ? "Saving..." : "Save Changes"}
                  </Text>
                </HStack>
              </Button>

              {/* Cancel Button */}
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                disabled={saving || uploadingAvatar}
                onPress={() => router.back()}
              >
                <Text size="lg" className="text-typography-600 dark:text-typography-400 font-semibold">
                  Cancel
                </Text>
              </Button>
            </VStack>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfilePage;
