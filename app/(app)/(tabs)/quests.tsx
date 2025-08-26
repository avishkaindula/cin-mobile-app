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
import {
  getPublishedMissions,
  toggleMissionBookmark,
  startMission,
  getMissionThumbnailUrl,
  MissionWithStats,
} from "@/services/missions";

const QuestsPage = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all"); // all, missions, events
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
              const thumbnailUrl = await getMissionThumbnailUrl(
                mission.thumbnail_path
              );
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
      const { success, error, is_bookmarked } = await toggleMissionBookmark(
        missionId
      );

      if (success) {
        setMissions((prev) =>
          prev.map((mission) =>
            mission.id === missionId ? { ...mission, is_bookmarked } : mission
          )
        );
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
        // Redirect to submit page to start providing evidence
        router.push(`/mission/${missionId}/submit`);
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
    router.push(`/mission/${missionId}/`);
  };

  // User stats (calculated from real data)
  const userStats = {
    completed: missions.filter((m) => m.submission_status === "reviewed")
      .length,
    active: missions.filter(
      (m) =>
        m.submission_status === "in_progress" ||
        m.submission_status === "started"
    ).length,
    totalPoints: missions
      .filter((m) => m.submission_status === "reviewed")
      .reduce((sum, m) => sum + (m.points_awarded || 0), 0),
    totalEnergy: missions
      .filter((m) => m.submission_status === "reviewed")
      .reduce((sum, m) => sum + (m.energy_awarded || 0), 0),
    rank: 45, // This would come from user profile/leaderboard
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
      activeTab === "missions" ||
      (activeTab === "events" &&
        (mission.is_bookmarked || mission.submission_status));

    return matchesSearch && matchesTab;
  });

  const getStatusInfo = (mission: MissionWithStats) => {
    if (mission.submission_status === "reviewed") {
      return { text: "Completed", color: "text-green-600", icon: CheckCircle };
    } else if (
      mission.submission_status === "in_progress" ||
      mission.submission_status === "started"
    ) {
      return {
        text: `${mission.submission_progress || 0}% Complete`,
        color: "text-blue-600",
        icon: Play,
      };
    } else if (mission.is_bookmarked) {
      return {
        text: "Saved",
        color: "text-purple-600",
        icon: BookmarkCheck,
      };
    } else {
      return { text: "Available", color: "text-green-600", icon: Target };
    }
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
                Loading missions...
              </Text>
            </VStack>
          </Card>
        </Box>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="bg-white dark:bg-background-dark"
    >
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <VStack space="lg" className="p-6 pb-4">
          <VStack space="md" className="items-center">
            <Image
              source={require("@/assets/icon.png")}
              style={{ width: 64, height: 64 }}
              resizeMode="contain"
            />
            <Heading
              size="xl"
              className="text-[#333333] font-extrabold tracking-wider"
              retro
            >
              Climate Quests
            </Heading>
            <Text
              size="lg"
              className="text-[#333333] text-center font-semibold tracking-wide"
            >
              Complete missions to earn rewards and make an impact
            </Text>
          </VStack>

          {/* User Stats */}
          <Card className="p-6 bg-[#FCFCFC] border-2 border-[#333333] shadow-[4px_4px_0_#333333]">
            <VStack space="md">
              <HStack className="justify-between items-center">
                <Text size="xl" className="text-[#333333] font-bold tracking-wide" retro>
                  Your Progress
                </Text>
                <Box className="bg-[#A2D8FF] border-2 border-[#333333] shadow-[2px_2px_0_#333333] rounded-lg p-3">
                  <Icon as={Award} size="lg" className="text-[#333333]" />
                </Box>
              </HStack>
              <HStack className="justify-between items-center w-full">
                <VStack space="xs" className="items-center flex-1">
                  <Text className="font-bold text-[#333333] text-2xl tracking-wider" retro>
                    {userStats.completed}
                  </Text>
                  <Text size="sm" className="text-[#333333] font-bold tracking-wide">
                    Completed
                  </Text>
                </VStack>
                <VStack space="xs" className="items-center flex-1">
                  <Text className="font-bold text-[#333333] text-2xl tracking-wider" retro>
                    {userStats.active}
                  </Text>
                  <Text size="sm" className="text-[#333333] font-bold tracking-wide">
                    Active
                  </Text>
                </VStack>
                <VStack space="xs" className="items-center flex-1">
                  <Text className="font-bold text-[#333333] text-2xl tracking-wider" retro>
                    {userStats.totalPoints}
                  </Text>
                  <Text size="sm" className="text-[#333333] font-bold tracking-wide">
                    Points
                  </Text>
                </VStack>
                <VStack space="xs" className="items-center flex-1">
                  <Text className="font-bold text-[#333333] text-2xl tracking-wider" retro>
                    {userStats.totalEnergy}
                  </Text>
                  <Text size="sm" className="text-[#333333] font-bold tracking-wide">
                    Energy
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Card>
        </VStack>

        {/* Search Bar */}
        <Box className="px-6 mb-4">
          <HStack
            space="md"
            className="items-center bg-[#FCFCFC] border-2 border-[#333333] shadow-[2px_2px_0_#333333] rounded-lg px-4 py-3"
          >
            <Icon as={Search} size="md" className="text-[#333333]" />
            <TextInput
              className="flex-1 text-[#333333] font-semibold tracking-wide"
              placeholder="Search quests..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#333333"
            />
          </HStack>
        </Box>

        {/* Tab Navigation */}
        <HStack space="md" className="px-6 mb-6">
          <Button
            variant={activeTab === "all" ? "solid" : "outline"}
            size="sm"
            onPress={() => setActiveTab("all")}
            className={`flex-1 border-2 border-[#333333] shadow-[2px_2px_0_#333333] ${
              activeTab === "all" ? "bg-[#98FB98]" : "bg-[#FCFCFC]"
            }`}
          >
            <Text className={`font-bold tracking-wide ${activeTab === "all" ? "text-[#333333]" : "text-[#333333]"}`}>
              All ({missions.length})
            </Text>
          </Button>
          <Button
            variant={activeTab === "missions" ? "solid" : "outline"}
            size="sm"
            onPress={() => setActiveTab("missions")}
            className={`flex-1 border-2 border-[#333333] shadow-[2px_2px_0_#333333] ${
              activeTab === "missions" ? "bg-[#A2D8FF]" : "bg-[#FCFCFC]"
            }`}
          >
            <HStack space="xs" className="items-center">
              <Icon
                as={Target}
                size="sm"
                className="text-[#333333]"
              />
              <Text className="text-[#333333] font-bold tracking-wide">
                Missions
              </Text>
            </HStack>
          </Button>
          <Button
            variant={activeTab === "events" ? "solid" : "outline"}
            size="sm"
            onPress={() => setActiveTab("events")}
            className={`flex-1 border-2 border-[#333333] shadow-[2px_2px_0_#333333] ${
              activeTab === "events" ? "bg-[#FFE4B5]" : "bg-[#FCFCFC]"
            }`}
          >
            <HStack space="xs" className="items-center">
              <Icon
                as={Calendar}
                size="sm"
                className="text-[#333333]"
              />
              <Text className="text-[#333333] font-bold tracking-wide">
                Events
              </Text>
            </HStack>
          </Button>
        </HStack>

        {/* Missions List */}
        <VStack space="md" className="px-6 pb-6">
          {filteredMissions.length === 0 ? (
            <Card className="p-8 items-center border-2 border-[#333333] shadow-[4px_4px_0_#333333] bg-[#FCFCFC]">
              <VStack space="md" className="items-center">
                <Image
                  source={require("@/assets/icon.png")}
                  style={{ width: 48, height: 48 }}
                  resizeMode="contain"
                />
                <Text className="text-center text-[#333333] font-semibold tracking-wide">
                  {searchQuery
                    ? "No missions found matching your search."
                    : "No missions available at the moment."}
                </Text>
              </VStack>
            </Card>
          ) : (
            filteredMissions.map((mission) => {
              const statusInfo = getStatusInfo(mission);

              return (
                <Card
                  key={mission.id}
                  className="overflow-hidden border-2 border-[#333333] shadow-[4px_4px_0_#333333] bg-[#FCFCFC]"
                >
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
                              <Badge className="bg-[#98FB98] border-2 border-[#333333] shadow-[2px_2px_0_#333333]">
                                <HStack space="xs" className="items-center">
                                  <Icon
                                    as={Award}
                                    size="xs"
                                    className="text-[#333333]"
                                  />
                                  <Text size="xs" className="text-[#333333] font-bold tracking-wide">
                                    +{mission.points_awarded} pts
                                  </Text>
                                </HStack>
                              </Badge>
                              <Badge className="bg-[#FFE4B5] border-2 border-[#333333] shadow-[2px_2px_0_#333333]">
                                <HStack space="xs" className="items-center">
                                  <Icon
                                    as={Zap}
                                    size="xs"
                                    className="text-[#333333]"
                                  />
                                  <Text size="xs" className="text-[#333333] font-bold tracking-wide">
                                    +{mission.energy_awarded} ⚡
                                  </Text>
                                </HStack>
                              </Badge>
                            </HStack>

                            <Heading
                              size="md"
                              className="text-[#333333] font-extrabold tracking-wider"
                              retro
                            >
                              {mission.title}
                            </Heading>

                            <Text
                              size="sm"
                              className="text-[#333333] font-semibold tracking-wide"
                              numberOfLines={2}
                            >
                              {mission.description}
                            </Text>
                          </VStack>

                          <HStack space="xs" className="items-center">
                            <Icon
                              as={statusInfo.icon}
                              size="sm"
                              className={statusInfo.color}
                            />
                            <Text size="xs" className={statusInfo.color}>
                              {statusInfo.text}
                            </Text>
                          </HStack>
                        </HStack>

                        {/* Mission Info */}
                        <HStack space="md" className="items-center">
                          <HStack space="xs" className="items-center">
                            <Icon
                              as={Building}
                              size="sm"
                              className="text-[#333333]"
                            />
                            <Text
                              size="sm"
                              className="text-[#333333] font-semibold tracking-wide"
                            >
                              {mission.organization_name}
                            </Text>
                          </HStack>
                          <HStack space="xs" className="items-center">
                            <Icon
                              as={Users}
                              size="sm"
                              className="text-[#333333]"
                            />
                            <Text
                              size="sm"
                              className="text-[#333333] font-semibold tracking-wide"
                            >
                              {mission.participants_count}
                            </Text>
                          </HStack>
                        </HStack>

                        {/* Progress Bar for Active Missions */}
                        {mission.submission_status &&
                          mission.submission_status !== "reviewed" && (
                            <VStack space="xs">
                              <HStack className="justify-between">
                                <Text
                                  size="sm"
                                  className="text-[#333333] font-bold tracking-wide"
                                >
                                  Progress
                                </Text>
                                <Text size="sm" className="text-[#333333] font-bold tracking-wide">
                                  {mission.submission_progress || 0}%
                                </Text>
                              </HStack>
                              <Box className="w-full h-3 bg-[#333333] border-2 border-[#333333] rounded-lg">
                                <Box
                                  className="h-full rounded-md bg-[#A2D8FF] border border-[#333333]"
                                  style={{
                                    width: `${mission.submission_progress || 0}%`,
                                  }}
                                />
                              </Box>
                            </VStack>
                          )}

                        {/* Action Buttons */}
                        <HStack space="md">
                          <Button
                            variant="solid"
                            size="sm"
                            onPress={() => handleBookmarkToggle(mission.id)}
                            disabled={
                              actionLoading === `bookmark-${mission.id}`
                            }
                            className="flex-1 border-2 border-[#333333] shadow-[2px_2px_0_#333333] bg-[#FCFCFC]"
                          >
                            <HStack space="xs" className="items-center">
                              <Icon
                                as={
                                  mission.is_bookmarked
                                    ? BookmarkCheck
                                    : Bookmark
                                }
                                size="sm"
                                className="text-[#333333]"
                              />
                              <Text size="sm" className="text-[#333333] font-bold tracking-wide">
                                {mission.is_bookmarked ? "Saved" : "Save"}
                              </Text>
                            </HStack>
                          </Button>

                          <Button
                            variant="solid"
                            size="sm"
                            onPress={() => handleViewMission(mission.id)}
                            className="flex-1 border-2 border-[#333333] shadow-[2px_2px_0_#333333] bg-[#FCFCFC]"
                          >
                            <HStack space="sm" className="items-center">
                              <Icon
                                as={Eye}
                                size="sm"
                                className="text-[#333333]"
                              />
                              <Text className="text-[#333333] font-bold tracking-wide">View</Text>
                            </HStack>
                          </Button>

                          {mission.submission_status ? (
                            <Button
                              variant="solid"
                              size="sm"
                              onPress={() => {
                                if (mission.submission_status === "reviewed") {
                                  handleViewMission(mission.id);
                                } else {
                                  router.push(`/mission/${mission.id}/submit`);
                                }
                              }}
                              className="flex-1 bg-[#A2D8FF] border-2 border-[#333333] shadow-[2px_2px_0_#333333]"
                              disabled={
                                mission.submission_status === "reviewed"
                              }
                            >
                              <HStack space="xs" className="items-center">
                                <Icon
                                  as={
                                    mission.submission_status === "reviewed"
                                      ? CheckCircle
                                      : Play
                                  }
                                  size="sm"
                                  className="text-[#333333]"
                                />
                                <Text size="sm" className="text-[#333333] font-bold tracking-wide">
                                  {mission.submission_status === "reviewed"
                                    ? "Completed"
                                    : "Continue"}
                                </Text>
                              </HStack>
                            </Button>
                          ) : (
                            <Button
                              variant="solid"
                              size="sm"
                              onPress={() => handleStartMission(mission.id)}
                              disabled={actionLoading === `start-${mission.id}`}
                              className="flex-1 bg-[#98FB98] border-2 border-[#333333] shadow-[2px_2px_0_#333333]"
                            >
                              <HStack space="xs" className="items-center">
                                <Icon
                                  as={Target}
                                  size="sm"
                                  className="text-[#333333]"
                                />
                                <Text size="sm" className="text-[#333333] font-bold tracking-wide">
                                  Start
                                </Text>
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
