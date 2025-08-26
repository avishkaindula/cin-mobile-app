import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  InteractionManager,
  Platform,
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
import { Input, InputField, InputIcon } from "@/components/ui/input";
import { ScrollView } from "@/components/ui/scroll-view";
import { Spinner } from "@/components/ui/spinner";
import {
  UserPlus,
  Mail,
  Lock,
  ArrowLeft,
  User,
  Github,
} from "lucide-react-native";
import { useSession } from "@/context/auth";
import { useAppToast } from "@/lib/toast-utils";
import { GoogleIcon } from "@/assets/ico/google-icon";
import { AppleIcon } from "@/assets/ico/apple-icon";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const {
    signUp,
    signInWithGitHub,
    signInWithGoogle,
    signInWithApple,
    isGoogleProcessing,
    session,
  } = useSession();
  const { showError, showSuccess } = useAppToast();

  // Show success message when Google OAuth completes
  useEffect(() => {
    if (session && isGoogleProcessing === false && googleLoading === false) {
      // This means we just completed Google OAuth
      showSuccess("Welcome!", "You have successfully signed up with Google.");
    }
  }, [session, isGoogleProcessing, googleLoading]);

  async function handleSignUp() {
    // Debounce: Prevent rapid multiple submissions
    const now = Date.now();
    if (now - lastSubmitTime < 2000) {
      // 2 second debounce
      console.log("Ignoring rapid button press");
      return;
    }
    setLastSubmitTime(now);

    // Prevent double submission
    if (loading) {
      console.log("Sign up already in progress, ignoring duplicate request");
      return;
    }

    // Validation
    if (!email.trim()) {
      showError("Email Required", "Please enter your email address");
      return;
    }

    if (!fullName.trim()) {
      showError("Name Required", "Please enter your full name");
      return;
    }

    if (!password.trim()) {
      showError("Password Required", "Please enter a password");
      return;
    }

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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError("Invalid Email", "Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      console.log("Starting sign up process for:", email);

      const { error, session } = await signUp(email, password, fullName);

      console.log("Sign up response:", {
        hasError: !!error,
        errorMessage: error?.message,
        hasSession: !!session,
      });

      if (error) {
        console.error("Sign up error:", error);
        showError(
          "Sign Up Error",
          error.message || "An unexpected error occurred"
        );
      } else {
        console.log("Sign up successful, navigating to verify-email");
        showSuccess(
          "Account Created!",
          "Please check your email to verify your account."
        );

        // Use InteractionManager to ensure smooth navigation
        InteractionManager.runAfterInteractions(() => {
          // Small delay to ensure state is updated
          setTimeout(() => {
            router.push("/verify-email" as any);
            setTimeout(() => router.setParams({ email }), 100);
          }, 100);
        });
      }
    } catch (error) {
      console.error("Unexpected sign up error:", error);
      showError(
        "Sign Up Error",
        "An unexpected error occurred. Please try again."
      );
    } finally {
      // Add a small delay before re-enabling the button to prevent rapid double-clicks
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }

  async function handleGitHubSignUp() {
    setGithubLoading(true);
    try {
      const { error } = await signInWithGitHub();

      if (error) {
        showError(
          "GitHub Sign Up Error",
          error.message || "Failed to sign up with GitHub"
        );
      }
    } catch (error) {
      showError(
        "GitHub Sign Up Error",
        "An unexpected error occurred with GitHub sign up"
      );
    } finally {
      setGithubLoading(false);
    }
  }

  async function handleGoogleSignUp() {
    setGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();

      if (error) {
        showError(
          "Google Sign Up Error",
          error.message || "Failed to sign up with Google"
        );
      }
    } catch (error) {
      showError(
        "Google Sign Up Error",
        "An unexpected error occurred with Google sign up"
      );
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleAppleSignUp() {
    if (Platform.OS !== "ios") {
      showError(
        "Apple Sign Up Error",
        "Apple Sign In is only available on iOS devices"
      );
      return;
    }

    setAppleLoading(true);
    try {
      const { error } = await signInWithApple();

      if (error) {
        if (error.message === "Apple Sign In was cancelled") {
          // Don't show error for user cancellation
          return;
        }
        showError(
          "Apple Sign Up Error",
          error.message || "Failed to sign up with Apple"
        );
      } else {
        showSuccess("Welcome!", "You have successfully signed up with Apple.");
      }
    } catch (error) {
      showError(
        "Apple Sign Up Error",
        "An unexpected error occurred with Apple sign up"
      );
    } finally {
      setAppleLoading(false);
    }
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
              <ButtonIcon as={ArrowLeft} size="sm" className="text-[#333333]" />
              <ButtonText className="text-[#333333] font-bold tracking-wide">
                Go Back
              </ButtonText>
            </Button>
          </HStack>

          <Box className="flex-1 justify-center">
            <VStack space="md" className="items-center">
              {/* Header */}
              <VStack space="md" className="items-center mb-2">
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
                    Join the Network
                  </Heading>
                  <Text
                    size="lg"
                    className="text-[#333333] text-center font-semibold tracking-wide"
                  >
                    Start making a difference in climate research
                  </Text>
                </VStack>
              </VStack>

              {/* Sign Up Card */}
              <Card className="w-full max-w-sm p-8">
                <VStack space="lg" className="items-center">
                  <VStack space="md" className="items-center">
                    <Heading
                      size="lg"
                      className="text-[#333333] font-extrabold tracking-wider"
                      retro
                    >
                      Mission 1.5
                    </Heading>
                    <Text
                      size="sm"
                      className="text-[#333333] text-center font-semibold tracking-wide"
                    >
                      Create your account to start contributing to climate
                      science
                    </Text>
                  </VStack>

                  {/* Full Name Input */}
                  <VStack space="xs" className="w-full">
                    <Text
                      size="sm"
                      className="text-[#333333] font-bold tracking-wide"
                    >
                      Full Name
                    </Text>
                    <Input className="w-full" key="fullname-input">
                      <InputIcon as={User} className="ml-3" />
                      <InputField
                        testID="fullname-field"
                        placeholder="Your full name"
                        value={fullName}
                        onChangeText={setFullName}
                        autoCapitalize="words"
                        textContentType="name"
                        autoComplete="name"
                      />
                    </Input>
                  </VStack>

                  {/* Email Input */}
                  <VStack space="xs" className="w-full">
                    <Text
                      size="sm"
                      className="text-[#333333] font-bold tracking-wide"
                    >
                      Email
                    </Text>
                    <Input className="w-full" key="email-input">
                      <InputIcon as={Mail} className="ml-3" />
                      <InputField
                        testID="email-field"
                        placeholder="email@address.com"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        autoComplete="email"
                      />
                    </Input>
                  </VStack>

                  {/* Password Input */}
                  <VStack space="xs" className="w-full">
                    <Text
                      size="sm"
                      className="text-[#333333] font-bold tracking-wide"
                    >
                      Password
                    </Text>
                    <Input className="w-full" key="password-input">
                      <InputIcon as={Lock} className="ml-3" />
                      <InputField
                        testID="password-field"
                        placeholder="Password (min. 6 characters)"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                        autoCapitalize="none"
                        textContentType="newPassword"
                        autoComplete="new-password"
                      />
                    </Input>
                  </VStack>

                  {/* Confirm Password Input */}
                  <VStack space="xs" className="w-full">
                    <Text
                      size="sm"
                      className="text-[#333333] font-bold tracking-wide"
                    >
                      Confirm Password
                    </Text>
                    <Input className="w-full" key="confirm-password-input">
                      <InputIcon as={Lock} className="ml-3" />
                      <InputField
                        testID="confirm-password-field"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={true}
                        autoCapitalize="none"
                        textContentType="none"
                        autoComplete="off"
                      />
                    </Input>
                  </VStack>

                  {/* Sign Up Button */}
                  <Button
                    variant="solid"
                    action="primary"
                    size="lg"
                    className="w-full"
                    disabled={
                      loading ||
                      githubLoading ||
                      googleLoading ||
                      appleLoading ||
                      isGoogleProcessing ||
                      !email.trim() ||
                      !fullName.trim() ||
                      !password.trim() ||
                      !confirmPassword.trim()
                    }
                    onPress={handleSignUp}
                  >
                    <HStack space="md" className="items-center justify-center">
                      {loading ? (
                        <Spinner size="small" color="white" />
                      ) : (
                        <Icon
                          as={UserPlus}
                          size="md"
                          className="text-[#333333]"
                        />
                      )}
                      <Text size="lg" className="text-[#333333] font-semibold">
                        {loading ? "Creating Account..." : "Create Account"}
                      </Text>
                    </HStack>
                  </Button>

                  {/* Divider */}
                  <HStack className="items-center w-full">
                    <Box className="flex-1 h-px bg-outline-300 dark:bg-outline-600" />
                    <Text
                      size="sm"
                      className="px-4 text-[#333333] font-semibold tracking-wide"
                    >
                      or
                    </Text>
                    <Box className="flex-1 h-px bg-outline-300 dark:bg-outline-600" />
                  </HStack>

                  {/* Google OAuth Button */}
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    disabled={
                      loading ||
                      githubLoading ||
                      googleLoading ||
                      appleLoading ||
                      isGoogleProcessing
                    }
                    onPress={handleGoogleSignUp}
                  >
                    <HStack space="md" className="items-center justify-center">
                      <GoogleIcon size={20} />
                      <Text
                        size="lg"
                        className="text-[#333333] font-semibold tracking-wide"
                      >
                        {googleLoading || isGoogleProcessing
                          ? isGoogleProcessing
                            ? "Processing..."
                            : "Connecting..."
                          : "Continue with Google"}
                      </Text>
                    </HStack>
                  </Button>

                  {/* Apple OAuth Button (iOS only) */}
                  {Platform.OS === "ios" && (
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      disabled={
                        loading ||
                        githubLoading ||
                        googleLoading ||
                        appleLoading ||
                        isGoogleProcessing
                      }
                      onPress={handleAppleSignUp}
                    >
                      <HStack space="md" className="items-center justify-center">
                        {appleLoading ? (
                          <Spinner size="small" />
                        ) : (
                          <AppleIcon size={20} color="#6B7280" />
                        )}
                        <Text
                          size="lg"
                          className="text-[#333333] font-semibold tracking-wide"
                        >
                          {appleLoading
                            ? "Connecting..."
                            : "Continue with Apple"}
                        </Text>
                      </HStack>
                    </Button>
                  )}

                  {/* GitHub OAuth Button */}
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    disabled={
                      loading ||
                      githubLoading ||
                      googleLoading ||
                      appleLoading ||
                      isGoogleProcessing
                    }
                    onPress={handleGitHubSignUp}
                  >
                    <HStack space="md" className="items-center justify-center">
                      <Icon
                        as={Github}
                        size="md"
                        className="text-typography-600 dark:text-typography-400"
                      />
                      <Text size="lg" className="text-[#333333] font-semibold">
                        {githubLoading
                          ? "Connecting..."
                          : "Continue with GitHub"}
                      </Text>
                    </HStack>
                  </Button>

                  {/* Sign In Link */}
                  <VStack space="xs" className="items-center">
                    <Text size="lg" className="text-[#333333]">
                      Already have an account?
                    </Text>
                    <Button
                      variant="link"
                      size="sm"
                      onPress={() => router.push("/sign-in")}
                    >
                      <Text
                        size="lg"
                        className="text-primary-500 font-bold tracking-wide"
                      >
                        Sign In
                      </Text>
                    </Button>
                  </VStack>

                  <VStack space="xs" className="items-center">
                    <Text size="md" className="text-[#666666] text-center">
                      By creating an account, you agree to our Terms of Service
                      and Privacy Policy
                    </Text>
                  </VStack>
                </VStack>
              </Card>

              {/* Benefits */}
              <VStack space="md" className="w-full max-w-sm">
                <Text
                  size="lg"
                  className="text-[#333333] text-center font-semibold"
                >
                  Join thousands of climate enthusiasts:
                </Text>
                <VStack space="xs">
                  <HStack space="md" className="items-center">
                    <Box className="w-2 h-2 bg-green-500 rounded-full" />
                    <Text size="md" className="text-[#333333]">
                      Contribute to real climate research
                    </Text>
                  </HStack>
                  <HStack space="md" className="items-center">
                    <Box className="w-2 h-2 bg-blue-500 rounded-full" />
                    <Text size="md" className="text-[#333333]">
                      Access exclusive missions and data
                    </Text>
                  </HStack>
                  <HStack space="md" className="items-center">
                    <Box className="w-2 h-2 bg-purple-500 rounded-full" />
                    <Text size="md" className="text-[#333333]">
                      Earn recognition for your contributions
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </VStack>
          </Box>
        </Box>
      </ScrollView>

      {/* Google Processing Overlay */}
      {isGoogleProcessing && (
        <Box className="absolute inset-0 bg-black/50 flex-1 justify-center items-center">
          <Card className="p-8 m-6">
            <VStack space="lg" className="items-center">
              <Spinner size="large" />
              <VStack space="xs" className="items-center">
                <Heading size="md" className="text-[#333333]" retro={true}>
                  Completing Sign Up
                </Heading>
                <Text size="md" className="text-[#666666] text-center">
                  Securely connecting your Google account...
                </Text>
              </VStack>
            </VStack>
          </Card>
        </Box>
      )}
    </SafeAreaView>
  );
}
