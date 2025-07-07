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
import { Input, InputField, InputIcon } from "@/components/ui/input";
import { ScrollView } from "@/components/ui/scroll-view";
import { Spinner } from "@/components/ui/spinner";
import { UserPlus, Mail, Lock, User, Github } from "lucide-react-native";
import { GoogleIcon } from "@/assets/ico/google-icon";
import { useSession } from "@/context/auth";
import { useAppToast } from "@/lib/toast-utils";

export default function SignUpScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const {
    signUp,
    signInWithGitHub,
    signInWithGoogle,
    isGoogleProcessing,
    session,
  } = useSession();
  const { showError, showSuccess } = useAppToast();

  // Show success message when Google OAuth completes
  useEffect(() => {
    if (session && isGoogleProcessing === false && googleLoading === false) {
      showSuccess("Welcome!", "You have successfully signed up with Google.");
    }
  }, [session, isGoogleProcessing, googleLoading]);

  async function handleSignUp() {
    // Basic validation
    if (!email.trim() || !fullName.trim() || !password.trim()) {
      showError("Missing Fields", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      showError("Password Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        showError("Sign Up Error!", error.message);
      } else {
        showSuccess("Account Created!", "Welcome to Climate Intelligence Network!");
      }
    } catch (error) {
      showError("Sign Up Error", "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignUp() {
    setGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        showError("Google Sign Up Error!", error.message || "Failed to sign up with Google");
      }
    } catch (error) {
      showError("Google Sign Up Error", "An unexpected error occurred with Google sign up");
    } finally {
      setGoogleLoading(false);
    }
  }

  async function handleGitHubSignUp() {
    setGithubLoading(true);
    const { error } = await signInWithGitHub();
    if (error) {
      showError("GitHub Sign Up Error!", error.message);
    } else {
      showSuccess("GitHub Connected!", "You have successfully signed up with GitHub.");
    }
    setGithubLoading(false);
  }

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="bg-gradient-to-br from-green-100 via-blue-100 to-purple-100"
    >
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <Box className="flex-1 justify-center p-6">
          <VStack space="xl" className="items-center">
            <VStack space="lg" className="items-center mb-8">
              <Box className="p-6 bg-gradient-to-br from-green-200 to-blue-300 rounded-full shadow-xl border-4 border-green-400 transform -rotate-3">
                <Icon as={UserPlus} size="xl" className="text-blue-600" />
              </Box>
              <VStack space="xs" className="items-center">
                <Heading
                  size="2xl"
                  className="text-center font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
                >
                  🌟 Join the Climate Heroes! 🌍
                </Heading>
                <Text
                  size="lg"
                  className="text-green-600 text-center font-semibold"
                >
                  Let's save our planet together! 🚀🌱
                </Text>
              </VStack>
            </VStack>

            {/* Sign Up Card */}
            <Card className="w-full max-w-sm p-8" variant="elevated">
              <VStack space="lg" className="items-center">
                <VStack space="md" className="items-center">
                  <Heading
                    size="lg"
                    className="text-green-700 font-black"
                  >
                    🎮 Create Your Hero Account 🦸‍♀️
                  </Heading>
                  <Text
                    size="sm"
                    className="text-green-600 text-center font-medium"
                  >
                    Ready to become a planet-saving superhero? ✨
                  </Text>
                </VStack>

                {/* Full Name Input */}
                <VStack space="xs" className="w-full">
                  <Text size="sm" className="text-green-700 font-bold">
                    🦸‍♂️ Your Hero Name
                  </Text>
                  <Input className="w-full" variant="rounded" size="lg">
                    <InputIcon as={User} className="ml-3" />
                    <InputField
                      placeholder="Your awesome name"
                      value={fullName}
                      onChangeText={setFullName}
                      autoCapitalize="words"
                    />
                  </Input>
                </VStack>

                {/* Email Input */}
                <VStack space="xs" className="w-full">
                  <Text size="sm" className="text-green-700 font-bold">
                    📧 Your Super Email
                  </Text>
                  <Input className="w-full" variant="rounded" size="lg">
                    <InputIcon as={Mail} className="ml-3" />
                    <InputField
                      placeholder="hero@savetheplanet.com"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </Input>
                </VStack>

                {/* Password Input */}
                <VStack space="xs" className="w-full">
                  <Text size="sm" className="text-green-700 font-bold">
                    🔒 Create Secret Code
                  </Text>
                  <Input className="w-full" variant="rounded" size="lg">
                    <InputIcon as={Lock} className="ml-3" />
                    <InputField
                      placeholder="Super secret password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={true}
                      autoCapitalize="none"
                    />
                  </Input>
                </VStack>

                {/* Confirm Password Input */}
                <VStack space="xs" className="w-full">
                  <Text size="sm" className="text-green-700 font-bold">
                    🔐 Confirm Secret Code
                  </Text>
                  <Input className="w-full" variant="rounded" size="lg">
                    <InputIcon as={Lock} className="ml-3" />
                    <InputField
                      placeholder="Type it again!"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={true}
                      autoCapitalize="none"
                    />
                  </Input>
                </VStack>

                {/* Sign Up Button */}
                <Button
                  variant="solid"
                  action="positive"
                  size="lg"
                  className="w-full"
                  disabled={
                    loading ||
                    githubLoading ||
                    googleLoading ||
                    isGoogleProcessing ||
                    !email.trim() ||
                    !fullName.trim() ||
                    !password.trim() ||
                    !confirmPassword.trim()
                  }
                  onPress={handleSignUp}
                >
                  <HStack space="md" className="items-center">
                    {loading ? (
                      <Spinner size="small" color="white" />
                    ) : (
                      <Icon as={UserPlus} size="md" className="text-white" />
                    )}
                    <Text size="lg" className="text-white font-black">
                      {loading ? "🚀 Creating Hero Account..." : "🌟 Become a Climate Hero!"}
                    </Text>
                  </HStack>
                </Button>

                {/* Divider */}
                <HStack className="items-center w-full">
                  <Box className="flex-1 h-1 bg-gradient-to-r from-green-300 to-blue-300 rounded-full" />
                  <Text size="sm" className="px-4 text-green-500 font-bold">
                    ✨ or ✨
                  </Text>
                  <Box className="flex-1 h-1 bg-gradient-to-r from-blue-300 to-green-300 rounded-full" />
                </HStack>

                {/* Google OAuth Button */}
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  disabled={loading || githubLoading || googleLoading || isGoogleProcessing}
                  onPress={handleGoogleSignUp}
                >
                  <HStack space="md" className="items-center">
                    <GoogleIcon size={24} />
                    <Text size="lg" className="text-blue-600 font-bold">
                      {googleLoading || isGoogleProcessing
                        ? isGoogleProcessing
                          ? "🔄 Processing..."
                          : "🚀 Connecting..."
                        : "🎉 Join with Google"}
                    </Text>
                  </HStack>
                </Button>

                {/* GitHub OAuth Button */}
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  disabled={loading || githubLoading || googleLoading}
                  onPress={handleGitHubSignUp}
                >
                  <HStack space="md" className="items-center">
                    <Icon as={Github} size="md" className="text-gray-700" />
                    <Text size="lg" className="text-gray-700 font-bold">
                      {githubLoading ? "🔄 Connecting..." : "🐙 Join with GitHub"}
                    </Text>
                  </HStack>
                </Button>

                {/* Sign In Link */}
                <VStack space="xs" className="items-center">
                  <Text size="sm" className="text-green-600 font-medium">
                    Already a climate hero? 🦸‍♀️🦸‍♂️
                  </Text>
                  <Button
                    variant="link"
                    size="sm"
                    onPress={() => router.push("/sign-in")}
                  >
                    <Text size="sm" className="text-blue-500 font-bold">
                      🌟 Continue Your Adventure!
                    </Text>
                  </Button>
                </VStack>

                <VStack space="xs" className="items-center">
                  <Text size="xs" className="text-green-500 text-center font-medium">
                    By joining, you agree to help save our amazing planet! 🌎💙
                  </Text>
                </VStack>
              </VStack>
            </Card>
          </VStack>
        </Box>
      </ScrollView>

      {/* Google Processing Overlay */}
      {isGoogleProcessing && (
        <Box className="absolute inset-0 bg-green-900/50 flex-1 justify-center items-center">
          <Card className="p-8 m-6" variant="elevated">
            <VStack space="lg" className="items-center">
              <Spinner size="large" />
              <VStack space="xs" className="items-center">
                <Heading size="md" className="text-green-700 font-black">
                  🚀 Almost Ready!
                </Heading>
                <Text size="sm" className="text-green-600 text-center font-medium">
                  Setting up your hero account... ✨
                </Text>
              </VStack>
            </VStack>
          </Card>
        </Box>
      )}
    </SafeAreaView>
  );
}
