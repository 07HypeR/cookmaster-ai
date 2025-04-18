import { FlatList, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import RecipeIntro from "@/components/RecipeIntro";
import Colors from "@/services/Colors";
import Ingredient from "@/components/Ingredient";
import RecipeSteps from "@/components/RecipeSteps";
import CreateRecipe from "@/components/CreateRecipe";

const RecipeDetail = () => {
  const { recipeData } = useLocalSearchParams();
  const recipe = JSON.parse(recipeData as string);
  return (
    <FlatList
      data={[]}
      renderItem={() => null}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View
          style={{
            padding: 20,
            backgroundColor: Colors.WHITE,
            height: "100%",
          }}
        >
          <RecipeIntro recipe={recipe} />
          <Ingredient ingredients={recipe?.ingredients} />
          <RecipeSteps steps={recipe.steps} />

          <Text
            style={{
              marginTop: 15,
              fontFamily: "outfit",
              fontSize: 16,
              textAlign: "center",
              color: Colors.GRAY,
            }}
          >
            You are looking something else, Create A New One
          </Text>
          <CreateRecipe />
        </View>
      }
    />
  );
};

export default RecipeDetail;
