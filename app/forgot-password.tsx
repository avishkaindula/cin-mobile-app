import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, Alert } from "react-native";
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
import { KeyRound, Mail, ArrowLeft, CheckCircle } from "lucide-react-native";
import { useSession } from "@/context/ctx";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useSession();

  async function handleResetPassword() {
    if (!email) {
      Alert.alert("Email Required", "Please enter your email address");
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(email);

    if (error) {
      Alert.alert("Reset Password Error", error.message);
    } else {
      setEmailSent(true);
    }
    setLoading(false);
  }

  if (emailSent) {
    return (
      <SafeAreaView
        style={{ flex: 1 }}
        className="bg-white dark:bg-background-dark"
      >
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
          <Box className="flex-1 p-6">
            {/* Back Button */}
            <HStack className="items-center mb-6">
              <Button
                variant="link"
                size="sm"
                onPress={() => router.back()}
                className="p-2 -ml-2"
              >
                <Icon
                  as={ArrowLeft}
                  size="md"
                  className="text-typography-600"
                />
              </Button>
              <Text
                size="lg"
                className="text-typography-900 dark:text-typography-950 font-semibold ml-2"
              >
                Password Reset
              </Text>
            </HStack>

            <Box className="flex-1 justify-center">
              <VStack space="xl" className="items-center">
                {/* Success Header */}
                <VStack space="lg" className="items-center mb-8">
                  <Box className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <Icon
                      as={CheckCircle}
                      size="xl"
                      className="text-green-500"
                    />
                  </Box>
                  <VStack space="xs" className="items-center">
                    <Heading
                      size="2xl"
                      className="text-typography-900 dark:text-typography-950 text-center"
                    >
                      Check Your Email
                    </Heading>
                    <Text
                      size="lg"
                      className="text-typography-600 dark:text-typography-750 text-center"
                    >
                      We've sent you a password reset link
                    </Text>
                  </VStack>
                </VStack>

                {/* Success Card */}
                <Card className="w-full max-w-sm p-8">
                  <VStack space="lg" className="items-center">
                    <VStack space="md" className="items-center">
                      <Text
                        size="md"
                        className="text-typography-600 dark:text-typography-750 text-center"
                      >
                        We've sent a password reset link to:
                      </Text>
                      <Text
                        size="lg"
                        className="text-typography-900 dark:text-typography-950 font-semibold text-center"
                      >
                        {email}
                      </Text>
                    </VStack>

                    <VStack space="md" className="w-full">
                      <Text
                        size="sm"
                        className="text-typography-600 dark:text-typography-750 text-center"
                      >
                        Click the link in your email to reset your password. If
                        you don't see the email, check your spam folder.
                      </Text>
                    </VStack>

                    {/* Actions */}
                    <VStack space="md" className="w-full">
                      <Button
                        variant="solid"
                        action="primary"
                        size="lg"
                        className="w-full"
                        onPress={() => router.push("/sign-in")}
                      >
                        <Text size="lg" className="text-white font-semibold">
                          Back to Sign In
                        </Text>
                      </Button>

                      <Button
                        variant="outline"
                        size="md"
                        className="w-full"
                        onPress={() => {
                          setEmailSent(false);
                          setEmail("");
                        }}
                      >
                        <Text
                          size="md"
                          className="text-primary-500 font-semibold"
                        >
                          Try Different Email
                        </Text>
                      </Button>
                    </VStack>
                  </VStack>
                </Card>
              </VStack>
            </Box>
          </Box>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="bg-white dark:bg-background-dark"
    >
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <Box className="flex-1 p-6">
          {/* Back Button */}
          <HStack className="items-center mb-6">
            <Button
              variant="link"
              size="sm"
              onPress={() => router.back()}
              className="p-2 -ml-2"
            >
              <Icon as={ArrowLeft} size="md" className="text-typography-600" />
            </Button>
            <Text
              size="lg"
              className="text-typography-900 dark:text-typography-950 font-semibold ml-2"
            >
              Go Back
            </Text>
          </HStack>

          <Box className="flex-1 justify-center">
            <VStack space="xl" className="items-center">
              {/* Header */}
              <VStack space="lg" className="items-center mb-8">
                <Box className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <Icon as={KeyRound} size="xl" className="text-orange-500" />
                </Box>
                <VStack space="xs" className="items-center">
                  <Heading
                    size="2xl"
                    className="text-typography-900 dark:text-typography-950 text-center"
                  >
                    Forgot Password?
                  </Heading>
                  <Text
                    size="lg"
                    className="text-typography-600 dark:text-typography-750 text-center"
                  >
                    No worries, we'll help you reset it
                  </Text>
                </VStack>
              </VStack>
              {/* Reset Password Card */}
              <Card className="w-full max-w-sm p-8">
                <VStack space="lg">
                  <VStack space="md" className="items-center">
                    <Heading
                      size="lg"
                      className="text-typography-900 dark:text-typography-950"
                    >
                      Reset Your Password
                    </Heading>
                    <Text
                      size="sm"
                      className="text-typography-600 dark:text-typography-750 text-center"
                    >
                      Enter your email address and we'll send you a link to
                      reset your password
                    </Text>
                  </VStack>

                  {/* Email Input */}
                  <VStack space="xs" className="w-full">
                    <Text
                      size="sm"
                      className="text-typography-600 dark:text-typography-750"
                    >
                      Email Address
                    </Text>
                    <Input className="w-full">
                      <InputIcon as={Mail} className="ml-3" />
                      <InputField
                        placeholder="email@address.com"
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
                    action="primary"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                    onPress={handleResetPassword}
                  >
                    <HStack space="md" className="items-center">
                      <Icon as={KeyRound} size="md" className="text-white" />
                      <Text size="lg" className="text-white font-semibold">
                        {loading ? "Sending Reset Link..." : "Send Reset Link"}
                      </Text>
                    </HStack>
                  </Button>

                  {/* Sign In Link */}
                  <VStack space="xs" className="items-center">
                    <Text
                      size="sm"
                      className="text-typography-600 dark:text-typography-750"
                    >
                      Remember your password?
                    </Text>
                    <Button
                      variant="link"
                      size="sm"
                      onPress={() => router.push("/sign-in")}
                    >
                      <Text
                        size="sm"
                        className="text-primary-500 font-semibold"
                      >
                        Back to Sign In
                      </Text>
                    </Button>
                  </VStack>
                </VStack>
              </Card>
              {/* Help Text */}
              <VStack space="md" className="w-full max-w-sm">
                <VStack space="xs">
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750 text-center font-semibold"
                  >
                    Need help?
                  </Text>
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750 text-center"
                  >
                    Contact our support team if you continue to experience
                    issues with your account.
                  </Text>
                </VStack>
              </VStack>
            </VStack>
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
