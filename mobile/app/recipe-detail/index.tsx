import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import RecipeIntro from "@/components/RecipeIntro";
import Colors from "@/shared/Colors";
import Ingredient from "@/components/Ingredient";
import RecipeSteps from "@/components/RecipeSteps";
import CreateRecipe from "@/components/CreateRecipe";
import Ionicons from "@expo/vector-icons/Ionicons";
import RecipeService from "@/services/RecipeService";

interface Recipe {
  id: number;
  recipe_name: string;
  description: string;
  ingredients: any[];
  steps: any[];
  calories: number;
  cook_time: number;
  serve_to: number;
  image_prompt: string;
  category: string;
  recipe_image: string;
  user_email: string;
  likes: number;
  created_at: string;
  updated_at: string;
}

const RecipeDetail = () => {
  const { recipeId, recipeData, source, categoryName } = useLocalSearchParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError(null);

        // If recipeId is provided, fetch from database
        if (recipeId) {
          const result = await RecipeService.getRecipeById(recipeId as string);
          if (result.data) {
            setRecipe(result.data);
          } else if (result.error) {
            setError(result.error);
          }
        }
        // If recipeData is provided (fallback for existing functionality)
        else if (recipeData) {
          const parsedRecipe = JSON.parse(recipeData as string);
          setRecipe(parsedRecipe);
        } else {
          setError("No recipe ID or data provided");
        }
      } catch (err) {
        console.error("Error fetching recipe:", err);
        setError("Failed to load recipe");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId, recipeData]);

  const handleBackPress = () => {
    if (source === "category" && categoryName) {
      router.push({
        pathname: "/recipe-by-category",
        params: {
          categoryName: categoryName as string,
        },
      });
    } else if (source === "explore") {
      router.push("/(tabs)/explore");
    } else if (source === "myRecipes") {
      router.push("/(tabs)/cookbook");
    } else if (source === "savedRecipes") {
      router.push("/(tabs)/cookbook");
    } else {
      router.back();
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.background,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 50,
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text
          style={{
            marginTop: 16,
            fontFamily: "outfit",
            fontSize: 16,
            color: Colors.textLight,
          }}
        >
          Loading recipe...
        </Text>
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.background,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 50,
        }}
      >
        <Ionicons name="alert-circle" size={48} color={Colors.error} />
        <Text
          style={{
            marginTop: 16,
            fontFamily: "outfit",
            fontSize: 18,
            color: Colors.text,
            textAlign: "center",
            marginHorizontal: 20,
          }}
        >
          {error || "Recipe not found"}
        </Text>
        <TouchableOpacity
          style={{
            marginTop: 20,
            paddingHorizontal: 24,
            paddingVertical: 12,
            backgroundColor: Colors.primary,
            borderRadius: 12,
          }}
          onPress={handleBackPress}
        >
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 16,
              color: Colors.white,
            }}
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <FlatList
        data={[]}
        renderItem={() => null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          backgroundColor: Colors.background,
          paddingBottom: 120,
        }}
        ListHeaderComponent={
          <View
            style={{
              padding: 20,
              backgroundColor: Colors.background,
              height: "100%",
              paddingTop: 50,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 20,
                gap: 10,
              }}
            >
              {/* Back Button */}
              <TouchableOpacity
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: Colors.secondary,
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: Colors.shadow,
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.15,
                  shadowRadius: 3,
                  elevation: 3,
                  borderWidth: 1,
                  borderColor: Colors.border,
                }}
                onPress={handleBackPress}
                activeOpacity={0.6}
              >
                <Ionicons name="arrow-back" size={24} color={Colors.text} />
              </TouchableOpacity>
              <Text
                style={{
                  fontFamily: "outfit",
                  fontSize: 16,
                  color: Colors.text,
                  fontWeight: "500",
                }}
              >
                {source === "category"
                  ? `Back to ${categoryName}`
                  : source === "explore"
                  ? "Back to Explore"
                  : source === "myRecipes"
                  ? "Back to My Recipes"
                  : source === "savedRecipes"
                  ? "Back to Saved Recipes"
                  : "Back to Home"}
              </Text>
            </View>

            <RecipeIntro recipe={recipe} />
            <Ingredient ingredients={recipe?.ingredients} />
            <RecipeSteps steps={recipe.steps} />

            <Text
              style={{
                marginTop: 15,
                fontFamily: "outfit",
                fontSize: 16,
                textAlign: "center",
                color: Colors.gray,
              }}
            >
              You are looking something else, Create A New One
            </Text>
            <CreateRecipe />
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
};

export default RecipeDetail;
