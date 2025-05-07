import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';

const API_URL = 'http://192.168.131.73:5000'; // Replace with your actual IP

const UserDetails = () => {
  const [name, setName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [originalPhone, setOriginalPhone] = useState('');
  const [address, setAddress] = useState('');
  const [originalAddress, setOriginalAddress] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      const res = await axios.get(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setName(res.data.name);
      setOriginalName(res.data.name);
      setEmail(res.data.email);
      setPhone(res.data.phone);
      setOriginalPhone(res.data.phone);
      setAddress(res.data.address);
      setOriginalAddress(res.data.address);
    } catch (err) {
      console.error('Fetch error:', err);
      Alert.alert('Error', 'Failed to load user data.');
    } finally {
      setLoading(false);
    }
  };

  const saveChanges = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) return;

      const updateData = { name, phone, address };

      const res = await axios.put(`${API_URL}/auth/profile`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOriginalName(name);
      setOriginalPhone(phone);
      setOriginalAddress(address);
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (err) {
      console.error('Update error:', err);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <>
      <Navbar isLoggedIn={true} onLogout={() => console.log("Logging out...")} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={100}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <View style={styles.fieldGroup}>
              <MaterialIcons name="email" size={20} color="#6b7280" />
              <Text style={styles.label}>Email</Text>
            </View>
            <Text style={styles.value}>{email}</Text>

            <View style={styles.fieldGroup}>
              <Ionicons name="person" size={20} color="#6b7280" />
              <Text style={styles.label}>Name</Text>
            </View>
            {editing ? (
              <TextInput style={styles.input} value={name} onChangeText={setName} />
            ) : (
              <Text style={styles.value}>{name}</Text>
            )}

            <View style={styles.fieldGroup}>
              <Feather name="phone" size={20} color="#6b7280" />
              <Text style={styles.label}>Phone</Text>
            </View>
            {editing ? (
              <TextInput style={styles.input} value={phone} onChangeText={setPhone} />
            ) : (
              <Text style={styles.value}>{phone}</Text>
            )}

            <View style={styles.fieldGroup}>
              <Ionicons name="location-outline" size={20} color="#6b7280" />
              <Text style={styles.label}>Address</Text>
            </View>
            {editing ? (
              <TextInput style={styles.input} value={address} onChangeText={setAddress} />
            ) : (
              <Text style={styles.value}>{address}</Text>
            )}

            <TouchableOpacity
              onPress={editing ? saveChanges : () => setEditing(true)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>{editing ? 'Save Changes' : 'Edit Profile'}</Text>
            </TouchableOpacity>

            {editing && (
              <TouchableOpacity
                onPress={() => {
                  setName(originalName);
                  setPhone(originalPhone);
                  setAddress(originalAddress);
                  setEditing(false);
                }}
                style={[styles.button, styles.cancelButton]}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    padding: 24,
    paddingTop: 100, // <- Added to push content below sticky navbar
    backgroundColor: '#f9fafb',
    flex: 1,
  },
  
  fieldGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 6,
  },
  label: {
    fontWeight: '600',
    fontSize: 15,
    color: '#1f2937',
  },
  value: {
    fontSize: 16,
    marginTop: 8,
    color: '#111827',
    backgroundColor: '#e5e7eb',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 8,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#111827',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 32,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6b7280',
    marginTop: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.6,
  },
});

export default UserDetails;
