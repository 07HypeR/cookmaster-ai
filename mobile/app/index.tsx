import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Marquee } from "@animatereactnative/marquee";
import { Redirect, useRouter } from "expo-router";
import Colors from "@/shared/Colors";
import { useAuth } from "@clerk/clerk-expo";

const Index = () => {
  const router = useRouter();

  const { isSignedIn } = useAuth();

  if (isSignedIn) return <Redirect href={"/(tabs)/home"} />;

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

  // useEffect(() => {
  //   const fetchAndCreateUser = async () => {
  //     if (!isAuthenticated) return;

  //     try {
  //       const userData = await getIdTokenClaims();
  //       console.log("-- Logto User Data:", userData);

  //       if (!userData?.email) {
  //         console.warn("Email not found in Logto userData.");
  //         return;
  //       }

  //       const result = await GlobalApi.GetUserByEmail(userData.email);
  //       console.log("User Lookup Result:", result.data.data);

  //       if (!result.data.data || result.data.data.length === 0) {
  //         // Create new user
  //         const data = {
  //           email: userData.email,
  //           name: userData.name ?? "",
  //           picture: userData.picture ?? "",
  //         };

  //         const resp = await GlobalApi.CreateNewUser(data);
  //         console.log("User created:", resp.data.data);
  //         setUser(resp.data.data);
  //         router.replace("/(tabs)/Home");
  //       } else {
  //         console.log("User already exists:", result.data.data[0]);
  //         setUser(result.data.data[0]);
  //         router.replace("/(tabs)/Home");
  //       }
  //     } catch (err: any) {
  //       console.error(
  //         "Error during user creation:",
  //         err?.response?.data || err.message
  //       );
  //     }
  //   };

  //   fetchAndCreateUser();
  // }, [isAuthenticated]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingVertical: 10 }}>
          {[0.7, 0.4, 0.5].map((speed, i) => (
            <Marquee
              key={i}
              spacing={10}
              speed={speed}
              style={{
                transform: [{ rotate: "-4deg" }],
                marginTop: i === 0 ? 0 : 10,
              }}
            >
              <View style={styles.imageContainer}>
                {imageList.map((image, index) => (
                  <Image source={image} key={index} style={styles.image} />
                ))}
              </View>
            </Marquee>
          ))}
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>
            Cookmaster Al 🥗🔍 | Find, Create & Enjoy Delicious Recipes!
          </Text>
          <Text style={styles.subtitle}>
            Generate delicious recipes in seconds with the power of Al! 🍔✨
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(auth)/sign-in")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 160,
    height: 160,
    borderRadius: 25,
  },
  imageContainer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 10,
  },
  contentContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    marginTop: 20,
    borderRadius: 30,
    flexGrow: 1,
    justifyContent: "center",
    shadowColor: Colors.shadow,
  },
  title: {
    fontFamily: "outfit-bold",
    fontSize: 30,
    textAlign: "center",
    color: Colors.shadow,
  },
  subtitle: {
    textAlign: "center",
    fontFamily: "outfit",
    fontSize: 17,
    color: Colors.gray,
    marginTop: 7,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 15,
    marginTop: 20,
  },
  buttonText: {
    textAlign: "center",
    color: Colors.white,
    fontSize: 17,
    fontFamily: "outfit",
  },
});
export default Index;
