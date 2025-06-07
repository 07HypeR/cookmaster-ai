import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Colors from "@/services/Colors";
import GlobalApi from "@/services/GlobalApi";
import { UserContext } from "@/context/UserContext";
import RecipeCard from "@/components/RecipeCard";
import Ionicons from "@expo/vector-icons/Ionicons";

const Cookbook = () => {
  const { user } = useContext(UserContext);
  const [recipeList, setRecipeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    if (activeTab === 1) {
      GetUserRecipeList();
    } else {
      savedUserRecipeList();
    }
  }, [activeTab]);

  const GetUserRecipeList = async () => {
    setLoading(true);
    setRecipeList([]);
    const result = await GlobalApi.GetUserCreatedRecipe(user?.email);
    console.log(result.data.data);
    setRecipeList(result.data.data || []);
    setLoading(false);
  };

  const savedUserRecipeList = async () => {
    setLoading(true);
    setRecipeList([]);
    const result = await GlobalApi.SavedRecipeList(user?.email);
    console.log(result.data.data);
    const savedData = result.data.data;
    let QueryFilter = "";
    savedData.forEach((element: any) => {
      QueryFilter =
        QueryFilter + "filters[documentId][$in]=" + element?.recipeDocId + "&";
    });
    console.log(QueryFilter);

    if (QueryFilter === "") {
      setRecipeList([]);
      setLoading(false);
      return;
    }

    const resp = await GlobalApi.GetSavedRecipes(QueryFilter);
    console.log(resp.data.data);
    setRecipeList(resp.data.data || []);
    setLoading(false);
  };

  return (
    <View
      style={{
        padding: 20,
        backgroundColor: Colors.WHITE,
        height: "100%",
      }}
    >
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 40 : 40,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 30,
          }}
        >
          Cookbook
        </Text>
        <View style={[styles.tabContainer, { marginBottom: 6, gap: 10 }]}>
          <TouchableOpacity
            onPress={() => {
              setActiveTab(1), GetUserRecipeList();
            }}
            style={[styles.tabContainer, { opacity: activeTab == 1 ? 1 : 0.4 }]}
          >
            <Ionicons name="sparkles-sharp" size={24} color="black" />
            <Text style={styles.tabText}>My Recipe</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setActiveTab(2);
              savedUserRecipeList();
            }}
            style={[styles.tabContainer, { opacity: activeTab == 2 ? 1 : 0.4 }]}
          >
            <Ionicons name="bookmark" size={24} color="black" />
            <Text style={styles.tabText}>Saved</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={recipeList}
          numColumns={2}
          refreshing={loading}
          onRefresh={activeTab === 1 ? GetUserRecipeList : savedUserRecipeList}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item.id || index.toString()}
          ListEmptyComponent={
            !loading ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 250,
                }}
              >
                <Ionicons name="sad-outline" size={60} color="gray" />
                <Text
                  style={{
                    fontFamily: "outfit",
                    fontSize: 18,
                    color: "gray",
                    marginTop: 10,
                  }}
                >
                  {activeTab === 1
                    ? "No recipes found."
                    : "No saved recipes found."}
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={{ flex: 1 }}>
              <RecipeCard recipe={item} />
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default Cookbook;

const styles = StyleSheet.create({
  tabContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    padding: 4,
  },
  tabText: {
    fontFamily: "outfit",
    fontSize: 20,
  },
});
