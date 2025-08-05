import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useRef, useState, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/shared/Colors";
import Button from "./Button";
import GlobalApi, { AiModel } from "@/services/GlobalApi";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import LoadingDialog from "./LoadingDialog";
import { UserContext } from "@/context/UserContext";
import Prompt from "./../services/Prompt";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import RecipeService from "@/services/RecipeService";

const { width, height } = Dimensions.get("window");

interface CreateRecipeProps {
  selectedCategory?: string;
  selectedQuickAction?: string;
}

const CreateRecipe = ({
  selectedCategory,
  selectedQuickAction,
}: CreateRecipeProps) => {
  const { user, isVegMode, setUser } = useContext(UserContext);
  const [userInput, setUserInput] = useState<string>();
  const [recipeOptions, setRecipeOptions] = useState<any | null>([]);
  const [loading, setLoading] = useState(false);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [openLoading, setOpenLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingFullRecipe, setIsGeneratingFullRecipe] = useState(false);
  const router = useRouter();

  const OnGenerate = async () => {
    if (isGenerating) return;
    if (!userInput) {
      Alert.alert("Please enter details");
      return;
    }

    setIsGenerating(true);
    setLoading(true);

    try {
      const result = await GlobalApi.AiModel(
        userInput + Prompt.GENERATE_RECIPE_OPTION_PROMPT
      );
      const extractJson =
        result.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const jsonMatch = extractJson.match(/```json\n([\s\S]*?)\n```/);
      if (!jsonMatch) {
        throw new Error("Ai response dose not contain JSON");
      }
      const jsonString = jsonMatch[1];
      const parsedJsonResp = JSON.parse(jsonString || "{}");
      console.log(parsedJsonResp);
      setRecipeOptions(parsedJsonResp);
      actionSheetRef.current?.show();
    } catch (error) {
      console.error("Error generating options", error);
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  };

  const GenerateCompleteRecipe = async (option: any) => {
    if (isGeneratingFullRecipe) return;

    actionSheetRef.current?.hide();
    setOpenLoading(true);
    setIsGeneratingFullRecipe(true);

    try {
      const PROMPT =
        "RecipeName: " +
        option.recipeName +
        "Description: " +
        option?.description +
        Prompt.GENERATE_COMPLETE_RECIPE_PROMPT;

      const result = await GlobalApi.AiModel(PROMPT);

      const extractJson =
        result.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const jsonMatch = extractJson.match(/```json\n([\s\S]*?)\n```/);
      if (!jsonMatch) {
        throw new Error("Ai response dose not contain JSON");
      }
      const jsonString = jsonMatch[1];
      const parsedJsonResp = JSON.parse(jsonString || "{}");
      console.log(parsedJsonResp);

      const imageUrl = await GenerateRecipeAiImage(parsedJsonResp.imagePrompt);
      const insertedRecordResult = await SaveDb(parsedJsonResp, imageUrl);
      console.log(insertedRecordResult);

      if (insertedRecordResult?.id) {
        router.push({
          pathname: "/recipe-detail",
          params: {
            recipeId: insertedRecordResult.id.toString(),
          },
        });
      } else {
        throw new Error("Failed to get recipe ID after creation");
      }
    } catch (error) {
      console.error("Error generating complete recipe:", error);
      Alert.alert("Error", "Failed to generate recipe. Please try again.");
    } finally {
      setOpenLoading(false);
      setIsGeneratingFullRecipe(false);
    }
  };

  const GenerateRecipeAiImage = async (imagePrompt: string) => {
    try {
      const response = await GlobalApi.RecipeImageApi.post("/image/generate", {
        prompt: imagePrompt,
      });
      console.log("Image generated successfully:", response.data.imageUrl);
      return response.data.imageUrl;
    } catch (error) {
      console.error("Error generating recipe image:", error);
      throw new Error("Failed to generate recipe image");
    }
  };

  const SaveDb = async (parsedJsonResp: any, imageUrl: string) => {
    try {
      // Validate user data
      if (!user?.email || !user?.id) {
        throw new Error("User data is incomplete. Please sign in again.");
      }

      const data = {
        ...parsedJsonResp,
        recipeImage: imageUrl,
        userEmail: user.email,
      };

      console.log("Saving recipe to database:", JSON.stringify(data, null, 2));

      // Use RecipeService for better error handling and validation
      const result = await RecipeService.createRecipe(data);

      if (!result.success) {
        throw new Error(result.error || "Failed to create recipe");
      }

      console.log("Recipe saved successfully:", result.data);
      return result.data;
    } catch (error: any) {
      console.error("Error saving recipe to database:", error);

      // Show user-friendly error message
      const errorMessage = error.message || "Unknown error occurred";
      Alert.alert(
        "Recipe Save Error",
        `Failed to save recipe: ${errorMessage}`
      );
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={["#4CAF50", "#2E7D32"] as [string, string]}
            style={styles.iconGradient}
          >
            <Ionicons name="sparkles" size={28} color={Colors.white} />
          </LinearGradient>
        </View>
        <Text style={styles.title}>AI Recipe Generator</Text>
        <Text style={styles.subtitle}>
          Describe what you want to cook and let AI create amazing recipes for
          you
        </Text>
      </View>

      {/* Input Section */}
      <View style={styles.inputSection}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            multiline={true}
            numberOfLines={4}
            onChangeText={(value) => setUserInput(value)}
            placeholder="What would you like to cook? Include ingredients, cuisine type, or preferences..."
            placeholderTextColor={Colors.textLight}
            textAlignVertical="top"
          />
          <View style={styles.inputFooter}>
            <Ionicons name="bulb" size={16} color={Colors.textLight} />
            <Text style={styles.inputHint}>
              Be specific for better results. You can also just select a
              category or quick action or combine, or combine all three for the
              best results.
            </Text>
          </View>
        </View>
      </View>

      {/* Generate Button */}
      <TouchableOpacity
        style={[
          styles.generateButton,
          loading && styles.generateButtonDisabled,
        ]}
        onPress={OnGenerate}
        disabled={loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#4CAF50", "#2E7D32"] as [string, string]}
          style={styles.generateButtonGradient}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <>
              <Ionicons name="sparkles" size={20} color={Colors.white} />
              <Text style={styles.generateButtonText}>Generate Recipe</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Recipe Options Action Sheet */}
      <ActionSheet ref={actionSheetRef}>
        <View style={styles.actionSheetContainer}>
          <View style={styles.actionSheetHeader}>
            <View style={styles.actionSheetIconContainer}>
              <LinearGradient
                colors={["#4CAF50", "#2E7D32"] as [string, string]}
                style={styles.actionSheetIconGradient}
              >
                <Ionicons name="restaurant" size={24} color={Colors.white} />
              </LinearGradient>
            </View>
            <View style={styles.actionSheetTextContainer}>
              <Text style={styles.actionSheetTitle}>Choose Your Recipe</Text>
              <Text style={styles.actionSheetSubtitle}>
                Select the recipe you'd like to create
              </Text>
            </View>
          </View>

          <View style={styles.recipeOptionsContainer}>
            {Array.isArray(recipeOptions) && recipeOptions.length > 0 ? (
              recipeOptions.map((item: any, index: any) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recipeOptionCard}
                  onPress={() => GenerateCompleteRecipe(item)}
                  activeOpacity={0.8}
                >
                  <View style={styles.recipeOptionContent}>
                    <Text style={styles.recipeOptionTitle}>
                      {item?.recipeName || item?.title || "Unnamed Recipe"}
                    </Text>
                    <Text style={styles.recipeOptionDescription}>
                      {item?.description || "No description available"}
                    </Text>
                  </View>
                  <View style={styles.recipeOptionArrow}>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={Colors.gray}
                    />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <LinearGradient
                  colors={["#BDBDBD", "#9E9E9E"] as [string, string]}
                  style={styles.emptyStateIconGradient}
                >
                  <Ionicons name="restaurant" size={40} color={Colors.white} />
                </LinearGradient>
                <Text style={styles.emptyStateTitle}>No Recipes Found</Text>
                <Text style={styles.emptyStateText}>
                  Try adjusting your description or ingredients
                </Text>
              </View>
            )}
          </View>
        </View>
      </ActionSheet>

      {/* Loading Dialog */}
      <LoadingDialog visible={openLoading} />
    </View>
  );
};

export default CreateRecipe;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 28,
  },
  iconContainer: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  iconGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: "outfit-bold",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textLight,
    fontFamily: "outfit",
    textAlign: "center",
    lineHeight: 22,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputContainer: {
    backgroundColor: Colors.grayLight,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    padding: 20,
    fontSize: 16,
    color: Colors.text,
    fontFamily: "outfit",
    minHeight: 120,
  },
  inputFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
    paddingTop: 0,
    backgroundColor: Colors.grayLight,
  },
  inputHint: {
    fontSize: 13,
    color: Colors.textLight,
    fontFamily: "outfit",
    flex: 1,
  },
  generateButton: {
    borderRadius: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  generateButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 20,
    gap: 12,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: "600",
    fontFamily: "outfit",
  },
  actionSheetContainer: {
    padding: 24,
  },
  actionSheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 16,
  },
  actionSheetIconContainer: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  actionSheetIconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  actionSheetTextContainer: {
    flex: 1,
  },
  actionSheetTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: "outfit-bold",
    marginBottom: 4,
  },
  actionSheetSubtitle: {
    fontSize: 15,
    color: Colors.textLight,
    fontFamily: "outfit",
  },
  recipeOptionsContainer: {
    gap: 16,
  },
  recipeOptionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeOptionContent: {
    flex: 1,
  },
  recipeOptionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.text,
    fontFamily: "outfit-bold",
    marginBottom: 6,
  },
  recipeOptionDescription: {
    fontSize: 14,
    color: Colors.textLight,
    fontFamily: "outfit",
    lineHeight: 20,
  },
  recipeOptionArrow: {
    marginLeft: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyStateIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: "outfit-bold",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 15,
    color: Colors.textLight,
    fontFamily: "outfit",
    textAlign: "center",
    lineHeight: 22,
  },
});
