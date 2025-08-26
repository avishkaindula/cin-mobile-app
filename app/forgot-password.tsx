import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, Image } from "react-native";
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
import { useSession } from "@/context/auth";
import { useAppToast } from "@/lib/toast-utils";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useSession();
  const { showError, showSuccess } = useAppToast();

  async function handleResetPassword() {
    if (!email) {
      showError("Email Required", "Please enter your email address");
      return;
    }

    setLoading(true);
    const { error } = await resetPassword(email);

    if (error) {
      showError("Reset Password Error", error.message);
    } else {
      setEmailSent(true);
      showSuccess(
        "Email Sent",
        "Check your email for password reset instructions"
      );
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
                variant="outline"
                size="sm"
                onPress={() => router.back()}
                className="border-2 border-[#333333] shadow-[2px_2px_0_#333333] bg-[#FCFCFC] px-4 py-2"
              >
                <HStack space="sm" className="items-center">
                  <Icon as={ArrowLeft} size="sm" className="text-[#333333]" />
                  <Text className="text-[#333333] font-bold tracking-wide">
                    Go Back
                  </Text>
                </HStack>
              </Button>
            </HStack>

            <Box className="flex-1 justify-center">
              <VStack space="xl" className="items-center">
                {/* Success Header */}
                <VStack space="lg" className="items-center mb-8">
                  <Box className="p-4 bg-[#98FB98] rounded-full">
                    <Icon
                      as={CheckCircle}
                      size="xl"
                      className="text-[#333333]"
                    />
                  </Box>
                  <VStack space="xs" className="items-center">
                    <Heading
                      size="2xl"
                      className="text-[#333333] text-center font-extrabold tracking-wider"
                      retro
                    >
                      Check Your Email
                    </Heading>
                    <Text
                      size="lg"
                      className="text-[#333333] text-center font-semibold tracking-wide"
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
                        className="text-[#333333] text-center font-semibold tracking-wide"
                      >
                        We've sent a password reset link to:
                      </Text>
                      <Text
                        size="lg"
                        className="text-[#333333] font-bold text-center tracking-wide"
                      >
                        {email}
                      </Text>
                    </VStack>

                    <VStack space="md" className="w-full">
                      <Text
                        size="md"
                        className="text-[#333333] text-center font-semibold tracking-wide"
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
                        <Text
                          size="lg"
                          className="text-[#333333] font-semibold"
                        >
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
                          className="text-primary-500 font-bold tracking-wide"
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
              variant="outline"
              size="sm"
              onPress={() => router.back()}
              className="border-2 border-[#333333] shadow-[2px_2px_0_#333333] bg-[#FCFCFC] px-4 py-2"
            >
              <HStack space="xs" className="items-center">
                <Icon as={ArrowLeft} size="sm" className="text-[#333333]" />
                <Text
                  size="md"
                  className="text-[#333333] font-bold tracking-wide"
                >
                  Go Back
                </Text>
              </HStack>
            </Button>
          </HStack>

          <Box className="flex-1 justify-center">
            <VStack space="xl" className="items-center">
              {/* Header */}
              <VStack space="md" className="items-center mb-4">
                <Image
                  source={require("@/assets/icon.png")}
                  style={{ width: 64, height: 64 }}
                  resizeMode="contain"
                />
                <VStack space="md" className="items-center">
                  <Heading
                    size="2xl"
                    className="text-[#333333] text-center font-extrabold tracking-wider"
                    retro
                  >
                    Forgot Password?
                  </Heading>
                  <Text
                    size="lg"
                    className="text-[#333333] text-center font-semibold tracking-wide"
                  >
                    No worries, we'll help you reset it
                  </Text>
                </VStack>
              </VStack>
              {/* Reset Password Card */}
              <Card className="w-full max-w-sm p-8">
                <VStack space="lg" className="items-center">
                  <VStack space="md" className="items-center">
                    <Heading
                      size="lg"
                      className="text-[#333333] font-extrabold tracking-wider"
                      retro
                    >
                      Reset Your Password
                    </Heading>
                    <Text
                      size="md"
                      className="text-[#333333] text-center font-semibold tracking-wide"
                    >
                      Enter your email address and we'll send you a link to
                      reset your password
                    </Text>
                  </VStack>

                  {/* Email Input */}
                  <VStack space="xs" className="w-full">
                    <Text
                      size="sm"
                      className="text-[#333333] font-bold tracking-wide"
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
                    <HStack space="md" className="items-center justify-center">
                      <Icon
                        as={KeyRound}
                        size="md"
                        className="text-[#333333]"
                      />
                      <Text size="lg" className="text-[#333333] font-semibold">
                        {loading ? "Sending Reset Link..." : "Send Reset Link"}
                      </Text>
                    </HStack>
                  </Button>

                  {/* Sign In Link */}
                  <VStack space="xs" className="items-center">
                    <Text
                      size="md"
                      className="text-[#333333] font-semibold tracking-wide"
                    >
                      Remember your password?
                    </Text>
                    <Button
                      variant="link"
                      size="sm"
                      onPress={() => router.push("/sign-in")}
                    >
                      <Text
                        size="md"
                        className="text-primary-500 font-bold tracking-wide"
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
                    size="md"
                    className="text-[#333333] text-center font-bold tracking-wide"
                  >
                    Need help?
                  </Text>
                  <Text
                    size="md"
                    className="text-[#333333] text-center font-semibold tracking-wide"
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
