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
import { useAppToast } from "@/components/toast-utils";
import { LogIn, Shield, Mail, Lock, Github } from "lucide-react-native";
import { GoogleIcon } from "@/assets/Icons/GoogleIcon";
import { useSession } from "@/context/auth";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn, signInWithGitHub, signInWithGoogle } = useSession();
  const { showError, showSuccess } = useAppToast();

  async function handleSignIn() {
    setLoading(true);
    const { error } = await signIn(email, password);

    if (error) {
      showError("Sign In Error!", error.message);
    } else {
      showSuccess("Welcome Back!", "You have successfully signed in.");
    }

    setLoading(false);
  }

  async function handleGitHubSignIn() {
    setGithubLoading(true);
    const { error } = await signInWithGitHub();

    if (error) {
      showError("GitHub Sign In Error!", error.message);
    } else {
      showSuccess(
        "GitHub Connected!",
        "You have successfully signed in with GitHub."
      );
    }
    setGithubLoading(false);
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    const { error } = await signInWithGoogle();

    if (error) {
      showError("Google Sign In Error!", error.message);
    } else {
      showSuccess(
        "Google Connected!",
        "You have successfully signed in with Google."
      );
    }
    setGoogleLoading(false);
  }

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="bg-white dark:bg-background-dark"
    >
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <Box className="flex-1 justify-center p-6">
          <VStack space="xl" className="items-center">
            <VStack space="lg" className="items-center mb-8">
              <Box className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                <Icon as={Shield} size="xl" className="text-primary-500" />
              </Box>
              <VStack space="xs" className="items-center">
                <Heading
                  size="2xl"
                  className="text-typography-900 dark:text-typography-950 text-center"
                >
                  Welcome Back
                </Heading>
                <Text
                  size="lg"
                  className="text-typography-600 dark:text-typography-750 text-center"
                >
                  Sign in to continue your climate action journey
                </Text>
              </VStack>
            </VStack>

            {/* Sign In Card */}
            <Card className="w-full max-w-sm p-8">
              <VStack space="lg" className="items-center">
                <VStack space="md" className="items-center">
                  <Heading
                    size="lg"
                    className="text-typography-900 dark:text-typography-950"
                  >
                    Climate Intelligence Network
                  </Heading>
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750 text-center"
                  >
                    Join thousands of climate scientists and environmental
                    enthusiasts making a difference
                  </Text>
                </VStack>

                {/* Email Input */}
                <VStack space="xs" className="w-full">
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750"
                  >
                    Email
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

                {/* Password Input */}
                <VStack space="xs" className="w-full">
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750"
                  >
                    Password
                  </Text>
                  <Input className="w-full">
                    <InputIcon as={Lock} className="ml-3" />
                    <InputField
                      placeholder="Password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={true}
                      autoCapitalize="none"
                    />
                  </Input>
                </VStack>

                {/* Sign In Button */}
                <Button
                  variant="solid"
                  action="primary"
                  size="lg"
                  className="w-full"
                  disabled={loading || githubLoading || googleLoading}
                  onPress={handleSignIn}
                >
                  <HStack space="md" className="items-center">
                    <Icon as={LogIn} size="md" className="text-white" />
                    <Text size="lg" className="text-white font-semibold">
                      {loading ? "Signing In..." : "Sign In"}
                    </Text>
                  </HStack>
                </Button>

                {/* Divider */}
                <HStack className="items-center w-full">
                  <Box className="flex-1 h-px bg-outline-300 dark:bg-outline-600" />
                  <Text
                    size="sm"
                    className="px-4 text-typography-500 dark:text-typography-400"
                  >
                    or
                  </Text>
                  <Box className="flex-1 h-px bg-outline-300 dark:bg-outline-600" />
                </HStack>

                {/* GitHub OAuth Button */}
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  disabled={loading || githubLoading || googleLoading}
                  onPress={handleGitHubSignIn}
                >
                  <HStack space="md" className="items-center">
                    <Icon
                      as={Github}
                      size="md"
                      className="text-typography-600 dark:text-typography-400"
                    />
                    <Text
                      size="lg"
                      className="text-typography-600 dark:text-typography-400 font-semibold"
                    >
                      {githubLoading ? "Connecting..." : "Continue with GitHub"}
                    </Text>
                  </HStack>
                </Button>

                {/* Google OAuth Button */}
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  disabled={loading || githubLoading || googleLoading}
                  onPress={handleGoogleSignIn}
                >
                  <HStack space="md" className="items-center">
                    <GoogleIcon size={20} />
                    <Text
                      size="lg"
                      className="text-typography-600 dark:text-typography-400 font-semibold"
                    >
                      {googleLoading ? "Connecting..." : "Continue with Google"}
                    </Text>
                  </HStack>
                </Button>

                {/* Forgot Password Link */}
                <Button
                  variant="link"
                  size="sm"
                  onPress={() => router.push("/forgot-password")}
                >
                  <Text size="sm" className="text-primary-500 font-semibold">
                    Forgot Password?
                  </Text>
                </Button>

                {/* Sign Up Link */}
                <VStack space="xs" className="items-center">
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750"
                  >
                    Don't have an account?
                  </Text>
                  <Button
                    variant="link"
                    size="sm"
                    onPress={() => router.push("/sign-up")}
                  >
                    <Text size="sm" className="text-primary-500 font-semibold">
                      Create Account
                    </Text>
                  </Button>
                </VStack>

                <VStack space="xs" className="items-center">
                  <Text
                    size="xs"
                    className="text-typography-500 dark:text-typography-300 text-center"
                  >
                    By signing in, you agree to our Terms of Service and Privacy
                    Policy
                  </Text>
                </VStack>
              </VStack>
            </Card>

            {/* Features */}
            <VStack space="md" className="w-full max-w-sm">
              <Text
                size="sm"
                className="text-typography-600 dark:text-typography-750 text-center font-semibold"
              >
                What you'll get:
              </Text>
              <VStack space="xs">
                <HStack space="md" className="items-center">
                  <Box className="w-2 h-2 bg-green-500 rounded-full" />
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750"
                  >
                    Access to climate missions and data collection
                  </Text>
                </HStack>
                <HStack space="md" className="items-center">
                  <Box className="w-2 h-2 bg-blue-500 rounded-full" />
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750"
                  >
                    Connect with a global community of researchers
                  </Text>
                </HStack>
                <HStack space="md" className="items-center">
                  <Box className="w-2 h-2 bg-purple-500 rounded-full" />
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750"
                  >
                    Track your environmental impact and achievements
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
