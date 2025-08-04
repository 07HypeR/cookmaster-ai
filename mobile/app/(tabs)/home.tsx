import { FlatList, ScrollView, StatusBar, Animated } from "react-native";
import React, { useRef, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import Colors from "@/shared/Colors";
import IntroHeader from "@/components/IntroHeader";
import CreateRecipeBanner from "@/components/CreateRecipeBanner";
import CategoryList from "@/components/CategoryList";
import LatestRecipes from "@/components/LatestRecipes";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Home = () => {
  const insets = useSafeAreaInsets();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Function to start entrance animations
  const startEntranceAnimations = () => {
    // Reset animation values
    fadeAnim.setValue(0);
    slideAnim.setValue(30);

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

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <FlatList
        data={[]}
        renderItem={() => null}
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: Colors.background,
          paddingTop: insets.top,
        }}
        ListHeaderComponent={
          <Animated.ScrollView
            style={{
              padding: 20,
              backgroundColor: Colors.background,
            }}
            contentContainerStyle={{
              paddingBottom: 120, // Add extra bottom space for scrolling
            }}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }}
            >
              {/* Intro */}
              <IntroHeader />

              {/* Create Recipe Ad Banner */}
              <CreateRecipeBanner />

              {/* Category */}
              <CategoryList />

              <LatestRecipes />
            </Animated.View>
          </Animated.ScrollView>
        }
      />
    </>
  );
};

export default Home;
