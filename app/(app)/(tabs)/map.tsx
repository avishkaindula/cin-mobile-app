import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/components/i18n/language-context";
import {
  MapPin,
  Globe,
  Navigation,
  Users,
  Target,
  Calendar,
  Sparkles,
  Bell,
} from "lucide-react-native";

const MapPage = () => {
  const { t } = useLanguage();

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="bg-white dark:bg-background-dark"
    >
      <Box className="flex-1 justify-center items-center p-6">
        <VStack space="xl" className="items-center max-w-sm">
          {/* Map Icon with Animation Effect */}
          <Box className="relative">
            <Box className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full items-center justify-center">
              <Icon as={MapPin} size="xl" className="text-primary-600 dark:text-primary-400" />
            </Box>
            {/* Sparkle icons around the main icon */}
            <Box className="absolute -top-2 -right-2">
              <Icon as={Sparkles} size="sm" className="text-yellow-500" />
            </Box>
            <Box className="absolute -bottom-2 -left-2">
              <Icon as={Globe} size="sm" className="text-blue-500" />
            </Box>
          </Box>

          {/* Coming Soon Content */}
          <VStack space="lg" className="items-center">
            <VStack space="xs" className="items-center">
              <Heading
                size="xl"
                className="text-typography-900 dark:text-typography-950 text-center"
              >
                🗺️ Quest Map
              </Heading>
              <Heading
                size="lg"
                className="text-primary-600 dark:text-primary-400 text-center"
              >
                Coming Soon!
              </Heading>
            </VStack>

            <Text
              size="md"
              className="text-typography-600 dark:text-typography-750 text-center"
            >
              Discover nearby climate action opportunities, connect with local communities, and track your environmental impact on an interactive map.
            </Text>
          </VStack>

          {/* Feature Preview Cards */}
          <VStack space="md" className="w-full">
            <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <HStack space="md" className="items-center">
                <Icon as={Navigation} size="md" className="text-blue-600 dark:text-blue-400" />
                <VStack space="xs" className="flex-1">
                  <Text className="font-semibold text-blue-900 dark:text-blue-100">
                    📍 Location-based Quests
                  </Text>
                  <Text size="sm" className="text-blue-800 dark:text-blue-200">
                    Find missions and events near you
                  </Text>
                </VStack>
              </HStack>
            </Card>

            <Card className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <HStack space="md" className="items-center">
                <Icon as={Users} size="md" className="text-green-600 dark:text-green-400" />
                <VStack space="xs" className="flex-1">
                  <Text className="font-semibold text-green-900 dark:text-green-100">
                    🤝 Community Hubs
                  </Text>
                  <Text size="sm" className="text-green-800 dark:text-green-200">
                    Connect with local climate warriors
                  </Text>
                </VStack>
              </HStack>
            </Card>

            <Card className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <HStack space="md" className="items-center">
                <Icon as={Target} size="md" className="text-purple-600 dark:text-purple-400" />
                <VStack space="xs" className="flex-1">
                  <Text className="font-semibold text-purple-900 dark:text-purple-100">
                    📊 Impact Tracking
                  </Text>
                  <Text size="sm" className="text-purple-800 dark:text-purple-200">
                    Visualize your environmental impact
                  </Text>
                </VStack>
              </HStack>
            </Card>
          </VStack>

          {/* Notification Button */}
          <Button
            variant="solid"
            className="bg-primary-600 w-full"
          >
            <HStack space="xs" className="items-center">
              <Icon as={Bell} size="sm" className="text-white" />
              <Text className="text-white font-medium">
                Notify Me When Available
              </Text>
            </HStack>
          </Button>

          {/* Additional Info */}
          <VStack space="xs" className="items-center">
            <Text
              size="sm"
              className="text-typography-500 dark:text-typography-600 text-center"
            >
              🚀 We're working hard to bring you an amazing map experience
            </Text>
            <Text
              size="xs"
              className="text-typography-400 dark:text-typography-700 text-center"
            >
              Expected launch: Q2 2025
            </Text>
          </VStack>
        </VStack>
      </Box>
    </SafeAreaView>
  );
};

export default MapPage;
