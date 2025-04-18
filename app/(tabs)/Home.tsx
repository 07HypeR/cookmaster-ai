import { ScrollView, StyleSheet } from "react-native";
import React from "react";
import Colors from "@/services/Colors";
import IntroHeader from "@/components/IntroHeader";
import CreateRecipe from "@/components/CreateRecipe";
import CategoryList from "@/components/CategoryList";

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
      <CategoryList />
    </ScrollView>
  );
};

export default Home;
