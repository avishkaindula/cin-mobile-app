import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/i18n/LanguageContext";
import {
  MapPin,
  Thermometer,
  Cloud,
  Wind,
  Droplets,
  Eye,
} from "lucide-react-native";

const MapPage = () => {
  const { t } = useLanguage();

  const climateStations = [
    {
      id: 1,
      name: "Downtown Station",
      distance: "0.5 km",
      temperature: "28°C",
      humidity: "65%",
      windSpeed: "12 km/h",
      status: "active",
    },
    {
      id: 2,
      name: "Park Monitoring Point",
      distance: "1.2 km",
      temperature: "26°C",
      humidity: "70%",
      windSpeed: "8 km/h",
      status: "active",
    },
    {
      id: 3,
      name: "Industrial Zone Sensor",
      distance: "2.8 km",
      temperature: "31°C",
      humidity: "58%",
      windSpeed: "15 km/h",
      status: "offline",
    },
  ];

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      className="bg-white dark:bg-background-dark"
    >
      <ScrollView className="flex-1">
        <Box className="p-6">
          {/* Header */}
          <VStack className="space-y-4 mb-8">
            <HStack className="items-center space-x-3">
              <Icon as={MapPin} size="xl" className="text-primary-500" />
              <VStack>
                <Heading
                  size="xl"
                  className="text-typography-900 dark:text-typography-950"
                >
                  {t("map")}
                </Heading>
                <Text
                  size="sm"
                  className="text-typography-600 dark:text-typography-750"
                >
                  Real-time climate data visualization
                </Text>
              </VStack>
            </HStack>
          </VStack>

          {/* Map Placeholder */}
          <Card className="p-6 mb-6 bg-gray-100 dark:bg-gray-800">
            <VStack className="items-center justify-center h-48 space-y-3">
              <Icon as={MapPin} size="xl" className="text-gray-400" />
              <Text className="text-gray-600 dark:text-gray-400 text-center">
                Interactive Climate Map
              </Text>
              <Text
                size="sm"
                className="text-gray-500 dark:text-gray-500 text-center"
              >
                Tap to view detailed climate data
              </Text>
              <Button variant="outline" size="sm">
                <Text>Open Full Map</Text>
              </Button>
            </VStack>
          </Card>

          {/* Current Location Weather */}
          <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
            <VStack className="space-y-4">
              <HStack className="justify-between items-center">
                <VStack>
                  <Text className="font-semibold text-typography-900 dark:text-typography-950">
                    {t("yourLocation")}
                  </Text>
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750"
                  >
                    São Paulo, Brazil
                  </Text>
                </VStack>
                <Badge variant="solid" action="success">
                  <Text size="xs">Live</Text>
                </Badge>
              </HStack>

              <HStack className="justify-between">
                <VStack className="items-center">
                  <Icon as={Thermometer} size="md" className="text-red-500" />
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750"
                  >
                    Temperature
                  </Text>
                  <Text className="font-bold text-typography-900 dark:text-typography-950">
                    27°C
                  </Text>
                </VStack>
                <VStack className="items-center">
                  <Icon as={Droplets} size="md" className="text-blue-500" />
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750"
                  >
                    Humidity
                  </Text>
                  <Text className="font-bold text-typography-900 dark:text-typography-950">
                    68%
                  </Text>
                </VStack>
                <VStack className="items-center">
                  <Icon as={Wind} size="md" className="text-gray-500" />
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750"
                  >
                    Wind
                  </Text>
                  <Text className="font-bold text-typography-900 dark:text-typography-950">
                    10 km/h
                  </Text>
                </VStack>
                <VStack className="items-center">
                  <Icon as={Eye} size="md" className="text-purple-500" />
                  <Text
                    size="sm"
                    className="text-typography-600 dark:text-typography-750"
                  >
                    Visibility
                  </Text>
                  <Text className="font-bold text-typography-900 dark:text-typography-950">
                    12 km
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Card>

          {/* Nearby Stations */}
          <VStack className="space-y-4 mb-6">
            <Heading
              size="md"
              className="text-typography-900 dark:text-typography-950"
            >
              {t("nearbyStations")}
            </Heading>

            {climateStations.map((station) => (
              <Card key={station.id} className="p-4">
                <VStack className="space-y-3">
                  <HStack className="justify-between items-start">
                    <VStack className="flex-1">
                      <Text className="font-semibold text-typography-900 dark:text-typography-950">
                        {station.name}
                      </Text>
                      <Text
                        size="sm"
                        className="text-typography-600 dark:text-typography-750"
                      >
                        {station.distance} away
                      </Text>
                    </VStack>
                    <Badge
                      variant="solid"
                      action={station.status === "active" ? "success" : "error"}
                    >
                      <Text size="xs">{station.status}</Text>
                    </Badge>
                  </HStack>

                  {station.status === "active" && (
                    <HStack className="justify-between">
                      <VStack className="items-center">
                        <Icon
                          as={Thermometer}
                          size="sm"
                          className="text-red-500"
                        />
                        <Text size="xs" className="text-typography-500">
                          {station.temperature}
                        </Text>
                      </VStack>
                      <VStack className="items-center">
                        <Icon
                          as={Droplets}
                          size="sm"
                          className="text-blue-500"
                        />
                        <Text size="xs" className="text-typography-500">
                          {station.humidity}
                        </Text>
                      </VStack>
                      <VStack className="items-center">
                        <Icon as={Wind} size="sm" className="text-gray-500" />
                        <Text size="xs" className="text-typography-500">
                          {station.windSpeed}
                        </Text>
                      </VStack>
                      <Button size="sm" variant="outline">
                        <Text>View Details</Text>
                      </Button>
                    </HStack>
                  )}
                </VStack>
              </Card>
            ))}
          </VStack>

          {/* Data Contribution */}
          <Card className="p-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <VStack className="space-y-3">
              <HStack className="items-center space-x-2">
                <Icon as={Cloud} size="md" className="text-green-600" />
                <Text className="font-semibold text-green-900 dark:text-green-100">
                  Contribute Data
                </Text>
              </HStack>
              <Text size="sm" className="text-green-800 dark:text-green-200">
                Help improve climate monitoring by sharing observations from
                your location
              </Text>
              <Button size="sm" variant="solid" className="bg-green-600">
                <Text className="text-white">Add Reading</Text>
              </Button>
            </VStack>
          </Card>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MapPage;
