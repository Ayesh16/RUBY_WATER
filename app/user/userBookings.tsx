import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import axios, { AxiosError }  from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '@/components/Navbar';

const API_URL = 'http://localhost:5000';

const UserBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      const userId = await AsyncStorage.getItem('ownerId');
      const token = await AsyncStorage.getItem('authToken'); // ✅ get the token
  
      if (!userId || !token) {
        console.warn('User ID or token not found');
        Alert.alert('Error', 'Please log in again.');
        return;
      }
  
      const response = await axios.get(`${API_URL}/bookings/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ add this
        },
      });
  
      setBookings(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('Error fetching bookings:', err.response?.data || err.message);
        Alert.alert('Error', err.response?.data?.message || 'Failed to fetch bookings');
      } else {
        console.error('Unknown error:', err);
        Alert.alert('Error', 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const cancelBooking = async (bookingId: string) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Unauthorized', 'Please log in again.');
        return;
      }

      Alert.alert(
        'Cancel Booking',
        'Are you sure you want to cancel this booking?',
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Yes',
            style: 'destructive',
            onPress: async () => {
                console.log('🚨 Sending DELETE request');
                try {
                  await axios.delete(`${API_URL}/bookings/${bookingId}`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });
                  console.log('🔐 Token:', token);
                  console.log('📤 Sending delete for bookingId:', bookingId);

                  Alert.alert('Cancelled', 'Booking has been cancelled.');
                  setLoading(true);
                  fetchUserBookings();
                } catch (err) {
                  console.error('❌ Cancel error:', err);
                  Alert.alert('Error', 'Failed to cancel booking');
                }}
            }
        ]
      );
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error('Cancel error:', error.response?.data || error.message);
          Alert.alert('Error', error.response?.data?.message || 'Failed to cancel booking');
        } else {
          console.error('Unexpected error:', error);
          Alert.alert('Error', 'Something went wrong');
        }
      }
  };

  const renderBooking = ({ item }: any) => {
    const statusColor =
      item.status === 'pending'
        ? '#ffc107'
        : item.status === 'confirmed'
        ? '#28a745'
        : item.status === 'cancelled'
        ? '#dc3545'
        : '#6c757d';

    return (
      <View style={styles.card}>
        <Text style={styles.title}>🚛 Truck ID: {item.truck_id}</Text>
        <Text style={styles.detail}>📍 Address: {item.address}</Text>
        <Text style={styles.detail}>📞 Phone: {item.phone}</Text>
        <Text style={styles.detail}>📅 Delivery: {new Date(item.delivery_time).toLocaleString()}</Text>

        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>

        {item.status !== 'cancelled' && (
          <TouchableOpacity
            onPress={() => cancelBooking(item._id)}
            style={styles.cancelBtn}
          >
            <Text style={styles.cancelBtnText}>Cancel Booking</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 40 }} />;
  }

  if (bookings.length === 0) {
    return (
      <Text style={styles.emptyText}>📝 You haven’t booked any trucks yet.</Text>
    );
  }

  return (
    <FlatList
      data={bookings}
      keyExtractor={(item) => item._id}
      renderItem={renderBooking}
      contentContainerStyle={{ padding: 15 }}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 18,
    marginBottom: 15,
    borderRadius: 12,
    borderLeftWidth: 6,
    borderLeftColor: '#007BFF',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  detail: {
    fontSize: 15,
    color: '#555',
    marginBottom: 3,
  },
  statusBadge: {
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  cancelBtn: {
    marginTop: 15,
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default UserBookings;
