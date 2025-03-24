import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Checkbox from 'expo-checkbox'; // ✅ Import Checkbox
import { useNavigation, useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

const API_URL = 'https://5778-27-62-98-154.ngrok-free.app/auth/signup'.trim();
const TRUCK_API_URL = 'https://5778-27-62-98-154.ngrok-free.app/trucks/register'.trim();

// ✅ Validation Schema
const schema = yup.object({
  name: yup.string().required('Customer name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: yup.string().oneOf(['user', 'provider']).required('Role is required'),
  owner_id: yup.string().when('role', {
    is: 'provider',
    then: (schema) => schema.required('Owner ID is required'),
  }),
  truck_name: yup.string().when('role', {
    is: 'provider',
    then: (schema) => schema.required('Truck name is required'),
  }),
  capacity: yup.string().when('role', {
    is: 'provider',
    then: (schema) => schema.required('Truck capacity is required'),
  }),
  truck_type: yup.string().when('role', {
    is: 'provider',
    then: (schema) => schema.required('Truck type is required'),
  }),
  location: yup.string().when('role', {
    is: 'provider',
    then: (schema) => schema.required('Location is required'),
  }),
});

export default function SignUp() {
  const navigation = useNavigation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // ✅ Track checkbox state

  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: 'user' },
  });

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  // ✅ When checkbox is toggled, update role
  const toggleRole = () => {
    const newRole = !isChecked ? 'provider' : 'user';
    setIsChecked(!isChecked);
    setValue('role', newRole); // ✅ Ensure role is updated
  };

  // ✅ Handle Form Submission
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // ✅ 1. Sign up user
      const response = await axios.post(API_URL, data);
      Alert.alert('Success', 'Signup Successful!');

      // ✅ 2. If provider, register truck
      if (data.role === 'provider') {
        const truckPayload = {
          owner_id: response.data.userId, // ✅ Corrected Owner ID
          truck_name: data.truck_name,
          capacity: data.capacity,
          truck_type: data.truck_type,
          location: data.location,
        };

        await axios.post(TRUCK_API_URL, truckPayload);
        Alert.alert('Truck Registered', 'Your truck details have been stored.');
      }

      // ✅ 3. Navigate to Login
      router.push('/auth/login');
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.message || 'Something went wrong'
        : 'An unexpected error occurred';
      Alert.alert('Signup Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>

        {/* ✅ User Fields */}
        {(['name', 'email', 'password'] as const).map((field) => (
          <View key={field}>
            <Controller
              control={control}
              name={field}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ?? ''}
                  secureTextEntry={field === 'password'}
                />
              )}
            />
            {errors[field] && <Text style={styles.errorText}>{errors[field]?.message}</Text>}
          </View>
        ))}

        {/* ✅ Checkbox for Provider Role */}
        <View style={styles.checkboxContainer}>
          <Checkbox value={isChecked} onValueChange={toggleRole} color={isChecked ? "#007BFF" : undefined} />
          <Text style={styles.checkboxLabel}>Register as a Provider</Text>
        </View>

        {/* ✅ Provider Fields (Only visible when checkbox is checked) */}
        {isChecked && (['owner_id', 'truck_name', 'capacity', 'truck_type', 'location'] as const).map((field) => (
          <View key={field}>
            <Controller
              control={control}
              name={field}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder={field.replace('_', ' ').toUpperCase()}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ?? ''}
                />
              )}
            />
            {errors[field] && <Text style={styles.errorText}>{errors[field]?.message}</Text>}
          </View>
        ))}

        {/* ✅ Loading & Submit */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        )}

        {/* ✅ Already a User? Login */}
        <View style={styles.loginLinkContainer}>
          <Text>Already a user?</Text>
          <TouchableOpacity onPress={() => router.push('/auth/login')}>
            <Text style={styles.loginLink}> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ✅ Styles
// ✅ Styles
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingLeft: 10, marginBottom: 10 },
  button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  checkboxLabel: { marginLeft: 10, fontSize: 16 },
  errorText: { color: 'red', fontSize: 14, marginBottom: 5 },

  // ✅ Added missing styles
  loginLinkContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 15 },
  loginLink: { color: '#007BFF', fontWeight: 'bold', textDecorationLine: 'underline' },
});




