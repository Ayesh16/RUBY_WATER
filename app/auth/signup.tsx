import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';

// Define the form data interface
interface SignUpFormData {
  name: string;
  lastName: string;
  mobile: string;
  address: string;
  email: string;
  pincode: string;
  location: string;
  password: string;
}

// Validation schema using Yup
const schema = yup.object().shape({
  name: yup.string().required('Customer name is required'),
  mobile: yup
    .string()
    .min(10, 'Mobile number must be at least 10 digits')
    .required('Mobile number is required'),
  address: yup.string().required('Address is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
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
  } = useForm<SignUpFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const onSubmit = async (data: SignUpFormData) => {
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
      router.push('/auth/signin');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
      console.error('Fetch Error:', error);
    }
  };

  return (
    <View style={styles.container}>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Register</Text>

            {['name', 'lastName', 'mobile', 'email', 'password', 'location'].map((field) => (
              <Controller
                key={field}
                control={control}
                name={field as keyof SignUpFormData}
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      secureTextEntry={field === 'password'}
                      keyboardType={field === 'mobile' ? 'numeric' : 'default'}
                    />
                    {errors[field as keyof SignUpFormData] && (
                      <Text style={styles.error}>{errors[field as keyof SignUpFormData]?.message}</Text>
                    )}
                  </View>
                )}
              />
            ))}

            <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/auth/signin')}>
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
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
    height: 50,
    width: 300
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
