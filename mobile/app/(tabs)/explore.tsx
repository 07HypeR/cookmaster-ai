import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Animated,
  TextInput,
} from "react-native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Colors from "@/shared/Colors";
import GlobalApi from "@/services/GlobalApi";
import RecipeCard from "@/components/RecipeCard";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

interface Recipe {
  id?: number;
  attributes?: {
    recipeName?: string;
    description?: string;
    category?: string;
    likes?: number;
    createdAt?: string;
    [key: string]: any;
  };
  recipeName?: string;
  description?: string;
  category?: string | any;
  likes?: number;
  createdAt?: string;
  [key: string]: any;
}

const Explore = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [recipeList, setRecipeList] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const filterAnim = useRef(new Animated.Value(0)).current;
  const isToggling = useRef(false);

  const categories = [
    {
      id: "all",
      name: "All",
      icon: "grid",
      color: "#6366f1",
      gradient: ["#667eea", "#764ba2"],
    },
    {
      id: "breakfast",
      name: "Breakfast",
      icon: "sunny",
      color: "#f59e0b",
      gradient: ["#f093fb", "#f5576c"],
    },
    {
      id: "lunch",
      name: "Lunch",
      icon: "restaurant",
      color: "#10b981",
      gradient: ["#4facfe", "#00f2fe"],
    },
    {
      id: "dinner",
      name: "Dinner",
      icon: "moon",
      color: "#8b5cf6",
      gradient: ["#43e97b", "#38f9d7"],
    },
    {
      id: "dessert",
      name: "Dessert",
      icon: "ice-cream",
      color: "#ec4899",
      gradient: ["#fa709a", "#fee140"],
    },
    {
      id: "cake",
      name: "Cake",
      icon: "cake",
      iconType: "material",
      color: "#f97316",
      gradient: ["#ffecd2", "#fcb69f"],
    },
    {
      id: "drink",
      name: "Drink",
      icon: "cafe",
      color: "#06b6d4",
      gradient: ["#a8edea", "#fed6e3"],
    },
    {
      id: "fastfood",
      name: "Fast Food",
      icon: "fast-food",
      color: "#ef4444",
      gradient: ["#ff9a9e", "#fecfef"],
    },
    {
      id: "salad",
      name: "Salad",
      icon: "leaf",
      color: "#84cc16",
      gradient: ["#d299c2", "#fef9d7"],
    },
  ];

  const sortOptions = [
    { id: "newest", name: "Newest", icon: "time" },
    { id: "popular", name: "Popular", icon: "trending-up" },
    { id: "name", name: "Name", icon: "text" },
  ];

  // Function to start entrance animations
  const startEntranceAnimations = () => {
    // Reset animation values
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    scaleAnim.setValue(0.95);

    // Start animations
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
  };

  // Start entrance animations when component mounts
  useEffect(() => {
    startEntranceAnimations();
  }, []);

  // Restart animations when tab comes into focus
  useFocusEffect(
    React.useCallback(() => {
      startEntranceAnimations();
    }, [])
  );

  const GetAllRecipes = async (category?: string, isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      let result;
      if (category && category !== "all") {
        result = await GlobalApi.GetRecipeByCategory(category);
      } else {
        result = await GlobalApi.GetAllRecipeList();
      }

      // Ensure we have valid data
      const recipes = result?.data?.data || [];
      setRecipeList(Array.isArray(recipes) ? recipes : []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setRecipeList([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterAndSortRecipes = useCallback(() => {
    // Ensure recipeList is an array
    if (!Array.isArray(recipeList)) {
      setFilteredRecipes([]);
      return;
    }

    let filtered = [...recipeList];

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((recipe) => {
        if (!recipe) return false;

        const recipeName =
          recipe.attributes?.recipeName || recipe.recipeName || "";
        const description =
          recipe.attributes?.description || recipe.description || "";

        return (
          recipeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // Sort recipes
    switch (sortBy) {
      case "name":
        filtered.sort((a, b) => {
          const nameA = a?.attributes?.recipeName || a?.recipeName || "";
          const nameB = b?.attributes?.recipeName || b?.recipeName || "";
          return nameA.localeCompare(nameB);
        });
        break;
      case "popular":
        filtered.sort((a, b) => {
          const likesA = a?.attributes?.likes || a?.likes || 0;
          const likesB = b?.attributes?.likes || b?.likes || 0;
          return likesB - likesA;
        });
        break;
      case "newest":
      default:
        filtered.sort((a, b) => {
          const dateA = a?.attributes?.createdAt || a?.createdAt || 0;
          const dateB = b?.attributes?.createdAt || b?.createdAt || 0;
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
        break;
    }

    setFilteredRecipes(filtered);
  }, [recipeList, searchQuery, sortBy]);

  useEffect(() => {
    GetAllRecipes(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    filterAndSortRecipes();
  }, [filterAndSortRecipes]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleCategoryPress = (category: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedCategory(category);
  };

  const handleSortPress = (sort: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSortBy(sort);
  };

  const toggleFilters = useCallback(() => {
    if (isToggling.current) return;
    isToggling.current = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!showFilters) {
      setShowFilters(true);
      Animated.parallel([
        Animated.spring(filterAnim, {
          toValue: 1,
          tension: 100,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start(() => {
        isToggling.current = false;
      });
    } else {
      Animated.parallel([
        Animated.timing(filterAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowFilters(false);
        isToggling.current = false;
      });
    }
  }, [showFilters, filterAnim]);

  const clearFilters = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("newest");
  }, []);

  const onRefresh = useCallback(() => {
    GetAllRecipes(selectedCategory, true);
  }, [selectedCategory]);

  const handleCreateRecipe = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(tabs)/create");
  };

  const getEmptyStateContent = () => {
    if (searchQuery) {
      return {
        icon: "search",
        title: "No Recipes Found",
        subtitle:
          "Try adjusting your search or filters to find what you're looking for",
        actionText: "Clear Search",
        actionIcon: "refresh",
        onPress: clearFilters,
        gradient: ["#FF9800", "#F57C00"],
      };
    } else {
      return {
        icon: "restaurant",
        title: "No Recipes Available",
        subtitle:
          "Pull down to refresh and discover new recipes from around the world",
        actionText: "Create Recipe",
        actionIcon: "add-circle",
        onPress: handleCreateRecipe,
        gradient: ["#4CAF50", "#2E7D32"],
      };
    }
  };

  const emptyState = getEmptyStateContent();

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
        <View style={styles.headerTop}>
          <View style={styles.headerContent}>
            <View style={styles.headerIconContainer}>
              <LinearGradient
                colors={["#4CAF50", "#2E7D32"] as [string, string]}
                style={styles.headerIconGradient}
              >
                <Ionicons name="compass" size={28} color={Colors.white} />
              </LinearGradient>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Explore</Text>
              <Text style={styles.headerSubtitle}>
                Discover amazing recipes
              </Text>
            </View>
          </View>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.statContent}>
                {loading ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                  <Text style={styles.statNumber}>
                    {filteredRecipes.length}
                  </Text>
                )}
                <Text style={styles.statLabel}>Recipes</Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Search Bar */}
      <Animated.View
        style={[
          styles.searchContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes..."
            placeholderTextColor={Colors.textLight}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={Colors.textLight}
              />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={toggleFilters}>
          <LinearGradient
            colors={["#4CAF50", "#2E7D32"] as [string, string]}
            style={styles.filterButtonGradient}
          >
            <Ionicons name="filter" size={20} color={Colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      {/* Category Pills */}
      <Animated.View
        style={[
          styles.categoryContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryPill}
              onPress={() => handleCategoryPress(item.id)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  selectedCategory === item.id
                    ? (["#4CAF50", "#2E7D32"] as [string, string])
                    : [Colors.card, Colors.card]
                }
                style={[
                  styles.categoryGradient,
                  selectedCategory === item.id &&
                    styles.selectedCategoryGradient,
                ]}
              >
                {item.iconType === "material" ? (
                  <MaterialIcons
                    name={item.icon as any}
                    size={18}
                    color={
                      selectedCategory === item.id ? Colors.white : Colors.text
                    }
                  />
                ) : (
                  <Ionicons
                    name={item.icon as any}
                    size={18}
                    color={
                      selectedCategory === item.id ? Colors.white : Colors.text
                    }
                  />
                )}
                <Text
                  style={[
                    styles.categoryPillText,
                    selectedCategory === item.id &&
                      styles.selectedCategoryPillText,
                  ]}
                >
                  {item.name}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        />
      </Animated.View>

      {/* Filters Section */}
      {showFilters && (
        <Animated.View
          style={[
            styles.filtersContainer,
            {
              opacity: filterAnim,
              transform: [
                {
                  scale: filterAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.95, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={[Colors.card, Colors.background]}
            style={styles.filtersGradient}
          >
            {/* Sort Options */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>Sort By</Text>
              <View style={styles.sortOptionsList}>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.sortChip}
                    onPress={() => handleSortPress(option.id)}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={
                        sortBy === option.id
                          ? (["#4CAF50", "#2E7D32"] as [string, string])
                          : [Colors.card, Colors.card]
                      }
                      style={[
                        styles.sortChipGradient,
                        sortBy === option.id && styles.selectedSortChipGradient,
                      ]}
                    >
                      <Ionicons
                        name={option.icon as any}
                        size={16}
                        color={
                          sortBy === option.id ? Colors.white : Colors.text
                        }
                      />
                      <Text
                        style={[
                          styles.sortText,
                          sortBy === option.id && styles.selectedSortText,
                        ]}
                      >
                        {option.name}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Clear Filters */}
            {(searchQuery ||
              selectedCategory !== "all" ||
              sortBy !== "newest") && (
              <TouchableOpacity
                style={styles.clearFiltersButton}
                onPress={clearFilters}
              >
                <Ionicons name="refresh" size={16} color={Colors.primary} />
                <Text style={styles.clearFiltersText}>Clear Filters</Text>
              </TouchableOpacity>
            )}

            {/* Done Button */}
            <TouchableOpacity style={styles.doneButton} onPress={toggleFilters}>
              <LinearGradient
                colors={["#4CAF50", "#2E7D32"] as [string, string]}
                style={styles.doneButtonGradient}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      )}

      {/* Content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: filterAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0.5],
            }),
            transform: [
              {
                scale: filterAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.95],
                }),
              },
            ],
          },
        ]}
      >
        <FlatList
          data={filteredRecipes}
          numColumns={2}
          keyExtractor={(item, index) =>
            item.id?.toString() ||
            item.attributes?.id?.toString() ||
            index.toString()
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
            />
          }
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                  <LinearGradient
                    colors={emptyState.gradient as [string, string]}
                    style={styles.emptyIconGradient}
                  >
                    <Ionicons
                      name={emptyState.icon as any}
                      size={50}
                      color={Colors.white}
                    />
                  </LinearGradient>
                </View>
                <Text style={styles.emptyTitle}>{emptyState.title}</Text>
                <Text style={styles.emptySubtitle}>{emptyState.subtitle}</Text>
                <TouchableOpacity
                  style={styles.emptyActionButton}
                  activeOpacity={0.8}
                  onPress={emptyState.onPress}
                >
                  <LinearGradient
                    colors={emptyState.gradient as [string, string]}
                    style={styles.emptyActionGradient}
                  >
                    <Ionicons
                      name={emptyState.actionIcon as any}
                      size={18}
                      color={Colors.white}
                    />
                    <Text style={styles.emptyActionText}>
                      {emptyState.actionText}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading recipes...</Text>
              </View>
            )
          }
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
                source="explore"
                categoryName={selectedCategory}
              />
            </Animated.View>
          )}
        />
      </Animated.View>
    </View>
  );
};

export default Explore;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: Colors.background,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  headerIconContainer: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  headerIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
    fontFamily: "outfit-bold",
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textLight,
    fontFamily: "outfit",
    marginTop: 4,
    lineHeight: 20,
  },
  statsContainer: {
    alignItems: "flex-end",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statContent: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primary,
    fontFamily: "outfit-bold",
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textLight,
    fontFamily: "outfit",
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontFamily: "outfit",
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 0,
    marginLeft: 10,
  },
  filterButton: {
    borderRadius: 25,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  filterButtonGradient: {
    borderRadius: 25,
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryContainer: {
    paddingVertical: 15,
  },
  categoryList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryPill: {
    borderRadius: 25,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedCategoryGradient: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  categoryPillText: {
    fontFamily: "outfit-bold",
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  selectedCategoryPillText: {
    color: Colors.white,
  },
  filtersContainer: {
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 20,
    paddingBottom: 15,
    overflow: "hidden",
  },
  filtersGradient: {
    borderRadius: 20,
    padding: 20,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontFamily: "outfit-bold",
    fontSize: 18,
    color: Colors.text,
    marginBottom: 12,
  },
  sortOptionsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  sortChip: {
    borderRadius: 20,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sortChipGradient: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedSortChipGradient: {
    borderColor: Colors.primary,
  },
  sortText: {
    fontFamily: "outfit",
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  selectedSortText: {
    color: Colors.white,
  },
  clearFiltersButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 15,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  clearFiltersText: {
    fontFamily: "outfit-bold",
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 8,
  },
  doneButton: {
    borderRadius: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  doneButtonGradient: {
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  doneButtonText: {
    fontFamily: "outfit-bold",
    fontSize: 16,
    color: Colors.white,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  listContainerList: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  recipeCardContainer: {
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
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
    width: 120,
    height: 120,
    borderRadius: 60,
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
    paddingHorizontal: 40,
  },
  emptyActionButton: {
    borderRadius: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  emptyActionGradient: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  emptyActionText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "outfit",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textLight,
    fontFamily: "outfit",
    textAlign: "center",
  },
});
