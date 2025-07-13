import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import { UserContext } from "@/context/UserContext";
import { useState } from "react";
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
  const [loaded, error] = useFonts({
    outfit: require("../assets/fonts/Outfit-Regular.ttf"),
    "outfit-bold": require("../assets/fonts/Outfit-Bold.ttf"),
  });

  const [user, setUser] = useState();

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        <ClerkProvider tokenCache={tokenCache}>
          <Slot />
        </ClerkProvider>
      </UserContext.Provider>

      <Toast config={toastConfig} />
    </>
  );
};

export default RootLayout;
