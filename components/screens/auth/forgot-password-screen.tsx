import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, InputField, InputIcon } from "@/components/ui/input";
import { ScrollView } from "@/components/ui/scroll-view";
import { Spinner } from "@/components/ui/spinner";
import { Mail, ArrowLeft, HelpCircle } from "lucide-react-native";
import { useAppToast } from "@/lib/toast-utils";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useAppToast();

  async function handleResetPassword() {
    if (!email.trim()) {
      showError("Email Required", "Please enter your email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError("Invalid Email", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      showSuccess(
        "Reset Link Sent! 📧",
        "Check your email for reset instructions. Don't forget to check your spam folder!"
      );
      setLoading(false);
    }, 2000);
  }

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="bg-gradient-to-br from-orange-100 via-yellow-100 to-red-100"
    >
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <Box className="flex-1 justify-center p-6">
          <VStack space="xl" className="items-center">
            {/* Back Button */}
            <HStack className="w-full justify-start mb-4">
              <Button
                variant="link"
                size="sm"
                onPress={() => router.back()}
              >
                <HStack space="sm" className="items-center">
                  <Icon as={ArrowLeft} size="sm" className="text-orange-600" />
                  <Text size="sm" className="text-orange-600 font-bold">
                    🔙 Back to Sign In
                  </Text>
                </HStack>
              </Button>
            </HStack>

            <VStack space="lg" className="items-center mb-8">
              <Box className="p-6 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-full shadow-xl border-4 border-yellow-400 transform rotate-12">
                <Icon as={HelpCircle} size="xl" className="text-orange-600" />
              </Box>
              <VStack space="xs" className="items-center">
                <Heading
                  size="2xl"
                  className="text-center font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent"
                >
                  🤔 Forgot Your Secret Code?
                </Heading>
                <Text
                  size="lg"
                  className="text-orange-600 text-center font-semibold"
                >
                  No worries! Let's help you get back to saving the planet! 🌍
                </Text>
              </VStack>
            </VStack>

            {/* Reset Password Card */}
            <Card className="w-full max-w-sm p-8" variant="elevated">
              <VStack space="lg" className="items-center">
                <VStack space="md" className="items-center">
                  <Heading
                    size="lg"
                    className="text-orange-700 font-black"
                  >
                    🔐 Reset Your Password
                  </Heading>
                  <Text
                    size="sm"
                    className="text-orange-600 text-center font-medium"
                  >
                    Enter your email and we'll send you a magic link to reset your password! ✨
                  </Text>
                </VStack>

                {/* Email Input */}
                <VStack space="xs" className="w-full">
                  <Text
                    size="sm"
                    className="text-orange-700 font-bold"
                  >
                    📧 Your Email Address
                  </Text>
                  <Input className="w-full" variant="rounded" size="lg">
                    <InputIcon as={Mail} className="ml-3" />
                    <InputField
                      placeholder="your.email@address.com"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </Input>
                </VStack>

                {/* Reset Button */}
                <Button
                  variant="solid"
                  action="secondary"
                  size="lg"
                  className="w-full"
                  disabled={loading || !email.trim()}
                  onPress={handleResetPassword}
                >
                  <HStack space="md" className="items-center">
                    {loading ? (
                      <Spinner size="small" color="white" />
                    ) : (
                      <Icon as={Mail} size="md" className="text-white" />
                    )}
                    <Text size="lg" className="text-white font-black">
                      {loading ? "🚀 Sending Magic Link..." : "📧 Send Reset Link"}
                    </Text>
                  </HStack>
                </Button>

                <VStack space="xs" className="items-center">
                  <Text
                    size="xs"
                    className="text-orange-500 text-center font-medium"
                  >
                    Don't worry, your climate hero data is safe with us! 🛡️
                  </Text>
                </VStack>
              </VStack>
            </Card>

            {/* Help Section */}
            <VStack space="md" className="w-full max-w-sm">
              <Text
                size="sm"
                className="text-orange-700 text-center font-black"
              >
                🆘 Need more help?
              </Text>
              <VStack space="xs">
                <HStack space="md" className="items-center">
                  <Box className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full shadow-md" />
                  <Text
                    size="sm"
                    className="text-orange-700 font-medium"
                  >
                    📧 Check your spam/junk folder
                  </Text>
                </HStack>
                <HStack space="md" className="items-center">
                  <Box className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-600 rounded-full shadow-md" />
                  <Text
                    size="sm"
                    className="text-orange-700 font-medium"
                  >
                    ⏰ Link expires in 24 hours
                  </Text>
                </HStack>
                <HStack space="md" className="items-center">
                  <Box className="w-3 h-3 bg-gradient-to-r from-red-400 to-pink-600 rounded-full shadow-md" />
                  <Text
                    size="sm"
                    className="text-orange-700 font-medium"
                  >
                    🔄 You can request a new link anytime
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
