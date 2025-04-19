import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Colors from "@/services/Colors";
import GlobalApi from "@/services/GlobalApi";
import { UserContext } from "@/context/UserContext";
import RecipeCard from "@/components/RecipeCard";

const Cookbook = () => {
  const { user } = useContext(UserContext);
  const [recipeList, setRecipeList] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetUserRecipeList();
  }, []);

  const GetUserRecipeList = async () => {
    const result = await GlobalApi.GetUserCreatedRecipe(user?.email);
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
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 35,
        }}
      >
        Cookbook
      </Text>
      <FlatList
        data={recipeList}
        numColumns={2}
        refreshing={loading}
        onRefresh={GetUserRecipeList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={{ flex: 1 }}>
            <RecipeCard recipe={item} />
          </View>
        )}
      />
    </View>
  );
};

export default Cookbook;

const styles = StyleSheet.create({});
