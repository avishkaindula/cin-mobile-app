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
        <Card className="p-8 w-full max-w-sm border-2 border-[#333333] shadow-[4px_4px_0_#333333] bg-[#FCFCFC]">
          <VStack space="lg" className="items-center">
            {/* Logo */}
            <Box className="w-20 h-20 bg-[#DDA0DD] border-2 border-[#333333] shadow-[2px_2px_0_#333333] rounded-lg items-center justify-center">
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
              Community Hub
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
                We're building an amazing community experience where you can connect with fellow climate advocates, join local groups, and collaborate on missions together.
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
                  • Connect with local climate groups
                </Text>
                <Text
                  size="sm"
                  className="text-[#333333] font-semibold tracking-wide text-center"
                >
                  • Join community discussions
                </Text>
                <Text
                  size="sm"
                  className="text-[#333333] font-semibold tracking-wide text-center"
                >
                  • Participate in group missions
                </Text>
                <Text
                  size="sm"
                  className="text-[#333333] font-semibold tracking-wide text-center"
                >
                  • Share your impact stories
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
}
