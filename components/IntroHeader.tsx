import { Image, StyleSheet, Switch, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { UserContext } from "@/context/UserContext";

const IntroHeader = () => {
  const { user } = useContext(UserContext);
  const [isEnable, setIsEnable] = useState(false);

  return (
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
          gap: 8,
        }}
      >
        <Image
          source={{ uri: user?.picture }}
          style={{
            width: 45,
            height: 45,
            borderRadius: 99,
          }}
        />

        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 20,
          }}
        >
          Hello,{user?.name}
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Text style={{ fontFamily: "outfit", fontSize: 16 }}>
          {isEnable ? "Veg" : "Non-Veg"}
        </Text>
        <Switch value={isEnable} onValueChange={() => setIsEnable(!isEnable)} />
      </View>
    </View>
  );
};

export default IntroHeader;
