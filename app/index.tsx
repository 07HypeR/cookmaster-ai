import { UserContext } from "@/context/UserContect";
import GlobalApi from "@/services/GlobalApi";
import { useLogto } from "@logto/rn";
import { Redirect, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const { getIdTokenClaims, isAuthenticated } = useLogto();
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      getIdTokenClaims().then(async (userData) => {
        if (userData?.email) {
          const result = await GlobalApi.GetUserByEmail(userData?.email);
          // To Get Strapi Data in response
          if (!result.data.data) {
            // Insert new record
            const data = {
              email: userData.email,
              name: userData.name,
              picture: userData.picture,
            };
            const resp = await GlobalApi.CreateNewUser(data);
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
      }}
    >
      {/* <Redirect href={"/Landing"} /> */}
    </View>
  );
}
