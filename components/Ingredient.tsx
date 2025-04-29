import { FlatList, Text, View } from "react-native";
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
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
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
                  flexShrink: 1,
                  flexWrap: "wrap",
                }}
              >
                {item.ingredient}
              </Text>
            </View>

            <View
              style={{
                maxWidth: "40%",
                marginLeft: 4,
              }}
            >
              <Text
                style={{
                  fontFamily: "outfit",
                  fontSize: 18,
                  color: Colors.GRAY,
                  textAlign: "right",
                }}
              >
                {item.quantity}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Ingredient;
