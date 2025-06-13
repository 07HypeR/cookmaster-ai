import React, { useEffect } from "react";
import { Redirect, Stack, useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

const AuthRoutesLayout = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  //    useEffect(() => {
  //       const fetchAndCreateUser = async () => {
  //         if (!isSignedIn) return;

  //         try {
  //           const userData = await getClerkInstance;
  //           console.log("-- Logto User Data:", userData);

  //           if (!userData?.email) {
  //             console.warn("Email not found in Logto userData.");
  //             return;
  //           }

  //           const result = await GlobalApi.GetUserByEmail(userData.email);
  //           console.log("User Lookup Result:", result.data.data);

  //           if (!result.data.data || result.data.data.length === 0) {
  //             // Create new user
  //             const data = {
  //               email: userData.email,
  //               name: userData.name ?? "",
  //               picture: userData.picture ?? "",
  //             };

  //             const resp = await GlobalApi.CreateNewUser(data);
  //             console.log("User created:", resp.data.data);
  //             setUser(resp.data.data);
  //             router.replace("/(tabs)/Home");
  //           } else {
  //             console.log("User already exists:", result.data.data[0]);
  //             setUser(result.data.data[0]);
  //             router.replace("/(tabs)/Home");
  //           }
  //         } catch (err: any) {
  //           console.error(
  //             "Error during user creation:",
  //             err?.response?.data || err.message
  //           );
  //         }
  //       };

  //       fetchAndCreateUser();
  //     }, [isSignedIn]);

  return (
    <Stack>
      <Stack.Screen
        name="signIn"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signUp"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default AuthRoutesLayout;
