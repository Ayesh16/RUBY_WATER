import React, { useEffect, useState } from 'react';
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
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BouncyCheckbox from 'react-native-bouncy-checkbox'; 
import { useNavigation } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'expo-router';

interface SignUpFormData {
  name: string;
  mobile: string;
  address: string;
  email: string;
  pincode: string;
  location: string;
  password: string;
  role: "user" | "admin"; 
  truck_OwnerName?: string;
  truck_Id?: string;
  truck_Capacity?: string;
  truck_Type?: string;
}

const schema = yup.object({
  name: yup.string().required('Customer name is required'),
  mobile: yup.string().matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits').required('Mobile number is required'),
  address: yup.string().required('Address is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  pincode: yup.string().matches(/^[0-9]{6}$/, 'PIN Code must be 6 digits').required('PIN Code is required'),
  location: yup.string().required('Location is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  role: yup.mixed<'user' | 'admin'>().oneOf(['user', 'admin']).required('Role is required'),
  
  truck_OwnerName: yup.string().when('role', {
    is: "admin",
    then: (schema) => schema.required('Truck Owner Name is required'),
  }),
  truck_Id: yup.string().when('role', {
    is: "admin",
    then: (schema) => schema.required('Truck ID is required'),
  }),
  truck_Capacity: yup.string().when('role', {
    is: "admin",
    then: (schema) => schema.required('Truck Capacity is required'),
  }),
  truck_Type: yup.string().when('role', {
    is: "admin",
    then: (schema) => schema.required('Truck Type is required'),
  }),
});

export default function SignUp() {
  const navigation = useNavigation();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignUpFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      role: 'user', 
    },
  });

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(data));
      Alert.alert('Success', 'Account created successfully!');
      router.push('/auth/signin');
    } catch (error) {
      Alert.alert('Error', 'Failed to save user data');
    }
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
        
            <View style={styles.formContainer}>
              <Text style={styles.title}>Register</Text>
              
              {/* Standard User Fields */}
              {['name', 'email', 'mobile', 'address', 'pincode', 'location', 'password'].map((field) => (
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
                        value={value ?? ''} // Fix for uncontrolled input
                        secureTextEntry={field === 'password'}
                      />
                      {errors[field as keyof SignUpFormData] && (
                        <Text style={styles.error}>{errors[field as keyof SignUpFormData]?.message}</Text>
                      )}
                    </View>
                  )}
                />
              ))}

              {/* Checkbox for Admin */}
              <View style={styles.checkboxContainer}>
  <BouncyCheckbox
    size={25}
    fillColor="green"
    text="Register as Admin"
    isChecked={isAdmin}
    onPress={(checked: boolean) => {
      setIsAdmin(checked);
      setValue('role', checked ? 'admin' : 'user', { shouldValidate: true });
    }}
    textStyle={{
      textDecorationLine: "none", // Prevents strikethrough
      color: "white", // Ensures proper visibility
      fontSize: 16, // Adjust font size
    }}
    innerIconStyle={{
      borderWidth: 2, // Makes checkbox border more visible
      borderColor: "white", 
    }}
    style={{ marginBottom: 10 }} // Adds space below to prevent overlap
  />
</View>


              {/* Admin-Specific Fields */}
              {isAdmin && ['truck_OwnerName', 'truck_Id', 'truck_Capacity', 'truck_Type'].map((field) => (
                <Controller
                  key={field}
                  control={control}
                  name={field as keyof SignUpFormData}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.input}
                        placeholder={field.replace('_', ' ')}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value ?? ''} // Ensures a controlled component
                      />
                      {errors[field as keyof SignUpFormData] && (
                        <Text style={styles.error}>{errors[field as keyof SignUpFormData]?.message}</Text>
                      )}
                    </View>
                  )}
                />
              ))}

              {/* Sign Up Button */}
              <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
               <View style={styles.signinLinkContainer}>
                        <Text style={styles.signinLink} onPress={() => router.push('/auth/signin')}>
                          Already an user? Login
                        </Text>
              </View>
            </View>
          
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
}

// Styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: { flex: 1, justifyContent: 'center', padding: 20, width: '100%' },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: 'white' },
  inputContainer: { marginBottom: 15, height: 50, width: 300 },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingLeft: 10, backgroundColor: '#fff' },
  error: { color: 'red', fontSize: 12 },
  button: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  checkboxContainer: { marginVertical: 10, alignItems: 'flex-start' },
  signinLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signinLink: {
    color: 'white',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});
