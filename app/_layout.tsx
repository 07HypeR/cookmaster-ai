import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { LogtoProvider, LogtoConfig, UserScope } from "@logto/rn";
import { UserContext } from "@/context/UserContext";
import { useState } from "react";

const RootLayout = () => {
  const [loaded, error] = useFonts({
    outfit: require("../assets/fonts/Outfit-Regular.ttf"),
    "outfit-bold": require("../assets/fonts/Outfit-Bold.ttf"),
  });

  const config: LogtoConfig = {
    endpoint: "https://5tdeyd.logto.app/",
    appId: "4zwpnq54lv79sneejxcg0",
    scopes: [UserScope.Email],
  };

  const [user, setUser] = useState();

  return (
    <LogtoProvider config={config}>
      <UserContext.Provider value={{ user, setUser }}>
        <Stack>
          <Stack.Screen
            name="Landing"
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
        </Stack>
      </UserContext.Provider>
    </LogtoProvider>
  );
};

export default RootLayout;
