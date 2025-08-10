import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, RefreshControl, Image, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Pressable } from "@/components/ui/pressable";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/components/i18n/language-context";
import {
  Zap,
  Target,
  Calendar,
  Clock,
  Users,
  Award,
  Search,
  Filter,
  SortAsc,
  Thermometer,
  FileText,
  TrendingUp,
  CheckCircle,
  Play,
  MapPin,
  TreePine,
  Waves,
  Recycle,
  Lightbulb,
  Heart,
  Plus,
  Bookmark,
  BookmarkCheck,
  Eye,
  Building,
} from "lucide-react-native";
import { getPublishedMissions, toggleMissionBookmark, startMission, getMissionThumbnailUrl, MissionWithStats } from "@/services/missions";

const QuestsPage = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all"); // all, missions, my
  const [searchQuery, setSearchQuery] = useState("");
  const [missions, setMissions] = useState<MissionWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadMissions();
  }, []);

  const loadMissions = async () => {
    try {
      setLoading(true);
      const { data, error } = await getPublishedMissions();
      
      if (error) {
        console.error("Error loading missions:", error);
      } else if (data) {
        // Load thumbnail URLs for missions that have them
        const missionsWithThumbnails = await Promise.all(
          data.map(async (mission) => {
            if (mission.thumbnail_path) {
              const thumbnailUrl = await getMissionThumbnailUrl(mission.thumbnail_path);
              return { ...mission, thumbnailUrl };
            }
            return mission;
          })
        );
        setMissions(missionsWithThumbnails);
      }
    } catch (error) {
      console.error("Error loading missions:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMissions();
    setRefreshing(false);
  };

  const handleBookmarkToggle = async (missionId: string) => {
    setActionLoading(`bookmark-${missionId}`);
    try {
      const { success, error, is_bookmarked } = await toggleMissionBookmark(missionId);
      
      if (success) {
        setMissions(prev => prev.map(mission => 
          mission.id === missionId 
            ? { ...mission, is_bookmarked }
            : mission
        ));
      } else {
        console.error("Bookmark error:", error);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleStartMission = async (missionId: string) => {
    setActionLoading(`start-${missionId}`);
    try {
      const { success, error } = await startMission(missionId);
      
      if (success) {
        // Refresh missions data to get updated submission status
        await loadMissions();
      } else {
        console.error("Start mission error:", error);
      }
    } catch (error) {
      console.error("Error starting mission:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewMission = (missionId: string) => {
    router.push(`/mission/${missionId}`);
  };

  // User stats (this can be calculated from real data later)
  const userStats = {
    completed: missions.filter(m => m.submission_status === "reviewed").length,
    active: missions.filter(m => m.submission_status === "in_progress" || m.submission_status === "started").length,
    totalPoints: 850, // This would come from user profile
    totalEnergy: 425, // This would come from user profile
    rank: 45, // This would come from user profile
  };

  // Filter missions based on current tab and search
  const filteredMissions = missions.filter((mission) => {
    // Text search
    const matchesSearch =
      searchQuery === "" ||
      mission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Tab filter
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "missions") ||
      (activeTab === "my" && (mission.is_bookmarked || mission.submission_status));

    return matchesSearch && matchesTab;
  });

  const getStatusInfo = (mission: MissionWithStats) => {
    if (mission.submission_status === "reviewed") {
      return { text: "Completed", color: "text-green-600", icon: CheckCircle };
    } else if (mission.submission_status === "in_progress" || mission.submission_status === "started") {
      return { text: `${mission.submission_progress || 0}% Complete`, color: "text-blue-600", icon: Play };
    } else if (mission.is_bookmarked) {
      return { text: "Bookmarked", color: "text-purple-600", icon: BookmarkCheck };
    } else {
      return { text: "Available", color: "text-green-600", icon: Target };
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }} className="bg-white dark:bg-background-dark">
        <Box className="flex-1 justify-center items-center p-6">
          <Text className="text-typography-600 dark:text-typography-400">Loading missions...</Text>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white dark:bg-background-dark">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <VStack space="lg" className="p-6 pb-4">
          <HStack className="justify-between items-center">
            <VStack space="xs">
              <Heading size="xl" className="text-typography-900 dark:text-typography-950">
                Climate Quests
              </Heading>
              <Text size="sm" className="text-typography-600 dark:text-typography-750">
                Complete missions to earn rewards and make an impact
              </Text>
            </VStack>
            <Button variant="outline" size="sm" className="p-3">
              <Icon as={Filter} size="md" className="text-typography-600" />
            </Button>
          </HStack>

          {/* User Stats */}
          <Card className="p-4 bg-primary-600">
            <HStack className="justify-between items-center">
              <VStack space="xs">
                <Text size="sm" className="text-white/80">Your Progress</Text>
                <HStack space="md">
                  <VStack space="xs" className="items-center">
                    <Text className="font-bold text-white text-lg">{userStats.completed}</Text>
                    <Text size="xs" className="text-white/80">Completed</Text>
                  </VStack>
                  <VStack space="xs" className="items-center">
                    <Text className="font-bold text-white text-lg">{userStats.active}</Text>
                    <Text size="xs" className="text-white/80">Active</Text>
                  </VStack>
                  <VStack space="xs" className="items-center">
                    <Text className="font-bold text-white text-lg">{userStats.totalPoints}</Text>
                    <Text size="xs" className="text-white/80">Points</Text>
                  </VStack>
                </HStack>
              </VStack>
              <Box className="bg-white/20 rounded-full p-4">
                <Icon as={Award} size="lg" className="text-white" />
              </Box>
            </HStack>
          </Card>
        </VStack>

        {/* Search Bar */}
        <Box className="px-6 mb-4">
          <HStack space="md" className="items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3">
            <Icon as={Search} size="md" className="text-gray-500" />
            <TextInput
              className="flex-1 text-typography-900 dark:text-typography-950"
              placeholder="Search missions..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#6B7280"
            />
          </HStack>
        </Box>

        {/* Tab Navigation */}
        <HStack space="md" className="px-6 mb-6">
          <Button
            variant={activeTab === "all" ? "solid" : "outline"}
            size="sm"
            onPress={() => setActiveTab("all")}
            className="flex-1"
          >
            <Text className={activeTab === "all" ? "text-white" : ""}>
              All ({missions.length})
            </Text>
          </Button>
          <Button
            variant={activeTab === "missions" ? "solid" : "outline"}
            size="sm"
            onPress={() => setActiveTab("missions")}
            className="flex-1"
          >
            <HStack space="xs" className="items-center">
              <Icon
                as={Target}
                size="sm"
                className={activeTab === "missions" ? "text-white" : "text-gray-500"}
              />
              <Text className={activeTab === "missions" ? "text-white" : ""}>
                Missions
              </Text>
            </HStack>
          </Button>
          <Button
            variant={activeTab === "my" ? "solid" : "outline"}
            size="sm"
            onPress={() => setActiveTab("my")}
            className="flex-1"
          >
            <Text className={activeTab === "my" ? "text-white" : ""}>
              My Quests
            </Text>
          </Button>
        </HStack>

        {/* Missions List */}
        <VStack space="md" className="px-6 pb-6">
          {filteredMissions.length === 0 ? (
            <Card className="p-8 items-center">
              <VStack space="md" className="items-center">
                <Icon as={Target} size="xl" className="text-gray-400" />
                <Text className="text-center text-gray-500">
                  {searchQuery ? "No missions found matching your search." : "No missions available at the moment."}
                </Text>
              </VStack>
            </Card>
          ) : (
            filteredMissions.map((mission) => {
              const statusInfo = getStatusInfo(mission);
              
              return (
                <Card key={mission.id} className="overflow-hidden">
                  <VStack space="md">
                    {/* Mission Image */}
                    {(mission as any).thumbnailUrl && (
                      <Box className="h-48 w-full">
                        <Image
                          source={{ uri: (mission as any).thumbnailUrl }}
                          className="w-full h-full"
                          style={{ resizeMode: "cover" }}
                        />
                      </Box>
                    )}

                    <Box className="p-4">
                      {/* Mission Header */}
                      <VStack space="md">
                        <HStack className="justify-between items-start">
                          <VStack space="xs" className="flex-1">
                            <HStack space="xs" className="items-center">
                              <Badge className="bg-green-100 dark:bg-green-900/30">
                                <HStack space="xs" className="items-center">
                                  <Icon as={Award} size="xs" className="text-green-600" />
                                  <Text size="xs" className="text-green-600">
                                    +{mission.points_awarded} pts
                                  </Text>
                                </HStack>
                              </Badge>
                              <Badge className="bg-orange-100 dark:bg-orange-900/30">
                                <HStack space="xs" className="items-center">
                                  <Icon as={Zap} size="xs" className="text-orange-600" />
                                  <Text size="xs" className="text-orange-600">
                                    +{mission.energy_awarded} ⚡
                                  </Text>
                                </HStack>
                              </Badge>
                            </HStack>

                            <Heading size="md" className="text-typography-900 dark:text-typography-950">
                              {mission.title}
                            </Heading>
                            
                            <Text
                              size="sm"
                              className="text-typography-600 dark:text-typography-750"
                              numberOfLines={2}
                            >
                              {mission.description}
                            </Text>
                          </VStack>

                          <HStack space="xs" className="items-center">
                            <Icon as={statusInfo.icon} size="sm" className={statusInfo.color} />
                            <Text size="xs" className={statusInfo.color}>
                              {statusInfo.text}
                            </Text>
                          </HStack>
                        </HStack>

                        {/* Mission Info */}
                        <HStack space="md" className="items-center">
                          <HStack space="xs" className="items-center">
                            <Icon as={Building} size="sm" className="text-gray-500" />
                            <Text size="sm" className="text-typography-600 dark:text-typography-750">
                              {mission.organization_name}
                            </Text>
                          </HStack>
                          <HStack space="xs" className="items-center">
                            <Icon as={Users} size="sm" className="text-blue-500" />
                            <Text size="sm" className="text-typography-600 dark:text-typography-750">
                              {mission.participants_count}
                            </Text>
                          </HStack>
                        </HStack>

                        {/* Progress Bar for Active Missions */}
                        {mission.submission_status && mission.submission_status !== "reviewed" && (
                          <VStack space="xs">
                            <HStack className="justify-between">
                              <Text size="sm" className="text-typography-600 dark:text-typography-750">
                                Progress
                              </Text>
                              <Text size="sm" className="text-blue-600">
                                {mission.submission_progress || 0}%
                              </Text>
                            </HStack>
                            <Progress
                              value={mission.submission_progress || 0}
                              className="h-2"
                            />
                          </VStack>
                        )}

                        {/* Action Buttons */}
                        <HStack space="md">
                          <Button
                            variant="outline"
                            size="sm"
                            onPress={() => handleBookmarkToggle(mission.id)}
                            disabled={actionLoading === `bookmark-${mission.id}`}
                            className="flex-1"
                          >
                            <HStack space="xs" className="items-center">
                              <Icon
                                as={mission.is_bookmarked ? BookmarkCheck : Bookmark}
                                size="sm"
                                className={mission.is_bookmarked ? "text-primary-600" : "text-gray-500"}
                              />
                              <Text size="sm">
                                {mission.is_bookmarked ? "Saved" : "Save"}
                              </Text>
                            </HStack>
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onPress={() => handleViewMission(mission.id)}
                            className="flex-1"
                          >
                            <HStack space="xs" className="items-center">
                              <Icon as={Eye} size="sm" className="text-gray-500" />
                              <Text size="sm">View</Text>
                            </HStack>
                          </Button>

                          {mission.submission_status ? (
                            <Button
                              variant="solid"
                              size="sm"
                              className="flex-1 bg-blue-600"
                              disabled={mission.submission_status === "reviewed"}
                            >
                              <HStack space="xs" className="items-center">
                                <Icon
                                  as={mission.submission_status === "reviewed" ? CheckCircle : Play}
                                  size="sm"
                                  className="text-white"
                                />
                                <Text size="sm" className="text-white">
                                  {mission.submission_status === "reviewed" ? "Completed" : "Continue"}
                                </Text>
                              </HStack>
                            </Button>
                          ) : (
                            <Button
                              variant="solid"
                              size="sm"
                              onPress={() => handleStartMission(mission.id)}
                              disabled={actionLoading === `start-${mission.id}`}
                              className="flex-1"
                            >
                              <HStack space="xs" className="items-center">
                                <Icon as={Target} size="sm" className="text-white" />
                                <Text size="sm" className="text-white">Start</Text>
                              </HStack>
                            </Button>
                          )}
                        </HStack>
                      </VStack>
                    </Box>
                  </VStack>
                </Card>
              );
            })
          )}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuestsPage;
