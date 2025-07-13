import { UserContext } from "@/context/UserContext";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  Alert,
} from "react-native";

import Toast from "react-native-toast-message";

import GlobalApi from "@/services/GlobalApi";

const SignUp = () => {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const showToastOrAlert = (title: string, message: string, icon?: string) => {
    if (Platform.OS === "ios") {
      Alert.alert(title, message);
    } else {
      Toast.show({
        type: "custom",
        text1: title,
        text2: message,
        position: "bottom",
        visibilityTime: 2500,
        props: { icon: icon || "❗" },
      });
    }
  };

  const onSignUp = async () => {};

  const handleGoogleSignUp = async () => {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ alignItems: "center", marginBottom: 20 }}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={{ width: 80, height: 80, borderRadius: 9 }}
            />
          </View>

          <Text style={styles.title}>Create Account ✨</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#6BAF92"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#6BAF92"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#6BAF92"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={onSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>OR</Text>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignUp}
          >
            <Image
              source={require("@/assets/images/search.png")}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Sign up with Google</Text>
          </TouchableOpacity>

          <View style={styles.signInContainer}>
            <Text style={styles.signUpText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.signUpLink}> Sign in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E8F5E9",
  },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    color: "#2E7D32",
    marginBottom: 32,
    textAlign: "center",
    fontFamily: "outfit-bold",
  },
  input: {
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 20,
    borderColor: "#A5D6A7",
    borderWidth: 1,
    fontFamily: "outfit",
    color: "#2E7D32",
  },
  button: {
    backgroundColor: "#43A047",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "outfit",
  },
  signInContainer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "center",
  },
  signUpText: {
    color: "#2E7D32",
    fontSize: 14,
    fontFamily: "outfit",
  },
  orText: {
    textAlign: "center",
    marginVertical: 16,
    color: "#2E7D32",
    fontFamily: "outfit-bold",
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#A5D6A7",
    borderWidth: 1,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    color: "#2E7D32",
    fontFamily: "outfit-bold",
  },
  signUpLink: {
    color: "#1B5E20",
    fontSize: 14,
    fontFamily: "outfit-bold",
  },
});
