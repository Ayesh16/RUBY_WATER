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
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      const token = await AsyncStorage.getItem('authToken');

      if (!userId || !token) {
        Alert.alert('Error', 'Please log in again.');
        return;
      }

      const response = await axios.get(`${API_URL}/bookings/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings(response.data);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) {
      Alert.alert('Unauthorized', 'Please log in again.');
      return;
    }

    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/bookings/${bookingId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            Alert.alert('Cancelled', 'Booking has been cancelled.');
            fetchUserBookings();
          } catch (err) {
            Alert.alert('Error', 'Failed to cancel booking');
          }
        },
      },
    ]);
  };

  const statusColorMap: Record<string, string> = {
    pending: '#ffc107',
    confirmed: '#28a745',
    cancelled: '#dc3545',
    delivered: '#17a2b8',
  };

  const renderBooking = ({ item }: any) => {
    const statusColor = statusColorMap[item.status?.toLowerCase()] || '#6c757d';

    return (
      <View style={styles.card}>
        <Text style={styles.title}>
          🚛 Truck: {item.truck?.name || item.truck_id}
        </Text>
        <Text style={styles.detail}>📍 Address: {item.address}</Text>
        <Text style={styles.detail}>📞 Phone: {item.phone}</Text>
        <Text style={styles.detail}>
          📅 Delivery:{' '}
          {item.delivery_time
            ? new Date(item.delivery_time).toLocaleString()
            : 'Not set'}
        </Text>

        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{item.status?.toUpperCase()}</Text>
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
      refreshing={loading}
      onRefresh={fetchUserBookings}
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
