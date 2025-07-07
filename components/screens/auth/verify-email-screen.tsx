import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollView } from "@/components/ui/scroll-view";
import { Spinner } from "@/components/ui/spinner";
import { Mail, CheckCircle, ArrowLeft, RefreshCw } from "lucide-react-native";
import { useAppToast } from "@/lib/toast-utils";

export default function VerifyEmailScreen() {
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { showError, showSuccess } = useAppToast();

  useEffect(() => {
    let timer: any;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);

  async function handleResendEmail() {
    setResendLoading(true);
    setCountdown(60); // 60 second cooldown
    
    // Simulate API call
    setTimeout(() => {
      showSuccess(
        "Verification Email Sent! 📧",
        "Check your inbox (and spam folder) for the verification link!"
      );
      setResendLoading(false);
    }, 2000);
  }

  async function handleVerifyLater() {
    setLoading(true);
    
    // Simulate navigation delay
    setTimeout(() => {
      showSuccess(
        "Welcome to Climate Heroes! 🌟",
        "You can verify your email later in settings."
      );
      setLoading(false);
      router.replace("/(app)" as any);
    }, 1500);
  }

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100"
    >
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <Box className="flex-1 justify-center p-6">
          <VStack space="xl" className="items-center">
            {/* Back Button */}
            <HStack className="w-full justify-start mb-4">
              <Button
                variant="link"
                size="sm"
                onPress={() => router.push("/sign-in")}
              >
                <HStack space="sm" className="items-center">
                  <Icon as={ArrowLeft} size="sm" className="text-purple-600" />
                  <Text size="sm" className="text-purple-600 font-bold">
                    🔙 Back to Sign In
                  </Text>
                </HStack>
              </Button>
            </HStack>

            <VStack space="lg" className="items-center mb-8">
              <Box className="p-6 bg-gradient-to-br from-pink-200 to-purple-300 rounded-full shadow-xl border-4 border-pink-400 transform rotate-6">
                <Icon as={Mail} size="xl" className="text-purple-600" />
              </Box>
              <VStack space="xs" className="items-center">
                <Heading
                  size="2xl"
                  className="text-center font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                >
                  📧 Check Your Email! ✨
                </Heading>
                <Text
                  size="lg"
                  className="text-purple-600 text-center font-semibold"
                >
                  We sent you a magical verification link! 🪄
                </Text>
              </VStack>
            </VStack>

            {/* Verify Email Card */}
            <Card className="w-full max-w-sm p-8" variant="elevated">
              <VStack space="lg" className="items-center">
                <VStack space="md" className="items-center">
                  <Heading
                    size="lg"
                    className="text-purple-700 font-black"
                  >
                    📬 Verification Step
                  </Heading>
                  <Text
                    size="sm"
                    className="text-purple-600 text-center font-medium"
                  >
                    Click the link in your email to activate your climate hero powers! 🦸‍♀️
                  </Text>
                </VStack>

                {/* Status Icon */}
                <Box className="p-4 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full border-2 border-yellow-400">
                  <Icon as={CheckCircle} size="lg" className="text-orange-600" />
                </Box>

                {/* Resend Button */}
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  disabled={resendLoading || countdown > 0}
                  onPress={handleResendEmail}
                >
                  <HStack space="md" className="items-center">
                    {resendLoading ? (
                      <Spinner size="small" color="purple" />
                    ) : (
                      <Icon as={RefreshCw} size="md" className="text-purple-600" />
                    )}
                    <Text size="lg" className="text-purple-600 font-bold">
                      {resendLoading 
                        ? "📧 Sending..." 
                        : countdown > 0 
                        ? `⏰ Resend in ${countdown}s`
                        : "📧 Resend Email"}
                    </Text>
                  </HStack>
                </Button>

                {/* Continue Button */}
                <Button
                  variant="solid"
                  action="primary"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                  onPress={handleVerifyLater}
                >
                  <HStack space="md" className="items-center">
                    {loading ? (
                      <Spinner size="small" color="white" />
                    ) : (
                      <Icon as={CheckCircle} size="md" className="text-white" />
                    )}
                    <Text size="lg" className="text-white font-black">
                      {loading ? "🚀 Starting Adventure..." : "🌟 Continue to App"}
                    </Text>
                  </HStack>
                </Button>

                <VStack space="xs" className="items-center">
                  <Text
                    size="xs"
                    className="text-purple-500 text-center font-medium"
                  >
                    You can verify your email later in the app settings! 😊
                  </Text>
                </VStack>
              </VStack>
            </Card>

            {/* Help Section */}
            <VStack space="md" className="w-full max-w-sm">
              <Text
                size="sm"
                className="text-purple-700 text-center font-black"
              >
                🔍 Can't find the email?
              </Text>
              <VStack space="xs">
                <HStack space="md" className="items-center">
                  <Box className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full shadow-md" />
                  <Text
                    size="sm"
                    className="text-purple-700 font-medium"
                  >
                    📧 Check your spam/junk folder
                  </Text>
                </HStack>
                <HStack space="md" className="items-center">
                  <Box className="w-3 h-3 bg-gradient-to-r from-pink-400 to-blue-600 rounded-full shadow-md" />
                  <Text
                    size="sm"
                    className="text-purple-700 font-medium"
                  >
                    ⏰ Sometimes it takes a few minutes
                  </Text>
                </HStack>
                <HStack space="md" className="items-center">
                  <Box className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full shadow-md" />
                  <Text
                    size="sm"
                    className="text-purple-700 font-medium"
                  >
                    🔄 You can always request a new one
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
