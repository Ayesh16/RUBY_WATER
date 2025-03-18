import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text,
  ImageBackground, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Image 
} from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please fill out both email and password fields.');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields.',
      });
      return;
    }
  
    setLoading(true);
  
    try {
      const storedUser = await AsyncStorage.getItem('user');
  
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
  
        if (parsedUser.email === email && parsedUser.password === password) {
          Toast.show({
            type: 'success',
            text1: 'Login Successful',
            text2: 'Welcome back!',
          });
          await AsyncStorage.setItem('user', JSON.stringify({ ...parsedUser, isLoggedIn: true }));
          setTimeout(() => {
            router.push('/Pages/home');
          }, 2000);
        } else {
          setErrorMessage('Invalid email or password.');
          Toast.show({
            type: 'error',
            text1: 'Invalid Credentials',
            text2: 'Incorrect email or password.',
          });
        }
      } else {
        setErrorMessage('User not found. Please register first.');
        Toast.show({
          type: 'error',
          text1: 'User Not Found',
          text2: 'Please register first.',
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred. Please try again.');
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: 'Something went wrong. Try again.',
      });
    }
  
    setLoading(false);
  };
  
  const checkLoginStatus = async () => {
    const user = await AsyncStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.isLoggedIn) {
        router.push('/Pages/home');
      }
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    Toast.show({
      type: 'info',
      text1: 'Logged Out',
      text2: 'You have successfully logged out.',
    });
    router.push('/auth/signin');
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
            autoComplete="email"
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

      {/* Toast Message Component */}
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
