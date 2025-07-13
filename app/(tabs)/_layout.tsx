import { Image, StyleSheet } from "react-native";
import React from "react";
import { Redirect, Tabs } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

const TabLayout = () => {
  const { isSignedIn } = useAuth();
  if (!isSignedIn) return <Redirect href={"/"} />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require("./../../assets/images/i1.png")}
              style={{
                width: size,
                height: size,
                opacity: focused ? 1 : 0.4,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Explore"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require("./../../assets/images/i2.png")}
              style={{
                width: size,
                height: size,
                opacity: focused ? 1 : 0.4,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Cookbook"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require("./../../assets/images/i3.png")}
              style={{
                width: size,
                height: size,
                opacity: focused ? 1 : 0.4,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require("./../../assets/images/i4.png")}
              style={{
                width: size,
                height: size,
                opacity: focused ? 1 : 0.4,
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
