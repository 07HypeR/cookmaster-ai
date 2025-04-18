import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import GlobalApi from "@/services/GlobalApi";
import RecipeCardHome from "./RecipeCardHome";

const LatestRecipes = () => {
  const [recipeList, setRecipeList] = useState();

  useEffect(() => {
    GetAllLatestRecipe();
  }, []);

  const GetAllLatestRecipe = async () => {
    const result = await GlobalApi.GetAllRecipesByLimit(10);
    console.log(result.data.data);
    setRecipeList(result.data.data);
  };
  return (
    <View
      style={{
        marginTop: 20,
      }}
    >
      <Text style={{ fontSize: 20, fontFamily: "outfit-bold" }}>
        Latest Recipes
      </Text>

      <FlatList
        data={recipeList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }: any) => (
          <View>
            <RecipeCardHome recipe={item} />
          </View>
        )}
      />
    </View>
  );
};

export default LatestRecipes;

const styles = StyleSheet.create({});
