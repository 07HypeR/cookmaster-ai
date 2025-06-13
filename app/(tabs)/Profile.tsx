import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext } from "react";
import Colors from "@/services/Colors";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "expo-router";
import { useClerk } from "@clerk/clerk-expo";

const Profile = () => {
  const { user } = useContext(UserContext);
  const { signOut } = useClerk();

  const option = [
    {
      name: "Create New Recipe",
      icon: require("./../../assets/images/i1.png"),
      path: "/(tabs)/Home",
    },
    {
      name: "My Recipes",
      icon: require("./../../assets/images/i3.png"),
      path: "/(tabs)/Cookbook",
    },
    {
      name: "Browse More Recipes",
      icon: require("./../../assets/images/i2.png"),
      path: "/(tabs)/Explore",
    },
    {
      name: "Logout",
      icon: require("./../../assets/images/power.png"),
      path: "logout",
    },
  ];
  const router = useRouter();
  const onOptionClick = async (option: any) => {
    if (option.path === "logout") {
      await signOut();
      router.replace("/");
      return;
    }
    router.push(option.path);
  };
  return (
    <View
      style={{
        height: "100%",
        backgroundColor: Colors.WHITE,
        padding: 20,
      }}
    >
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 40 : 40,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 30,
          }}
        >
          Profile
        </Text>
        <View
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Image
            source={{ uri: user?.picture }}
            style={{
              width: 80,
              height: 80,
              borderRadius: 99,
            }}
          />
          <Text
            style={{
              fontFamily: "outfit-bold",
              fontSize: 25,
              marginTop: 20,
            }}
          >
            {user?.name}
          </Text>
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 17,
              color: Colors.GRAY,
            }}
          >
            {user?.email}
          </Text>
        </View>

        <FlatList
          data={option}
          style={{
            marginTop: 25,
          }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => onOptionClick(item)}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 7,
                padding: 20,
              }}
            >
              <Image source={item.icon} style={{ width: 40, height: 40 }} />
              <Text
                style={{
                  fontFamily: "outfit",
                  fontSize: 20,
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

export default Profile;
