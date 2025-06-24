import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, Alert, AppState } from "react-native";
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
import { UserPlus, Mail, Lock, ArrowLeft } from "lucide-react-native";
import { useSession } from "@/context/ctx";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useSession();

  async function handleSignUp() {
    if (password !== confirmPassword) {
      Alert.alert("Password Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Password Error",
        "Password must be at least 6 characters long"
      );
      return;
    }

    setLoading(true);
    const { error, session } = await signUp(email, password);

    if (error) {
      Alert.alert("Sign Up Error", error.message);
    } else {
      // Always show email verification message since session won't be created until confirmed
      Alert.alert(
        "Check Your Email",
        "We've sent you a confirmation email. Please click the link in your email to activate your account.",
        [
          {
            text: "OK",
            onPress: () => router.push("/sign-in"),
          },
        ]
      );
    }
    setLoading(false);
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
                <Box className="p-4 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                  <Icon as={UserPlus} size="xl" className="text-primary-500" />
                </Box>
                <VStack space="xs" className="items-center">
                  <Heading
                    size="2xl"
                    className="text-typography-900 dark:text-typography-950 text-center"
                  >
                    Join the Network
                  </Heading>
                  <Text
                    size="lg"
                    className="text-typography-600 dark:text-typography-750 text-center"
                  >
                    Start making a difference in climate research
                  </Text>
                </VStack>
              </VStack>

              {/* Sign Up Card */}
              <Card className="w-full max-w-sm p-8">
                <VStack space="lg">
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
                      Create your account to start contributing to climate
                      science
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
                        placeholder="Password (min. 6 characters)"
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
                      Confirm Password
                    </Text>
                    <Input className="w-full">
                      <InputIcon as={Lock} className="ml-3" />
                      <InputField
                        placeholder="Confirm your password"
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
                    action="primary"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                    onPress={handleSignUp}
                  >
                    <HStack space="md" className="items-center">
                      <Icon as={UserPlus} size="md" className="text-white" />
                      <Text size="lg" className="text-white font-semibold">
                        {loading ? "Creating Account..." : "Create Account"}
                      </Text>
                    </HStack>
                  </Button>

                  {/* Sign In Link */}
                  <VStack space="xs" className="items-center">
                    <Text
                      size="sm"
                      className="text-typography-600 dark:text-typography-750"
                    >
                      Already have an account?
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
                        Sign In
                      </Text>
                    </Button>
                  </VStack>

                  <VStack space="xs" className="items-center">
                    <Text
                      size="xs"
                      className="text-typography-500 dark:text-typography-300 text-center"
                    >
                      By creating an account, you agree to our Terms of Service
                      and Privacy Policy
                    </Text>
                  </VStack>
                </VStack>
              </Card>

              {/* Benefits */}
              <VStack space="md" className="w-full max-w-sm">
                <Text
                  size="sm"
                  className="text-typography-600 dark:text-typography-750 text-center font-semibold"
                >
                  Join thousands of climate scientists:
                </Text>
                <VStack space="xs">
                  <HStack space="md" className="items-center">
                    <Box className="w-2 h-2 bg-green-500 rounded-full" />
                    <Text
                      size="sm"
                      className="text-typography-600 dark:text-typography-750"
                    >
                      Contribute to real climate research
                    </Text>
                  </HStack>
                  <HStack space="md" className="items-center">
                    <Box className="w-2 h-2 bg-blue-500 rounded-full" />
                    <Text
                      size="sm"
                      className="text-typography-600 dark:text-typography-750"
                    >
                      Access exclusive missions and data
                    </Text>
                  </HStack>
                  <HStack space="md" className="items-center">
                    <Box className="w-2 h-2 bg-purple-500 rounded-full" />
                    <Text
                      size="sm"
                      className="text-typography-600 dark:text-typography-750"
                    >
                      Earn recognition for your contributions
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </VStack>
          </Box>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
