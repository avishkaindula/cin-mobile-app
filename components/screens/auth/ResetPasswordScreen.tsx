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
import { Lock, ArrowLeft, Shield } from "lucide-react-native";
import { useAppToast } from "@/lib/toast-utils";

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useAppToast();

  async function handleResetPassword() {
    if (!password.trim()) {
      showError("Password Required", "Please enter a new password");
      return;
    }

    if (password !== confirmPassword) {
      showError("Password Mismatch", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      showError("Password Too Short", "Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      showSuccess(
        "Password Updated! 🎉",
        "Your new secret code is ready! You can now sign in with your new password."
      );
      setLoading(false);
      router.push("/sign-in");
    }, 2000);
  }

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="bg-gradient-to-br from-green-100 via-teal-100 to-blue-100"
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
                  <Icon as={ArrowLeft} size="sm" className="text-teal-600" />
                  <Text size="sm" className="text-teal-600 font-bold">
                    🔙 Back to Sign In
                  </Text>
                </HStack>
              </Button>
            </HStack>

            <VStack space="lg" className="items-center mb-8">
              <Box className="p-6 bg-gradient-to-br from-teal-200 to-blue-300 rounded-full shadow-xl border-4 border-teal-400 transform -rotate-6">
                <Icon as={Shield} size="xl" className="text-teal-600" />
              </Box>
              <VStack space="xs" className="items-center">
                <Heading
                  size="2xl"
                  className="text-center font-black bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"
                >
                  🔐 Create New Secret Code
                </Heading>
                <Text
                  size="lg"
                  className="text-teal-600 text-center font-semibold"
                >
                  Time for a super strong new password! 💪
                </Text>
              </VStack>
            </VStack>

            {/* Reset Password Card */}
            <Card className="w-full max-w-sm p-8" variant="elevated">
              <VStack space="lg" className="items-center">
                <VStack space="md" className="items-center">
                  <Heading
                    size="lg"
                    className="text-teal-700 font-black"
                  >
                    🛡️ New Password Setup
                  </Heading>
                  <Text
                    size="sm"
                    className="text-teal-600 text-center font-medium"
                  >
                    Create a strong password to keep your climate hero account safe! 🦸‍♀️
                  </Text>
                </VStack>

                {/* New Password Input */}
                <VStack space="xs" className="w-full">
                  <Text
                    size="sm"
                    className="text-teal-700 font-bold"
                  >
                    🔒 New Secret Code
                  </Text>
                  <Input className="w-full" variant="rounded" size="lg">
                    <InputIcon as={Lock} className="ml-3" />
                    <InputField
                      placeholder="Your new super secret password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={true}
                      autoCapitalize="none"
                    />
                  </Input>
                </VStack>

                {/* Confirm Password Input */}
                <VStack space="xs" className="w-full">
                  <Text
                    size="sm"
                    className="text-teal-700 font-bold"
                  >
                    🔐 Confirm Secret Code
                  </Text>
                  <Input className="w-full" variant="rounded" size="lg">
                    <InputIcon as={Lock} className="ml-3" />
                    <InputField
                      placeholder="Type it again to be sure!"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={true}
                      autoCapitalize="none"
                    />
                  </Input>
                </VStack>

                {/* Reset Button */}
                <Button
                  variant="solid"
                  action="positive"
                  size="lg"
                  className="w-full"
                  disabled={loading || !password.trim() || !confirmPassword.trim()}
                  onPress={handleResetPassword}
                >
                  <HStack space="md" className="items-center">
                    {loading ? (
                      <Spinner size="small" color="white" />
                    ) : (
                      <Icon as={Shield} size="md" className="text-white" />
                    )}
                    <Text size="lg" className="text-white font-black">
                      {loading ? "🚀 Updating Password..." : "🛡️ Set New Password"}
                    </Text>
                  </HStack>
                </Button>

                <VStack space="xs" className="items-center">
                  <Text
                    size="xs"
                    className="text-teal-500 text-center font-medium"
                  >
                    Make it strong! Use letters, numbers, and symbols! 💪
                  </Text>
                </VStack>
              </VStack>
            </Card>

            {/* Password Tips */}
            <VStack space="md" className="w-full max-w-sm">
              <Text
                size="sm"
                className="text-teal-700 text-center font-black"
              >
                🔒 Password Super Tips:
              </Text>
              <VStack space="xs">
                <HStack space="md" className="items-center">
                  <Box className="w-3 h-3 bg-gradient-to-r from-teal-400 to-blue-600 rounded-full shadow-md" />
                  <Text
                    size="sm"
                    className="text-teal-700 font-medium"
                  >
                    🔢 At least 6 characters long
                  </Text>
                </HStack>
                <HStack space="md" className="items-center">
                  <Box className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full shadow-md" />
                  <Text
                    size="sm"
                    className="text-teal-700 font-medium"
                  >
                    🔤 Mix of letters and numbers
                  </Text>
                </HStack>
                <HStack space="md" className="items-center">
                  <Box className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-600 rounded-full shadow-md" />
                  <Text
                    size="sm"
                    className="text-teal-700 font-medium"
                  >
                    🔣 Add special symbols for extra strength
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
