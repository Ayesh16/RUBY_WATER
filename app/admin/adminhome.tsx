import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';

const AdminHomePage = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
      </View>

      {/* Dummy Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statTitle}>Users</Text>
          <Text style={styles.statValue}>150</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statTitle}>Providers</Text>
          <Text style={styles.statValue}>25</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statTitle}>Trucks</Text>
          <Text style={styles.statValue}>10</Text>
        </View>
      </View>

      {/* Dummy Navigation Links */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => alert('Manage Users')}>
          <Text style={styles.buttonText}>Manage Users</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => alert('Manage Providers')}>
          <Text style={styles.buttonText}>Manage Providers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => alert('Manage Trucks')}>
          <Text style={styles.buttonText}>Manage Trucks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => alert('Manage Categories')}>
          <Text style={styles.buttonText}>Manage Categories</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => alert('Manage Bookings')}>
          <Text style={styles.buttonText}>Manage Bookings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    backgroundColor: 'blue',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statValue: {
    fontSize: 24,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminHomePage;
