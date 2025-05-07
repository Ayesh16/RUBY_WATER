import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Navbar from '@/components/Navbar';

const API_URL = 'http://192.168.131.73:5000'; // Change to your IP if testing on device

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
      console.log('Token:', token);
      if (!token) return;

      const res = await axios.get(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('User Data:', res.data);

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

      console.log('Update Response:', res.data);

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
    <><Navbar isLoggedIn={true} onLogout={() => console.log("Logging out...")} /><View style={styles.container}>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{email}</Text>

      <Text style={styles.label}>Name:</Text>
      {editing ? (
        <TextInput style={styles.input} value={name} onChangeText={setName} />
      ) : (
        <Text style={styles.value}>{name}</Text>
      )}

      <Text style={styles.label}>Phone:</Text>
      {editing ? (
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} />
      ) : (
        <Text style={styles.value}>{phone}</Text>
      )}

      <Text style={styles.label}>Address:</Text>
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
          } }
          style={[styles.button, styles.cancelButton]}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </View></>
  );
};

const styles = StyleSheet.create({
    container: {
      padding: 24,
      backgroundColor: '#f9fafb',
      flex: 1,
      marginTop:100
    },
    label: {
      fontWeight: '600',
      marginTop: 20,
      fontSize: 15,
      color: '#111827',
      letterSpacing: 0.5,
    },
    value: {
      fontSize: 16,
      marginTop: 6,
      color: '#374151',
      backgroundColor: '#e5e7eb',
      padding: 10,
      borderRadius: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: '#d1d5db',
      borderRadius: 10,
      padding: 12,
      marginTop: 6,
      fontSize: 16,
      backgroundColor: '#fff',
      color: '#111827',
    },
    button: {
      backgroundColor: '#3b82f6',
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 10,
      marginTop: 32,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 3,
    },
    cancelButton: {
      backgroundColor: '#9ca3af',
      marginTop: 12,
    },
    buttonText: {
      color: '#ffffff',
      fontWeight: 'bold',
      fontSize: 16,
      letterSpacing: 0.5,
    },
  });
  

export default UserDetails;
