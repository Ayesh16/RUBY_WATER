import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ImageBackground, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

const API_URL = 'https://5778-27-62-98-154.ngrok-free.app/auth/login'; // Replace with actual API

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields.',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome back!',
      });

      setTimeout(() => {
        router.push('/Pages/home'); // Redirect to Home page
      }, 2000);
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.message || 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/background.png')} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Login</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}

        <View style={styles.signupLinkContainer}>
          <Text style={styles.signupLink} onPress={() => router.push('/auth/signup')}>
            New User? Register
          </Text>
        </View>
      </View>

      {/* Toast Notification */}
      <Toast />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: 'white',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
    width: 300,
    height: 50,
  },
  input: {
    height: 50,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    width: 300,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupLink: {
    color: 'white',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});

export default Login;
