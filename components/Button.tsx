import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Colors from "@/services/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

const Button = ({ label, onPress, icon = "" }: any) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: Colors.PRIMARY,
        padding: 15,
        borderRadius: 15,
        marginTop: 20,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
      }}
    >
      <Ionicons name={icon} size={20} color="white" />
      <Text
        style={{
          textAlign: "center",
          color: Colors.WHITE,
          fontSize: 17,
          fontFamily: "outfit",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
