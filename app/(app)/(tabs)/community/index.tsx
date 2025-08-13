import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/components/i18n/language-context";
import {
  Users,
  Clock,
  Construction,
} from "lucide-react-native";

export default function CommunityScreen() {
  const { t } = useLanguage();

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="bg-white dark:bg-background-dark"
    >
      <Box className="flex-1 justify-center items-center p-6">
        <Card className="p-8 w-full max-w-sm">
          <VStack space="lg" className="items-center">
            {/* Icon */}
            <Box className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full items-center justify-center">
              <Icon as={Construction} size="xl" className="text-primary-600" />
            </Box>

            {/* Title */}
            <Heading
              size="xl"
              className="text-typography-900 dark:text-typography-950 text-center"
            >
              Community Hub
            </Heading>

            {/* Coming Soon Message */}
            <VStack space="md" className="items-center">
              <Text
                size="lg"
                className="text-typography-700 dark:text-typography-300 font-semibold text-center"
              >
                Coming Soon!
              </Text>
              <Text
                size="sm"
                className="text-typography-600 dark:text-typography-400 text-center"
              >
                We're building an amazing community experience where you can connect with fellow climate advocates, join local groups, and collaborate on missions together.
              </Text>
            </VStack>

            {/* Features Preview */}
            <VStack space="sm" className="w-full">
              <Text
                size="sm"
                className="text-typography-700 dark:text-typography-300 font-medium text-center"
              >
                What's coming:
              </Text>
              <VStack space="xs">
                <Text
                  size="sm"
                  className="text-typography-600 dark:text-typography-400 text-center"
                >
                  • Connect with local climate groups
                </Text>
                <Text
                  size="sm"
                  className="text-typography-600 dark:text-typography-400 text-center"
                >
                  • Join community discussions
                </Text>
                <Text
                  size="sm"
                  className="text-typography-600 dark:text-typography-400 text-center"
                >
                  • Participate in group missions
                </Text>
                <Text
                  size="sm"
                  className="text-typography-600 dark:text-typography-400 text-center"
                >
                  • Share your impact stories
                </Text>
              </VStack>
            </VStack>

            {/* Clock Icon */}
            <Box className="flex-row items-center">
              <Icon as={Clock} size="sm" className="text-typography-500 mr-2" />
              <Text
                size="sm"
                className="text-typography-500 italic"
              >
                Stay tuned for updates!
              </Text>
            </Box>
          </VStack>
        </Card>
      </Box>
    </SafeAreaView>
  );
}
