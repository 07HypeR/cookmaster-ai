import { UserContext } from "@/context/UserContext";
import Colors from "@/services/Colors";
import GlobalApi from "@/services/GlobalApi";
import { useLogto } from "@logto/rn";
import { Redirect, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

const Index = () => {
  const { getIdTokenClaims, isAuthenticated } = useLogto();
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      getIdTokenClaims().then(async (userData) => {
        console.log("--", userData);

        if (userData?.email) {
          const result = await GlobalApi.GetUserByEmail(userData?.email);
          console.log(result.data.data); // To Get Strapi Data in response

          if (!result.data.data) {
            // Insert new record
            const data = {
              email: userData.email,
              name: userData.name,
              picture: userData.picture,
            };
            const resp = await GlobalApi.CreateNewUser(data);
            console.log(resp.data.data);
            setUser(resp.data.data);
            router.replace("/(tabs)/Home");
          } else {
            setUser(result?.data?.data[0]);
            router.replace("/(tabs)/Home");
          }
        }
      });
    }
  }, [isAuthenticated]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.WHITE,
      }}
    >
      <Modal visible statusBarTranslucent>
        <View style={styles.overlay}>
          <View
            style={{
              padding: 20,
              borderRadius: 15,
              backgroundColor: Colors.PRIMARY,
              alignItems: "center",
            }}
          >
            <ActivityIndicator size={"large"} color={Colors.WHITE} />
            <Text style={styles.text}>Please wait! Logging In...</Text>
          </View>
        </View>
      </Modal>
      {/* <Redirect href={"/Landing"} /> */}
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.WHITE,
  },
  text: {
    marginTop: 10,
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: "outfit",
  },
});
