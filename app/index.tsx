import { UserContext } from "@/context/UserContext";
import GlobalApi from "@/services/GlobalApi";
import { useLogto } from "@logto/rn";
import { Redirect, useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { Text, View } from "react-native";

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
      }}
    >
      {/* <Redirect href={"/Landing"} /> */}
    </View>
  );
};

export default Index;
