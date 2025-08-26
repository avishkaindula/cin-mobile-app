import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  TextInput,
  Keyboard,
  InteractionManager,
  Image,
} from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollView } from "@/components/ui/scroll-view";
import { Mail, ArrowLeft } from "lucide-react-native";
import { useSession } from "@/context/auth";
import { useAppToast } from "@/lib/toast-utils";

export default function VerifyEmail() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const { verifyOtp, resendVerification } = useSession();
  const { showError, showSuccess } = useAppToast();

  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Wait for the screen to fully load before showing interactive elements
  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setIsReady(true);
      });
      return () => task.cancel();
    }, [])
  );

  // Clean up keyboard and input refs on unmount
  useEffect(() => {
    return () => {
      // Dismiss keyboard when component unmounts
      Keyboard.dismiss();
      // Clear input refs
      inputRefs.current = [];
    };
  }, []);

  const handleCodeChange = (value: string, index: number) => {
    if (!isReady) return; // Don't handle input until screen is ready
    if (value.length > 1) return; // Prevent multiple characters

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      // Use setTimeout to avoid focus issues during state updates
      setTimeout(() => {
        if (inputRefs.current[index + 1]) {
          inputRefs.current[index + 1]?.focus();
        }
      }, 50);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (!isReady) return; // Don't handle input until screen is ready
    // Handle backspace to focus previous input
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      // Use setTimeout to avoid focus issues during state updates
      setTimeout(() => {
        if (inputRefs.current[index - 1]) {
          inputRefs.current[index - 1]?.focus();
        }
      }, 50);
    }
  };

  const handleVerify = async () => {
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      showError("Invalid Code", "Please enter all 6 digits");
      return;
    }

    if (!email) {
      showError("Error", "Email not found. Please go back and try again.");
      return;
    }

    setLoading(true);
    try {
      const { error, session } = await verifyOtp(
        email,
        verificationCode,
        "signup"
      );

      if (error) {
        showError(
          "Verification Failed",
          "The verification code is invalid or has expired. Please check your code or request a new one."
        );
      } else {
        showSuccess(
          "Email Verified!",
          "Your email has been successfully verified."
        );
        // Navigate after a short delay to let user see the success message
        setTimeout(() => {
          router.push("/sign-in");
        }, 1500);
      }
    } catch (error) {
      showError(
        "Verification Error",
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      showError("Error", "Email not found. Please go back and try again.");
      return;
    }

    setResendLoading(true);
    try {
      const { error } = await resendVerification(email);

      if (error) {
        showError(
          "Resend Error",
          error.message || "Failed to resend verification code"
        );
      } else {
        showSuccess(
          "Code Sent",
          "A new verification code has been sent to your email."
        );
        // Clear the current code
        setCode(["", "", "", "", "", ""]);
      }
    } catch (error) {
      showError(
        "Resend Error",
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setResendLoading(false);
    }
  };

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
              <ButtonIcon as={ArrowLeft} size="sm" className="text-[#333333]" />
              <ButtonText className="text-[#333333] font-bold tracking-wide">
                Go Back
              </ButtonText>
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
                    Verify Your Email
                  </Heading>
                  <Text
                    size="lg"
                    className="text-[#333333] text-center font-semibold tracking-wide"
                  >
                    We've sent a 6-digit code to
                  </Text>
                  <Text
                    size="lg"
                    className="text-primary-500 font-bold text-center tracking-wide"
                  >
                    {email}
                  </Text>
                </VStack>
              </VStack>

              {/* Verification Card */}
              <Card className="w-full max-w-sm p-8">
                <VStack space="lg" className="items-center">
                  <VStack space="md" className="items-center">
                    <Heading
                      size="md"
                      className="text-[#333333] font-extrabold tracking-wider text-center"
                      retro
                    >
                      Enter Verification Code
                    </Heading>
                    <Text
                      size="md"
                      className="text-[#333333] text-center font-semibold tracking-wide"
                    >
                      Enter the 6-digit code sent to your email, or click the
                      verification link in your email to activate your account
                      instantly.
                    </Text>
                  </VStack>

                  {/* Code Input */}
                  <HStack space="sm" className="justify-center">
                    {code.map((digit, index) => (
                      <Box
                        key={index}
                        className="w-12 h-12 border-2 border-[#333333] shadow-[2px_2px_0_#333333] rounded-lg bg-[#FCFCFC]"
                      >
                        <TextInput
                          ref={(ref) => {
                            if (isReady) {
                              inputRefs.current[index] = ref;
                            }
                          }}
                          value={digit}
                          onChangeText={(value) =>
                            handleCodeChange(value, index)
                          }
                          onKeyPress={(e) => handleKeyPress(e, index)}
                          keyboardType="numeric"
                          maxLength={1}
                          textAlign="center"
                          autoCorrect={false}
                          autoComplete="off"
                          textContentType="none"
                          editable={isReady}
                          style={{
                            flex: 1,
                            fontSize: 18,
                            fontWeight: "600",
                            color: "#333333", // Retro color for the digit text
                          }}
                          className="text-typography-900 dark:text-typography-50"
                        />
                      </Box>
                    ))}
                  </HStack>

                  {/* Verify Button */}
                  <Button
                    variant="solid"
                    action="primary"
                    size="lg"
                    className="w-full"
                    disabled={
                      !isReady ||
                      loading ||
                      resendLoading ||
                      code.some((digit) => !digit)
                    }
                    onPress={handleVerify}
                  >
                    <Text size="lg" className="text-[#333333] font-semibold">
                      {loading ? "Verifying..." : "Verify Email"}
                    </Text>
                  </Button>

                  {/* Resend Code */}
                  <VStack space="xs" className="items-center">
                    <Text
                      size="md"
                      className="text-[#333333] font-semibold tracking-wide"
                    >
                      Didn't receive the code?
                    </Text>
                    <Button
                      variant="link"
                      size="sm"
                      disabled={loading || resendLoading}
                      onPress={handleResendCode}
                    >
                      <Text
                        size="md"
                        className="text-primary-500 font-bold tracking-wide"
                      >
                        {resendLoading ? "Sending..." : "Resend Code"}
                      </Text>
                    </Button>
                  </VStack>

                  {/* Alternative option */}
                  <VStack space="xs" className="items-center">
                    <Text
                      size="md"
                      className="text-[#333333] font-semibold tracking-wide"
                    >
                      Already clicked the email link?
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
                        Go to Sign In
                      </Text>
                    </Button>
                  </VStack>
                </VStack>
              </Card>

              {/* Help Text */}
              <VStack space="xs" className="w-full max-w-sm">
                <Text
                  size="md"
                  className="text-[#666666] text-center font-medium tracking-wide"
                >
                  Check your spam folder if you don't see the email
                </Text>
              </VStack>
            </VStack>
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
