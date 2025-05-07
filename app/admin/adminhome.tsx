import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Hardcoded for demo - replace with secure storage or props
  const token = 'your_admin_jwt_token_here';
  const role = 'admin'; // replace with real logic

  useEffect(() => {
    if (role !== 'admin') {
      Alert.alert('Access Denied', 'You are not authorized to view this page.');
      router.replace('/');
    } else {
      fetchDashboard();
    }
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('http://<YOUR_BACKEND_URL>/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error('Dashboard fetch error', err);
      Alert.alert('Error', 'Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Admin Dashboard</Text>

      <View style={styles.cardWrapper}>
        <DashboardCard title="Total Users" value={stats?.totalUsers} backgroundColor="#007bff" />
        <DashboardCard title="Total Bookings" value={stats?.totalBookings} backgroundColor="#28a745" />
        <DashboardCard title="Total Trucks" value={stats?.totalTrucks} backgroundColor="#ffc107" />
      </View>
    </ScrollView>
  );
}

type CardProps = {
  title: string;
  value: number;
  backgroundColor: string;
};

const DashboardCard = ({ title, value, backgroundColor }: CardProps) => (
  <View style={[styles.card, { backgroundColor }]}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  cardWrapper: {
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cardValue: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
