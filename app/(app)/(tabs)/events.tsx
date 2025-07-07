import React, { useState } from "react";
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
import { useLanguage } from "@/components/i18n/language-context";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  TreePine,
  Waves,
  Recycle,
  Lightbulb,
  Heart,
  Plus,
} from "lucide-react-native";

const EventsPage = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Upcoming events
  const upcomingEvents = [
    {
      id: 1,
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
      difficulty: "Easy",
      points: 150,
      organizer: "Ocean Heroes",
      isJoined: false,
    },
    {
      id: 2,
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
      difficulty: "Easy",
      points: 200,
      organizer: "Green Future",
      isJoined: true,
    },
    {
      id: 3,
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
      difficulty: "Easy",
      points: 120,
      organizer: "EcoMakers",
      isJoined: false,
    },
    {
      id: 4,
      title: "💡 Climate Science Fair",
      description: "Showcase climate solutions and learn from amazing young scientists! Interactive exhibits and demos.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
      date: "July 22, 2025",
      time: "10:00 AM - 4:00 PM",
      location: "Science Museum",
      distance: "3.2 km away",
      participants: 89,
      maxParticipants: 150,
      category: "education",
      difficulty: "Medium",
      points: 250,
      organizer: "Future Scientists",
      isJoined: false,
    },
  ];

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      cleanup: Waves,
      planting: TreePine,
      education: Lightbulb,
      action: Recycle,
    };
    return icons[category] || Calendar;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      cleanup: "text-blue-600 dark:text-blue-400",
      planting: "text-green-600 dark:text-green-400",
      education: "text-purple-600 dark:text-purple-400",
      action: "text-orange-600 dark:text-orange-400",
    };
    return colors[category] || "text-gray-600 dark:text-gray-400";
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      Easy: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
      Medium: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
      Hard: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
    };
    return colors[difficulty] || colors.Easy;
  };

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
              <Icon as={Calendar} size="xl" className="text-primary-500" />
              <VStack space="xs" className="flex-1">
                <Heading
                  size="xl"
                  className="text-typography-900 dark:text-typography-950"
                >
                  🎉 Climate Events
                </Heading>
                <Text
                  size="sm"
                  className="text-typography-600 dark:text-typography-750"
                >
                  Join fun activities to help our planet!
                </Text>
              </VStack>
            </HStack>

            {/* Quick Stats */}
            <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-gray-200 dark:border-gray-800">
              <HStack className="justify-between items-center">
                <VStack space="xs" className="items-center">
                  <Text
                    size="xl"
                    className="font-bold text-green-600 dark:text-green-400"
                  >
                    1
                  </Text>
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750"
                  >
                    Joined
                  </Text>
                </VStack>
                <VStack space="xs" className="items-center">
                  <Text
                    size="xl"
                    className="font-bold text-blue-600 dark:text-blue-400"
                  >
                    3
                  </Text>
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750"
                  >
                    Nearby
                  </Text>
                </VStack>
                <VStack space="xs" className="items-center">
                  <Text
                    size="xl"
                    className="font-bold text-purple-600 dark:text-purple-400"
                  >
                    570
                  </Text>
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750"
                  >
                    Points Available
                  </Text>
                </VStack>
              </HStack>
            </Card>
          </VStack>

          {/* Category Filters */}
          <VStack space="md" className="mb-6">
            <Heading
              size="md"
              className="text-typography-900 dark:text-typography-950"
            >
              🏷️ Categories
            </Heading>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack space="md">
                {[
                  { key: "all", label: "All Events", icon: Calendar },
                  { key: "cleanup", label: "Cleanup", icon: Waves },
                  { key: "planting", label: "Planting", icon: TreePine },
                  { key: "education", label: "Education", icon: Lightbulb },
                ].map((category) => (
                  <Button
                    key={category.key}
                    variant={selectedCategory === category.key ? "solid" : "outline"}
                    size="sm"
                    onPress={() => setSelectedCategory(category.key)}
                    className="min-w-24"
                  >
                    <HStack space="xs" className="items-center">
                      <Icon 
                        as={category.icon} 
                        size="xs" 
                        className={selectedCategory === category.key ? "text-white" : "text-gray-500"}
                      />
                      <Text 
                        size="sm"
                        className={selectedCategory === category.key ? "text-white" : ""}
                      >
                        {category.label}
                      </Text>
                    </HStack>
                  </Button>
                ))}
              </HStack>
            </ScrollView>
          </VStack>

          {/* Upcoming Events */}
          <VStack space="lg" className="mb-6">
            <HStack className="justify-between items-center">
              <Heading
                size="md"
                className="text-typography-900 dark:text-typography-950"
              >
                🗓️ Upcoming Events
              </Heading>
              <Button size="sm" variant="outline">
                <HStack space="xs" className="items-center">
                  <Icon as={Plus} size="xs" className="text-gray-500" />
                  <Text size="sm">Create Event</Text>
                </HStack>
              </Button>
            </HStack>

            {upcomingEvents
              .filter(event => selectedCategory === "all" || event.category === selectedCategory)
              .map((event) => (
              <Card
                key={event.id}
                className="overflow-hidden border border-gray-200 dark:border-gray-800"
              >
                <VStack space="md">
                  {/* Event Image */}
                  <Box className="relative h-40">
                    <Image
                      source={{ uri: event.image }}
                      className="w-full h-full"
                      style={{ resizeMode: "cover" }}
                    />
                    <Box className="absolute top-3 right-3">
                      <Badge variant="solid" className="bg-white/90">
                        <Text size="xs" className="text-gray-900">
                          +{event.points} pts
                        </Text>
                      </Badge>
                    </Box>
                    <Box className="absolute top-3 left-3">
                      <Badge 
                        variant="solid" 
                        className={event.isJoined ? "bg-green-500" : "bg-blue-500"}
                      >
                        <Text size="xs" className="text-white">
                          {event.isJoined ? "✅ Joined" : "Available"}
                        </Text>
                      </Badge>
                    </Box>
                  </Box>

                  {/* Event Content */}
                  <VStack space="md" className="p-4">
                    <VStack space="xs">
                      <Text
                        className="font-bold text-lg text-typography-900 dark:text-typography-950"
                        numberOfLines={2}
                      >
                        {event.title}
                      </Text>
                      <Text
                        size="sm"
                        className="text-typography-600 dark:text-typography-750"
                        numberOfLines={3}
                      >
                        {event.description}
                      </Text>
                    </VStack>

                    {/* Event Details */}
                    <VStack space="xs">
                      <HStack space="xs" className="items-center">
                        <Icon as={Calendar} size="sm" className="text-purple-500" />
                        <Text size="sm" className="text-typography-600 dark:text-typography-750">
                          {event.date} • {event.time}
                        </Text>
                      </HStack>
                      <HStack space="xs" className="items-center">
                        <Icon as={MapPin} size="sm" className="text-red-500" />
                        <Text size="sm" className="text-typography-600 dark:text-typography-750">
                          {event.location} ({event.distance})
                        </Text>
                      </HStack>
                      <HStack space="xs" className="items-center">
                        <Icon as={Users} size="sm" className="text-blue-500" />
                        <Text size="sm" className="text-typography-600 dark:text-typography-750">
                          {event.participants}/{event.maxParticipants} joined
                        </Text>
                      </HStack>
                    </VStack>

                    {/* Badges */}
                    <HStack space="xs" className="items-center">
                      <Badge
                        variant="outline"
                        className={getDifficultyColor(event.difficulty)}
                      >
                        <Text size="xs">{event.difficulty}</Text>
                      </Badge>
                      <Badge variant="outline">
                        <HStack space="xs" className="items-center">
                          <Icon 
                            as={getCategoryIcon(event.category)} 
                            size="xs" 
                            className={getCategoryColor(event.category)}
                          />
                          <Text size="xs" className="capitalize">
                            {event.category}
                          </Text>
                        </HStack>
                      </Badge>
                      <Badge variant="outline">
                        <Text size="xs">by {event.organizer}</Text>
                      </Badge>
                    </HStack>

                    {/* Action Button */}
                    <HStack className="justify-between items-center">
                      <VStack space="xs">
                        <Text size="xs" className="text-typography-500">
                          Progress: {event.participants}/{event.maxParticipants} spots filled
                        </Text>
                        <Box className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <Box 
                            className="h-2 bg-primary-500 rounded-full"
                            style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                          />
                        </Box>
                      </VStack>
                      <Button
                        size="sm"
                        variant={event.isJoined ? "outline" : "solid"}
                        className={event.isJoined ? "border-green-500" : ""}
                      >
                        <HStack space="xs" className="items-center">
                          {event.isJoined ? (
                            <Icon as={Heart} size="xs" className="text-green-500" />
                          ) : (
                            <Icon as={Plus} size="xs" className="text-white" />
                          )}
                          <Text className={event.isJoined ? "text-green-500" : "text-white"}>
                            {event.isJoined ? "Joined!" : "Join Event"}
                          </Text>
                        </HStack>
                      </Button>
                    </HStack>
                  </VStack>
                </VStack>
              </Card>
            ))}
          </VStack>

          {/* Create Event CTA */}
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
            <VStack space="lg" className="items-center">
              <Icon as={Plus} size="xl" className="text-purple-600" />
              <VStack space="xs" className="items-center">
                <Text className="font-bold text-purple-900 dark:text-purple-100 text-center">
                  🌟 Organize Your Own Event!
                </Text>
                <Text size="sm" className="text-purple-800 dark:text-purple-200 text-center">
                  Have an idea for a climate action event? Create one and invite your community!
                </Text>
              </VStack>
              <Button size="sm" variant="solid" className="bg-purple-600">
                <HStack space="xs" className="items-center">
                  <Icon as={Plus} size="xs" className="text-white" />
                  <Text className="text-white">Create New Event</Text>
                </HStack>
              </Button>
            </VStack>
          </Card>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventsPage;
