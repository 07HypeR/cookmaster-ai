import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import GlobalApi from "@/services/GlobalApi";
import { useRouter } from "expo-router";

const CategoryList = () => {
  const [categoryList, setCategoryList] = useState([]);
  const router = useRouter();
  useEffect(() => {
    GetCategoryList();
  }, []);

  const GetCategoryList = async () => {
    const result = await GlobalApi.GetCategories();
    // console.log(result.data.data);
    setCategoryList(result?.data?.data);
  };
  return (
    <View
      style={{
        marginTop: 20,
      }}
    >
      <Text style={styles.heading}>Category</Text>
      <FlatList
        data={categoryList}
        numColumns={4}
        renderItem={({ item, index }: any) => (
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/recipe-by-category",
                params: {
                  categoryName: item?.name,
                },
              })
            }
            style={styles.categoryContainer}
          >
            <Image
              source={{ uri: item?.image?.url }}
              style={{
                width: 40,
                height: 40,
              }}
            />
            <Text style={{ fontFamily: "outfit", marginTop: 3 }}>
              {item?.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  heading: {
    fontFamily: "outfit-bold",
    fontSize: 20,
  },
  categoryContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    marginTop: 10,
  },
});
