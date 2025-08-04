import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useContext, useEffect } from "react";
import Colors from "@/shared/Colors";
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
  }, [user, fetchSavedRecipes]);

  const saved = isRecipeSaved(recipe?.id?.toString() || recipe?.documentId);

  const handleToggleSave = async () => {
    if (!user?.email) return;

    try {
      const recipeId = recipe?.id?.toString() || recipe?.documentId;
      if (saved) {
        await removeRecipe(user.email, recipeId);
        Alert.alert("Removed", "Recipe removed from your cookbook.");
      } else {
        await saveRecipe(user.email, recipeId);
        Alert.alert("Saved", "Recipe saved to your cookbook.");
      }
    } catch {
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: recipe?.recipeImage || recipe?.recipe_image }}
          style={styles.recipeImage}
        />
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleToggleSave}
          activeOpacity={0.8}
        >
          <Ionicons
            name={saved ? "heart" : "heart-outline"}
            size={24}
            color={saved ? Colors.primary : Colors.text}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.recipeName}>
          {recipe.recipeName || recipe.recipe_name}
        </Text>

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{recipe.description}</Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name="leaf" size={20} color={Colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureValue}>{recipe?.calories} Cal</Text>
              <Text style={styles.featureLabel}>Calories</Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name="timer" size={20} color={Colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureValue}>
                {recipe?.cookTime || recipe?.cook_time} Min
              </Text>
              <Text style={styles.featureLabel}>Time</Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={styles.featureIcon}>
              <Ionicons name="people" size={20} color={Colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureValue}>
                {recipe?.serveTo || recipe?.serve_to} Serve
              </Text>
              <Text style={styles.featureLabel}>Serve</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default RecipeIntro;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageContainer: {
    position: "relative",
  },
  recipeImage: {
    width: "100%",
    height: 240,
    borderRadius: 20,
  },
  saveButton: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white + "E6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  content: {
    padding: 20,
  },
  recipeName: {
    fontFamily: "outfit-bold",
    fontSize: 24,
    color: Colors.text,
    marginBottom: 15,
    lineHeight: 30,
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: "outfit-bold",
    fontSize: 18,
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.textLight,
    lineHeight: 22,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  featureCard: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.grayLight,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 80,
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  featureContent: {
    alignItems: "center",
  },
  featureValue: {
    fontFamily: "outfit-bold",
    fontSize: 18,
    color: Colors.text,
    marginBottom: 4,
    textAlign: "center",
  },
  featureLabel: {
    fontFamily: "outfit",
    fontSize: 13,
    color: Colors.textLight,
    textAlign: "center",
  },
});
