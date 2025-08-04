import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/shared/Colors";
import RecipeService from "@/services/RecipeService";
import UserService from "@/services/UserService";
import CategoryService from "@/services/CategoryService";
import { useUser } from "@clerk/clerk-expo";

interface ResultsState {
  user?: any;
  createUser?: any;
  updateUser?: any;
  userRecipes?: any;
  savedRecipes?: any;
  createRecipe?: any;
  searchRecipes?: any;
  categories?: any;
  createCategory?: any;
}

const DataManagementExample = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResultsState>({});

  // ==================== USER OPERATIONS ====================
  const handleGetUser = async () => {
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      Alert.alert("Error", "No user email available");
      return;
    }

    setLoading(true);
    try {
      const result = await UserService.getUserByEmail(
        user.emailAddresses[0].emailAddress
      );
      setResults((prev) => ({ ...prev, user: result }));

      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        Alert.alert("Success", "User fetched successfully");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch user");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      Alert.alert("Error", "No user email available");
      return;
    }

    setLoading(true);
    try {
      const userData = {
        email: user.emailAddresses[0].emailAddress,
        name: user.fullName || "User",
        picture: user.imageUrl,
      };

      const result = await UserService.createUser(userData);
      setResults((prev) => ({ ...prev, createUser: result }));

      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        Alert.alert("Success", "User created successfully");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      Alert.alert("Error", "No user email available");
      return;
    }

    setLoading(true);
    try {
      // First get the user to get their ID
      const userResult = await UserService.getUserByEmail(
        user.emailAddresses[0].emailAddress
      );

      if (userResult.error || !userResult.data) {
        Alert.alert("Error", "User not found");
        return;
      }

      const updateData = {
        name: "Updated Name",
        credits: 20,
      };

      const result = await UserService.updateUser(
        userResult.data.id,
        updateData
      );
      setResults((prev) => ({ ...prev, updateUser: result }));

      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        Alert.alert("Success", "User updated successfully");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  // ==================== RECIPE OPERATIONS ====================
  const handleGetUserRecipes = async () => {
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      Alert.alert("Error", "No user email available");
      return;
    }

    setLoading(true);
    try {
      const result = await RecipeService.getUserCreatedRecipes(
        user.emailAddresses[0].emailAddress
      );
      setResults((prev) => ({ ...prev, userRecipes: result }));

      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        Alert.alert("Success", `Found ${result.data.length} recipes`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch user recipes");
    } finally {
      setLoading(false);
    }
  };

  const handleGetSavedRecipes = async () => {
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      Alert.alert("Error", "No user email available");
      return;
    }

    setLoading(true);
    try {
      const result = await RecipeService.getUserSavedRecipes(
        user.emailAddresses[0].emailAddress
      );
      setResults((prev) => ({ ...prev, savedRecipes: result }));

      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        Alert.alert("Success", `Found ${result.data.length} saved recipes`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch saved recipes");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRecipe = async () => {
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      Alert.alert("Error", "No user email available");
      return;
    }

    setLoading(true);
    try {
      const recipeData = {
        recipeName: "Test Recipe",
        description: "A test recipe created via API",
        ingredients: ["Ingredient 1", "Ingredient 2"],
        steps: ["Step 1", "Step 2"],
        calories: 300,
        cookTime: 30,
        serveTo: 4,
        imagePrompt: "A delicious test recipe",
        category: "Dinner",
        recipeImage: "https://example.com/image.jpg",
        userEmail: user.emailAddresses[0].emailAddress,
      };

      const result = await RecipeService.createRecipe(recipeData);
      setResults((prev) => ({ ...prev, createRecipe: result }));

      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        Alert.alert("Success", "Recipe created successfully");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create recipe");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchRecipes = async () => {
    setLoading(true);
    try {
      const result = await RecipeService.searchRecipes({
        q: "chicken",
        category: "Dinner",
        sort: "created_at DESC",
      });
      setResults((prev) => ({ ...prev, searchRecipes: result }));

      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        Alert.alert("Success", `Found ${result.data.length} recipes`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to search recipes");
    } finally {
      setLoading(false);
    }
  };

  // ==================== CATEGORY OPERATIONS ====================
  const handleGetCategories = async () => {
    setLoading(true);
    try {
      const result = await CategoryService.getAllCategories();
      setResults((prev) => ({ ...prev, categories: result }));

      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        Alert.alert("Success", `Found ${result.data.length} categories`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    setLoading(true);
    try {
      const categoryData = {
        name: "Test Category",
        icon: "restaurant",
        color: "#FF5722",
        image: "https://example.com/category.jpg",
      };

      const result = await CategoryService.createCategory(categoryData);
      setResults((prev) => ({ ...prev, createCategory: result }));

      if (result.error) {
        Alert.alert("Error", result.error);
      } else {
        Alert.alert("Success", "Category created successfully");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const renderButton = (
    title: string,
    onPress: () => void,
    icon: string,
    gradient: string[]
  ) => (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={gradient as [string, string]}
        style={styles.buttonGradient}
      >
        <Ionicons name={icon as any} size={20} color={Colors.white} />
        <Text style={styles.buttonText}>{title}</Text>
        {loading && <ActivityIndicator size="small" color={Colors.white} />}
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Data Management Examples</Text>
      <Text style={styles.subtitle}>
        Test all CRUD operations with your cookmaster-ai-server
      </Text>

      {/* User Operations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 User Operations</Text>
        {renderButton("Get User", handleGetUser, "person", [
          "#2196F3",
          "#1976D2",
        ])}
        {renderButton("Create User", handleCreateUser, "person-add", [
          "#4CAF50",
          "#388E3C",
        ])}
        {renderButton("Update User", handleUpdateUser, "create", [
          "#FF9800",
          "#F57C00",
        ])}
      </View>

      {/* Recipe Operations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🍳 Recipe Operations</Text>
        {renderButton("Get User Recipes", handleGetUserRecipes, "restaurant", [
          "#9C27B0",
          "#7B1FA2",
        ])}
        {renderButton("Get Saved Recipes", handleGetSavedRecipes, "bookmark", [
          "#607D8B",
          "#455A64",
        ])}
        {renderButton("Create Recipe", handleCreateRecipe, "add-circle", [
          "#E91E63",
          "#C2185B",
        ])}
        {renderButton("Search Recipes", handleSearchRecipes, "search", [
          "#795548",
          "#5D4037",
        ])}
      </View>

      {/* Category Operations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📂 Category Operations</Text>
        {renderButton("Get Categories", handleGetCategories, "grid", [
          "#00BCD4",
          "#0097A7",
        ])}
        {renderButton("Create Category", handleCreateCategory, "add", [
          "#8BC34A",
          "#689F38",
        ])}
      </View>

      {/* Results Display */}
      {Object.keys(results).length > 0 && (
        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>📊 Results</Text>
          {Object.entries(results).map(([key, result]: [string, any]) => (
            <View key={key} style={styles.resultItem}>
              <Text style={styles.resultTitle}>{key}</Text>
              <Text style={styles.resultText}>
                {result.error ? `Error: ${result.error}` : "Success"}
              </Text>
              {result.data && (
                <Text style={styles.resultData}>
                  Data: {JSON.stringify(result.data).substring(0, 100)}...
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: "outfit-bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textLight,
    fontFamily: "outfit",
    textAlign: "center",
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: "outfit-bold",
    marginBottom: 15,
  },
  button: {
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 10,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "outfit",
  },
  resultsSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resultItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: "outfit-bold",
    marginBottom: 5,
  },
  resultText: {
    fontSize: 12,
    color: Colors.textLight,
    fontFamily: "outfit",
    marginBottom: 5,
  },
  resultData: {
    fontSize: 10,
    color: Colors.textLight,
    fontFamily: "outfit",
    fontStyle: "italic",
  },
});

export default DataManagementExample;
