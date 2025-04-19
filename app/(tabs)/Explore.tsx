import { FlatList, Platform, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "@/services/Colors";
import GlobalApi from "@/services/GlobalApi";
import RecipeCard from "@/components/RecipeCard";

const Explore = () => {
  const [recipeList, setRecipeList] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetAllRecipes();
  }, []);

  const GetAllRecipes = async () => {
    const result = await GlobalApi.GetAllRecipeList();
    console.log(result.data.data);
    setRecipeList(result.data.data);
  };
  return (
    <View
      style={{
        padding: 20,
        backgroundColor: Colors.WHITE,
        height: "100%",
      }}
    >
      <View
        style={{
          ...(Platform.OS === "ios" ? { marginVertical: 30 } : {}),
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 30,
          }}
        >
          Explore
        </Text>
        <FlatList
          data={recipeList}
          numColumns={2}
          refreshing={loading}
          onRefresh={GetAllRecipes}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={{ flex: 1 }}>
              <RecipeCard recipe={item} />
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default Explore;
