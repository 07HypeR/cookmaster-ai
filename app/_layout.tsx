import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { UserContext } from "@/context/UserContext";
import { useState } from "react";
import { Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomToast from "../shared/CustomToast";
import Toast, {
  ToastConfig,
  ToastConfigParams,
} from "react-native-toast-message";

const toastConfig: ToastConfig = {
  custom: (props: ToastConfigParams<any>) => (
    <CustomToast
      text1={props.text1 || ""}
      text2={props.text2 || ""}
      {...props}
    />
  ),
};

const RootLayout = () => {
  const [loaded, error] = useFonts({
    outfit: require("../assets/fonts/Outfit-Regular.ttf"),
    "outfit-bold": require("../assets/fonts/Outfit-Bold.ttf"),
  });

  const [user, setUser] = useState();

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(auth)/signIn"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(auth)/signUp"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="recipe-by-category/index"
            options={{
              headerTransparent: true,
              headerTitle: "",
              headerShown: Platform.OS !== "ios",
            }}
          />
          <Stack.Screen
            name="recipe-detail/index"
            options={{
              headerTitle: "Recipe Details",
              headerBackTitle: "Back",
              headerRight: () => (
                <Ionicons name="share" size={24} color="black" />
              ),
            }}
          />
        </Stack>
      </UserContext.Provider>
      <Toast config={toastConfig} />
    </>
  );
};

export default RootLayout;
