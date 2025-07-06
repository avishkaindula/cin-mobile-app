import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/i18n/LanguageContext";
import {
  Users,
  MessageCircle,
  Calendar,
  MapPin,
  Star,
  UserPlus,
  Eye,
  Award,
  Activity,
} from "lucide-react-native";

export default function CommunityScreen() {
  const { t } = useLanguage();

  const featuredCommunities = [
    {
      id: 1,
      name: "Lions Club",
      members: 2400,
      image:
        "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=200&fit=crop",
      description: "Service above self - join Lions in making a difference",
      category: "Service",
      rating: 4.9,
      isJoined: false,
      activeMembers: 1850,
    },
    {
      id: 2,
      name: "Rotaract",
      members: 1800,
      image:
        "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=300&h=200&fit=crop",
      description: "Young professionals creating positive change",
      category: "Youth Service",
      rating: 4.8,
      isJoined: true,
      activeMembers: 1200,
    },
    {
      id: 3,
      name: "Green Warriors",
      members: 3200,
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop",
      description: "Environmental action starts here",
      category: "Environment",
      rating: 4.7,
      isJoined: false,
      activeMembers: 2100,
    },
    {
      id: 4,
      name: "Youth for Climate",
      members: 2800,
      image:
        "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=300&h=200&fit=crop",
      description: "Young voices for climate action",
      category: "Climate",
      rating: 4.9,
      isJoined: false,
      activeMembers: 1950,
    },
  ];

  const recentDiscussions = [
    {
      id: 1,
      title: "Best practices for community tree planting",
      author: "Sarah Chen",
      replies: 23,
      lastActive: "2h ago",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      category: "Environment",
    },
    {
      id: 2,
      title: "Organizing climate awareness workshops",
      author: "Miguel Santos",
      replies: 18,
      lastActive: "5h ago",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      category: "Education",
    },
    {
      id: 3,
      title: "Partnership opportunities with local businesses",
      author: "Sarah Chen",
      replies: 31,
      lastActive: "1d ago",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      category: "Partnerships",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Community Beach Cleanup",
      date: "Dec 15",
      time: "9:00 AM",
      location: "Santa Monica Beach",
      attendees: 45,
      community: "Green Warriors",
    },
    {
      id: 2,
      title: "Climate Action Summit",
      date: "Dec 18",
      time: "2:00 PM",
      location: "City Hall",
      attendees: 120,
      community: "Youth for Climate",
    },
  ];

  const handleCommunityPress = (community: any) => {
    router.push({
      pathname: "./details",
      params: { id: community.id, name: community.name }
    });
  };

  const CommunityCard = ({ community }: { community: any }) => (
    <TouchableOpacity onPress={() => handleCommunityPress(community)}>
      <Card className="w-72 mr-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
        <VStack space="sm" className="p-4">
          {/* Community Image and Badge */}
          <Box className="relative">
            <Image
              source={{ uri: community.image }}
              alt={community.name}
              className="w-full h-32 rounded-lg"
            />
            <Badge className="absolute top-2 right-2 bg-primary-100 dark:bg-primary-900">
              <Text className="text-primary-800 dark:text-primary-200 text-xs font-medium">
                {community.category}
              </Text>
            </Badge>
          </Box>

          {/* Community Info */}
          <VStack space="xs">
            <HStack className="justify-between items-start">
              <Heading className="text-typography-900 dark:text-typography-950 text-lg font-bold flex-1">
                {community.name}
              </Heading>
              <HStack space="xs" className="items-center">
                <Icon as={Star} size="sm" className="text-yellow-500" />
                <Text className="text-typography-600 dark:text-typography-750 text-sm font-medium">
                  {community.rating}
                </Text>
              </HStack>
            </HStack>

            <Text className="text-typography-600 dark:text-typography-750 text-sm line-clamp-2">
              {community.description}
            </Text>

            {/* Stats */}
            <HStack space="md" className="items-center">
              <HStack space="xs" className="items-center">
                <Icon as={Users} size="sm" className="text-typography-500" />
                <Text className="text-typography-600 dark:text-typography-750 text-sm">
                  {community.members.toLocaleString()}
                </Text>
              </HStack>
              <HStack space="xs" className="items-center">
                <Icon as={Activity} size="sm" className="text-green-500" />
                <Text className="text-typography-600 dark:text-typography-750 text-sm">
                  {community.activeMembers.toLocaleString()} {t("active")}
                </Text>
              </HStack>
            </HStack>

            {/* Action Button */}
            <Button
              size="sm"
              variant={community.isJoined ? "outline" : "solid"}
              className={community.isJoined ? "" : ""}
            >
              <HStack space="xs" className="items-center">
                <Icon
                  as={community.isJoined ? Eye : UserPlus}
                  size="sm"
                  className={community.isJoined ? "" : "text-white"}
                />
                <Text
                  className={community.isJoined ? "" : "text-white font-medium"}
                >
                  {community.isJoined ? t("view") : t("join")}
                </Text>
              </HStack>
            </Button>
          </VStack>
        </VStack>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="bg-white dark:bg-background-dark"
    >
      <ScrollView className="flex-1">
        <Box className="p-6">
          {/* Header */}
          <VStack space="lg" className="mb-8">
            <HStack space="md" className="items-center">
              <Icon as={Users} size="xl" className="text-primary-500" />
              <VStack space="xs">
                <Heading
                  size="xl"
                  className="text-typography-900 dark:text-typography-950"
                >
                  {t("community")}
                </Heading>
                <Text
                  size="sm"
                  className="text-typography-600 dark:text-typography-750"
                >
                  {t("communitySubtitle")}
                </Text>
              </VStack>
            </HStack>
          </VStack>

          {/* Quick Actions */}
          <HStack space="md" className="mb-6">
            <Button variant="solid" className="flex-1">
              <Icon as={MessageCircle} size="sm" className="text-white mr-2" />
              <Text className="text-white">{t("startDiscussion")}</Text>
            </Button>
            <Button variant="outline" className="flex-1">
              <Icon as={Calendar} size="sm" className="mr-2" />
              <Text>{t("createEvent")}</Text>
            </Button>
          </HStack>

          {/* Featured Communities */}
          <VStack space="lg" className="mb-6">
            <HStack className="justify-between items-center">
              <Heading
                size="md"
                className="text-typography-900 dark:text-typography-950"
              >
                {t("featuredCommunities")}
              </Heading>
              <TouchableOpacity>
                <Text className="text-primary-600 dark:text-primary-400 text-sm font-medium">
                  {t("viewAll")}
                </Text>
              </TouchableOpacity>
            </HStack>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack space="md" className="px-1">
                {featuredCommunities.map((community) => (
                  <CommunityCard key={community.id} community={community} />
                ))}
              </HStack>
            </ScrollView>
          </VStack>

          {/* Recent Discussions */}
          <VStack space="lg" className="mb-6">
            <HStack className="justify-between items-center">
              <Heading
                size="md"
                className="text-typography-900 dark:text-typography-950"
              >
                Recent {t("discussions")}
              </Heading>
              <TouchableOpacity>
                <Text className="text-primary-600 dark:text-primary-400 text-sm font-medium">
                  {t("viewAll")}
                </Text>
              </TouchableOpacity>
            </HStack>
            <VStack space="md">
              {recentDiscussions.map((discussion) => (
                <TouchableOpacity key={discussion.id}>
                  <Card className="p-4 border border-gray-200 dark:border-gray-800">
                    <HStack space="sm" className="items-start">
                      <Avatar size="md">
                        <AvatarImage
                          source={{ uri: discussion.avatar }}
                          alt={discussion.author}
                        />
                      </Avatar>
                      <VStack className="flex-1" space="xs">
                        <HStack className="justify-between items-start">
                          <Text className="text-typography-900 dark:text-typography-950 font-semibold flex-1">
                            {discussion.title}
                          </Text>
                          <Badge variant="outline" className="ml-2">
                            <Text className="text-typography-600 dark:text-typography-750 text-xs font-medium">
                              {discussion.category}
                            </Text>
                          </Badge>
                        </HStack>
                        <HStack space="md" className="items-center">
                          <Text className="text-typography-600 dark:text-typography-750 text-sm">
                            {t("by")} {discussion.author}
                          </Text>
                          <HStack space="xs" className="items-center">
                            <Icon
                              as={MessageCircle}
                              size="xs"
                              className="text-typography-500"
                            />
                            <Text className="text-typography-600 dark:text-typography-750 text-sm">
                              {discussion.replies} {t("replies")}
                            </Text>
                          </HStack>
                          <Text className="text-typography-500 text-sm">
                            {discussion.lastActive}
                          </Text>
                        </HStack>
                      </VStack>
                    </HStack>
                  </Card>
                </TouchableOpacity>
              ))}
            </VStack>
          </VStack>

          {/* Upcoming Events */}
          <VStack space="lg" className="mb-6">
            <HStack className="justify-between items-center">
              <Heading
                size="md"
                className="text-typography-900 dark:text-typography-950"
              >
                Upcoming {t("events")}
              </Heading>
              <TouchableOpacity>
                <Text className="text-primary-600 dark:text-primary-400 text-sm font-medium">
                  {t("viewAll")}
                </Text>
              </TouchableOpacity>
            </HStack>
            <VStack space="md">
              {upcomingEvents.map((event) => (
                <TouchableOpacity key={event.id}>
                  <Card className="p-4 border border-gray-200 dark:border-gray-800">
                    <HStack space="sm" className="items-center">
                      {/* Date Box */}
                      <VStack className="bg-primary-100 dark:bg-primary-900 rounded-lg p-3 items-center min-w-16">
                        <Text className="text-primary-800 dark:text-primary-200 text-lg font-bold">
                          {event.date.split(" ")[1]}
                        </Text>
                        <Text className="text-primary-600 dark:text-primary-400 text-xs font-medium">
                          {event.date.split(" ")[0]}
                        </Text>
                      </VStack>

                      {/* Event Details */}
                      <VStack className="flex-1" space="xs">
                        <Text className="text-typography-900 dark:text-typography-950 font-semibold">
                          {event.title}
                        </Text>
                        <HStack space="md" className="items-center">
                          <HStack space="xs" className="items-center">
                            <Icon
                              as={MapPin}
                              size="xs"
                              className="text-typography-500"
                            />
                            <Text className="text-typography-600 dark:text-typography-750 text-sm">
                              {event.location}
                            </Text>
                          </HStack>
                          <Text className="text-typography-500 text-sm">
                            {event.time}
                          </Text>
                        </HStack>
                        <HStack space="md" className="items-center">
                          <Text className="text-primary-600 dark:text-primary-400 text-sm font-medium">
                            {event.community}
                          </Text>
                          <HStack space="xs" className="items-center">
                            <Icon
                              as={Users}
                              size="xs"
                              className="text-typography-500"
                            />
                            <Text className="text-typography-600 dark:text-typography-750 text-sm">
                              {event.attendees} {t("attending")}
                            </Text>
                          </HStack>
                        </HStack>
                      </VStack>

                      {/* Action Button */}
                      <Button size="sm" variant="outline">
                        <Text>{t("join")}</Text>
                      </Button>
                    </HStack>
                  </Card>
                </TouchableOpacity>
              ))}
            </VStack>
          </VStack>

          {/* My Communities Stats */}
          <Card className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-gray-200 dark:border-gray-800">
            <VStack space="sm">
              <HStack className="justify-between items-center">
                <Heading
                  size="md"
                  className="text-typography-900 dark:text-typography-950"
                >
                  {t("myCommunities")}
                </Heading>
                <Icon as={Award} size="lg" className="text-primary-500" />
              </HStack>
              <HStack space="md" className="items-center">
                <VStack className="items-center">
                  <Text
                    size="2xl"
                    className="font-bold text-primary-600 dark:text-primary-400"
                  >
                    3
                  </Text>
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750"
                  >
                    {t("joined")}
                  </Text>
                </VStack>
                <VStack className="items-center">
                  <Text
                    size="2xl"
                    className="font-bold text-blue-600 dark:text-blue-400"
                  >
                    28
                  </Text>
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750"
                  >
                    {t("discussions")}
                  </Text>
                </VStack>
                <VStack className="items-center">
                  <Text
                    size="2xl"
                    className="font-bold text-green-600 dark:text-green-400"
                  >
                    15
                  </Text>
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750"
                  >
                    {t("events")}
                  </Text>
                </VStack>
                <VStack className="items-center">
                  <Text
                    size="2xl"
                    className="font-bold text-orange-600 dark:text-orange-400"
                  >
                    850
                  </Text>
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750"
                  >
                    {t("impactPoints")}
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Card>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
