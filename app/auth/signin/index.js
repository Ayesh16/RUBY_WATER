import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useNavigation } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';
import { Video } from 'expo-av'; // Importing Video component from expo-av

// Validation schema using Yup
const schema = yup.object().shape({
  name: yup.string().required('Customer name is required'),
  mobile: yup
    .string()
    .min(10, 'Mobile number must be at least 10 digits')
    .required('Mobile number is required'),
  address: yup.string().required('Address is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  pincode: yup
    .string()
    .matches(/^[0-9]{6}$/, 'PIN Code must be 6 digits')
    .required('PIN Code is required'),
  location: yup.string().required('Location is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  lastName: yup.string().required('Last Name is required'),
});

export default function SignUp() {
  const navigation = useNavigation();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      email: data.email,
      password: data.password,
      lastName: data.lastName,
      location: data.location,
      phoneno: `+91${data.mobile}`,
    };

    try {
      console.log('Sending Payload:', payload);
      const response = await fetch('https://promptly-touched-toucan.ngrok-free.app/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.message || 'Something went wrong!');
      }

      const responseData = await response.json();
      console.log('API Response:', responseData);
      navigation.navigate('SignIn');
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong');
      console.error('Fetch Error:', error);
    }
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
      
      {/* Form and Input Fields */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Register</Text>

            {/* Customer Name Input */}
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Customer Name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
                </View>
              )}
            />

            {/* Last Name Input */}
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.lastName && <Text style={styles.error}>{errors.lastName.message}</Text>}
                </View>
              )}
            />

            {/* Mobile Number Input */}
            <Controller
              control={control}
              name="mobile"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Mobile Number"
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.mobile && <Text style={styles.error}>{errors.mobile.message}</Text>}
                </View>
              )}
            />

            {/* Email Input */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
                </View>
              )}
            />

            {/* Password Input */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
                </View>
              )}
            />

            {/* Location Input */}
            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, onBlur, value } }) => (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Location"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                  {errors.location && <Text style={styles.error}>{errors.location.message}</Text>}
                </View>
              )}
            />

            {/* Submit Button */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Text style={styles.link}>Already have an account? Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundVideo: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: '#fff',
  },
  error: {
    color: 'red',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    textAlign: 'center',
    marginTop: 10,
    color: '#007BFF',
  },
});
