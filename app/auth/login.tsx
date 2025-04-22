import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MotiView } from "moti";

const API_URL = "http://192.168.1.36:5000/auth/login";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const storeUserDetails = async (token: string, ownerId: string) => {
    try {
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("ownerId", ownerId);
      console.log("✅ Token & Owner ID stored successfully!");
    } catch (error) {
      console.error("❌ Error storing token & owner ID:", error);
    }
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("📌 Full API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }

      if (!data.token || !data.owner_id) {
        throw new Error("⚠️ Token or Owner ID missing in response!");
      }

      await storeUserDetails(data.token, data.owner_id);

      const storedToken = await AsyncStorage.getItem("authToken");
      const storedOwnerId = await AsyncStorage.getItem("ownerId");
      console.log("📌 Stored Token:", storedToken);
      console.log("📌 Stored Owner ID:", storedOwnerId);

      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: `Welcome back, ${data.name || "User"}!`,
      });

      console.log("📌 User Role:", data.role);

      setTimeout(() => {
        router.push(data.role === "provider" ? "/provider/providerhome" : "/home");
      }, 2000);
    } catch (error: any) {
      console.error("❌ Login Error:", error.message);
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <MotiView
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 800 }}
      >
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}

        <View style={styles.signupLinkContainer}>
          <Text>New User?</Text>
          <TouchableOpacity onPress={() => router.push("/auth/signup")}>
            <Text style={styles.signupLink}> Register</Text>
          </TouchableOpacity>
        </View>

        <Toast />
      </MotiView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
    backgroundColor: "#F9F9F9",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  signupLinkContainer: { flexDirection: "row", justifyContent: "center", marginTop: 15 },
  signupLink: { color: "#007BFF", fontWeight: "bold", textDecorationLine: "underline" },
});

export default Login;
