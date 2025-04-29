import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Colors from "@/services/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { UserContext } from "@/context/UserContext";
import { useSavedRecipesStore } from "@/services/useSavedRecipesStore";

const RecipeIntro = ({ recipe }: any) => {
  const { user } = useContext(UserContext);
  const { fetchSavedRecipes, isRecipeSaved, saveRecipe, removeRecipe } =
    useSavedRecipesStore();

  useEffect(() => {
    if (user?.email) {
      fetchSavedRecipes(user.email);
    }
  }, [user]);

  const saved = isRecipeSaved(recipe?.documentId);

  const handleToggleSave = async () => {
    if (!user?.email) return;

    try {
      if (saved) {
        await removeRecipe(user.email, recipe.documentId);
        Alert.alert("Removed", "Recipe removed from your cookbook.");
      } else {
        await saveRecipe(user.email, recipe.documentId);
        Alert.alert("Saved", "Recipe saved to your cookbook.");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong.");
    }
  };
  return (
    <View>
      <Image
        source={{ uri: recipe?.recipeImage }}
        style={{
          width: "100%",
          height: 240,
          borderRadius: 20,
        }}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "outfit",
            fontSize: 25,
            marginTop: 7,
          }}
        >
          {recipe.recipeName}
        </Text>
        <TouchableOpacity onPress={handleToggleSave}>
          {!saved ? (
            <Ionicons name="bookmark-outline" size={24} color="#000" />
          ) : (
            <Ionicons name="bookmark" size={24} color={Colors.PRIMARY} />
          )}
        </TouchableOpacity>
      </View>
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 20,
          marginTop: 7,
        }}
      >
        Description
      </Text>
      <Text
        style={{
          fontFamily: "outfit",
          fontSize: 17,
          marginTop: 3,
          color: Colors.GRAY,
        }}
      >
        {recipe.description}
      </Text>
      <View
        style={{
          marginTop: 15,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 6,
        }}
      >
        <View style={styles.featureContainer}>
          <Ionicons name="leaf" size={18} color={Colors.PRIMARY} />
          <View>
            <Text style={styles.mainText}>{recipe?.calories} Cal</Text>
            <Text>Calories</Text>
          </View>
        </View>
        <View style={styles.featureContainer}>
          <Ionicons name="timer" size={18} color={Colors.PRIMARY} />
          <View>
            <Text style={styles.mainText}>{recipe?.cookTime} Min</Text>
            <Text>Time</Text>
          </View>
        </View>
        <View style={styles.featureContainer}>
          <Ionicons name="people" size={18} color={Colors.PRIMARY} />
          <View>
            <Text style={styles.mainText}>{recipe?.serveTo} Serve</Text>
            <Text>Serve</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RecipeIntro;

const styles = StyleSheet.create({
  featureContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    padding: 15,
    backgroundColor: Colors.SECONDARY,
    borderRadius: 15,
  },
  mainText: {
    fontFamily: "outfit",
    fontSize: 18,
    color: Colors.PRIMARY,
  },
});
