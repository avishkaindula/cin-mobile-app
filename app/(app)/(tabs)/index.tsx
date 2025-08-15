import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Image, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
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
import { useLanguage } from "@/components/i18n/language-context";
import { Globe, Trophy, Play, CheckCircle, Bookmark, Target, Zap, Award, Users, Building, Eye } from "lucide-react-native";
import {
  getPublishedMissions,
  getMissionThumbnailUrl,
  MissionWithStats,
} from "@/services/missions";

const HomePage = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [missions, setMissions] = useState<MissionWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  // Filter missions for different sections
  const ongoingMissions = missions.filter(
    (m) =>
      m.submission_status === "in_progress" ||
      m.submission_status === "started"
  );

  const savedMissions = missions.filter((m) => m.is_bookmarked);
  
  const availableMissions = missions.filter(
    (m) => !m.submission_status && !m.is_bookmarked
  ).slice(0, 3); // Show top 3 available missions

  // User league and points data (calculated from real data)
  const userStats = {
    currentPoints: missions
      .filter((m) => m.submission_status === "reviewed")
      .reduce((sum, m) => sum + (m.points_awarded || 0), 0),
    currentLeague: "silver",
    nextLeagueThreshold: 1000,
    leagueColor: "#C0C0C0", // Silver color
    leagueIcon: Trophy,
    totalEnergy: missions
      .filter((m) => m.submission_status === "reviewed")
      .reduce((sum, m) => sum + (m.energy_awarded || 0), 0),
    completedMissions: missions.filter((m) => m.submission_status === "reviewed").length,
    activeMissions: ongoingMissions.length,
  };

  const pointsToNext = userStats.nextLeagueThreshold - userStats.currentPoints;

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
        icon: Bookmark,
      };
    } else {
      return { text: "Available", color: "text-green-600", icon: Target };
    }
  };

  const handleViewMission = (missionId: string) => {
    router.push(`/mission/${missionId}/`);
  };

  const handleStartMission = (missionId: string) => {
    router.push(`/mission/${missionId}/submit`);
  };

  const handleContinueMission = (missionId: string) => {
    router.push(`/mission/${missionId}/submit`);
  };



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
        <Box className="p-6">
          {/* Header with League Status */}
          <VStack space="lg" className="mb-8">
            <HStack space="lg" className="items-center">
              <Icon as={Globe} size="xl" className="text-primary-500" />
              <VStack space="xs" className="flex-1">
                <Heading
                  size="xl"
                  className="text-typography-900 dark:text-typography-950"
                >
                  Mission 1.5
                </Heading>
                <Text
                  size="sm"
                  className="text-typography-600 dark:text-typography-750"
                >
                  Empowering climate action
                </Text>
              </VStack>
            </HStack>

            {/* League Status Card */}
            <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-gray-200 dark:border-gray-800">
              <HStack space="md" className="items-center">
                <Box
                  className="p-3 rounded-full"
                  style={{ backgroundColor: `${userStats.leagueColor}20` }}
                >
                  <Icon
                    as={userStats.leagueIcon}
                    size="md"
                    style={{ color: userStats.leagueColor }}
                  />
                </Box>
                <VStack space="xs" className="flex-1">
                  <HStack space="xs" className="items-center">
                    <Text
                      size="lg"
                      className="font-bold text-typography-900 dark:text-typography-950"
                    >
                      Silver League
                    </Text>
                    <Badge variant="solid" className="bg-primary-500">
                      <Text size="xs" className="text-white">
                        {userStats.currentPoints} {t("points")}
                      </Text>
                    </Badge>
                  </HStack>
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750"
                  >
                    {pointsToNext > 0 ? `${pointsToNext} ${t("pointsToNext")}` : "Max level reached!"}
                  </Text>
                  <Box className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                    <Box
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(
                          (userStats.currentPoints /
                            userStats.nextLeagueThreshold) *
                          100, 100
                        )}%`,
                        backgroundColor: userStats.leagueColor,
                      }}
                    />
                  </Box>
                </VStack>
              </HStack>
            </Card>
          </VStack>

          {/* Quick Stats */}
          <HStack space="md" className="mb-8">
            <Card className="flex-1 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <VStack space="xs" className="items-center">
                <Text className="font-bold text-green-600 text-2xl">
                  {userStats.completedMissions}
                </Text>
                <Text size="sm" className="text-green-600">
                  Completed
                </Text>
              </VStack>
            </Card>
            <Card className="flex-1 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <VStack space="xs" className="items-center">
                <Text className="font-bold text-blue-600 text-2xl">
                  {userStats.activeMissions}
                </Text>
                <Text size="sm" className="text-blue-600">
                  Active
                </Text>
              </VStack>
            </Card>
            <Card className="flex-1 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <VStack space="xs" className="items-center">
                <Text className="font-bold text-orange-600 text-2xl">
                  {userStats.totalEnergy}
                </Text>
                <Text size="sm" className="text-orange-600">
                  Energy
                </Text>
              </VStack>
            </Card>
          </HStack>

          {/* Ongoing Quests */}
          {ongoingMissions.length > 0 && (
            <VStack space="lg" className="mb-8">
              <HStack className="justify-between items-center">
                <Heading
                  size="lg"
                  className="text-typography-900 dark:text-typography-950"
                >
                  Continue Your Quests
                </Heading>
                <Button variant="link" size="sm" onPress={() => router.push('/quests')}>
                  <Text size="sm" className="text-primary-500">
                    View All
                  </Text>
                </Button>
              </HStack>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack space="lg">
                  {ongoingMissions.slice(0, 5).map((mission) => {
                    const statusInfo = getStatusInfo(mission);
                    return (
                      <Card
                        key={mission.id}
                        className="w-72 overflow-hidden border border-gray-200 dark:border-gray-800"
                      >
                        <VStack space="md">
                          {(mission as any).thumbnailUrl && (
                            <Box className="relative">
                              <Image
                                source={{ uri: (mission as any).thumbnailUrl }}
                                className="w-full h-32"
                                style={{ resizeMode: "cover" }}
                              />
                              <Badge
                                variant="solid"
                                className="absolute top-2 right-2 bg-blue-500"
                              >
                                <Text size="xs" className="text-white">
                                  {mission.submission_progress || 0}% Complete
                                </Text>
                              </Badge>
                            </Box>
                          )}
                          <VStack space="md" className="p-4">
                            <HStack space="xs" className="items-center">
                              <Badge className="bg-green-100 dark:bg-green-900/30">
                                <HStack space="xs" className="items-center">
                                  <Icon
                                    as={Award}
                                    size="xs"
                                    className="text-green-600"
                                  />
                                  <Text size="xs" className="text-green-600">
                                    +{mission.points_awarded} pts
                                  </Text>
                                </HStack>
                              </Badge>
                              <Badge className="bg-orange-100 dark:bg-orange-900/30">
                                <HStack space="xs" className="items-center">
                                  <Icon
                                    as={Zap}
                                    size="xs"
                                    className="text-orange-600"
                                  />
                                  <Text size="xs" className="text-orange-600">
                                    +{mission.energy_awarded} ⚡
                                  </Text>
                                </HStack>
                              </Badge>
                            </HStack>
                            <VStack space="xs">
                              <Text
                                className="font-semibold text-typography-900 dark:text-typography-950"
                                numberOfLines={2}
                              >
                                {mission.title}
                              </Text>
                              <Text
                                size="sm"
                                className="text-typography-600 dark:text-typography-750"
                                numberOfLines={3}
                              >
                                {mission.description}
                              </Text>
                            </VStack>
                            <VStack space="xs">
                              <HStack className="justify-between">
                                <Text
                                  size="sm"
                                  className="text-typography-600 dark:text-typography-750"
                                >
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
                            <Button 
                              size="sm" 
                              className="mt-2"
                              onPress={() => handleContinueMission(mission.id)}
                            >
                              <HStack space="xs" className="items-center">
                                <Icon as={Play} size="sm" className="text-white" />
                                <Text className="text-white">Continue</Text>
                              </HStack>
                            </Button>
                          </VStack>
                        </VStack>
                      </Card>
                    );
                  })}
                </HStack>
              </ScrollView>
            </VStack>
          )}

          {/* Saved Quests */}
          {savedMissions.length > 0 && (
            <VStack space="lg" className="mb-8">
              <HStack className="justify-between items-center">
                <Heading
                  size="lg"
                  className="text-typography-900 dark:text-typography-950"
                >
                  Saved Quests
                </Heading>
                <Button variant="link" size="sm" onPress={() => router.push('/quests')}>
                  <Text size="sm" className="text-primary-500">
                    View All
                  </Text>
                </Button>
              </HStack>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack space="lg">
                  {savedMissions.slice(0, 5).map((mission) => (
                    <Card
                      key={mission.id}
                      className="w-72 overflow-hidden border border-gray-200 dark:border-gray-800"
                    >
                      <VStack space="md">
                        {(mission as any).thumbnailUrl && (
                          <Box className="relative">
                            <Image
                              source={{ uri: (mission as any).thumbnailUrl }}
                              className="w-full h-32"
                              style={{ resizeMode: "cover" }}
                            />
                            <Badge
                              variant="solid"
                              className="absolute top-2 right-2 bg-purple-500"
                            >
                              <HStack space="xs" className="items-center">
                                <Icon as={Bookmark} size="xs" className="text-white" />
                                <Text size="xs" className="text-white">
                                  Saved
                                </Text>
                              </HStack>
                            </Badge>
                          </Box>
                        )}
                        <VStack space="md" className="p-4">
                          <HStack space="xs" className="items-center">
                            <Badge className="bg-green-100 dark:bg-green-900/30">
                              <HStack space="xs" className="items-center">
                                <Icon
                                  as={Award}
                                  size="xs"
                                  className="text-green-600"
                                />
                                <Text size="xs" className="text-green-600">
                                  +{mission.points_awarded} pts
                                </Text>
                              </HStack>
                            </Badge>
                            <Badge className="bg-orange-100 dark:bg-orange-900/30">
                              <HStack space="xs" className="items-center">
                                <Icon
                                  as={Zap}
                                  size="xs"
                                  className="text-orange-600"
                                />
                                <Text size="xs" className="text-orange-600">
                                  +{mission.energy_awarded} ⚡
                                </Text>
                              </HStack>
                            </Badge>
                          </HStack>
                          <VStack space="xs">
                            <Text
                              className="font-semibold text-typography-900 dark:text-typography-950"
                              numberOfLines={2}
                            >
                              {mission.title}
                            </Text>
                            <Text
                              size="sm"
                              className="text-typography-600 dark:text-typography-750"
                              numberOfLines={3}
                            >
                              {mission.description}
                            </Text>
                          </VStack>
                          <HStack space="xs" className="items-center">
                            <Icon
                              as={Building}
                              size="sm"
                              className="text-gray-500"
                            />
                            <Text
                              size="sm"
                              className="text-typography-600 dark:text-typography-750"
                            >
                              {mission.organization_name}
                            </Text>
                          </HStack>
                          <HStack space="md">
                            <Button 
                              variant="outline"
                              size="sm" 
                              className="flex-1"
                              onPress={() => handleViewMission(mission.id)}
                            >
                              <HStack space="xs" className="items-center">
                                <Icon as={Eye} size="sm" className="text-gray-500" />
                                <Text size="sm">View</Text>
                              </HStack>
                            </Button>
                            <Button 
                              size="sm" 
                              className="flex-1"
                              onPress={() => handleStartMission(mission.id)}
                            >
                              <HStack space="xs" className="items-center">
                                <Icon as={Target} size="sm" className="text-white" />
                                <Text className="text-white">Start</Text>
                              </HStack>
                            </Button>
                          </HStack>
                        </VStack>
                      </VStack>
                    </Card>
                  ))}
                </HStack>
              </ScrollView>
            </VStack>
          )}

          {/* Available Quests */}
          {availableMissions.length > 0 && (
            <VStack space="lg" className="mb-8">
              <HStack className="justify-between items-center">
                <Heading
                  size="lg"
                  className="text-typography-900 dark:text-typography-950"
                >
                  Discover New Quests
                </Heading>
                <Button variant="link" size="sm" onPress={() => router.push('/quests')}>
                  <Text size="sm" className="text-primary-500">
                    View All
                  </Text>
                </Button>
              </HStack>

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack space="lg">
                  {availableMissions.map((mission) => (
                    <Card
                      key={mission.id}
                      className="w-72 overflow-hidden border border-gray-200 dark:border-gray-800"
                    >
                      <VStack space="md">
                        {(mission as any).thumbnailUrl && (
                          <Box className="relative">
                            <Image
                              source={{ uri: (mission as any).thumbnailUrl }}
                              className="w-full h-32"
                              style={{ resizeMode: "cover" }}
                            />
                            <Badge
                              variant="solid"
                              className="absolute top-2 right-2 bg-primary-500"
                            >
                              <Text size="xs" className="text-white">
                                +{mission.points_awarded} pts
                              </Text>
                            </Badge>
                          </Box>
                        )}
                        <VStack space="md" className="p-4">
                          <HStack space="xs" className="items-center">
                            <Badge className="bg-green-100 dark:bg-green-900/30">
                              <HStack space="xs" className="items-center">
                                <Icon
                                  as={Award}
                                  size="xs"
                                  className="text-green-600"
                                />
                                <Text size="xs" className="text-green-600">
                                  +{mission.points_awarded} pts
                                </Text>
                              </HStack>
                            </Badge>
                            <Badge className="bg-orange-100 dark:bg-orange-900/30">
                              <HStack space="xs" className="items-center">
                                <Icon
                                  as={Zap}
                                  size="xs"
                                  className="text-orange-600"
                                />
                                <Text size="xs" className="text-orange-600">
                                  +{mission.energy_awarded} ⚡
                                </Text>
                              </HStack>
                            </Badge>
                          </HStack>
                          <VStack space="xs">
                            <Text
                              className="font-semibold text-typography-900 dark:text-typography-950"
                              numberOfLines={2}
                            >
                              {mission.title}
                            </Text>
                            <Text
                              size="sm"
                              className="text-typography-600 dark:text-typography-750"
                              numberOfLines={3}
                            >
                              {mission.description}
                            </Text>
                          </VStack>
                          <HStack space="md" className="items-center">
                            <HStack space="xs" className="items-center">
                              <Icon
                                as={Building}
                                size="sm"
                                className="text-gray-500"
                              />
                              <Text
                                size="sm"
                                className="text-typography-600 dark:text-typography-750"
                              >
                                {mission.organization_name}
                              </Text>
                            </HStack>
                            <HStack space="xs" className="items-center">
                              <Icon
                                as={Users}
                                size="sm"
                                className="text-blue-500"
                              />
                              <Text
                                size="sm"
                                className="text-typography-600 dark:text-typography-750"
                              >
                                {mission.participants_count}
                              </Text>
                            </HStack>
                          </HStack>
                          <Button 
                            size="sm" 
                            className="mt-2"
                            onPress={() => handleStartMission(mission.id)}
                          >
                            <HStack space="xs" className="items-center">
                              <Icon as={Target} size="sm" className="text-white" />
                              <Text className="text-white">Start Quest</Text>
                            </HStack>
                          </Button>
                        </VStack>
                      </VStack>
                    </Card>
                  ))}
                </HStack>
              </ScrollView>
            </VStack>
          )}

          {/* Loading State */}
          {loading && (
            <Card className="p-8 items-center">
              <VStack space="md" className="items-center">
                <Text className="text-center text-gray-500">
                  Loading your quests...
                </Text>
              </VStack>
            </Card>
          )}

          {/* No quests message */}
          {!loading && missions.length === 0 && (
            <Card className="p-8 items-center">
              <VStack space="md" className="items-center">
                <Icon as={Target} size="xl" className="text-gray-400" />
                <Text className="text-center text-gray-500">
                  No quests available at the moment.
                </Text>
                <Button 
                  size="sm" 
                  variant="outline"
                  onPress={() => router.push('/quests')}
                >
                  <Text>Explore Quests</Text>
                </Button>
              </VStack>
            </Card>
          )}

          {/* Empty states for each section */}
          {!loading && missions.length > 0 && ongoingMissions.length === 0 && savedMissions.length === 0 && (
            <VStack space="lg" className="mb-8">
              <Heading
                size="lg"
                className="text-typography-900 dark:text-typography-950"
              >
                Get Started
              </Heading>
              <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-gray-200 dark:border-gray-800">
                <VStack space="md" className="items-center">
                  <Icon as={Target} size="xl" className="text-primary-500" />
                  <Text className="text-center text-typography-900 dark:text-typography-950 font-semibold">
                    Start your climate action journey!
                  </Text>
                  <Text className="text-center text-typography-600 dark:text-typography-750">
                    Browse available quests and start making a positive impact on our planet.
                  </Text>
                  <Button 
                    size="sm" 
                    onPress={() => router.push('/quests')}
                  >
                    <Text className="text-white">Explore Quests</Text>
                  </Button>
                </VStack>
              </Card>
            </VStack>
          )}
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePage;
