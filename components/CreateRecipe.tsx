import { View, Text, Image, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import Colors from "@/services/Colors";
import Button from "./Button";

const CreateRecipe = () => {
  const [userInput, setUserInput] = useState<string>();

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
        onPress={() => console.log("On Button Press")}
        icon={"sparkles"}
      />
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
});
