import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import Colors from "@/services/Colors";

const Ingredient = ({ ingredients }: any) => {
  return (
    <View
      style={{
        marginTop: 15,
      }}
    >
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
            fontFamily: "outfit-bold",
            fontSize: 20,
          }}
        >
          Ingredient
        </Text>
        <Text style={{ fontFamily: "outfit", fontSize: 16 }}>
          {ingredients?.length} Items
        </Text>
      </View>

      <FlatList
        data={ingredients}
        renderItem={({ item, index }) => (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 7,
                padding: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  padding: 5,
                  backgroundColor: Colors.SECONDARY,
                  borderRadius: 99,
                }}
              >
                {item?.icon}
              </Text>
              <Text
                style={{
                  fontFamily: "outfit",
                  fontSize: 18,
                }}
              >
                {item.ingredient}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 20,
                color: Colors.GRAY,
              }}
            >
              {item?.quantity}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default Ingredient;

const styles = StyleSheet.create({});
