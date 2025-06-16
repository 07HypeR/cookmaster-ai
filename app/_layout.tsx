import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { UserContext } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
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
  const [user, setUser] = useState();
  const [loaded] = useFonts({
    outfit: require("../assets/fonts/Outfit-Regular.ttf"),
    "outfit-bold": require("../assets/fonts/Outfit-Bold.ttf"),
  });
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;
  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
    );
  }

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
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
              name="(auth)"
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
        </ClerkProvider>
      </UserContext.Provider>

      <Toast config={toastConfig} />
    </>
  );
};

export default RootLayout;
