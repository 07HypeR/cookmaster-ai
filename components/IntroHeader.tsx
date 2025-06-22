import { Image, Platform, Switch, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { UserContext } from "@/context/UserContext";
import { useUser } from "@clerk/clerk-expo";

const IntroHeader = () => {
  // const { user } = useContext(UserContext);
  const [isEnable, setIsEnable] = useState(false);
  const { user } = useUser();

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: Platform.OS === "ios" ? 40 : 40,
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
          source={
            user?.imageUrl
              ? { uri: user.imageUrl }
              : require("../assets/images/user.png")
          }
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
          Hello,{user?.firstName} 👋
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
