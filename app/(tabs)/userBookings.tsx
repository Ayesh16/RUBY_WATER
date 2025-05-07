import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '@/components/Navbar';

const API_URL = 'http://192.168.161.73:5000';

const UserBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedStatusId, setExpandedStatusId] = useState<string | null>(null);

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

      // Sort bookings from latest to oldest
      const sortedBookings = response.data.sort(
        (a: any, b: any) =>
          new Date(b.createdAt || b.delivery_time).getTime() -
          new Date(a.createdAt || a.delivery_time).getTime()
      );

      setBookings(sortedBookings);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const statusColorMap: Record<string, string> = {
    pending: '#ffc107',
    confirmed: '#28a745',
    cancelled: '#dc3545',
    delivered: '#17a2b8',
  };

  const toggleStatus = (id: string) => {
    setExpandedStatusId((prev) => (prev === id ? null : id));
  };

  const renderBooking = ({ item }: any) => {
    const statusColor = statusColorMap[item.status?.toLowerCase()] || '#6c757d';
    const isExpanded = expandedStatusId === item._id;

    return (
      <View style={styles.card}>
        <Text style={styles.title}>🚛 Truck: {item.truck?.name || item.truck_id}</Text>
        <Text style={styles.detail}>📍 Address: {item.address}</Text>
        <Text style={styles.detail}>📞 Phone: {item.phone}</Text>
        <Text style={styles.detail}>
          📅 Delivery:{' '}
          {item.delivery_time
            ? new Date(item.delivery_time).toLocaleString()
            : 'Not set'}
        </Text>
        <Text style={styles.detail}>
          🕒 Booked At:{' '}
          {item.createdAt
            ? new Date(item.createdAt).toLocaleString()
            : 'Unknown'}
        </Text>

        {/* Toggle Switch for status */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>
            {isExpanded ? 'Hide Status' : 'Show Status'}
          </Text>
          <Switch
            value={isExpanded}
            onValueChange={() => toggleStatus(item._id)}
            thumbColor="#fff"
            trackColor={{ false: '#767577', true: '#81b0ff' }}
          />
        </View>

        {isExpanded && (
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{item.status?.toUpperCase()}</Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Navbar isLoggedIn={true} onLogout={() => console.log("Logging out...")} />
        <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 40 }} />
      </View>
    );
  }

  if (bookings.length === 0) {
    return (
      <View style={styles.container}>
        <Navbar isLoggedIn={true} onLogout={() => console.log("Logging out...")} />
        <Text style={styles.emptyText}>📝 You haven’t booked any trucks yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar isLoggedIn={true} onLogout={() => console.log("Logging out...")} />
      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        renderItem={renderBooking}
        refreshing={loading}
        onRefresh={fetchUserBookings}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: '#f8f9fa',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
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
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  toggleLabel: {
    fontSize: 15,
    color: '#333',
    marginRight: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default UserBookings;
