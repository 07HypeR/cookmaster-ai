import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "@/services/Colors";
import IntroHeader from "@/components/IntroHeader";
import CreateRecipe from "@/components/CreateRecipe";

const Home = () => {
  return (
    <ScrollView
      style={{
        height: "100%",
        backgroundColor: Colors.WHITE,
        padding: 20,
      }}
    >
      {/* Intro */}
      <IntroHeader />

      {/* Recipe Generator UI */}
      <CreateRecipe />
      {/* Category */}
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({});
