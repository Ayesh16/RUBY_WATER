import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

const API_URL = 'https://6052-2409-40f4-1004-868e-7432-e9ee-9e6b-e766.ngrok-free.app/auth/login';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
  
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log("Full API Response:", data); // ✅ Log full response
  
      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials");
      }
  
      if (!data.role) {
        console.warn("⚠️ Role is missing in response! API returned:", data); // ✅ Debugging
        throw new Error("Role is missing in response!");
      }
  
      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: `Welcome back, ${data.name || "User"}!`,
      });
  
      setTimeout(() => {
        if (data.role === "provider") {
          router.push("/provider/providerhome");
        } else if (data.role === "user") {
          router.push("/user/home");
        } else {
          throw new Error("Unknown role!");
        }
      }, 2000);
    } catch (error: any) {
      console.error("Login Error:", error.message);
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
        <TouchableOpacity onPress={() => router.push('/auth/signup')}>
          <Text style={styles.signupLink}> Register</Text>
        </TouchableOpacity>
      </View>

      {/* Toast Notification */}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
    backgroundColor: '#F9F9F9',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  signupLink: {
    color: '#007BFF',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default Login;
