import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import React, { useContext, useEffect } from "react";
import { Marquee } from "@animatereactnative/marquee";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Colors from "@/services/Colors";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/services/firebase";
import { UserContext } from "@/context/UserContext";
import GlobalApi from "@/services/GlobalApi";

const Index = () => {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const imageList = [
    require("../assets/images/1.jpg"),
    require("../assets/images/c1.jpg"),
    require("../assets/images/2.jpg"),
    require("../assets/images/c2.jpg"),
    require("../assets/images/3.jpg"),
    require("../assets/images/c3.jpg"),
    require("../assets/images/4.jpg"),
    require("../assets/images/5.jpg"),
    require("../assets/images/6.jpg"),
  ];
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userInfo) => {
      if (userInfo && userInfo.emailVerified) {
        console.log("Authenticated & Verified:", userInfo.email);

        const email = userInfo.email;

        const userData = await GlobalApi.GetUserByEmail(email!);

        console.log(userData);
        setUser(userData);

        router.replace("/(tabs)/Home");
      } else {
        if (userInfo && !userInfo.emailVerified) {
          console.log("Email not verified. Staying on auth screen.");
        } else {
          console.log("No user logged in.");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <GestureHandlerRootView style={{ backgroundColor: "#E8F5E9" }}>
      <View>
        <Marquee
          spacing={10}
          speed={0.7}
          style={{
            transform: [{ rotate: "-4deg" }],
          }}
        >
          <View style={styles.imageContainer}>
            {imageList.map((image, index) => (
              <Image source={image} key={index} style={styles.image} />
            ))}
          </View>
        </Marquee>

        <Marquee
          spacing={10}
          speed={0.4}
          style={{
            transform: [{ rotate: "-4deg" }],
            marginTop: 10,
          }}
        >
          <View style={styles.imageContainer}>
            {imageList.map((image, index) => (
              <Image source={image} key={index} style={styles.image} />
            ))}
          </View>
        </Marquee>

        <Marquee
          spacing={10}
          speed={0.5}
          style={{
            transform: [{ rotate: "-4deg" }],
            marginTop: 10,
          }}
        >
          <View style={styles.imageContainer}>
            {imageList.map((image, index) => (
              <Image source={image} key={index} style={styles.image} />
            ))}
          </View>
        </Marquee>
      </View>

      <View
        style={{
          backgroundColor: Colors.WHITE,
          height: "100%",
          padding: 20,
          marginTop: 20,
        }}
      >
        <View style={{ marginTop: 30 }}>
          <Text
            style={{
              fontFamily: "outfit-bold",
              fontSize: 30,
              textAlign: "center",
            }}
          >
            Cookmaster Al 🥗🔍 | Find, Create & Enjoy Delicious Recipes!
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "outfit",
              fontSize: 17,
              color: Colors.GRAY,
              marginTop: 7,
            }}
          >
            Generate delicious recipes in seconds with the power of Al! 🍔✨
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/signIn")}
            style={styles.button}
          >
            <Text
              style={{
                textAlign: "center",
                color: Colors.WHITE,
                fontSize: 17,
                fontFamily: "outfit",
              }}
            >
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 160,
    height: 160,
    borderRadius: 25,
  },
  imageContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
  },
});

export default Index;
