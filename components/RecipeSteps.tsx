import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "@/services/Colors";

const RecipeSteps = ({ steps }: any) => {
  return (
    <View
      style={{
        marginTop: 15,
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 20,
        }}
      >
        Recipe Steps
      </Text>

      <FlatList
        data={steps}
        renderItem={({ item, index }: any) => (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 7,
              alignItems: "center",
              marginTop: 10,
              padding: 10,
              borderRadius: 15,
              borderWidth: 1,
              borderColor: Colors.PRIMARY,
            }}
          >
            <Text
              style={[
                styles.text,
                {
                  padding: 10,
                  width: 40,
                  textAlign: "center",
                  backgroundColor: Colors.SECONDARY,
                  borderRadius: 7,
                },
              ]}
            >
              {index + 1}
            </Text>
            <Text style={[styles.text, { flex: 1 }]}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default RecipeSteps;

const styles = StyleSheet.create({
  text: {
    fontFamily: "outfit",
    fontSize: 18,
  },
});
