import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MotiView } from "moti";

const API_URL = "http://192.168.131.73:5000/auth/login";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const storeUserDetails = async (token: string, ownerId: string, role: string) => {
    try {
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("ownerId", ownerId);
      await AsyncStorage.setItem("userRole", role);
      console.log("✅ Token, Owner ID & Role stored successfully!");
    } catch (error) {
      console.error("❌ Error storing login data:", error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in both fields");
      return;
    }

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

      const { token, owner_id, role } = data;

      if (!token || !owner_id || !role) {
        throw new Error("⚠️ Missing login response data");
      }

      await storeUserDetails(token, owner_id, role);

      // Navigate based on role
      if (role === "admin") {
        console.log("Redirecting to admin page...");
        router.replace("/admin/adminhome");
      } else if (role === "provider") {
        router.replace("/provider/providerhome");
      } else {
        router.replace("/home");
      }
    } catch (error: any) {
      console.error("Login Error:", error.message);
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 200 }}>
        <Text style={styles.title}>Login</Text>
      </MotiView>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}

      <View style={styles.signupLinkContainer}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/auth/signup")}>
          <Text style={styles.signupLink}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  signupLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupLink: {
    color: "#007BFF",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

export default Login;
