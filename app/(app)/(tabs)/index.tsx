import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Image } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/i18n/LanguageContext";
import { Globe, Thermometer, Users, Trophy, Leaf } from "lucide-react-native";

const HomePage = () => {
  const { t } = useLanguage();

  // User league and points data (this would come from a store/context in a real app)
  const userStats = {
    currentPoints: 850,
    currentLeague: "silver",
    nextLeagueThreshold: 1000,
    leagueColor: "#C0C0C0", // Silver color
    leagueIcon: Trophy,
  };

  const pointsToNext = userStats.nextLeagueThreshold - userStats.currentPoints;

  // Featured missions data
  const featuredMissions = [
    {
      id: 1,
      title: "Urban Heat Island Mapping",
      description:
        "Help map temperature variations in your city to identify heat hotspots",
      image:
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop",
      points: 150,
      type: "task",
      difficulty: "intermediate",
      icon: Thermometer,
    },
    {
      id: 2,
      title: "Community Climate Workshop",
      description: "Join our virtual workshop on climate adaptation strategies",
      image:
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=300&h=200&fit=crop",
      points: 100,
      type: "event",
      difficulty: "beginner",
      icon: Users,
    },
    {
      id: 3,
      title: "Biodiversity Survey",
      description:
        "Document local flora and fauna to track climate impact on ecosystems",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop",
      points: 200,
      type: "task",
      difficulty: "advanced",
      icon: Leaf,
    },
  ];

  // Campaigns data
  const campaigns = [
    {
      id: 1,
      title: "Save the Amazon",
      description:
        "Join the fight against deforestation in the Amazon rainforest",
      image:
        "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=250&fit=crop",
      points: 300,
      participants: 1250,
      difficulty: "intermediate",
    },
    {
      id: 2,
      title: "Ocean Cleanup Initiative",
      description: "Help monitor and clean up ocean plastic pollution",
      image:
        "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=250&fit=crop",
      points: 250,
      participants: 890,
      difficulty: "beginner",
    },
  ];

  // Rewards data
  const rewards = [
    {
      id: 1,
      title: "EcoShop Discount",
      description: "Sustainable products for your home",
      logo: "🌱",
      discount: "20%",
      points: 500,
    },
    {
      id: 2,
      title: "Green Energy Credit",
      description: "Renewable energy for your home",
      logo: "⚡",
      discount: "15%",
      points: 750,
    },
    {
      id: 3,
      title: "Carbon Offset",
      description: "Offset your carbon footprint",
      logo: "🌍",
      discount: "25%",
      points: 400,
    },
  ];

  const getLeagueInfo = (league: string) => {
    const leagues: Record<string, { name: string; color: string; icon: any }> =
      {
        bronze: { name: t("bronzeLeague"), color: "#CD7F32", icon: Trophy },
        silver: { name: t("silverLeague"), color: "#C0C0C0", icon: Trophy },
        gold: { name: t("goldLeague"), color: "#FFD700", icon: Trophy },
        platinum: { name: t("platinumLeague"), color: "#E5E4E2", icon: Trophy },
        diamond: { name: t("diamondLeague"), color: "#B9F2FF", icon: Trophy },
      };
    return leagues[league] || leagues.bronze;
  };

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

  const leagueInfo = getLeagueInfo(userStats.currentLeague);

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="bg-white dark:bg-background-dark"
    >
      <ScrollView className="flex-1">
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
                  {t("climateIntel")}
                </Heading>
                <Text
                  size="sm"
                  className="text-typography-600 dark:text-typography-750"
                >
                  {t("empoweringClimateAction")}
                </Text>
              </VStack>
            </HStack>

            {/* League Status Card */}
            <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-gray-200 dark:border-gray-800">
              <HStack space="md" className="items-center">
                <Box
                  className="p-3 rounded-full"
                  style={{ backgroundColor: `${leagueInfo.color}20` }}
                >
                  <Icon
                    as={leagueInfo.icon}
                    size="md"
                    style={{ color: leagueInfo.color }}
                  />
                </Box>
                <VStack space="xs" className="flex-1">
                  <HStack space="xs" className="items-center">
                    <Text
                      size="lg"
                      className="font-bold text-typography-900 dark:text-typography-950"
                    >
                      {leagueInfo.name}
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
                    {pointsToNext} {t("pointsToNext")}
                  </Text>
                  <Box className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                    <Box
                      className="h-full rounded-full"
                      style={{
                        width: `${
                          (userStats.currentPoints /
                            userStats.nextLeagueThreshold) *
                          100
                        }%`,
                        backgroundColor: leagueInfo.color,
                      }}
                    />
                  </Box>
                </VStack>
              </HStack>
            </Card>
          </VStack>

          {/* Featured Missions */}
          <VStack space="lg" className="mb-8">
            <HStack className="justify-between items-center">
              <Heading
                size="lg"
                className="text-typography-900 dark:text-typography-950"
              >
                {t("featuredMissions")}
              </Heading>
              <Button variant="link" size="sm">
                <Text size="sm" className="text-primary-500">
                  {t("viewAllMissions")}
                </Text>
              </Button>
            </HStack>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack space="lg">
                {featuredMissions.map((mission) => (
                  <Card
                    key={mission.id}
                    className="w-72 overflow-hidden border border-gray-200 dark:border-gray-800"
                  >
                    <Box className="relative">
                      <Image
                        source={{ uri: mission.image }}
                        className="w-full h-32"
                        style={{ resizeMode: "cover" }}
                      />
                      <Badge
                        variant="solid"
                        className="absolute top-2 right-2 bg-primary-500"
                      >
                        <Text size="xs" className="text-white">
                          {mission.points} pts
                        </Text>
                      </Badge>
                    </Box>
                    <VStack space="md" className="p-4">
                      <HStack space="xs" className="items-center">
                        <Badge
                          variant="outline"
                          className={
                            mission.type === "event"
                              ? "border-blue-500"
                              : "border-green-500"
                          }
                        >
                          <Text
                            size="xs"
                            className={
                              mission.type === "event"
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-green-600 dark:text-green-400"
                            }
                          >
                            {t(mission.type)}
                          </Text>
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getDifficultyColor(mission.difficulty)}
                        >
                          <Text size="xs">{t(mission.difficulty)}</Text>
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
                      <Button size="sm" className="mt-2">
                        <Text className="text-white">{t("joinMission")}</Text>
                      </Button>
                    </VStack>
                  </Card>
                ))}
              </HStack>
            </ScrollView>
          </VStack>

          {/* Campaigns */}
          <VStack space="lg" className="mb-8">
            <VStack space="xs">
              <HStack className="justify-between items-center">
                <Heading
                  size="lg"
                  className="text-typography-900 dark:text-typography-950"
                >
                  {t("campaigns")}
                </Heading>
                <Button variant="link" size="sm">
                  <Text size="sm" className="text-primary-500">
                    {t("viewAllCampaigns")}
                  </Text>
                </Button>
              </HStack>
            </VStack>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack space="lg">
                {campaigns.map((campaign) => (
                  <Card
                    key={campaign.id}
                    className="w-80 h-48 overflow-hidden relative border border-gray-200 dark:border-gray-800"
                  >
                    <Box className="absolute inset-0">
                      <Image
                        source={{ uri: campaign.image }}
                        className="w-full h-full"
                        style={{ resizeMode: "cover" }}
                      />
                      <Box className="absolute inset-0 bg-black/60" />
                    </Box>
                    <Box className="absolute bottom-0 left-0 right-0 p-4">
                      <VStack space="md">
                        <HStack space="xs" className="items-center">
                          <Badge variant="solid" className="bg-white/90">
                            <Text size="xs" className="text-gray-900">
                              {campaign.points} pts
                            </Text>
                          </Badge>
                          <Badge
                            variant="solid"
                            className={getDifficultyColor(campaign.difficulty)}
                          >
                            <Text size="xs">{t(campaign.difficulty)}</Text>
                          </Badge>
                        </HStack>
                        <VStack space="xs">
                          <Text
                            className="font-bold text-white"
                            numberOfLines={1}
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
                          <Text size="xs" className="text-white/80">
                            {campaign.participants} participants
                          </Text>
                        </VStack>
                        <Button
                          size="sm"
                          variant="solid"
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

          {/* Redeem Points */}
          <VStack space="lg">
            <VStack space="xs">
              <HStack className="justify-between items-center">
                <Heading
                  size="lg"
                  className="text-typography-900 dark:text-typography-950"
                >
                  {t("redeemPoints")}
                </Heading>
                <Button variant="link" size="sm">
                  <Text size="sm" className="text-primary-500">
                    {t("viewAllOffers")}
                  </Text>
                </Button>
              </HStack>
            </VStack>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack space="md">
                {rewards.map((reward) => (
                  <Card
                    key={reward.id}
                    className="w-48 p-4 border border-gray-200 dark:border-gray-800"
                  >
                    <VStack space="md" className="items-center">
                      <Text className="text-3xl">{reward.logo}</Text>
                      <VStack space="xs" className="items-center">
                        <Badge variant="solid" className="bg-green-500">
                          <Text size="xs" className="text-white">
                            {reward.discount} {t("discount")}
                          </Text>
                        </Badge>
                        <Badge variant="outline">
                          <Text
                            size="xs"
                            className="text-typography-600 dark:text-typography-750"
                          >
                            {reward.points} pts
                          </Text>
                        </Badge>
                      </VStack>
                      <VStack space="xs" className="items-center">
                        <Text
                          className="font-semibold text-typography-900 dark:text-typography-950 text-center"
                          numberOfLines={2}
                        >
                          {reward.title}
                        </Text>
                        <Text
                          size="sm"
                          className="text-typography-600 dark:text-typography-750 text-center"
                          numberOfLines={2}
                        >
                          {reward.description}
                        </Text>
                      </VStack>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        disabled={userStats.currentPoints < reward.points}
                      >
                        <Text
                          className={
                            userStats.currentPoints >= reward.points
                              ? "text-primary-500"
                              : "text-gray-400"
                          }
                        >
                          Redeem
                        </Text>
                      </Button>
                    </VStack>
                  </Card>
                ))}
              </HStack>
            </ScrollView>
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePage;
