import { FlatList, Platform, ScrollView, StyleSheet } from "react-native";
import React from "react";
import Colors from "@/services/Colors";
import IntroHeader from "@/components/IntroHeader";
import CreateRecipe from "@/components/CreateRecipe";
import CategoryList from "@/components/CategoryList";
import LatestRecipes from "@/components/LatestRecipes";

const Home = () => {
  return (
    <FlatList
      data={[]}
      renderItem={() => null}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
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

          <LatestRecipes />
        </ScrollView>
      }
    />
  );
};

export default Home;
