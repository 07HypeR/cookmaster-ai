import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";
import Colors from "@/services/Colors";
import Button from "./Button";
import GlobalApi from "@/services/GlobalApi";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import {
  GENERATE_COMPLETE_RECIPE_PROMPT,
  GENERATE_RECIPE_OPTION_PROMPT,
} from "../services/Prompt";
import LoadingDialog from "./LoadingDialog";

const CreateRecipe = () => {
  const [userInput, setUserInput] = useState<string>();
  const [recipeOptions, setRecipeOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const [openLoading, setOpenLoading] = useState(false);

  const OnGenerate = async () => {
    if (loading) return;
    if (!userInput) {
      Alert.alert("Please enter details");
      return;
    }
    setLoading(true);
    const result = await GlobalApi.AiModel(
      userInput + GENERATE_RECIPE_OPTION_PROMPT
    );
    console.log(result.text);

    setRecipeOptions(JSON.parse(result?.text ?? "{}"));
    setLoading(false);
    actionSheetRef.current?.show();
  };

  const GenerateCompleteRecipe = async (option: any) => {
    if (openLoading) return;
    actionSheetRef.current?.hide();
    setOpenLoading(true);
    const PROMPT =
      "recipe Name: " +
      option.recipeName +
      "Description: " +
      option?.description +
      GENERATE_COMPLETE_RECIPE_PROMPT;
    const result = await GlobalApi.AiModel(PROMPT);
    console.log(result.text);
    setOpenLoading(false);
  };

  return (
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
      />
      <Button
        label={"Generate Recipe"}
        onPress={OnGenerate}
        loading={loading}
        icon={"sparkles"}
      />
      <LoadingDialog visible={openLoading} />
      <ActionSheet ref={actionSheetRef}>
        <View style={styles.actionSheetContainer}>
          <Text style={styles.heading}>Select Recipe</Text>
          <View>
            {Array.isArray(recipeOptions) &&
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
    borderWidth: 0.2,
    borderRadius: 15,
    marginTop: 15,
  },
});
