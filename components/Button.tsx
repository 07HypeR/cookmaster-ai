import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import React, { FC } from "react";
import Colors from "@/services/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

const Button = ({ label, onPress, icon = "", loading = false }: any) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
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
      {loading ? (
        <ActivityIndicator color={Colors.WHITE} />
      ) : (
        <Ionicons name={icon} size={20} color="white" />
      )}
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
