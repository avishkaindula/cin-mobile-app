import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Image, TextInput } from "react-native";
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
import { useLanguage } from "@/components/i18n/LanguageContext";
import {
  Target,
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
} from "lucide-react-native";

const MissionsPage = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // User stats
  const userStats = {
    completed: 12,
    active: 3,
    totalPoints: 850,
    rank: 45,
  };

  // My ongoing missions
  const myMissions = [
    {
      id: 1,
      title: "Urban Heat Island Mapping",
      description: "Help map temperature variations in your city",
      image:
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop",
      progress: 65,
      deadline: "5 days left",
      points: 150,
      category: "dataCollection",
      difficulty: "intermediate",
      participants: 234,
      status: "ongoing",
    },
    {
      id: 2,
      title: "Community Climate Workshop",
      description: "Organize climate awareness in your neighborhood",
      image:
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=300&h=200&fit=crop",
      progress: 30,
      deadline: "12 days left",
      points: 200,
      category: "awareness",
      difficulty: "beginner",
      participants: 156,
      status: "ongoing",
    },
  ];

  // All available missions
  const allMissions = [
    ...myMissions,
    {
      id: 3,
      title: "Biodiversity Survey",
      description: "Document local flora and fauna changes",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop",
      progress: 0,
      deadline: "30 days left",
      points: 300,
      category: "research",
      difficulty: "advanced",
      participants: 89,
      status: "available",
    },
    {
      id: 4,
      title: "Ocean Cleanup Documentation",
      description: "Report marine pollution and cleanup efforts",
      image:
        "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=200&fit=crop",
      progress: 0,
      deadline: "45 days left",
      points: 250,
      category: "action",
      difficulty: "intermediate",
      participants: 167,
      status: "available",
    },
    {
      id: 5,
      title: "Air Quality Monitoring",
      description: "Track air pollution levels in urban areas",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
      progress: 0,
      deadline: "20 days left",
      points: 180,
      category: "dataCollection",
      difficulty: "beginner",
      participants: 245,
      status: "available",
    },
    {
      id: 6,
      title: "Sustainable Agriculture Training",
      description: "Learn and teach climate-smart farming",
      image:
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop",
      progress: 100,
      deadline: "Completed",
      points: 220,
      category: "awareness",
      difficulty: "intermediate",
      participants: 78,
      status: "completed",
    },
  ];

  // Featured campaigns
  const featuredCampaigns = [
    {
      id: 1,
      title: "Save the Amazon Initiative",
      description: "Global campaign to protect rainforest ecosystems",
      image:
        "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=250&fit=crop",
      points: 500,
      participants: 2340,
      difficulty: "expert",
      deadline: "60 days left",
      category: "action",
    },
    {
      id: 2,
      title: "Climate Education for All",
      description: "Bring climate science to underserved communities",
      image:
        "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=250&fit=crop",
      points: 350,
      participants: 1890,
      difficulty: "intermediate",
      deadline: "90 days left",
      category: "awareness",
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner:
        "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
      intermediate:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
      advanced:
        "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
      expert: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    };
    return colors[difficulty] || colors.beginner;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      dataCollection: Thermometer,
      research: FileText,
      awareness: Users,
      action: Target,
    };
    return icons[category] || Target;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      dataCollection: "text-blue-600 dark:text-blue-400",
      research: "text-purple-600 dark:text-purple-400",
      awareness: "text-green-600 dark:text-green-400",
      action: "text-orange-600 dark:text-orange-400",
    };
    return colors[category] || "text-gray-600 dark:text-gray-400";
  };

  const getStatusBadge = (status: string, progress?: number) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="solid" className="bg-green-500">
            <Text size="xs" className="text-white">
              {t("completed")}
            </Text>
          </Badge>
        );
      case "ongoing":
        return (
          <Badge variant="solid" className="bg-blue-500">
            <Text size="xs" className="text-white">
              {progress}% {t("progress")}
            </Text>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-primary-500">
            <Text size="xs" className="text-primary-600 dark:text-primary-400">
              Available
            </Text>
          </Badge>
        );
    }
  };

  const filteredMissions = allMissions.filter((mission) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "my" && ["ongoing", "completed"].includes(mission.status));
    const matchesSearch =
      mission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || mission.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "all" || mission.difficulty === selectedDifficulty;

    return matchesTab && matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="bg-white dark:bg-background-dark"
    >
      <ScrollView className="flex-1">
        <Box className="p-6">
          {/* Header */}
          <VStack space="lg" className="mb-8">
            <HStack space="lg" className="items-center">
              <Icon as={Target} size="xl" className="text-primary-500" />
              <VStack space="xs" className="flex-1">
                <Heading
                  size="xl"
                  className="text-typography-900 dark:text-typography-950"
                >
                  {t("missions")}
                </Heading>
                <Text
                  size="sm"
                  className="text-typography-600 dark:text-typography-750"
                >
                  Contribute to climate research and action
                </Text>
              </VStack>
            </HStack>

            {/* User Stats Card */}
            <Card className="p-4 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-gray-200 dark:border-gray-800">
              <HStack className="justify-between items-center">
                <VStack space="xs" className="items-center">
                  <Text
                    size="2xl"
                    className="font-bold text-primary-600 dark:text-primary-400"
                  >
                    {userStats.completed}
                  </Text>
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750"
                  >
                    {t("completed")}
                  </Text>
                </VStack>
                <VStack space="xs" className="items-center">
                  <Text
                    size="2xl"
                    className="font-bold text-blue-600 dark:text-blue-400"
                  >
                    {userStats.active}
                  </Text>
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750"
                  >
                    {t("ongoing")}
                  </Text>
                </VStack>
                <VStack space="xs" className="items-center">
                  <Text
                    size="2xl"
                    className="font-bold text-green-600 dark:text-green-400"
                  >
                    {userStats.totalPoints}
                  </Text>
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750"
                  >
                    {t("points")}
                  </Text>
                </VStack>
                <VStack space="xs" className="items-center">
                  <Text
                    size="2xl"
                    className="font-bold text-orange-600 dark:text-orange-400"
                  >
                    #{userStats.rank}
                  </Text>
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750"
                  >
                    Global Rank
                  </Text>
                </VStack>
              </HStack>
            </Card>
          </VStack>

          {/* Featured Campaigns */}
          <VStack space="lg" className="mb-8">
            <Heading
              size="lg"
              className="text-typography-900 dark:text-typography-950"
            >
              Featured {t("campaigns")}
            </Heading>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack space="lg">
                {featuredCampaigns.map((campaign) => (
                  <Card
                    key={campaign.id}
                    className="w-80 h-56 overflow-hidden relative border border-gray-200 dark:border-gray-800"
                  >
                    <Box className="absolute inset-0">
                      <Image
                        source={{ uri: campaign.image }}
                        className="w-full h-full"
                        style={{ resizeMode: "cover" }}
                      />
                      <Box className="absolute inset-0 bg-black/60" />
                    </Box>
                    <Box className="absolute top-4 right-4">
                      <Badge variant="solid" className="bg-white/90">
                        <Text size="xs" className="text-gray-900">
                          {campaign.points} pts
                        </Text>
                      </Badge>
                    </Box>
                    <Box className="absolute bottom-0 left-0 right-0 p-4">
                      <VStack space="md">
                        <HStack space="xs" className="items-center">
                          <Badge
                            variant="solid"
                            className={getDifficultyColor(campaign.difficulty)}
                          >
                            <Text size="xs">{t(campaign.difficulty)}</Text>
                          </Badge>
                          <Badge variant="outline" className="border-white/40">
                            <Text size="xs" className="text-white">
                              {t(campaign.category)}
                            </Text>
                          </Badge>
                        </HStack>
                        <VStack space="xs">
                          <Text
                            className="font-bold text-white text-lg"
                            numberOfLines={2}
                          >
                            {campaign.title}
                          </Text>
                          <Text
                            size="sm"
                            className="text-white/90"
                            numberOfLines={2}
                          >
                            {campaign.description}
                          </Text>
                          <HStack space="md" className="items-center">
                            <HStack space="xs" className="items-center">
                              <Icon
                                as={Users}
                                size="sm"
                                className="text-white/80"
                              />
                              <Text size="xs" className="text-white/80">
                                {campaign.participants}
                              </Text>
                            </HStack>
                            <HStack space="xs" className="items-center">
                              <Icon
                                as={Clock}
                                size="sm"
                                className="text-white/80"
                              />
                              <Text size="xs" className="text-white/80">
                                {campaign.deadline}
                              </Text>
                            </HStack>
                          </HStack>
                        </VStack>
                        <Button
                          size="sm"
                          className="bg-white/20 border-white/40"
                        >
                          <Text className="text-white">
                            {t("joinCampaign")}
                          </Text>
                        </Button>
                      </VStack>
                    </Box>
                  </Card>
                ))}
              </HStack>
            </ScrollView>
          </VStack>

          {/* Tabs and Search */}
          <VStack space="lg" className="mb-6">
            {/* Tab Navigation */}
            <HStack space="md">
              <Button
                variant={activeTab === "all" ? "solid" : "outline"}
                size="sm"
                onPress={() => setActiveTab("all")}
                className="flex-1"
              >
                <Text className={activeTab === "all" ? "text-white" : ""}>
                  {t("allMissions")}
                </Text>
              </Button>
              <Button
                variant={activeTab === "my" ? "solid" : "outline"}
                size="sm"
                onPress={() => setActiveTab("my")}
                className="flex-1"
              >
                <Text className={activeTab === "my" ? "text-white" : ""}>
                  {t("myMissions")}
                </Text>
              </Button>
            </HStack>

            {/* Search and Filters */}
            <VStack space="md">
              {/* Search Bar */}
              <Box className="relative">
                <HStack
                  space="md"
                  className="items-center border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3"
                >
                  <Icon as={Search} size="sm" className="text-gray-500" />
                  <Box className="flex-1">
                    <TextInput
                      placeholder={t("searchMissions")}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      className="text-typography-900 dark:text-typography-950 flex-1"
                      placeholderTextColor="#9CA3AF"
                    />
                  </Box>
                </HStack>
              </Box>

              {/* Filter Buttons */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <HStack space="md">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 dark:border-gray-600"
                  >
                    <HStack space="xs" className="items-center">
                      <Icon as={Filter} size="xs" className="text-gray-500" />
                      <Text size="sm">{t("category")}</Text>
                    </HStack>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 dark:border-gray-600"
                  >
                    <HStack space="xs" className="items-center">
                      <Icon
                        as={TrendingUp}
                        size="xs"
                        className="text-gray-500"
                      />
                      <Text size="sm">Difficulty</Text>
                    </HStack>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 dark:border-gray-600"
                  >
                    <HStack space="xs" className="items-center">
                      <Icon as={SortAsc} size="xs" className="text-gray-500" />
                      <Text size="sm">{t("sortBy")}</Text>
                    </HStack>
                  </Button>
                </HStack>
              </ScrollView>
            </VStack>
          </VStack>

          {/* Missions List */}
          <VStack space="lg">
            {filteredMissions.map((mission) => (
              <Card
                key={mission.id}
                className="overflow-hidden border border-gray-200 dark:border-gray-800"
              >
                <HStack space="md">
                  {/* Mission Image with Additional Info */}
                  <VStack space="xs" className="w-24">
                    <Box className="relative">
                      <Image
                        source={{ uri: mission.image }}
                        className="w-24 h-16"
                        style={{ resizeMode: "cover" }}
                      />
                      <Box className="absolute top-1 right-1">
                        <Badge variant="solid" className="bg-primary-500">
                          <Text size="xs" className="text-white">
                            {mission.points}
                          </Text>
                        </Badge>
                      </Box>
                    </Box>

                    {/* Additional mission info below image */}
                    <VStack space="xs" className="w-full">
                      <Box className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        <VStack space="xs" className="items-center">
                          <HStack space="xs" className="items-center">
                            <Icon
                              as={Award}
                              size="xs"
                              className="text-orange-500"
                            />
                            <Text
                              size="xs"
                              className="text-typography-700 dark:text-typography-300 font-medium"
                            >
                              Rank #{Math.floor(Math.random() * 50) + 1}
                            </Text>
                          </HStack>
                          <Text
                            size="xs"
                            className="text-typography-600 dark:text-typography-400 text-center"
                          >
                            {mission.status === "completed"
                              ? "Completed!"
                              : mission.status === "ongoing"
                              ? "In Progress"
                              : "Join Now"}
                          </Text>
                        </VStack>
                      </Box>
                    </VStack>
                  </VStack>

                  {/* Mission Content */}
                  <VStack space="md" className="flex-1 p-4">
                    <VStack space="xs">
                      <HStack className="justify-between items-start">
                        <Text
                          className="font-semibold text-typography-900 dark:text-typography-950 flex-1"
                          numberOfLines={2}
                        >
                          {mission.title}
                        </Text>
                        {getStatusBadge(mission.status, mission.progress)}
                      </HStack>
                      <Text
                        size="sm"
                        className="text-typography-600 dark:text-typography-750"
                        numberOfLines={2}
                      >
                        {mission.description}
                      </Text>
                    </VStack>

                    <HStack space="xs" className="items-center">
                      <Badge
                        variant="outline"
                        className={getDifficultyColor(mission.difficulty)}
                      >
                        <Text size="xs">{t(mission.difficulty)}</Text>
                      </Badge>
                      <Badge variant="outline">
                        <HStack space="xs" className="items-center">
                          <Icon
                            as={getCategoryIcon(mission.category)}
                            size="xs"
                            className={getCategoryColor(mission.category)}
                          />
                          <Text
                            size="xs"
                            className="text-typography-600 dark:text-typography-750"
                          >
                            {t(mission.category)}
                          </Text>
                        </HStack>
                      </Badge>
                    </HStack>

                    {mission.status === "ongoing" && (
                      <VStack space="xs">
                        <HStack className="justify-between">
                          <Text
                            size="sm"
                            className="text-typography-600 dark:text-typography-750"
                          >
                            {t("progress")}
                          </Text>
                          <Text
                            size="sm"
                            className="text-typography-600 dark:text-typography-750"
                          >
                            {mission.progress}%
                          </Text>
                        </HStack>
                        <Progress value={mission.progress} className="h-2" />
                      </VStack>
                    )}

                    <VStack space="xs">
                      <HStack className="justify-between items-center">
                        <HStack space="md">
                          <HStack space="xs" className="items-center">
                            <Icon
                              as={Users}
                              size="sm"
                              className="text-gray-500"
                            />
                            <Text
                              size="sm"
                              className="text-typography-600 dark:text-typography-750"
                            >
                              {mission.participants}
                            </Text>
                          </HStack>
                          <HStack space="xs" className="items-center">
                            <Icon
                              as={Clock}
                              size="sm"
                              className="text-gray-500"
                            />
                            <Text
                              size="sm"
                              className="text-typography-600 dark:text-typography-750"
                            >
                              {mission.deadline}
                            </Text>
                          </HStack>
                        </HStack>
                      </HStack>

                      {/* Action Button below the info */}
                      <Button
                        size="sm"
                        variant={
                          mission.status === "completed" ? "outline" : "solid"
                        }
                        disabled={mission.status === "completed"}
                        className="self-end"
                      >
                        <HStack space="xs" className="items-center">
                          {mission.status === "completed" ? (
                            <Icon
                              as={CheckCircle}
                              size="sm"
                              className="text-green-500"
                            />
                          ) : mission.status === "ongoing" ? (
                            <Icon as={Play} size="sm" className="text-white" />
                          ) : (
                            <Icon
                              as={Target}
                              size="sm"
                              className="text-white"
                            />
                          )}
                          <Text
                            className={
                              mission.status === "completed" ? "" : "text-white"
                            }
                          >
                            {mission.status === "completed"
                              ? "Completed"
                              : mission.status === "ongoing"
                              ? "Continue"
                              : "Start"}
                          </Text>
                        </HStack>
                      </Button>
                    </VStack>
                  </VStack>
                </HStack>
              </Card>
            ))}
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MissionsPage;
