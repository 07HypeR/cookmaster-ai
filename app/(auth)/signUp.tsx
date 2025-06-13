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
import { useSignUp } from "@clerk/clerk-expo";
import GlobalApi from "@/services/GlobalApi";

const SignUp = () => {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [username, setUsername] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

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

  const onSignUp = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
        username,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        router.replace("/(auth)/signIn");
        await setActive({ session: signUpAttempt.createdSessionId });
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
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

            <Text style={styles.title}>Verify Your Email 📩</Text>

            <Text
              style={[
                styles.signUpText,
                { textAlign: "center", marginBottom: 20 },
              ]}
            >
              We've sent a verification code to your email.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter your verification code"
              placeholderTextColor="#6BAF92"
              value={code}
              onChangeText={(text) => setCode(text)}
              keyboardType="numeric"
            />

            <TouchableOpacity style={styles.button} onPress={onVerifyPress}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

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
            value={username}
            onChangeText={(username) => setUsername(username)}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#6BAF92"
            keyboardType="email-address"
            autoCapitalize="none"
            value={emailAddress}
            onChangeText={(email) => setEmailAddress(email)}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#6BAF92"
            secureTextEntry={true}
            value={password}
            onChangeText={(password) => setPassword(password)}
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
