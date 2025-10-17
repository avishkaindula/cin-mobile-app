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
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { InputField } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TextareaInput } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Video,
  FileText,
  CheckCircle,
  Upload,
  X,
  Play,
  Eye,
  Trash2,
  Mic,
  Square,
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
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";

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
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

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

  const handleSelectDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "text/plain",
          "image/*",
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const document = result.assets[0];
      
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (document.size && document.size > maxSize) {
        Alert.alert("File Too Large", "Please select a file smaller than 10MB.");
        return;
      }

      await uploadDocument(document);
    } catch (error) {
      Alert.alert("Error", "Failed to pick document. Please try again.");
    }
  };

  const startAudioRecording = async () => {
    try {
      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Microphone access is required to record audio evidence.");
        return;
      }

      // Set audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);
    } catch (error) {
      Alert.alert("Error", "Failed to start recording. Please try again.");
    }
  };

  const stopAudioRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      if (uri) {
        await uploadAudioRecording(uri);
      }

      setRecording(null);
    } catch (error) {
      Alert.alert("Error", "Failed to save recording. Please try again.");
      setRecording(null);
    }
  };

  const uploadAudioRecording = async (uri: string) => {
    try {
      setSubmitting(true);

      const currentStep = guidanceSteps[currentStepIndex];
      if (!currentStep) return;

      // Read file as base64
      const base64Data = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to binary for upload
      const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

      const fileName = `audio_${Date.now()}.m4a`;

      const { data, error } = await uploadEvidenceFile(
        binaryData,
        fileName,
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
            type: "video", // Using "video" type for audio as it's the closest match
            data: data.path,
            metadata: {
              fileName,
              mimeType: "audio/m4a",
              isAudio: true,
            },
          },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload audio. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const uploadFile = async (asset: ImagePicker.ImagePickerAsset, type: "photo" | "video") => {
    try {
      setSubmitting(true);

      const currentStep = guidanceSteps[currentStepIndex];
      if (!currentStep) return;

      // Read file as base64
      const base64Data = await FileSystem.readAsStringAsync(asset.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to binary for upload
      const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

      // Determine content type
      const fileExt = asset.uri.split('.').pop()?.toLowerCase() || (type === "video" ? "mp4" : "jpg");
      const contentType = type === "video" 
        ? `video/${fileExt}` 
        : `image/${fileExt}`;

      const { data, error } = await uploadEvidenceFile(
        binaryData,
        asset.fileName || `${type}_${Date.now()}.${fileExt}`,
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
      console.error("Upload error:", error);
      Alert.alert("Error", "Failed to upload file. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const uploadDocument = async (document: DocumentPicker.DocumentPickerAsset) => {
    try {
      setSubmitting(true);

      const currentStep = guidanceSteps[currentStepIndex];
      if (!currentStep) return;

      // Read file as base64
      const base64Data = await FileSystem.readAsStringAsync(document.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to binary for upload
      const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

      const { data, error } = await uploadEvidenceFile(
        binaryData,
        document.name,
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
            type: "photo", // Using "photo" type for documents as it's the closest match
            data: data.path,
            metadata: {
              fileName: document.name,
              fileSize: document.size,
              mimeType: document.mimeType,
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Failed to upload document. Please try again.");
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

        // Reload progress - this will automatically update currentStepIndex from backend
        await loadMissionAndProgress();

        // Show success message
        if (currentStepIndex + 1 >= guidanceSteps.length) {
          const pointsAwarded = mission?.points_awarded || 0;
          const energyAwarded = mission?.energy_awarded || 0;
          Alert.alert(
            "Mission Completed! 🎉",
            `Congratulations! You've completed all steps and earned ${pointsAwarded} points and ${energyAwarded} energy!`,
            [
              {
                text: "OK",
                onPress: () => router.back(),
              },
            ]
          );
        } else {
          Alert.alert("Step Completed!", "Great job! You can now proceed to the next step.");
          // Don't manually increment - loadMissionAndProgress() already updated it from backend
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
    // Detect file type based on metadata
    const isAudio = item.metadata?.isAudio || item.metadata?.mimeType?.startsWith('audio/');
    const isDocument = item.metadata?.mimeType && 
      !item.metadata.mimeType.startsWith('image/') && 
      !item.metadata.mimeType.startsWith('video/') &&
      !item.metadata.mimeType.startsWith('audio/');
    
    const getEvidenceLabel = () => {
      if (item.type === "text") return "Text Evidence";
      if (isAudio) return "Audio Evidence";
      if (item.type === "video") return "Video Evidence";
      if (isDocument) return "Document Evidence";
      return "Photo Evidence";
    };

    const getFileSize = () => {
      if (!item.metadata?.fileSize) return "";
      const sizeInMB = (item.metadata.fileSize / (1024 * 1024)).toFixed(2);
      return ` (${sizeInMB} MB)`;
    };

    const getIcon = () => {
      if (item.type === "text") return FileText;
      if (isAudio) return Mic;
      if (item.type === "video") return Video;
      if (isDocument) return FileText;
      return Upload;
    };

    return (
      <Card key={index} className="p-3 mb-2 border border-gray-200 dark:border-gray-700">
        <HStack className="items-center justify-between">
          <HStack className="items-center flex-1" space="md">
            <Icon
              as={getIcon()}
              size="sm"
              className="text-gray-500"
            />
            <VStack className="flex-1">
              <Text size="sm" className="font-medium">
                {getEvidenceLabel()}
              </Text>
              <Text size="xs" className="text-gray-500" numberOfLines={1}>
                {item.type === "text" 
                  ? item.data 
                  : `${item.metadata?.fileName || "File uploaded"}${getFileSize()}`
                }
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
      <SafeAreaView
        style={{ flex: 1 }}
        className="bg-white dark:bg-background-dark"
      >
        <Box className="flex-1 justify-center items-center p-6">
          <Card className="p-8 border-2 border-[#333333] shadow-[4px_4px_0_#333333] bg-[#FCFCFC]">
            <VStack space="md" className="items-center">
              <Image
                source={require("@/assets/icon.png")}
                style={{ width: 48, height: 48 }}
                resizeMode="contain"
              />
              <Text className="text-[#333333] font-semibold tracking-wide">
                Loading mission submission...
              </Text>
            </VStack>
          </Card>
        </Box>
      </SafeAreaView>
    );
  }

  if (!mission || !progress) {
    return (
      <SafeAreaView style={{ flex: 1 }} className="bg-[#FCFCFC]">
        <Box className="flex-1 justify-center items-center p-6">
          <Text retro className="text-[#333333]">Mission not found or failed to load.</Text>
          <Button 
            onPress={() => router.back()} 
            className="mt-4 bg-[#98FB98] border-2 border-[#333333] shadow-[4px_4px_0_#333333]"
          >
            <Text className="text-[#333333] font-bold tracking-wide">Go Back</Text>
          </Button>
        </Box>
      </SafeAreaView>
    );
  }

  const currentStep = guidanceSteps[currentStepIndex];
  const isLastStep = currentStepIndex >= guidanceSteps.length - 1;
  const allStepsCompleted = progress.progressPercentage === 100;

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-[#FCFCFC]">
      {/* Header */}
      <VStack space="lg" className="items-center p-6">
        <Image
          source={require("@/assets/icon.png")}
          style={{ width: 48, height: 48 }}
          resizeMode="contain"
        />
        <Heading retro size="xl" className="text-[#333333] font-bold tracking-wide text-center">
          Submit Evidence
        </Heading>
        
        {/* Back Button */}
        <Button
          variant="solid"
          size="sm"
          onPress={() => router.back()}
          className="bg-[#FCFCFC] border-2 border-[#333333] shadow-[2px_2px_0_#333333]"
        >
          <HStack space="sm" className="items-center">
            <Icon as={ArrowLeft} size="sm" className="text-[#333333]" />
            <Text className="text-[#333333] font-bold tracking-wide">Go Back</Text>
          </HStack>
        </Button>
      </VStack>

      <ScrollView className="flex-1 p-6">
        {/* Mission Info */}
        <Card className="p-6 mb-6 bg-[#FCFCFC] border-2 border-[#333333] shadow-[4px_4px_0_#333333]">
          <VStack space="md">
            <Text retro className="font-bold text-[#333333]">
              {mission.title}
            </Text>
            <HStack className="justify-between items-center">
              <Text retro size="sm" className="text-[#333333]">
                Progress: {progress.progressPercentage}%
              </Text>
              <Text retro size="sm" className="text-[#333333]">
                Step {Math.min(currentStepIndex + 1, guidanceSteps.length)} of {guidanceSteps.length}
              </Text>
            </HStack>
            <Progress value={progress.progressPercentage} className="h-2 bg-[#E0E0E0] border-2 border-[#333333]">
              <ProgressFilledTrack 
                className="bg-[#A2D8FF]" 
                style={{ width: `${progress.progressPercentage}%` }}
              />
            </Progress>
          </VStack>
        </Card>

        {allStepsCompleted ? (
          <Card className="p-6 bg-[#98FB98] border-2 border-[#333333] shadow-[4px_4px_0_#333333]">
            <VStack space="md" className="items-center">
              <Icon as={CheckCircle} size="xl" className="text-[#333333]" />
              <Heading retro size="lg" className="text-[#333333] text-center font-bold tracking-wide">
                Mission Completed! 🎉
              </Heading>
              <Text retro className="text-center text-[#333333]">
                Congratulations! You've successfully completed all evidence requirements. 
                Your submission is being reviewed and points will be awarded once approved.
              </Text>
              <Button 
                onPress={() => router.back()} 
                className="bg-[#98FB98] border-2 border-[#333333] shadow-[4px_4px_0_#333333]"
              >
                <Text retro className="text-[#333333] font-bold">Return to Missions</Text>
              </Button>
            </VStack>
          </Card>
        ) : currentStep ? (
          <VStack space="lg">
            {/* Current Step */}
            <Card className="p-4 bg-[#FFE4B5] border-2 border-[#333333] shadow-[4px_4px_0_#333333]">
              <VStack space="md">
                <HStack space="md" className="items-start">
                  <Box className="w-8 h-8 bg-[#DDA0DD] border-2 border-[#333333] rounded-full items-center justify-center">
                    <Text retro size="sm" className="font-bold text-[#333333]">
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
            <Card className="p-4 bg-[#FCFCFC] border-2 border-[#333333] shadow-[4px_4px_0_#333333]">
              <VStack space="md">
                <Text retro size="lg" className="font-bold text-[#333333]">
                  Add Evidence
                </Text>

                {/* Evidence Type Buttons */}
                <VStack space="md">
                  {currentStep.requiredEvidence.includes("photo") && (
                    <VStack space="xs">
                      <Text size="sm" className="font-medium">Photo Evidence</Text>
                      <Button
                        size="sm"
                        onPress={handleSelectPhoto}
                        disabled={submitting}
                        className="bg-[#A2D8FF] border-2 border-[#333333] shadow-[4px_4px_0_#333333]"
                      >
                        <HStack space="xs" className="items-center">
                          <Icon as={Upload} size="sm" className="text-[#333333]" />
                          <Text retro className="text-[#333333] font-bold">Select Photo from Gallery</Text>
                        </HStack>
                      </Button>
                    </VStack>
                  )}

                  {currentStep.requiredEvidence.includes("video") && (
                    <VStack space="xs">
                      <Text size="sm" className="font-medium">Video Evidence</Text>
                      <Button
                        size="sm"
                        onPress={handleSelectVideo}
                        disabled={submitting}
                        className="bg-[#DDA0DD] border-2 border-[#333333] shadow-[4px_4px_0_#333333]"
                      >
                        <HStack space="xs" className="items-center">
                          <Icon as={Video} size="sm" className="text-[#333333]" />
                          <Text retro className="text-[#333333] font-bold">Select Video from Gallery</Text>
                        </HStack>
                      </Button>
                    </VStack>
                  )}

                  {/* Document Picker */}
                  {currentStep.requiredEvidence.includes("document") && (
                    <VStack space="xs">
                      <Text size="sm" className="font-medium">Document Evidence</Text>
                      <Button
                        size="sm"
                        onPress={handleSelectDocument}
                        disabled={submitting}
                        className="bg-[#FFE4B5] border-2 border-[#333333] shadow-[4px_4px_0_#333333]"
                      >
                        <VStack className="items-center justify-center">
                          <HStack space="xs" className="items-center">
                            <Icon as={FileText} size="sm" className="text-[#333333]" />
                            <Text retro className="text-[#333333] font-bold">Upload Document/File</Text>
                          </HStack>
                          <Text size="xs" className="text-[#333333] font-semibold">(PDF, DOC, XLS, etc.)</Text>
                        </VStack>
                      </Button>
                    </VStack>
                  )}

                  {/* Audio Recording */}
                  {currentStep.requiredEvidence.includes("audio") && (
                    <VStack space="xs">
                      <Text size="sm" className="font-medium">Audio Evidence</Text>
                      <Button
                        size="sm"
                        onPress={isRecording ? stopAudioRecording : startAudioRecording}
                        disabled={submitting}
                        className={`border-2 border-[#333333] shadow-[4px_4px_0_#333333] ${isRecording ? "bg-[#FF6B6B]" : "bg-[#FFA07A]"}`}
                      >
                        <HStack space="xs" className="items-center">
                          <Icon as={isRecording ? Square : Mic} size="sm" className="text-[#333333]" />
                          <Text retro className="text-[#333333] font-bold">
                            {isRecording ? "Stop Recording" : "Start Recording"}
                          </Text>
                        </HStack>
                      </Button>
                      {isRecording && (
                        <Text retro size="xs" className="text-red-500 text-center animate-pulse">
                          🔴 Recording in progress...
                        </Text>
                      )}
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
                  className="mt-4 bg-[#98FB98] border-2 border-[#333333] shadow-[4px_4px_0_#333333]"
                >
                  <Text retro className="text-[#333333] font-bold">
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
