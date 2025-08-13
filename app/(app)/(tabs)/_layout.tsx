import { Tabs } from "expo-router";
import React from "react";
import { Home, Zap, MapPin, Users, User } from "lucide-react-native";
import { Platform } from "react-native";
import { useColorScheme } from "nativewind";

function TabBarIcon({
  IconComponent,
  color,
}: {
  IconComponent: any;
  color: string;
}) {
  return <IconComponent size={20} color={color} />;
}

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#059669", // green-600
        tabBarInactiveTintColor: colorScheme === "dark" ? "#9CA3AF" : "#6B7280", // gray-400 for dark, gray-500 for light
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? "#181719" : "#FFFFFF", // match background-dark and white
          borderTopColor: colorScheme === "dark" ? "#2D2D2D" : "#E5E7EB", // darker border for dark mode
          borderTopWidth: 1,
          ...Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
              paddingTop: 8, // Adjust padding for iOS
            },
            default: {
              position: "absolute",
              paddingTop: 8, // Adjust padding for iOS
            },
          }),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <TabBarIcon IconComponent={Home} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="quests"
        options={{
          title: "Quests",
          tabBarIcon: ({ color }) => (
            <TabBarIcon IconComponent={Zap} color={color} />
          ),
          tabBarBadge: "7",
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color }) => (
            <TabBarIcon IconComponent={MapPin} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ color }) => (
            <TabBarIcon IconComponent={Users} color={color} />
          ),
          tabBarBadge: "2",
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <TabBarIcon IconComponent={User} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
