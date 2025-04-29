import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useContext, useRef, useState } from "react";
import Colors from "@/services/Colors";
import Button from "./Button";
import GlobalApi from "@/services/GlobalApi";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import LoadingDialog from "./LoadingDialog";
import { UserContext } from "@/context/UserContext";
import Prompt from "./../services/Prompt";
import { useRouter } from "expo-router";

const CreateRecipe = () => {
  const { user, setUser } = useContext(UserContext);
  const [userInput, setUserInput] = useState<string>();
  const [recipeOptions, setRecipeOptions] = useState<any | null>([]);
  const [loading, setLoading] = useState(false);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [openLoading, setOpenLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingFullRecipe, setIsGeneratingFullRecipe] = useState(false);
  const router = useRouter();

  // console.log(user);

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
      const content = result?.choices[0].message?.content;
      console.log(result?.choices[0].message?.content);

      content && setRecipeOptions(JSON.parse(content));
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
    const PROMPT =
      "RecipeName: " +
      option.recipeName +
      "Description: " +
      option?.description +
      Prompt.GENERATE_COMPLETE_RECIPE_PROMPT;

    const result = await GlobalApi.AiModel(PROMPT);

    const content: any = result?.choices[0].message?.content;
    const JSONContent = JSON.parse(content);
    console.log(content);
    console.log(JSONContent.imagePrompt);
    const imageUrl = await GenerateRecipeAiImage(JSONContent.imagePrompt);
    const insertedRecordResult = await SaveDb(JSONContent, imageUrl);
    console.log(insertedRecordResult);
    router.push({
      pathname: "/recipe-detail",
      params: {
        recipeData: JSON.stringify(insertedRecordResult),
      },
    });
    setOpenLoading(false);
    setIsGeneratingFullRecipe(false);
  };

  const GenerateRecipeAiImage = async (imagePrompt: string) => {
    const response = await GlobalApi.RecipeImageApi.post("/generate-image", {
      prompt: imagePrompt,
    });
    console.log(response.data.imageUrl);

    return response.data.imageUrl;
  };

  const SaveDb = async (content: any, imageUrl: string) => {
    const data = {
      ...content,
      recipeImage: imageUrl,
      userEmail: user?.email,
    };

    const userData = {
      name: user?.name,
      email: user?.email,
      picture: user?.picture,
      credits: user?.credits - 1,
      pref: null,
    };

    const result = await GlobalApi.CreateNewRecipe(data);
    const updateUser = await GlobalApi.UpdateUser(user?.documentId, userData);
    console.log(updateUser);
    // setUser(updateUser);
    return result.data.data;
  };
  return (
    <SafeAreaView>
      <LoadingDialog visible={openLoading} />
      <View style={styles.container}>
        <Image
          source={require("./../assets/images/pan.gif")}
          style={styles.panImage}
        />
        <Text style={styles.heading}>
          Warm up your stove, and let's get cooking!
        </Text>
        <Text style={styles.subHeading}>Make something for your LOVE ❤️</Text>
        <TextInput
          style={styles.textInput}
          multiline={true}
          numberOfLines={3}
          onChangeText={(value) => setUserInput(value)}
          placeholder="What do you want to create? Add ingredients etc."
          placeholderTextColor={"#ccc"}
        />
        <Button
          label={"Generate Recipe"}
          onPress={() => OnGenerate()}
          loading={loading}
          icon={"sparkles"}
        />
        <ActionSheet ref={actionSheetRef}>
          <View style={styles.actionSheetContainer}>
            <Text style={styles.heading}>Select Recipe</Text>
            <View>
              {recipeOptions &&
                recipeOptions?.map((item: any, index: any) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.recipeOptionContainer}
                    onPress={() => GenerateCompleteRecipe(item)}
                  >
                    <Text
                      style={{
                        fontFamily: "outfit-bold",
                        fontSize: 16,
                      }}
                    >
                      {item?.recipeName}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "outfit",
                        color: Colors.GRAY,
                      }}
                    >
                      {item?.description}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          </View>
        </ActionSheet>
      </View>
    </SafeAreaView>
  );
};

export default CreateRecipe;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 15,
    backgroundColor: Colors.SECONDARY,
    borderRadius: 25,
    display: "flex",
    alignItems: "center",
  },
  panImage: {
    width: 80,
    height: 80,
  },
  heading: {
    fontFamily: "outfit",
    fontSize: 23,
    textAlign: "center",
  },
  subHeading: {
    fontFamily: "outfit",
    fontSize: 16,
    marginTop: 6,
  },
  textInput: {
    backgroundColor: Colors.WHITE,
    width: "100%",
    borderRadius: 15,
    height: 120,
    marginTop: 8,
    fontSize: 16,
    padding: 15,
    textAlignVertical: "top",
  },
  actionSheetContainer: {
    padding: 25,
  },
  recipeOptionContainer: {
    padding: 15,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 15,
    marginTop: 15,
  },
});
