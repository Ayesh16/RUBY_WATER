import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Video } from 'expo-av';  // Import Video from expo-av
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please fill out both email and password fields.');
      return;
    }
    const payload = { email, password };

    try {
      setLoading(true);
      const response = await fetch(' https://promptly-touched-toucan.ngrok-free.app/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Something went wrong!');
      }

      const { token } = responseData;
      if (token) {
        alert('Login successful!');
        router.push('/home');  // Redirect to home page
      }
    } catch (error) {
      setErrorMessage('Login Failed: ' + (error.message || 'Something went wrong'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Implement Google Login logic here
    alert("Google Login clicked!");
  };

  return (
    <View style={styles.container}>
      {/* Video Background */}
      <Video
        source={require('../../../assets/videos/1.mp4')}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="cover"
        shouldPlay
        isLooping
        style={StyleSheet.absoluteFillObject}  // Fullscreen video
      />

      {/* Overlay for form */}
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
            autoCompleteType="email"
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

        {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}

        {/* Google Login Button */}
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
          <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}  // Google logo
            style={styles.googleLogo}
          />
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>

        <View style={styles.signupLinkContainer}>
          <Text style={styles.signupLink} onPress={() => router.push('/auth/signin')}>
            New User? Register
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, ,1 , 0.7)',  // Increase opacity for a darker effect
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#fff',  // Keep text white for contrast
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
    width: '100%',
  },
  input: {
    height: 50,
    borderColor: '#fff',  // Keep lighter border for input fields
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',  // Keep semi-transparent input background
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',  // Dark text color inside inputs
  },
  errorMessage: {
    color: '#f44336',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    width: '100%',
    maxWidth: 350,
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupLink: {
    color: '#fff',  // Keep signup link white
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});


