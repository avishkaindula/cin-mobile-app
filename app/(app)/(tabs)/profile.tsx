import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, RefreshControl } from "react-native";
import { router } from "expo-router";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { useColorScheme } from "nativewind";
import { useSession } from "@/context/auth";
import {
  User,
  Award,
  Target,
  BarChart3,
  Settings,
  Moon,
  Sun,
  LogOut,
  Calendar,
  CheckCircle,
  Edit,
} from "lucide-react-native";
import {
  getPublishedMissions,
  MissionWithStats,
} from "@/services/missions";
import {
  getCurrentUserProfile,
  Agent,
} from "@/services/profile/profile.service";

const ProfilePage = () => {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const { signOut, user } = useSession();
  const [missions, setMissions] = useState<MissionWithStats[]>([]);
  const [profile, setProfile] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([loadMissions(), loadProfile()]);
  };

  const loadMissions = async () => {
    try {
      const { data, error } = await getPublishedMissions();

      if (error) {
        console.error("Error loading missions:", error);
      } else if (data) {
        setMissions(data);
      }
    } catch (error) {
      console.error("Error loading missions:", error);
    }
  };

  const loadProfile = async () => {
    try {
      const response = await getCurrentUserProfile();
      if (response.success && response.data) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Calculate real user statistics from missions
  const userStats = {
    completedMissions: missions.filter((m) => m.submission_status === "reviewed").length,
    ongoingMissions: missions.filter(
      (m) =>
        m.submission_status === "in_progress" ||
        m.submission_status === "started"
    ).length,
    savedMissions: missions.filter((m) => m.is_bookmarked).length,
    totalPoints: missions
      .filter((m) => m.submission_status === "reviewed")
      .reduce((sum, m) => sum + (m.points_awarded || 0), 0),
    totalEnergy: missions
      .filter((m) => m.submission_status === "reviewed")
      .reduce((sum, m) => sum + (m.energy_awarded || 0), 0),
    dataPointsContributed: missions
      .filter((m) => m.submission_status === "reviewed")
      .reduce((sum, m) => sum + (m.participants_count || 1), 0),
  };

  // Calculate achievements based on real data
  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first mission",
      icon: Target,
      earned: userStats.completedMissions >= 1,
    },
    {
      id: 2,
      title: "Climate Activist",
      description: "Complete 5 missions",
      icon: Award,
      earned: userStats.completedMissions >= 5,
    },
    {
      id: 3,
      title: "Data Pioneer",
      description: "Contribute 100 data points",
      icon: BarChart3,
      earned: userStats.dataPointsContributed >= 100,
    },
    {
      id: 4,
      title: "Mission Master",
      description: "Complete 10 missions",
      icon: CheckCircle,
      earned: userStats.completedMissions >= 10,
    },
    {
      id: 5,
      title: "Point Collector",
      description: "Earn 1000 points",
      icon: Award,
      earned: userStats.totalPoints >= 1000,
    },
    {
      id: 6,
      title: "Energy Saver",
      description: "Collect 500 energy",
      icon: Award,
      earned: userStats.totalEnergy >= 500,
    },
  ];

  const earnedAchievements = achievements.filter(a => a.earned);

  // Calculate user level based on points
  const getUserLevel = (points: number) => {
    if (points >= 2000) return { level: 5, name: "Climate Champion" };
    if (points >= 1500) return { level: 4, name: "Earth Guardian" };
    if (points >= 1000) return { level: 3, name: "Green Warrior" };
    if (points >= 500) return { level: 2, name: "Eco Explorer" };
    if (points >= 100) return { level: 1, name: "Climate Rookie" };
    return { level: 0, name: "Newcomer" };
  };

  const currentLevel = getUserLevel(userStats.totalPoints);

  // Recent activity from missions
  const recentActivity = missions
    .filter((m) => m.submission_status === "reviewed")
    .slice(0, 3)
    .map((mission) => ({
      id: mission.id,
      title: `Completed ${mission.title}`,
      date: "Recently",
      icon: CheckCircle,
      color: "bg-green-500",
    }));

  const stats = [
    { label: "Missions Completed", value: userStats.completedMissions.toString(), color: "text-green-600" },
    { label: "Missions In Progress", value: userStats.ongoingMissions.toString(), color: "text-blue-600" },
    { label: "Saved Missions", value: userStats.savedMissions.toString(), color: "text-purple-600" },
    { label: "Points Earned", value: userStats.totalPoints.toString(), color: "text-orange-600" },
    { label: "Energy Collected", value: userStats.totalEnergy.toString(), color: "text-yellow-600" },
    { label: "Data Points", value: userStats.dataPointsContributed.toString(), color: "text-blue-500" },
  ];

  // Get display data from profile or auth user
  const displayName = profile?.full_name || 
                     user?.user_metadata?.full_name || 
                     user?.user_metadata?.name || 
                     user?.email?.split('@')[0] || 
                     "Climate Advocate";

  const displayEmail = profile?.email || user?.email || "No email";
  const displayLocation = profile?.address || user?.user_metadata?.location;

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
          {/* Header */}
          <VStack space="lg" className="mb-8">
            <HStack space="md" className="items-center">
              <Icon as={User} size="xl" className="text-primary-500" />
              <VStack space="xs">
                <Heading
                  size="xl"
                  className="text-typography-900 dark:text-typography-950"
                >
                  Profile
                </Heading>
                <Text
                  size="sm"
                  className="text-typography-600 dark:text-typography-750"
                >
                  Your climate action journey
                </Text>
              </VStack>
            </HStack>
          </VStack>

          {/* Profile Info */}
          <Card className="p-6 mb-6">
            <VStack space="lg">
              <HStack space="lg" className="items-center">
                {profile?.avatar_url || user?.user_metadata?.avatar_url || user?.user_metadata?.picture ? (
                  <Avatar size="xl">
                    <AvatarImage
                      source={{
                        uri: profile?.avatar_url || 
                             user?.user_metadata?.avatar_url || 
                             user?.user_metadata?.picture,
                      }}
                    />
                  </Avatar>
                ) : (
                  <Box className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full items-center justify-center">
                    <Icon as={User} size="xl" className="text-green-600 dark:text-green-400" />
                  </Box>
                )}
                <VStack space="xs" className="flex-1">
                  <Heading
                    size="lg"
                    className="text-typography-900 dark:text-typography-950"
                  >
                    {displayName}
                  </Heading>
                  <Text className="text-typography-600 dark:text-typography-750">
                    {displayEmail}
                  </Text>
                  {displayLocation && (
                    <Text
                      size="sm"
                      className="text-typography-500 dark:text-typography-300"
                    >
                      {displayLocation}
                    </Text>
                  )}
                  <HStack space="xs" className="items-center mt-2">
                    <Badge variant="solid" action="success">
                      <Text size="xs">Level {currentLevel.level}</Text>
                    </Badge>
                    <Badge variant="outline">
                      <Text size="xs">{userStats.totalPoints} points</Text>
                    </Badge>
                  </HStack>
                  <Text
                    size="sm"
                    className="text-primary-600 dark:text-primary-400 font-medium"
                  >
                    {currentLevel.name}
                  </Text>
                </VStack>
              </HStack>
              <Button 
                variant="outline"
                onPress={() => router.push("/profile/edit")}
              >
                <HStack space="xs" className="items-center">
                  <Icon as={Edit} size="sm" className="text-typography-600 dark:text-typography-400" />
                  <Text>Edit Profile</Text>
                </HStack>
              </Button>
              <Button
                variant="solid"
                action="negative"
                onPress={signOut}
                className="w-full"
              >
                <HStack space="xs" className="items-center">
                  <Icon as={LogOut} size="sm" className="text-white" />
                  <Text className="text-white">Sign Out</Text>
                </HStack>
              </Button>
            </VStack>
          </Card>

          {/* Stats */}
          <Card className="p-6 mb-6">
            <VStack space="lg">
              <Heading
                size="md"
                className="text-typography-900 dark:text-typography-950"
              >
                Contributions
              </Heading>
              <VStack space="md">
                {stats.map((stat, index) => (
                  <HStack key={index} className="justify-between items-center">
                    <Text className="text-typography-600 dark:text-typography-750">
                      {stat.label}
                    </Text>
                    <Text
                      className={`font-bold ${
                        stat.color
                      } dark:${stat.color.replace("text-", "text-")}`}
                    >
                      {stat.value}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </VStack>
          </Card>

          {/* Achievements */}
          <Card className="p-6 mb-6">
            <VStack space="lg">
              <Heading
                size="md"
                className="text-typography-900 dark:text-typography-950"
              >
                Achievements
              </Heading>
              <VStack space="md">
                {achievements.map((achievement) => (
                  <HStack
                    key={achievement.id}
                    space="md"
                    className="items-center"
                  >
                    <Box
                      className={`p-2 rounded-full ${
                        achievement.earned
                          ? "bg-green-100 dark:bg-green-900/30"
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      <Icon
                        as={achievement.icon}
                        size="md"
                        className={
                          achievement.earned
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-400"
                        }
                      />
                    </Box>
                    <VStack space="xs" className="flex-1">
                      <Text
                        className={`font-semibold ${
                          achievement.earned
                            ? "text-typography-900 dark:text-typography-950"
                            : "text-typography-500 dark:text-typography-500"
                        }`}
                      >
                        {achievement.title}
                      </Text>
                      <Text
                        size="sm"
                        className="text-typography-600 dark:text-typography-750"
                      >
                        {achievement.description}
                      </Text>
                    </VStack>
                    {achievement.earned && (
                      <Badge variant="solid" action="success">
                        <Text size="xs">Earned</Text>
                      </Badge>
                    )}
                  </HStack>
                ))}
              </VStack>
            </VStack>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6 mb-6">
            <VStack space="lg">
              <Heading
                size="md"
                className="text-typography-900 dark:text-typography-950"
              >
                Recent Activity
              </Heading>
              {loading ? (
                <Text className="text-typography-600 dark:text-typography-400">
                  Loading activity...
                </Text>
              ) : recentActivity.length > 0 ? (
                <VStack space="md">
                  {recentActivity.map((activity, index) => (
                    <HStack key={index} space="md" className="items-center">
                      <Box className={`w-2 h-2 ${activity.color} rounded-full`} />
                      <VStack space="xs" className="flex-1">
                        <Text className="text-typography-900 dark:text-typography-950">
                          {activity.title}
                        </Text>
                        <Text
                          size="sm"
                          className="text-typography-600 dark:text-typography-750"
                        >
                          {activity.date}
                        </Text>
                      </VStack>
                    </HStack>
                  ))}
                </VStack>
              ) : (
                <VStack space="md" className="items-center">
                  <Icon as={Calendar} size="lg" className="text-gray-400" />
                  <Text className="text-center text-gray-500">
                    Complete missions to see your activity here
                  </Text>
                </VStack>
              )}
            </VStack>
          </Card>

          {/* Settings */}
          <Card className="p-6">
            <VStack space="lg">
              <Heading
                size="md"
                className="text-typography-900 dark:text-typography-950"
              >
                Settings
              </Heading>
              <VStack space="md">
                <VStack space="md">
                  <HStack space="md" className="items-center">
                    <Icon
                      as={Settings}
                      size="md"
                      className="text-typography-500"
                    />
                    <Text className="text-typography-900 dark:text-typography-950">
                      Theme
                    </Text>
                  </HStack>
                  <Button
                    variant="outline"
                    onPress={toggleColorScheme}
                    className="w-full"
                  >
                    <HStack space="xs" className="items-center">
                      <Icon
                        as={colorScheme === "dark" ? Sun : Moon}
                        size="sm"
                        className="text-typography-600 dark:text-typography-400"
                      />
                      <Text
                        size="sm"
                        className="text-typography-600 dark:text-typography-750"
                      >
                        {colorScheme === "dark" ? "Light Mode" : "Dark Mode"}
                      </Text>
                    </HStack>
                  </Button>
                </VStack>
              </VStack>
            </VStack>
          </Card>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfilePage;
