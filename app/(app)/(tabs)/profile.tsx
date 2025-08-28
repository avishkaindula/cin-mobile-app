import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, RefreshControl, Alert } from "react-native";
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
import { Image } from "@/components/ui/image";
import { useTheme } from "@/context/theme";
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
  Trash2,
} from "lucide-react-native";
import {
  getPublishedMissions,
  getUserMissionStats,
  MissionWithStats,
} from "@/services/missions";
import {
  getCurrentUserProfile,
  getCurrentUserProfileWithAvatar,
  Agent,
} from "@/services/profile/profile.service";

const ProfilePage = () => {
  const { colorScheme, toggleColorScheme } = useTheme();
  const { signOut, user } = useSession();
  const [missions, setMissions] = useState<MissionWithStats[]>([]);
  const [profile, setProfile] = useState<Agent | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
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
      const response = await getCurrentUserProfileWithAvatar();
      if (response.success && response.data) {
        setProfile(response.data);
        setAvatarUrl(response.data.avatarSignedUrl || "");
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

  const deleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone and you will lose all your progress.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (!user?.id) return;

              // Call the delete user API route
              const response = await fetch('/api/auth/delete-user', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user.id }),
              });

              const result = await response.json();

              if (!response.ok) {
                Alert.alert("Error", result.error || "Failed to delete account. Please try again.");
                return;
              }

              // Sign out the user after successful deletion
              await signOut();
              
              Alert.alert("Account Deleted", "Your account has been successfully deleted.");
            } catch (error) {
              console.error("Error deleting account:", error);
              Alert.alert("Error", "Failed to delete account. Please try again.");
            }
          },
        },
      ]
    );
  };

  // Calculate real user statistics from missions
  const userStats = {
    completedMissions: missions.filter(
      (m) => m.submission_status === "reviewed"
    ).length,
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

  const earnedAchievements = achievements.filter((a) => a.earned);

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
    {
      label: "Missions Completed",
      value: userStats.completedMissions.toString(),
      color: "text-green-600",
    },
    {
      label: "Missions In Progress",
      value: userStats.ongoingMissions.toString(),
      color: "text-blue-600",
    },
    {
      label: "Saved Missions",
      value: userStats.savedMissions.toString(),
      color: "text-purple-600",
    },
    {
      label: "Points Earned",
      value: userStats.totalPoints.toString(),
      color: "text-orange-600",
    },
    {
      label: "Energy Collected",
      value: userStats.totalEnergy.toString(),
      color: "text-yellow-600",
    },
    {
      label: "Data Points",
      value: userStats.dataPointsContributed.toString(),
      color: "text-blue-500",
    },
  ];

  // Get display data from profile or auth user
  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Climate Advocate";

  const displayEmail = profile?.email || user?.email || "No email";
  const displayLocation = profile?.address || user?.user_metadata?.location;

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="bg-[#FCFCFC]"
    >
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Box className="p-6">
          {/* Header with Logo */}
          <HStack className="items-center justify-between mb-8">
            <VStack space="lg">
              <Heading retro size="2xl" className="text-[#333333] tracking-wide font-bold">
                Profile
              </Heading>
              <Text retro className="text-[#333333] text-base">
                Your climate action journey
              </Text>
            </VStack>
            <Image 
              source={require('@/assets/icon.png')}
              style={{ width: 48, height: 48 }}
              resizeMode="contain"
            />
          </HStack>

          {/* Profile Info Card */}
          <Card className="p-6 mb-6 bg-[#FCFCFC] border-2 border-[#333333] shadow-[4px_4px_0_#333333]">
            <VStack space="lg">
              <HStack space="lg" className="items-center">
                {avatarUrl ||
                user?.user_metadata?.avatar_url ||
                user?.user_metadata?.picture ? (
                  <Avatar size="xl" className="border-2 border-[#333333]">
                    <AvatarImage
                      source={{
                        uri:
                          avatarUrl ||
                          user?.user_metadata?.avatar_url ||
                          user?.user_metadata?.picture,
                      }}
                    />
                  </Avatar>
                ) : (
                  <Box className="w-16 h-16 bg-[#A2D8FF] border-2 border-[#333333] rounded-full items-center justify-center">
                    <Icon
                      as={User}
                      size="xl"
                      className="text-[#333333]"
                    />
                  </Box>
                )}
                <VStack space="md" className="flex-1">
                  <Heading retro
                    size="lg"
                    className="text-[#333333] font-bold tracking-wide"
                  >
                    {displayName}
                  </Heading>
                  <Text retro className="text-[#333333]">
                    {displayEmail}
                  </Text>
                  {displayLocation && (
                    <Text retro
                      size="sm"
                      className="text-[#333333] opacity-80"
                    >
                      {displayLocation}
                    </Text>
                  )}
                  <HStack space="xs" className="items-center mt-2">
                    <Badge className="bg-[#98FB98] border border-[#333333] shadow-[2px_2px_0_#333333]">
                      <Text retro size="xs" className="text-[#333333] font-bold">Level {currentLevel.level}</Text>
                    </Badge>
                    <Badge className="bg-[#FFD700] border border-[#333333] shadow-[2px_2px_0_#333333]">
                      <Text retro size="xs" className="text-[#333333] font-bold">{userStats.totalPoints} points</Text>
                    </Badge>
                  </HStack>
                  <Text retro
                    size="sm"
                    className="text-[#333333] font-bold tracking-wide"
                  >
                    {currentLevel.name}
                  </Text>
                </VStack>
              </HStack>
              <HStack space="md" className="justify-center">
                <Button
                  className="bg-[#A2D8FF] border-2 border-[#333333] shadow-[4px_4px_0_#333333] flex-1"
                  onPress={() => router.push("/profile/edit")}
                >
                  <HStack space="sm" className="items-center">
                    <Icon
                      as={Edit}
                      size="sm"
                      className="text-[#333333]"
                    />
                    <Text className="text-[#333333] font-bold tracking-wide">Edit Profile</Text>
                  </HStack>
                </Button>
                <Button
                  className="bg-[#DDA0DD] border-2 border-[#333333] shadow-[4px_4px_0_#333333] flex-1"
                  onPress={signOut}
                >
                  <HStack space="sm" className="items-center">
                    <Icon as={LogOut} size="sm" className="text-[#333333]" />
                    <Text className="text-[#333333] font-bold tracking-wide">Sign Out</Text>
                  </HStack>
                </Button>
              </HStack>
              
              {/* Delete Account Button */}
              <Button
                className="bg-[#FFB3B3] border-2 border-[#333333] shadow-[4px_4px_0_#333333] mt-4"
                onPress={deleteAccount}
              >
                <HStack space="sm" className="items-center justify-center">
                  <Icon as={Trash2} size="sm" className="text-[#333333]" />
                  <Text className="text-[#333333] font-bold tracking-wide">Delete Account</Text>
                </HStack>
              </Button>
            </VStack>
          </Card>

          {/* Stats Card */}
          <Card className="p-6 mb-6 bg-[#FCFCFC] border-2 border-[#333333] shadow-[4px_4px_0_#333333]">
            <VStack space="lg">
              <Heading retro
                size="lg"
                className="text-[#333333] font-bold tracking-wide"
              >
                Contributions
              </Heading>
              <VStack space="md">
                {stats.map((stat, index) => (
                  <HStack key={index} className="justify-between items-center">
                    <Text retro className="text-[#333333]">
                      {stat.label}
                    </Text>
                    <Text retro className="text-[#333333] font-bold">
                      {stat.value}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </VStack>
          </Card>

          {/* Achievements Card */}
          <Card className="p-6 mb-6 bg-[#FCFCFC] border-2 border-[#333333] shadow-[4px_4px_0_#333333]">
            <VStack space="lg">
              <Heading retro
                size="lg"
                className="text-[#333333] font-bold tracking-wide"
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
                      className={`p-2 rounded-lg border-2 border-[#333333] ${
                        achievement.earned
                          ? "bg-[#98FB98]"
                          : "bg-[#E0E0E0]"
                      }`}
                    >
                      <Icon
                        as={achievement.icon}
                        size="md"
                        className="text-[#333333]"
                      />
                    </Box>
                    <VStack space="xs" className="flex-1">
                      <Text retro
                        className={`font-bold tracking-wide ${
                          achievement.earned
                            ? "text-[#333333]"
                            : "text-[#333333]"
                        }`}
                      >
                        {achievement.title}
                      </Text>
                      <Text retro
                        size="sm"
                        className={`${
                          achievement.earned
                            ? "text-[#333333]"
                            : "text-[#333333] opacity-75"
                        }`}
                      >
                        {achievement.description}
                      </Text>
                    </VStack>
                    {achievement.earned && (
                      <Badge className="bg-[#FFD700] border border-[#333333] shadow-[2px_2px_0_#333333]">
                        <Text retro size="xs" className="text-[#333333] font-bold">Earned</Text>
                      </Badge>
                    )}
                  </HStack>
                ))}
              </VStack>
            </VStack>
          </Card>

          {/* Recent Activity Card */}
          <Card className="p-6 mb-6 bg-[#FCFCFC] border-2 border-[#333333] shadow-[4px_4px_0_#333333]">
            <VStack space="lg">
              <Heading retro
                size="lg"
                className="text-[#333333] font-bold tracking-wide"
              >
                Recent Activity
              </Heading>
              {loading ? (
                <Text retro className="text-[#333333] opacity-80">
                  Loading activity...
                </Text>
              ) : recentActivity.length > 0 ? (
                <VStack space="md">
                  {recentActivity.map((activity, index) => (
                    <HStack key={index} space="md" className="items-center">
                      <Box
                        className="w-3 h-3 bg-[#98FB98] border border-[#333333] rounded-full"
                      />
                      <VStack space="xs" className="flex-1">
                        <Text retro className="text-[#333333] font-bold">
                          {activity.title}
                        </Text>
                        <Text retro
                          size="sm"
                          className="text-[#333333] opacity-80"
                        >
                          {activity.date}
                        </Text>
                      </VStack>
                    </HStack>
                  ))}
                </VStack>
              ) : (
                <VStack space="md" className="items-center">
                  <Box className="p-4 bg-[#E0E0E0] border-2 border-[#333333] rounded-lg shadow-[2px_2px_0_#333333]">
                    <Icon as={Calendar} size="lg" className="text-[#333333]" />
                  </Box>
                  <Text retro className="text-center text-[#333333]">
                    Complete missions to see your activity here
                  </Text>
                </VStack>
              )}
            </VStack>
          </Card>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfilePage;
