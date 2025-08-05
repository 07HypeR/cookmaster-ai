import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  StatusBar,
  Animated,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import RecipeIntro from "@/components/RecipeIntro";
import Colors from "@/shared/Colors";
import Ingredient from "@/components/Ingredient";
import RecipeSteps from "@/components/RecipeSteps";
import CreateRecipe from "@/components/CreateRecipe";
import Ionicons from "@expo/vector-icons/Ionicons";
import RecipeService from "@/services/RecipeService";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

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
  const insets = useSafeAreaInsets();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

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

  // Start entrance animations when component mounts
  useEffect(() => {
    if (!loading && !error) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading, error]);

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
      <View style={styles.loadingContainer}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.background}
        />
        <View style={styles.loadingContent}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading recipe...</Text>
          </View>
        </View>
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.background}
        />
        <View style={styles.errorContent}>
          <View style={styles.errorCard}>
            <View style={styles.errorIconContainer}>
              <LinearGradient
                colors={["#FF6B6B", "#FF5252"] as [string, string]}
                style={styles.errorIconGradient}
              >
                <Ionicons name="alert-circle" size={32} color={Colors.white} />
              </LinearGradient>
            </View>
            <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
            <Text style={styles.errorMessage}>
              {error || "Recipe not found"}
            </Text>
            <TouchableOpacity
              style={styles.errorButton}
              onPress={handleBackPress}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#4CAF50", "#2E7D32"] as [string, string]}
                style={styles.errorButtonGradient}
              >
                <Ionicons name="arrow-back" size={20} color={Colors.white} />
                <Text style={styles.errorButtonText}>Go Back</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <FlatList
        data={[]}
        renderItem={() => null}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        contentContainerStyle={styles.flatListContent}
        ListHeaderComponent={
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            {/* Header Section */}
            <View style={styles.headerSection}>
              <View style={styles.headerContent}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBackPress}
                  activeOpacity={0.6}
                >
                  <LinearGradient
                    colors={["#4CAF50", "#2E7D32"] as [string, string]}
                    style={styles.backButtonGradient}
                  >
                    <Ionicons
                      name="arrow-back"
                      size={24}
                      color={Colors.white}
                    />
                  </LinearGradient>
                </TouchableOpacity>
                <View style={styles.headerText}>
                  <Text style={styles.headerTitle}>Recipe Details</Text>
                  <Text style={styles.headerSubtitle}>
                    {source === "category"
                      ? `${categoryName} Recipes`
                      : source === "explore"
                      ? "Explore Recipes"
                      : source === "myRecipes"
                      ? "My Recipes"
                      : source === "savedRecipes"
                      ? "Saved Recipes"
                      : "Back to home"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Recipe Content */}
            <View style={styles.recipeContent}>
              <RecipeIntro recipe={recipe} />
              <Ingredient ingredients={recipe?.ingredients} />
              <RecipeSteps steps={recipe.steps} />
            </View>

            {/* Create Recipe Section */}
            <View style={styles.createSection}>
              <View style={styles.createCard}>
                <View style={styles.createIconContainer}>
                  <LinearGradient
                    colors={["#FF6B6B", "#FF5252"] as [string, string]}
                    style={styles.createIconGradient}
                  >
                    <Ionicons name="add" size={24} color={Colors.white} />
                  </LinearGradient>
                </View>
                <View style={styles.createContent}>
                  <Text style={styles.createTitle}>Want something else?</Text>
                  <Text style={styles.createSubtitle}>
                    Create your own amazing recipe
                  </Text>
                </View>
              </View>
              <CreateRecipe />
            </View>
          </Animated.View>
        }
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flatList: {
    backgroundColor: Colors.background,
    paddingTop: 0,
  },
  flatListContent: {
    backgroundColor: Colors.background,
    paddingBottom: 120,
  },
  content: {
    padding: 20,
    backgroundColor: Colors.background,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingCard: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 40,
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  loadingText: {
    marginTop: 16,
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.textLight,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  errorContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorCard: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 40,
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  errorIconContainer: {
    marginBottom: 20,
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  errorIconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: "outfit-bold",
    marginBottom: 8,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: Colors.textLight,
    fontFamily: "outfit",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  errorButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  errorButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  errorButtonText: {
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.white,
    fontWeight: "600",
  },
  headerSection: {
    paddingTop: 45,
    marginBottom: 24,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  backButton: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: "outfit-bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textLight,
    fontFamily: "outfit",
  },
  recipeContent: {
    gap: 20,
  },
  createSection: {
    marginTop: 32,
  },
  createCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  createIconContainer: {
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  createIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  createContent: {
    flex: 1,
  },
  createTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: "outfit-bold",
    marginBottom: 4,
  },
  createSubtitle: {
    fontSize: 14,
    color: Colors.textLight,
    fontFamily: "outfit",
    lineHeight: 18,
  },
});

export default RecipeDetail;
