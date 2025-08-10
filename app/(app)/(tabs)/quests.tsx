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
} from "lucide-react-native";

const QuestsPage = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("all"); // all, missions, events, my
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");

  // User stats
  const userStats = {
    completed: 12,
    active: 3,
    totalPoints: 850,
    totalEnergy: 425,
    rank: 45,
  };

  // Missions data
  const missions = [
    {
      id: 1,
      type: "mission",
      title: "Urban Heat Island Mapping",
      description: "Help map temperature variations in your city",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop",
      progress: 65,
      deadline: "5 days left",
      points: 150,
      energy: 75,
      category: "dataCollection",
      difficulty: "intermediate",
      participants: 234,
      status: "ongoing",
    },
    {
      id: 2,
      type: "mission",
      title: "Community Climate Workshop",
      description: "Organize climate awareness in your neighborhood",
      image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=300&h=200&fit=crop",
      progress: 30,
      deadline: "12 days left",
      points: 200,
      energy: 100,
      category: "awareness",
      difficulty: "beginner",
      participants: 156,
      status: "ongoing",
    },
    {
      id: 3,
      type: "mission",
      title: "Biodiversity Survey",
      description: "Document local flora and fauna changes",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop",
      progress: 0,
      deadline: "30 days left",
      points: 300,
      energy: 150,
      category: "research",
      difficulty: "advanced",
      participants: 89,
      status: "available",
    },
    {
      id: 4,
      type: "mission",
      title: "Ocean Cleanup Documentation",
      description: "Report marine pollution and cleanup efforts",
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=200&fit=crop",
      progress: 100,
      deadline: "Completed",
      points: 250,
      energy: 125,
      category: "action",
      difficulty: "intermediate",
      participants: 167,
      status: "completed",
    },
  ];

  // Events data
  const events = [
    {
      id: 5,
      type: "event",
      title: "🌊 Beach Cleanup Adventure",
      description: "Join us for a fun day cleaning up our beautiful coastline! Help protect marine life while making new friends.",
      image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=300&h=200&fit=crop",
      date: "July 12, 2025",
      time: "9:00 AM - 12:00 PM",
      location: "Copacabana Beach, Rio de Janeiro",
      distance: "2.3 km away",
      participants: 45,
      maxParticipants: 60,
      category: "cleanup",
      difficulty: "easy",
      points: 150,
      energy: 75,
      organizer: "Ocean Heroes",
      isJoined: false,
      status: "available",
    },
    {
      id: 6,
      type: "event",
      title: "🌳 Community Tree Planting",
      description: "Help us plant 100 native trees in our local park! Every tree makes a difference for our climate.",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop",
      date: "July 15, 2025",
      time: "8:00 AM - 11:00 AM",
      location: "Central Park, São Paulo",
      distance: "1.5 km away",
      participants: 32,
      maxParticipants: 50,
      category: "planting",
      difficulty: "easy",
      points: 200,
      energy: 100,
      organizer: "Green Future",
      isJoined: true,
      status: "ongoing",
    },
    {
      id: 7,
      type: "event",
      title: "♻️ Recycling Workshop",
      description: "Learn creative ways to upcycle waste into useful items! Fun activities for the whole family.",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300&h=200&fit=crop",
      date: "July 18, 2025",
      time: "2:00 PM - 5:00 PM",
      location: "Community Center",
      distance: "0.8 km away",
      participants: 18,
      maxParticipants: 25,
      category: "education",
      difficulty: "easy",
      points: 120,
      energy: 60,
      organizer: "EcoMakers",
      isJoined: false,
      status: "available",
    },
  ];

  // Combined quests data
  const allQuests = [...missions, ...events];

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
      easy: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
      intermediate: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
      medium: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
      advanced: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
      hard: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300",
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
      cleanup: Waves,
      planting: TreePine,
      education: Lightbulb,
    };
    return icons[category] || Target;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      dataCollection: "text-blue-600 dark:text-blue-400",
      research: "text-purple-600 dark:text-purple-400",
      awareness: "text-green-600 dark:text-green-400",
      action: "text-orange-600 dark:text-orange-400",
      cleanup: "text-blue-600 dark:text-blue-400",
      planting: "text-green-600 dark:text-green-400",
      education: "text-purple-600 dark:text-purple-400",
    };
    return colors[category] || "text-gray-600 dark:text-gray-400";
  };

  const getStatusBadge = (quest: any) => {
    if (quest.type === "mission") {
      switch (quest.status) {
        case "completed":
          return (
            <Badge variant="solid" className="bg-green-500">
              <Text size="xs" className="text-white">Completed</Text>
            </Badge>
          );
        case "ongoing":
          return (
            <Badge variant="solid" className="bg-blue-500">
              <Text size="xs" className="text-white">{quest.progress}% Progress</Text>
            </Badge>
          );
        default:
          return (
            <Badge variant="outline" className="border-primary-500">
              <Text size="xs" className="text-primary-600 dark:text-primary-400">Available</Text>
            </Badge>
          );
      }
    } else {
      // Event
      if (quest.isJoined) {
        return (
          <Badge variant="solid" className="bg-green-500">
            <Text size="xs" className="text-white">✅ Joined</Text>
          </Badge>
        );
      } else {
        return (
          <Badge variant="outline" className="border-blue-500">
            <Text size="xs" className="text-blue-600 dark:text-blue-400">Available</Text>
          </Badge>
        );
      }
    }
  };

  const filteredQuests = allQuests.filter((quest) => {
    const isMyQuest = quest.status === "ongoing" || quest.status === "completed" || 
      (quest.type === "event" && (quest as any).isJoined);
    
    const matchesTab = 
      activeTab === "all" ||
      (activeTab === "missions" && quest.type === "mission") ||
      (activeTab === "events" && quest.type === "event") ||
      (activeTab === "my" && isMyQuest);
    
    const matchesSearch =
      quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quest.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory =
      selectedCategory === "all" || quest.category === selectedCategory;
    
    const matchesDifficulty =
      selectedDifficulty === "all" || quest.difficulty === selectedDifficulty;

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
              <Icon as={Zap} size="xl" className="text-primary-500" />
              <VStack space="xs" className="flex-1">
                <Heading
                  size="xl"
                  className="text-typography-900 dark:text-typography-950"
                >
                  ⚡ Quests
                </Heading>
                <Text
                  size="sm"
                  className="text-typography-600 dark:text-typography-750"
                >
                  Complete missions and join events to earn rewards
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
                    Completed
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
                    Active
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
                    Points
                  </Text>
                </VStack>
                <VStack space="xs" className="items-center">
                  <Text
                    size="2xl"
                    className="font-bold text-orange-600 dark:text-orange-400"
                  >
                    {userStats.totalEnergy}
                  </Text>
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750"
                  >
                    Energy ⚡
                  </Text>
                </VStack>
              </HStack>
            </Card>
          </VStack>

          {/* Tabs and Search */}
          <VStack space="lg" className="mb-6">
            {/* Tab Navigation */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack space="md">
                <Button
                  variant={activeTab === "all" ? "solid" : "outline"}
                  size="sm"
                  onPress={() => setActiveTab("all")}
                >
                  <Text className={activeTab === "all" ? "text-white" : ""}>
                    All Quests
                  </Text>
                </Button>
                <Button
                  variant={activeTab === "missions" ? "solid" : "outline"}
                  size="sm"
                  onPress={() => setActiveTab("missions")}
                >
                  <HStack space="xs" className="items-center">
                    <Icon 
                      as={Target} 
                      size="xs" 
                      className={activeTab === "missions" ? "text-white" : "text-gray-500"}
                    />
                    <Text className={activeTab === "missions" ? "text-white" : ""}>
                      Missions
                    </Text>
                  </HStack>
                </Button>
                <Button
                  variant={activeTab === "events" ? "solid" : "outline"}
                  size="sm"
                  onPress={() => setActiveTab("events")}
                >
                  <HStack space="xs" className="items-center">
                    <Icon 
                      as={Calendar} 
                      size="xs" 
                      className={activeTab === "events" ? "text-white" : "text-gray-500"}
                    />
                    <Text className={activeTab === "events" ? "text-white" : ""}>
                      Events
                    </Text>
                  </HStack>
                </Button>
                <Button
                  variant={activeTab === "my" ? "solid" : "outline"}
                  size="sm"
                  onPress={() => setActiveTab("my")}
                >
                  <Text className={activeTab === "my" ? "text-white" : ""}>
                    My Quests
                  </Text>
                </Button>
              </HStack>
            </ScrollView>

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
                      placeholder="Search quests..."
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
                      <Text size="sm">Category</Text>
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
                      <Text size="sm">Sort By</Text>
                    </HStack>
                  </Button>
                </HStack>
              </ScrollView>
            </VStack>
          </VStack>

          {/* Quests List */}
          <VStack space="lg">
            {filteredQuests.map((quest) => (
              <Card
                key={quest.id}
                className="overflow-hidden border border-gray-200 dark:border-gray-800"
              >
                <HStack space="md">
                  {/* Quest Image with Type Indicator */}
                  <VStack space="xs" className="w-24">
                    <Box className="relative">
                      <Image
                        source={{ uri: quest.image }}
                        className="w-24 h-16"
                        style={{ resizeMode: "cover" }}
                      />
                      <Box className="absolute top-1 right-1">
                        <Badge variant="solid" className="bg-primary-500">
                          <Text size="xs" className="text-white">
                            {quest.points}
                          </Text>
                        </Badge>
                      </Box>
                      <Box className="absolute top-1 left-1">
                        <Badge 
                          variant="solid" 
                          className={quest.type === "event" ? "bg-blue-500" : "bg-green-500"}
                        >
                          <Icon 
                            as={quest.type === "event" ? Calendar : Target} 
                            size="xs" 
                            className="text-white"
                          />
                        </Badge>
                      </Box>
                    </Box>

                    {/* Additional quest info */}
                    <VStack space="xs" className="w-full">
                      <Box className="bg-gray-50 dark:bg-gray-800 p-2 rounded">
                        <VStack space="xs" className="items-center">
                          <HStack space="xs" className="items-center">
                            <Icon
                              as={Zap}
                              size="xs"
                              className="text-orange-500"
                            />
                            <Text
                              size="xs"
                              className="text-typography-700 dark:text-typography-300 font-medium"
                            >
                              +{quest.energy} ⚡
                            </Text>
                          </HStack>
                          <Text
                            size="xs"
                            className="text-typography-600 dark:text-typography-400 text-center"
                          >
                            {quest.type === "mission" ? "Mission" : "Event"}
                          </Text>
                        </VStack>
                      </Box>
                    </VStack>
                  </VStack>

                  {/* Quest Content */}
                  <VStack space="md" className="flex-1 p-4">
                    <VStack space="xs">
                      <HStack className="justify-between items-start">
                        <Text
                          className="font-semibold text-typography-900 dark:text-typography-950 flex-1"
                          numberOfLines={2}
                        >
                          {quest.title}
                        </Text>
                        {getStatusBadge(quest)}
                      </HStack>
                      <Text
                        size="sm"
                        className="text-typography-600 dark:text-typography-750"
                        numberOfLines={2}
                      >
                        {quest.description}
                      </Text>
                    </VStack>

                    <HStack space="xs" className="items-center">
                      <Badge
                        variant="outline"
                        className={getDifficultyColor(quest.difficulty)}
                      >
                        <Text size="xs">{quest.difficulty}</Text>
                      </Badge>
                      <Badge variant="outline">
                        <HStack space="xs" className="items-center">
                          <Icon
                            as={getCategoryIcon(quest.category)}
                            size="xs"
                            className={getCategoryColor(quest.category)}
                          />
                          <Text
                            size="xs"
                            className="text-typography-600 dark:text-typography-750"
                          >
                            {quest.category}
                          </Text>
                        </HStack>
                      </Badge>
                    </HStack>

                    {/* Mission Progress */}
                    {quest.type === "mission" && quest.status === "ongoing" && (
                      <VStack space="xs">
                        <HStack className="justify-between">
                          <Text
                            size="sm"
                            className="text-typography-600 dark:text-typography-750"
                          >
                            Progress
                          </Text>
                          <Text
                            size="sm"
                            className="text-typography-600 dark:text-typography-750"
                          >
                            {(quest as any).progress}%
                          </Text>
                        </HStack>
                        <Progress value={(quest as any).progress} className="h-2" />
                      </VStack>
                    )}

                    {/* Event Details */}
                    {quest.type === "event" && (
                      <VStack space="xs">
                        <HStack space="xs" className="items-center">
                          <Icon as={Calendar} size="sm" className="text-purple-500" />
                          <Text size="sm" className="text-typography-600 dark:text-typography-750">
                            {(quest as any).date} • {(quest as any).time}
                          </Text>
                        </HStack>
                        <HStack space="xs" className="items-center">
                          <Icon as={MapPin} size="sm" className="text-red-500" />
                          <Text size="sm" className="text-typography-600 dark:text-typography-750">
                            {(quest as any).location} ({(quest as any).distance})
                          </Text>
                        </HStack>
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
                              {quest.type === "event" 
                                ? `${quest.participants}/${(quest as any).maxParticipants}`
                                : quest.participants
                              }
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
                              {quest.type === "mission" ? (quest as any).deadline : (quest as any).date}
                            </Text>
                          </HStack>
                        </HStack>
                      </HStack>

                      {/* Action Button */}
                      <Button
                        size="sm"
                        variant={
                          quest.status === "completed" || (quest.type === "event" && (quest as any).isJoined) ? "outline" : "solid"
                        }
                        disabled={quest.status === "completed"}
                        className="self-end"
                      >
                        <HStack space="xs" className="items-center">
                          {quest.status === "completed" ? (
                            <Icon
                              as={CheckCircle}
                              size="sm"
                              className="text-green-500"
                            />
                          ) : quest.status === "ongoing" || (quest.type === "event" && (quest as any).isJoined) ? (
                            <Icon as={Play} size="sm" className="text-white" />
                          ) : (
                            <Icon
                              as={quest.type === "event" ? Calendar : Target}
                              size="sm"
                              className="text-white"
                            />
                          )}
                          <Text
                            className={
                              quest.status === "completed" ? "" : "text-white"
                            }
                          >
                            {quest.status === "completed"
                              ? "Completed"
                              : quest.status === "ongoing"
                              ? "Continue"
                              : (quest.type === "event" && (quest as any).isJoined)
                              ? "Joined"
                              : quest.type === "event"
                              ? "Join Event"
                              : "Start Mission"
                            }
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

export default QuestsPage;
