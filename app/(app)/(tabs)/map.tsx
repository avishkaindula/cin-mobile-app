import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/components/i18n/language-context";
import {
  MapPin,
  Clock,
  Construction,
} from "lucide-react-native";

export default function MapScreen() {
  const { t } = useLanguage();

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="bg-white dark:bg-background-dark"
    >
      <Box className="flex-1 justify-center items-center p-6">
        <Card className="p-8 w-full max-w-sm border-2 border-[#333333] shadow-[4px_4px_0_#333333] bg-[#FCFCFC]">
          <VStack space="lg" className="items-center">
            {/* Logo */}
            <Box className="w-20 h-20 bg-[#A2D8FF] border-2 border-[#333333] shadow-[2px_2px_0_#333333] rounded-lg items-center justify-center">
              <Image
                source={require("@/assets/icon.png")}
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            </Box>

            {/* Title */}
            <Heading
              size="xl"
              className="text-[#333333] font-extrabold tracking-wider text-center"
              retro
            >
              Quest Map
            </Heading>

            {/* Coming Soon Message */}
            <VStack space="md" className="items-center">
              <Text
                size="lg"
                className="text-[#333333] font-bold tracking-wide text-center"
                retro
              >
                Coming Soon!
              </Text>
              <Text
                size="sm"
                className="text-[#333333] font-semibold tracking-wide text-center"
              >
                Discover nearby climate action opportunities, connect with local communities, and track your environmental impact on an interactive map.
              </Text>
            </VStack>

            {/* Features Preview */}
            <VStack space="sm" className="w-full">
              <Text
                size="sm"
                className="text-[#333333] font-bold tracking-wide text-center"
              >
                What's coming:
              </Text>
              <VStack space="xs">
                <Text
                  size="sm"
                  className="text-[#333333] font-semibold tracking-wide text-center"
                >
                  • Find location-based quests near you
                </Text>
                <Text
                  size="sm"
                  className="text-[#333333] font-semibold tracking-wide text-center"
                >
                  • Connect with local climate hubs
                </Text>
                <Text
                  size="sm"
                  className="text-[#333333] font-semibold tracking-wide text-center"
                >
                  • Track your environmental impact
                </Text>
                <Text
                  size="sm"
                  className="text-[#333333] font-semibold tracking-wide text-center"
                >
                  • Visualize global climate data
                </Text>
              </VStack>
            </VStack>

            {/* Clock Icon */}
            <Box className="flex-row items-center">
              <Icon as={Clock} size="sm" className="text-[#333333] mr-2" />
              <Text
                size="sm"
                className="text-[#333333] font-semibold tracking-wide italic"
              >
                Stay tuned for updates!
              </Text>
            </Box>
          </VStack>
        </Card>
      </Box>
    </SafeAreaView>
  );
};
