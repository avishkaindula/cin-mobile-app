import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, Alert, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { TextareaInput } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Gift,
  Star,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react-native";
import {
  getRewardById,
  getUserAvailablePoints,
  redeemReward,
  Reward,
} from "@/services/rewards";

const RewardDetailPage = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const rewardId = Array.isArray(id) ? id[0] : id;

  const [reward, setReward] = useState<Reward | null>(null);
  const [availablePoints, setAvailablePoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [redemptionNotes, setRedemptionNotes] = useState("");

  useEffect(() => {
    if (rewardId) {
      loadRewardDetails();
    }
  }, [rewardId]);

  const loadRewardDetails = async () => {
    try {
      setLoading(true);

      const [rewardResult, pointsResult] = await Promise.all([
        getRewardById(rewardId),
        getUserAvailablePoints(),
      ]);

      if (rewardResult.error || !rewardResult.data) {
        Alert.alert("Error", rewardResult.error || "Reward not found");
        router.back();
        return;
      }

      if (pointsResult.error || pointsResult.data === null) {
        Alert.alert("Error", pointsResult.error || "Failed to load your points");
        return;
      }

      setReward(rewardResult.data);
      setAvailablePoints(pointsResult.data);
    } catch (error) {
      console.error("Error loading reward details:", error);
      Alert.alert("Error", "Failed to load reward details");
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!reward) return;

    const canAfford = availablePoints >= reward.points_cost;
    const isOutOfStock =
      reward.availability === "limited" &&
      reward.quantity_available !== null &&
      reward.quantity_available <= 0;

    if (!canAfford) {
      Alert.alert(
        "Insufficient Points",
        `You need ${reward.points_cost - availablePoints} more points to redeem this reward.`
      );
      return;
    }

    if (isOutOfStock) {
      Alert.alert("Out of Stock", "This reward is currently out of stock.");
      return;
    }

    Alert.alert(
      "Confirm Redemption",
      `Are you sure you want to redeem "${reward.title}" for ${reward.points_cost} points?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Redeem",
          style: "default",
          onPress: async () => {
            try {
              setRedeeming(true);

              const { success, error } = await redeemReward(
                rewardId,
                redemptionNotes.trim() || undefined
              );

              if (error) {
                Alert.alert("Redemption Failed", error);
                return;
              }

              if (success) {
                Alert.alert(
                  "Redemption Successful! 🎉",
                  "Your redemption request has been submitted. An admin will review it shortly and you'll be notified once approved.",
                  [
                    {
                      text: "OK",
                      onPress: () => router.back(),
                    },
                  ]
                );
              }
            } catch (error) {
              console.error("Error redeeming reward:", error);
              Alert.alert("Error", "Failed to redeem reward. Please try again.");
            } finally {
              setRedeeming(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1 }}
        className="bg-white dark:bg-background-dark"
      >
        <Box className="flex-1 justify-center items-center p-6">
          <Card className="p-8 border-2 border-[#333333] shadow-[4px_4px_0_#333333] bg-[#FCFCFC]">
            <VStack space="md" className="items-center">
              <Image
                source={require("@/assets/icon.png")}
                style={{ width: 48, height: 48 }}
                resizeMode="contain"
              />
              <Text className="text-[#333333] font-semibold tracking-wide">
                Loading reward details...
              </Text>
            </VStack>
          </Card>
        </Box>
      </SafeAreaView>
    );
  }

  if (!reward) {
    return (
      <SafeAreaView style={{ flex: 1 }} className="bg-[#FCFCFC]">
        <Box className="flex-1 justify-center items-center p-6">
          <Text retro className="text-[#333333]">
            Reward not found or failed to load.
          </Text>
          <Button
            onPress={() => router.back()}
            className="mt-4 bg-[#98FB98] border-2 border-[#333333] shadow-[4px_4px_0_#333333]"
          >
            <Text className="text-[#333333] font-bold tracking-wide">Go Back</Text>
          </Button>
        </Box>
      </SafeAreaView>
    );
  }

  const canAfford = availablePoints >= reward.points_cost;
  const isOutOfStock =
    reward.availability === "limited" &&
    reward.quantity_available !== null &&
    reward.quantity_available <= 0;
  const canRedeem = canAfford && !isOutOfStock;

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-[#FCFCFC]">
      {/* Header */}
      <VStack space="lg" className="items-center p-6">
        <Image
          source={require("@/assets/icon.png")}
          style={{ width: 48, height: 48 }}
          resizeMode="contain"
        />
        <Heading retro size="xl" className="text-[#333333] font-bold tracking-wide text-center">
          Reward Details
        </Heading>

        {/* Back Button */}
        <Button
          variant="solid"
          size="sm"
          onPress={() => router.back()}
          className="bg-[#FCFCFC] border-2 border-[#333333] shadow-[2px_2px_0_#333333]"
        >
          <HStack space="sm" className="items-center">
            <Icon as={ArrowLeft} size="sm" className="text-[#333333]" />
            <Text className="text-[#333333] font-bold tracking-wide">Go Back</Text>
          </HStack>
        </Button>
      </VStack>

      <ScrollView className="flex-1 p-6">
        {/* Your Points */}
        <Card className="p-4 mb-6 bg-[#DDA0DD] border-2 border-[#333333] shadow-[4px_4px_0_#333333]">
          <HStack className="justify-between items-center">
            <Text className="font-bold text-[#333333] tracking-wide" retro>
              Your Available Points
            </Text>
            <HStack space="xs" className="items-center">
              <Icon as={Star} size="md" className="text-[#333333]" />
              <Text className="font-bold text-[#333333] text-2xl tracking-wider" retro>
                {availablePoints}
              </Text>
            </HStack>
          </HStack>
        </Card>

        {/* Reward Details */}
        <Card className="p-6 mb-6 bg-[#FCFCFC] border-2 border-[#333333] shadow-[4px_4px_0_#333333]">
          <VStack space="lg">
            {/* Title and Icon */}
            <HStack space="md" className="items-start">
              <Box className="p-4 rounded-lg bg-[#DDA0DD] border-2 border-[#333333] shadow-[2px_2px_0_#333333]">
                <Icon as={Gift} size="xl" className="text-[#333333]" />
              </Box>
              <VStack space="xs" className="flex-1">
                <Heading retro size="lg" className="text-[#333333] font-bold tracking-wide">
                  {reward.title}
                </Heading>
                <HStack space="xs" className="flex-wrap">
                  <Badge className="bg-[#FFE4B5] border-2 border-[#333333] shadow-[2px_2px_0_#333333]">
                    <Text size="xs" className="text-[#333333] font-bold tracking-wide">
                      {reward.type.replace("-", " ").toUpperCase()}
                    </Text>
                  </Badge>
                  <Badge className="bg-[#98FB98] border-2 border-[#333333] shadow-[2px_2px_0_#333333]">
                    <Text size="xs" className="text-[#333333] font-bold tracking-wide">
                      {reward.category.toUpperCase()}
                    </Text>
                  </Badge>
                </HStack>
              </VStack>
            </HStack>

            {/* Description */}
            <VStack space="xs">
              <Text className="font-bold text-[#333333] tracking-wide" retro>
                Description
              </Text>
              <Text size="sm" className="text-[#333333] font-semibold tracking-wide">
                {reward.description}
              </Text>
            </VStack>

            {/* Points Cost & Value */}
            <HStack space="lg" className="justify-between">
              <VStack space="xs" className="flex-1">
                <Text size="sm" className="text-[#333333] font-semibold tracking-wide">
                  Points Cost
                </Text>
                <HStack space="xs" className="items-center">
                  <Icon as={Star} size="md" className="text-[#333333]" />
                  <Text className="font-bold text-[#333333] text-2xl tracking-wider" retro>
                    {reward.points_cost}
                  </Text>
                </HStack>
              </VStack>
              <VStack space="xs" className="flex-1 items-end">
                <Text size="sm" className="text-[#333333] font-semibold tracking-wide">
                  Value
                </Text>
                <Text className="font-bold text-[#333333] text-lg tracking-wide">
                  {reward.value}
                </Text>
              </VStack>
            </HStack>

            {/* Availability */}
            <HStack space="xs" className="items-center">
              <Icon as={Users} size="sm" className="text-[#333333]" />
              <Text size="sm" className="text-[#333333] font-semibold tracking-wide">
                {reward.availability === "unlimited"
                  ? "Unlimited availability"
                  : `${reward.quantity_available} remaining`}
              </Text>
            </HStack>

            {/* Expiry Date */}
            {reward.expiry_date && (
              <HStack space="xs" className="items-center">
                <Icon as={Calendar} size="sm" className="text-[#333333]" />
                <Text size="sm" className="text-[#333333] font-semibold tracking-wide">
                  Expires: {new Date(reward.expiry_date).toLocaleDateString()}
                </Text>
              </HStack>
            )}
          </VStack>
        </Card>

        {/* Status Messages */}
        {!canAfford && (
          <Card className="p-4 mb-6 bg-[#FFB3B3] border-2 border-[#333333] shadow-[4px_4px_0_#333333]">
            <HStack space="md" className="items-center">
              <Icon as={AlertCircle} size="md" className="text-[#333333]" />
              <VStack space="xs" className="flex-1">
                <Text className="font-bold text-[#333333] tracking-wide">
                  Insufficient Points
                </Text>
                <Text size="sm" className="text-[#333333] font-semibold tracking-wide">
                  You need {reward.points_cost - availablePoints} more points to redeem this reward.
                </Text>
              </VStack>
            </HStack>
          </Card>
        )}

        {isOutOfStock && (
          <Card className="p-4 mb-6 bg-[#FFB3B3] border-2 border-[#333333] shadow-[4px_4px_0_#333333]">
            <HStack space="md" className="items-center">
              <Icon as={AlertCircle} size="md" className="text-[#333333]" />
              <Text className="font-bold text-[#333333] tracking-wide">
                This reward is currently out of stock
              </Text>
            </HStack>
          </Card>
        )}

        {/* Redemption Form */}
        {canRedeem && (
          <Card className="p-4 mb-6 bg-[#FCFCFC] border-2 border-[#333333] shadow-[4px_4px_0_#333333]">
            <VStack space="md">
              <Text className="font-bold text-[#333333] tracking-wide" retro>
                Additional Notes (Optional)
              </Text>
              <Text size="sm" className="text-[#333333] font-semibold tracking-wide">
                Add any specific requests or delivery instructions for this reward.
              </Text>
              <Textarea>
                <TextareaInput
                  placeholder="Enter any additional notes here..."
                  value={redemptionNotes}
                  onChangeText={setRedemptionNotes}
                  multiline
                  numberOfLines={4}
                />
              </Textarea>
            </VStack>
          </Card>
        )}

        {/* Redeem Button */}
        <Button
          onPress={handleRedeem}
          disabled={!canRedeem || redeeming}
          className={`mb-8 border-2 border-[#333333] shadow-[4px_4px_0_#333333] ${
            !canRedeem || redeeming ? "bg-[#E0E0E0]" : "bg-[#DDA0DD]"
          }`}
        >
          <HStack space="xs" className="items-center">
            <Icon
              as={canRedeem ? CheckCircle : AlertCircle}
              size="sm"
              className="text-[#333333]"
            />
            <Text className="text-[#333333] font-bold tracking-wide">
              {redeeming
                ? "Processing..."
                : isOutOfStock
                ? "Out of Stock"
                : !canAfford
                ? "Not Enough Points"
                : "Redeem Reward"}
            </Text>
          </HStack>
        </Button>

        {/* Info Box */}
        <Card className="p-4 bg-[#A2D8FF] border-2 border-[#333333] shadow-[4px_4px_0_#333333]">
          <VStack space="xs">
            <Text className="font-bold text-[#333333] tracking-wide">
              How Redemption Works
            </Text>
            <Text size="sm" className="text-[#333333] font-semibold tracking-wide">
              1. Submit your redemption request{"\n"}
              2. An admin will review your request{"\n"}
              3. You'll be notified once approved{"\n"}
              4. Points will be deducted upon approval
            </Text>
          </VStack>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RewardDetailPage;
