import {
  FlatList,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  Dimensions,
  Alert,
  Animated,
} from "react-native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/shared/Colors";
import GlobalApi from "@/services/GlobalApi";
import RecipeCard from "@/components/RecipeCard";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

const { width, height } = Dimensions.get("window");

const RecipeByCategory = () => {
  const { categoryName } = useLocalSearchParams();
  const [recipeList, setRecipeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState(""); // No sorting by default
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/(tabs)/home");
  };

  const handleFilterPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Sort Recipes", "Choose how to sort the recipes:", [
      { text: "Cancel", style: "cancel", onPress: () => setSortBy("") },
      {
        text: "By Name",
        onPress: () => setSortBy("name"),
        style: sortBy === "name" ? "default" : "default",
      },
      {
        text: "By Time",
        onPress: () => setSortBy("time"),
        style: sortBy === "time" ? "default" : "default",
      },
      {
        text: "By Difficulty",
        onPress: () => setSortBy("difficulty"),
        style: sortBy === "difficulty" ? "default" : "default",
      },
    ]);
  };

  const GetRecipeListByCategory = useCallback(async () => {
    setLoading(true);
    const result = await GlobalApi.GetRecipeByCategory(categoryName as string);
    console.log("---", result.data.data);
    setRecipeList(result?.data?.data);
    setLoading(false);
  }, [categoryName]);

  useEffect(() => {
    GetRecipeListByCategory();
  }, [GetRecipeListByCategory]);

  useEffect(() => {
    // Animate in on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Start pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const getCategoryIcon = (category: string) => {
    if (!category) return { name: "restaurant", type: "Ionicons" };

    const categoryIcons: { [key: string]: { name: string; type: string } } = {
      // Basic categories
      breakfast: { name: "sunny", type: "Ionicons" },
      lunch: { name: "restaurant", type: "Ionicons" },
      dinner: { name: "moon", type: "Ionicons" },
      dessert: { name: "ice-cream", type: "Ionicons" },
      cake: { name: "cake", type: "MaterialIcons" },
      drink: { name: "cafe", type: "Ionicons" },
      fastfood: { name: "fast-food", type: "Ionicons" },
      salad: { name: "leaf", type: "Ionicons" },
    };

    const lowerCategory = category.toLowerCase();
    return (
      categoryIcons[lowerCategory] || { name: "restaurant", type: "Ionicons" }
    );
  };

  const getCategoryGradient = (category: string) => {
    const lowerCategory = category?.toLowerCase();
    const gradients: { [key: string]: [string, string] } = {
      breakfast: ["#FFB74D", "#FF9800"],
      lunch: ["#81C784", "#4CAF50"],
      dinner: ["#64B5F6", "#2196F3"],
      dessert: ["#F06292", "#E91E63"],
      cake: ["#BA68C8", "#9C27B0"],
      drink: ["#4DB6AC", "#009688"],
      fastfood: ["#FF8A65", "#FF5722"],
      salad: ["#A8E6CF", "#81C784"],
    };
    return gradients[lowerCategory] || ["#4CAF50", "#2E7D32"];
  };

  const getSortIcon = () => {
    switch (sortBy) {
      case "name":
        return "text";
      case "time":
        return "time";
      case "difficulty":
        return "trending-up";
      default:
        return "filter"; // Default filter icon when no sorting is applied
    }
  };

  const sortedRecipes = [...recipeList].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name?.localeCompare(b.name) || 0;
      case "time":
        return (a.cookingTime || 0) - (b.cookingTime || 0);
      case "difficulty":
        return (a.difficulty || 0) - (b.difficulty || 0);
      default:
        return 0; // No sorting applied
    }
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#4CAF50", "#2E7D32"] as [string, string]}
            style={styles.backButtonGradient}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.categoryInfo}>
            <Animated.View
              style={[
                styles.categoryIconContainer,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={getCategoryGradient(categoryName as string)}
                style={styles.categoryIconGradient}
              >
                {getCategoryIcon(categoryName as string).type ===
                "MaterialIcons" ? (
                  <MaterialIcons
                    name={getCategoryIcon(categoryName as string).name as any}
                    size={24}
                    color={Colors.white}
                  />
                ) : (
                  <Ionicons
                    name={getCategoryIcon(categoryName as string).name as any}
                    size={24}
                    color={Colors.white}
                  />
                )}
              </LinearGradient>
            </Animated.View>
            <View style={styles.categoryTextContainer}>
              <Text style={styles.categoryTitle}>{categoryName}</Text>
              <Text style={styles.categorySubtitle}>
                {recipeList?.length || 0} recipes available
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleFilterPress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#FF6B6B", "#FF5252"] as [string, string]}
              style={styles.actionButtonGradient}
            >
              <Ionicons name={getSortIcon()} size={18} color={Colors.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Sort Indicator */}
      {sortBy && (
        <Animated.View
          style={[
            styles.sortIndicator,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sortIconContainer}>
            <LinearGradient
              colors={["#4CAF50", "#2E7D32"] as [string, string]}
              style={styles.sortIconGradient}
            >
              <Ionicons name={getSortIcon()} size={16} color={Colors.white} />
            </LinearGradient>
          </View>
          <Text style={styles.sortText}>
            Sorted by{" "}
            {sortBy === "time"
              ? "cooking time"
              : sortBy === "difficulty"
              ? "difficulty"
              : "name"}
          </Text>
          <TouchableOpacity
            onPress={() => setSortBy("")}
            activeOpacity={0.8}
            style={styles.clearSortButton}
          >
            <Ionicons name="close-circle" size={20} color={Colors.gray} />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Recipe Grid */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <FlatList
          data={sortedRecipes}
          numColumns={2}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={GetRecipeListByCategory}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <Animated.View
                  style={[
                    styles.emptyIconContainer,
                    {
                      transform: [
                        {
                          translateY: slideAnim.interpolate({
                            inputRange: [0, 30],
                            outputRange: [0, -10],
                          }),
                        },
                        {
                          scale: pulseAnim,
                        },
                      ],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={getCategoryGradient(categoryName as string)}
                    style={styles.emptyIconGradient}
                  >
                    {getCategoryIcon(categoryName as string).type ===
                    "MaterialIcons" ? (
                      <MaterialIcons
                        name={
                          getCategoryIcon(categoryName as string).name as any
                        }
                        size={40}
                        color={Colors.white}
                      />
                    ) : (
                      <Ionicons
                        name={
                          getCategoryIcon(categoryName as string).name as any
                        }
                        size={40}
                        color={Colors.white}
                      />
                    )}
                  </LinearGradient>
                </Animated.View>
                <Text style={styles.emptyTitle}>No Recipes Found</Text>
                <Text style={styles.emptySubtitle}>
                  No {(categoryName as string).toLowerCase()} recipes available
                  at the moment.
                </Text>
                <TouchableOpacity
                  style={styles.exploreButton}
                  onPress={handleBackPress}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#4CAF50", "#2E7D32"] as [string, string]}
                    style={styles.exploreButtonGradient}
                  >
                    <Ionicons name="search" size={18} color={Colors.white} />
                    <Text style={styles.exploreButtonText}>
                      Explore Other Categories
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : null
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item, index }) => (
            <Animated.View
              style={[
                styles.recipeCardContainer,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 30],
                        outputRange: [0, 10 + index * 3],
                      }),
                    },
                  ],
                },
              ]}
            >
              <RecipeCard
                recipe={item}
                source="category"
                categoryName={categoryName}
              />
            </Animated.View>
          )}
        />
      </Animated.View>
    </View>
  );
};

export default RecipeByCategory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  categoryIconContainer: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  categoryIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryTextContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: "outfit-bold",
  },
  categorySubtitle: {
    fontSize: 15,
    color: Colors.textLight,
    fontFamily: "outfit",
    marginTop: 4,
    lineHeight: 20,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  sortIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sortIconContainer: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  sortIconGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  sortText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    fontFamily: "outfit",
    fontWeight: "600",
  },
  clearSortButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  recipeCardContainer: {
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: 100,
  },
  emptyIconContainer: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    marginBottom: 24,
  },
  emptyIconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: "outfit-bold",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textLight,
    fontFamily: "outfit",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  exploreButton: {
    borderRadius: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  exploreButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
    gap: 10,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.white,
    fontFamily: "outfit",
  },
});
