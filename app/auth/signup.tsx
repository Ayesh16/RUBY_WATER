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
import { useNavigation, useRouter } from 'expo-router';
import { useForm, Controller, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';

const API_URL = 'http://localhost:5000/auth/signup'.trim();
const TRUCK_API_URL = 'http://localhost:5000/trucks/register'.trim();

// ✅ Validation Schema
const schema = yup.object({
  name: yup.string().required('Customer name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: yup.string().oneOf(['user', 'admin', 'provider']).required('Role is required'),
  checked: yup.boolean(),
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

  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: 'user', checked: false },
  });

  const role = useWatch({ control, name: 'role' });
  const isProvider = role === 'provider';

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  // ✅ Handle Form Submission
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        checked: data.role === 'provider',
        truckDetails: data.role === 'provider' ? {
          owner_id: "", // Backend will assign this
          truck_name: data.truck_name,
          capacity: data.capacity,
          truck_type: data.truck_type,
          location: data.location,
        } : undefined,
      };
  
      console.log("🚀 Sending Payload:", JSON.stringify(payload, null, 2));
  
      const response = await axios.post(API_URL, payload);
      
      Alert.alert('Success', 'Signup Successful!');
      router.push('/auth/login');
    } catch (error: unknown) {  // ✅ Explicitly set error type to `unknown`
      if (axios.isAxiosError(error)) {  // ✅ Check if it's an Axios error
        console.error("❌ Signup Error:", error.response?.data || error.message);
        Alert.alert('Signup Failed', error.response?.data?.message || 'An error occurred');
      } else {
        console.error("❌ Unexpected Error:", error);
        Alert.alert('Signup Failed', 'An unexpected error occurred');
      }
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

        {/* ✅ Role Selection */}
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => {
            const newRole = isProvider ? 'user' : 'provider';
            setValue('role', newRole);
            setValue('checked', newRole === 'provider');
          }}
        >
          <Text style={styles.toggleButtonText}>
            {isProvider ? 'Register as User' : 'Register as Provider'}
          </Text>
        </TouchableOpacity>

        {/* ✅ Provider Fields */}
        {isProvider && (['truck_name', 'capacity', 'truck_type', 'location'] as const).map((field) => (
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
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingLeft: 10, marginBottom: 10 },
  button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  toggleButton: { backgroundColor: '#007BFF', padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
  toggleButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: 'red', fontSize: 14, marginBottom: 5 },
  loginLinkContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 15 },
  loginLink: { color: '#007BFF', fontWeight: 'bold', textDecorationLine: 'underline' },
});




