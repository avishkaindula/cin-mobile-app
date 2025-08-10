import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Alert, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { InputField } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TextareaInput } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Video,
  FileText,
  MapPin,
  CheckCircle,
  Upload,
  X,
  Play,
  Eye,
  Trash2,
} from "lucide-react-native";
import { getMissionDetails } from "@/services/missions/details";
import {
  getSubmissionProgress,
  submitStepEvidence,
  uploadEvidenceFile,
  getEvidenceFileUrl,
  deleteStepEvidence,
  SubmissionProgress,
  EvidenceItem,
  GuidanceStep,
} from "@/services/missions/submissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

const MissionSubmissionPage = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const missionId = Array.isArray(id) ? id[0] : id;

  const [mission, setMission] = useState<any>(null);
  const [progress, setProgress] = useState<SubmissionProgress | null>(null);
  const [guidanceSteps, setGuidanceSteps] = useState<GuidanceStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [evidenceItems, setEvidenceItems] = useState<Omit<EvidenceItem, "uploadedAt">[]>([]);
  const [textInput, setTextInput] = useState("");

  useEffect(() => {
    if (missionId) {
      loadMissionAndProgress();
    }
  }, [missionId]);

  const loadMissionAndProgress = async () => {
    try {
      setLoading(true);

      // Load mission details
      const { data: missionData, error: missionError } = await getMissionDetails(missionId);
      if (missionError || !missionData) {
        Alert.alert("Error", missionError || "Mission not found");
        router.back();
        return;
      }

      setMission(missionData);
      setGuidanceSteps((missionData.guidance_steps as unknown as GuidanceStep[]) || []);

      // Load submission progress
      const { data: progressData, error: progressError } = await getSubmissionProgress(missionId);
      if (progressError) {
        Alert.alert("Error", progressError);
        return;
      }

      if (progressData) {
        setProgress(progressData);
        setCurrentStepIndex(progressData.currentStepIndex);
      }
    } catch (error) {
      console.error("Error loading mission and progress:", error);
      Alert.alert("Error", "Failed to load mission details");
    } finally {
      setLoading(false);
    }
  };

  const requestPermissions = async () => {
    const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();

    if (libraryStatus !== "granted") {
      Alert.alert("Permission Required", "Photo library access is required to submit evidence.");
      return false;
    }

    return true;
  };

  const handleSelectPhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadFile(result.assets[0], "photo");
    }
  };

  const handleSelectVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      videoMaxDuration: 60, // 1 minute max
      quality: ImagePicker.UIImagePickerControllerQualityType.Medium,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadFile(result.assets[0], "video");
    }
  };

  const handleGetLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Location access is required to submit location evidence.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const locationData = JSON.stringify({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp,
      });

      setEvidenceItems(prev => [
        ...prev,
        {
          type: "location",
          data: locationData,
          metadata: {
            accuracy: location.coords.accuracy,
            timestamp: location.timestamp,
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to get location. Please try again.");
    }
  };

  const uploadFile = async (asset: ImagePicker.ImagePickerAsset, type: "photo" | "video") => {
    try {
      setSubmitting(true);

      // Convert to blob for upload
      const response = await fetch(asset.uri);
      const blob = await response.blob();

      const currentStep = guidanceSteps[currentStepIndex];
      if (!currentStep) return;

      const { data, error } = await uploadEvidenceFile(
        blob,
        asset.fileName || `${type}_${Date.now()}`,
        missionId,
        currentStep.id
      );

      if (error) {
        Alert.alert("Upload Error", error);
        return;
      }

      if (data) {
        setEvidenceItems(prev => [
          ...prev,
          {
            type,
            data: data.path,
            metadata: {
              fileName: asset.fileName,
              fileSize: asset.fileSize,
              width: asset.width,
              height: asset.height,
              duration: asset.duration,
            },
          },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload file. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddTextEvidence = () => {
    if (textInput.trim()) {
      setEvidenceItems(prev => [
        ...prev,
        {
          type: "text",
          data: textInput.trim(),
        },
      ]);
      setTextInput("");
    }
  };

  const handleRemoveEvidence = (index: number) => {
    setEvidenceItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitStep = async () => {
    try {
      setSubmitting(true);

      const currentStep = guidanceSteps[currentStepIndex];
      if (!currentStep) return;

      // Check if required evidence types are provided
      const providedTypes = evidenceItems.map(item => item.type);
      const missingTypes = currentStep.requiredEvidence.filter(type => !providedTypes.includes(type as any));

      if (missingTypes.length > 0) {
        Alert.alert(
          "Missing Evidence",
          `Please provide the following required evidence: ${missingTypes.join(", ")}`
        );
        return;
      }

      const { success, error } = await submitStepEvidence(missionId, currentStep.id, evidenceItems);

      if (error) {
        Alert.alert("Submission Error", error);
        return;
      }

      if (success) {
        // Clear evidence for next step
        setEvidenceItems([]);
        setTextInput("");

        // Reload progress
        await loadMissionAndProgress();

        // Show success message
        if (currentStepIndex + 1 >= guidanceSteps.length) {
          Alert.alert(
            "Mission Completed! 🎉",
            "Congratulations! You've completed all steps. Your submission is being reviewed and points will be awarded once approved.",
            [
              {
                text: "OK",
                onPress: () => router.back(),
              },
            ]
          );
        } else {
          Alert.alert("Step Completed!", "Great job! You can now proceed to the next step.");
          setCurrentStepIndex(prev => prev + 1);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to submit step. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStepEvidence = async (stepId: string) => {
    Alert.alert(
      "Delete Evidence",
      "Are you sure you want to delete the evidence for this step? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { success, error } = await deleteStepEvidence(missionId, stepId);
            if (error) {
              Alert.alert("Error", error);
            } else {
              Alert.alert("Success", "Evidence deleted successfully.");
              await loadMissionAndProgress();
            }
          },
        },
      ]
    );
  };

  const renderEvidenceItem = (item: Omit<EvidenceItem, "uploadedAt">, index: number) => {
    return (
      <Card key={index} className="p-3 mb-2 border border-gray-200 dark:border-gray-700">
        <HStack className="items-center justify-between">
          <HStack className="items-center flex-1" space="md">
            <Icon
              as={item.type === "photo" ? Upload : item.type === "video" ? Video : item.type === "location" ? MapPin : FileText}
              size="sm"
              className="text-gray-500"
            />
            <VStack className="flex-1">
              <Text size="sm" className="font-medium">
                {item.type === "photo" && "Photo Evidence"}
                {item.type === "video" && "Video Evidence"}
                {item.type === "text" && "Text Evidence"}
                {item.type === "location" && "Location Evidence"}
              </Text>
              <Text size="xs" className="text-gray-500" numberOfLines={1}>
                {item.type === "text" ? item.data : item.metadata?.fileName || "File uploaded"}
              </Text>
            </VStack>
          </HStack>
          <Button
            variant="outline"
            size="sm"
            onPress={() => handleRemoveEvidence(index)}
            className="p-2"
          >
            <Icon as={X} size="sm" className="text-red-500" />
          </Button>
        </HStack>
      </Card>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }} className="bg-white dark:bg-background-dark">
        <Box className="flex-1 justify-center items-center p-6">
          <Text className="text-typography-600 dark:text-typography-400">
            Loading mission details...
          </Text>
        </Box>
      </SafeAreaView>
    );
  }

  if (!mission || !progress) {
    return (
      <SafeAreaView style={{ flex: 1 }} className="bg-white dark:bg-background-dark">
        <Box className="flex-1 justify-center items-center p-6">
          <Text className="text-red-600">Mission not found or failed to load.</Text>
          <Button onPress={() => router.back()} className="mt-4">
            <Text className="text-white">Go Back</Text>
          </Button>
        </Box>
      </SafeAreaView>
    );
  }

  const currentStep = guidanceSteps[currentStepIndex];
  const isLastStep = currentStepIndex >= guidanceSteps.length - 1;
  const allStepsCompleted = progress.progressPercentage === 100;

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white dark:bg-background-dark">
      {/* Header */}
      <HStack
        space="md"
        className="items-center p-4 border-b border-gray-200 dark:border-gray-800"
      >
        <Button
          variant="outline"
          size="sm"
          onPress={() => router.back()}
          className="p-2"
        >
          <Icon as={ArrowLeft} size="md" className="text-typography-600" />
        </Button>
        <Heading size="xl" className="font-bold text-typography-900 dark:text-typography-950 flex-1 text-center">
          Submit Evidence
        </Heading>
        <Box className="w-10 h-10" />
      </HStack>

      <ScrollView className="flex-1 p-6">
        {/* Mission Info */}
        <VStack space="lg" className="mb-6">
          <Card className="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
            <VStack space="md">
              <Text className="font-semibold text-primary-900 dark:text-primary-100">
                {mission.title}
              </Text>
              <HStack className="justify-between items-center">
                <Text size="sm" className="text-primary-700 dark:text-primary-300">
                  Progress: {progress.progressPercentage}%
                </Text>
                <Text size="sm" className="text-primary-700 dark:text-primary-300">
                  Step {Math.min(currentStepIndex + 1, guidanceSteps.length)} of {guidanceSteps.length}
                </Text>
              </HStack>
              <Progress value={progress.progressPercentage} className="h-2" />
            </VStack>
          </Card>
        </VStack>

        {allStepsCompleted ? (
          <Card className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <VStack space="md" className="items-center">
              <Icon as={CheckCircle} size="xl" className="text-green-600" />
              <Heading size="lg" className="text-green-900 dark:text-green-100 text-center">
                Mission Completed! 🎉
              </Heading>
              <Text className="text-center text-green-800 dark:text-green-200">
                Congratulations! You've successfully completed all evidence requirements. 
                Your submission is being reviewed and points will be awarded once approved.
              </Text>
              <Button onPress={() => router.back()} className="bg-green-600">
                <Text className="text-white">Return to Missions</Text>
              </Button>
            </VStack>
          </Card>
        ) : currentStep ? (
          <VStack space="lg">
            {/* Current Step */}
            <Card className="p-4 border border-blue-200 dark:border-blue-800">
              <VStack space="md">
                <HStack space="md" className="items-start">
                  <Box className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full items-center justify-center">
                    <Text size="sm" className="font-bold text-blue-600 dark:text-blue-400">
                      {currentStepIndex + 1}
                    </Text>
                  </Box>
                  <VStack space="xs" className="flex-1">
                    <Text className="font-semibold text-blue-900 dark:text-blue-100">
                      {currentStep.title}
                    </Text>
                    <Text size="sm" className="text-blue-800 dark:text-blue-200">
                      {currentStep.description}
                    </Text>
                  </VStack>
                </HStack>

                {/* Required Evidence */}
                <VStack space="xs">
                  <Text size="sm" className="font-medium text-blue-900 dark:text-blue-100">
                    Required Evidence:
                  </Text>
                  <HStack space="xs" className="flex-wrap">
                    {currentStep.requiredEvidence.map((evidence, idx) => (
                      <Badge
                        key={idx}
                        variant="outline"
                        className="border-blue-300 dark:border-blue-700"
                      >
                        <Text size="xs" className="text-blue-700 dark:text-blue-300">
                          {evidence}
                        </Text>
                      </Badge>
                    ))}
                  </HStack>
                </VStack>
              </VStack>
            </Card>

            {/* Evidence Collection */}
            <Card className="p-4 border border-gray-200 dark:border-gray-700">
              <VStack space="md">
                <Text className="font-semibold text-typography-900 dark:text-typography-950">
                  Add Evidence
                </Text>

                {/* Evidence Type Buttons */}
                <VStack space="md">
                  {currentStep.requiredEvidence.includes("photo") && (
                    <VStack space="xs">
                      <Text size="sm" className="font-medium">Photo Evidence</Text>
                      <Button
                        variant="outline"
                        size="sm"
                        onPress={handleSelectPhoto}
                        disabled={submitting}
                        className="w-full"
                      >
                        <HStack space="xs" className="items-center">
                          <Icon as={Upload} size="sm" />
                          <Text>Select Photo from Gallery</Text>
                        </HStack>
                      </Button>
                    </VStack>
                  )}

                  {currentStep.requiredEvidence.includes("video") && (
                    <VStack space="xs">
                      <Text size="sm" className="font-medium">Video Evidence</Text>
                      <Button
                        variant="outline"
                        size="sm"
                        onPress={handleSelectVideo}
                        disabled={submitting}
                        className="w-full"
                      >
                        <HStack space="xs" className="items-center">
                          <Icon as={Video} size="sm" />
                          <Text>Select Video from Gallery</Text>
                        </HStack>
                      </Button>
                    </VStack>
                  )}

                  {currentStep.requiredEvidence.includes("text") && (
                    <VStack space="xs">
                      <Text size="sm" className="font-medium">Text Evidence</Text>
                      <HStack space="md">
                        <Box className="flex-1">
                          <Textarea>
                            <TextareaInput
                              placeholder="Enter your text evidence..."
                              value={textInput}
                              onChangeText={setTextInput}
                              multiline
                              numberOfLines={3}
                            />
                          </Textarea>
                        </Box>
                        <Button
                          variant="outline"
                          size="sm"
                          onPress={handleAddTextEvidence}
                          disabled={!textInput.trim()}
                          className="self-start mt-1"
                        >
                          <Icon as={FileText} size="sm" />
                        </Button>
                      </HStack>
                    </VStack>
                  )}

                  {currentStep.requiredEvidence.includes("location") && (
                    <VStack space="xs">
                      <Text size="sm" className="font-medium">Location Evidence</Text>
                      <Button
                        variant="outline"
                        size="sm"
                        onPress={handleGetLocation}
                        disabled={submitting}
                      >
                        <HStack space="xs" className="items-center">
                          <Icon as={MapPin} size="sm" />
                          <Text>Get Current Location</Text>
                        </HStack>
                      </Button>
                    </VStack>
                  )}
                </VStack>

                {/* Current Evidence Items */}
                {evidenceItems.length > 0 && (
                  <VStack space="md">
                    <Text size="sm" className="font-medium">Added Evidence ({evidenceItems.length})</Text>
                    {evidenceItems.map((item, index) => renderEvidenceItem(item, index))}
                  </VStack>
                )}

                {/* Submit Button */}
                <Button
                  onPress={handleSubmitStep}
                  disabled={evidenceItems.length === 0 || submitting}
                  className="mt-4"
                >
                  <Text className="text-white">
                    {submitting ? "Submitting..." : isLastStep ? "Complete Mission" : "Submit Step"}
                  </Text>
                </Button>
              </VStack>
            </Card>

            {/* Completed Steps */}
            {Object.keys(progress.stepsCompleted).length > 0 && (
              <Card className="p-4 border border-gray-200 dark:border-gray-700">
                <VStack space="md">
                  <Text className="font-semibold text-typography-900 dark:text-typography-950">
                    Completed Steps
                  </Text>
                  {guidanceSteps.slice(0, currentStepIndex).map((step, index) => (
                    <HStack key={step.id} className="justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <HStack space="md" className="items-center flex-1">
                        <Icon as={CheckCircle} size="sm" className="text-green-600" />
                        <VStack className="flex-1">
                          <Text size="sm" className="font-medium text-green-900 dark:text-green-100">
                            {step.title}
                          </Text>
                          <Text size="xs" className="text-green-700 dark:text-green-300">
                            Completed • {progress.stepsCompleted[step.id]?.evidence.length || 0} evidence items
                          </Text>
                        </VStack>
                      </HStack>
                      <Button
                        variant="outline"
                        size="sm"
                        onPress={() => handleDeleteStepEvidence(step.id)}
                        className="p-2"
                      >
                        <Icon as={Trash2} size="sm" className="text-red-500" />
                      </Button>
                    </HStack>
                  ))}
                </VStack>
              </Card>
            )}
          </VStack>
        ) : (
          <Card className="p-6">
            <Text className="text-center text-gray-500">
              No guidance steps found for this mission.
            </Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MissionSubmissionPage;
