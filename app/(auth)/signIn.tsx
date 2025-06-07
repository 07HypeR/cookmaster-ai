import { UserContext } from "@/context/UserContext";
import { auth } from "@/services/firebase";
import GlobalApi from "@/services/GlobalApi";
import { useRouter } from "expo-router";
import {
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useContext, useState } from "react";
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

const SignIn = () => {
  const { user, setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [unverifiedUser, setUnverifiedUser] = useState<
    import("firebase/auth").User | null
  >(null);
  const [failedAttempt, setFailedAttempt] = useState(0);
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

  const onSignIn = async () => {
    if (!email || !password) {
      showToastOrAlert("Missing Fields!", "Enter all field values", "🙄");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseUser = userCredential.user;

      if (!firebaseUser.emailVerified) {
        setUnverifiedUser(firebaseUser);
        showToastOrAlert(
          "Email Not Verified ❌",
          "Please verify your email first.",
          "📭"
        );
        setLoading(false);
        return;
      }

      const userData = await GlobalApi.GetUserByEmail(email);

      let finalUserData = userData;
      if (!userData) {
        const data = {
          name: firebaseUser.displayName ?? "New User",
          email: firebaseUser.email ?? email,
        };
        finalUserData = await GlobalApi.CreateNewUser(data);
      }

      setUser(finalUserData);
      showToastOrAlert("Login Successful ✅", "Cook your delicious food", "🫡");
      router.replace("/(tabs)/Home");
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        console.log("SignIn Error:", (error as { message: string }).message);
      } else {
        console.log("SignIn Error:", error);
      }
      setFailedAttempt((prev) => prev + 1);

      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error as any).code === "auth/user-not-found"
      ) {
        showToastOrAlert("User Not Found", "No account with this email", "❌");
      } else {
        showToastOrAlert(
          "Incorrect Email & Password!",
          "Please enter valid credentials",
          "🤨"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    if (!unverifiedUser) return;

    try {
      await sendEmailVerification(unverifiedUser);
      showToastOrAlert(
        "Verification Email Sent ✅",
        "Check your inbox or spam folder",
        "📧"
      );
      setResendCooldown(60);
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        console.log("Resend error:", (error as { message: string }).message);
      } else {
        console.log("Resend error:", error);
      }
      showToastOrAlert("Failed to Resend!", "Try again later", "❌");
    }
  };

  const forgotPassword = async () => {
    if (!email) {
      showToastOrAlert(
        "Email Required",
        "Please enter your email to reset password",
        "📧"
      );
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      showToastOrAlert(
        "Reset Link Sent ✅",
        "Check your email to reset your password",
        "📤"
      );
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        console.log(
          "Forgot Password Error:",
          (error as { message: string }).message
        );
        showToastOrAlert(
          "Reset Failed",
          (error as { message: string }).message,
          "❌"
        );
      } else {
        console.log("Forgot Password Error:", error);
        showToastOrAlert("Reset Failed", "An unknown error occurred", "❌");
      }
    }
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign In clicked");
    // You'll implement actual Google Sign-In logic here later
  };

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

          <Text style={styles.title}>Welcome Back 👋</Text>

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

          <TouchableOpacity style={styles.button} onPress={onSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>OR</Text>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleSignIn}
          >
            <Image
              source={require("@/assets/images/search.png")}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Sign in with Google</Text>
          </TouchableOpacity>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signUp")}>
              <Text style={styles.signUpLink}> Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;

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
    fontWeight: "600",
    fontFamily: "outfit",
  },
  orText: {
    textAlign: "center",
    marginVertical: 16,
    color: "#2E7D32",
    fontWeight: "600",
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
    fontWeight: "600",
    fontFamily: "outfit-bold",
  },
  signUpContainer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "center",
  },
  signUpText: {
    color: "#2E7D32",
    fontSize: 14,
    fontFamily: "outfit",
  },
  signUpLink: {
    color: "#1B5E20",
    fontWeight: "600",
    fontSize: 14,
    fontFamily: "outfit-bold",
  },
  forgotPassword: {
    textAlign: "center",
    color: "#388E3C",
    fontSize: 14,
    fontWeight: "500",
  },
});
