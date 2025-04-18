import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Colors from "@/services/Colors";
import GlobalApi from "@/services/GlobalApi";
import RecipeCard from "@/components/RecipeCard";
import Ionicons from "@expo/vector-icons/Ionicons";

const RecipeByCategory = () => {
  const { categoryName } = useLocalSearchParams();
  const [recipeList, setRecipeList] = useState();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    GetRecipeListByCategory();
  }, []);

  const GetRecipeListByCategory = async () => {
    setLoading(true);
    const result = await GlobalApi.GetRecipeByCategory(categoryName as string);
    console.log("---", result.data.data);
    setRecipeList(result?.data?.data);
    setLoading(false);
  };

  return (
    <View
      style={{
        padding: 20,
        paddingTop: 55,
        backgroundColor: Colors.WHITE,
        height: "100%",
      }}
    >
      {Platform.OS === "ios" ? (
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Ionicons
            name="arrow-back"
            size={30}
            color="black"
            onPress={() => router.back()}
            style={{
              marginTop: 5,
            }}
          />
          <Text style={{ fontFamily: "outfit-bold", fontSize: 25 }}>
            Browse {categoryName} Recipes
          </Text>
        </View>
      ) : (
        <Text style={{ fontFamily: "outfit-bold", fontSize: 25 }}>
          Browse {categoryName} Recipes
        </Text>
      )}

      <FlatList
        data={recipeList}
        numColumns={2}
        refreshing={loading}
        onRefresh={GetRecipeListByCategory}
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

export default RecipeByCategory;

const styles = StyleSheet.create({});
