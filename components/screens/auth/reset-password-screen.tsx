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
import { KeyRound, Lock, CheckCircle } from "lucide-react-native";
import { authService } from "@/services";
import { useAppToast } from "@/lib/toast-utils";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useAppToast();

  async function handlePasswordReset() {
    if (password !== confirmPassword) {
      showError("Password Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      showError(
        "Password Error",
        "Password must be at least 6 characters long"
      );
      return;
    }

    setLoading(true);

    try {
      const { error } = await authService.updatePassword({ password });

      if (error) {
        showError("Password Reset Error", error.message);
      } else {
        showSuccess(
          "Password Updated",
          "Your password has been successfully updated!"
        );

        router.replace("/");
      }
    } catch (error) {
      showError("Password Reset Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="bg-white dark:bg-background-dark"
    >
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <Box className="flex-1 justify-center p-6">
          <VStack space="xl" className="items-center">
            {/* Header */}
            <VStack space="lg" className="items-center mb-8">
              <Box className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Icon as={KeyRound} size="xl" className="text-green-500" />
              </Box>
              <VStack space="xs" className="items-center">
                <Heading
                  size="2xl"
                  className="text-typography-900 dark:text-typography-950 text-center"
                >
                  Reset Your Password
                </Heading>
                <Text
                  size="lg"
                  className="text-typography-600 dark:text-typography-750 text-center"
                >
                  Enter your new password below
                </Text>
              </VStack>
            </VStack>

            {/* Reset Password Card */}
            <Card className="w-full max-w-sm p-8">
              <VStack space="lg">
                {/* New Password Input */}
                <VStack space="xs" className="w-full">
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750"
                  >
                    New Password
                  </Text>
                  <Input className="w-full">
                    <InputIcon as={Lock} className="ml-3" />
                    <InputField
                      placeholder="Enter new password"
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
                    className="text-typography-600 dark:text-typography-750"
                  >
                    Confirm New Password
                  </Text>
                  <Input className="w-full">
                    <InputIcon as={Lock} className="ml-3" />
                    <InputField
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={true}
                      autoCapitalize="none"
                    />
                  </Input>
                </VStack>

                {/* Update Password Button */}
                <Button
                  variant="solid"
                  action="primary"
                  size="lg"
                  className="w-full"
                  disabled={loading}
                  onPress={handlePasswordReset}
                >
                  <HStack space="md" className="items-center">
                    <Icon as={CheckCircle} size="md" className="text-white" />
                    <Text size="lg" className="text-white font-semibold">
                      {loading ? "Updating Password..." : "Update Password"}
                    </Text>
                  </HStack>
                </Button>

                <VStack space="xs" className="items-center">
                  <Text
                    size="xs"
                    className="text-typography-500 dark:text-typography-300 text-center"
                  >
                    Make sure your password is at least 6 characters long and
                    secure
                  </Text>
                </VStack>
              </VStack>
            </Card>
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
