import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:5000";

const TruckDetails = () => {
  const { id } = useLocalSearchParams(); // ✅ Get truck ID from URL
  const [truck, setTruck] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      Alert.alert("Error", "No truck ID provided.");
      return;
    }

    fetchTruckDetails();
  }, [id]);

  const fetchTruckDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");

      if (!token) {
        Alert.alert("Error", "You need to log in.");
        return;
      }

      const response = await axios.get(`${API_URL}/trucks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Truck Details Fetched:", response.data);
      setTruck(response.data);
    } catch (error) {
      console.error("❌ Error fetching truck details:", error);
      Alert.alert("Error", "Could not load truck details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0080FF" style={{ marginTop: 20 }} />;
  if (!truck) return <Text style={styles.errorText}>Truck details not found.</Text>;

  return (
    <View style={styles.container}>
      <Image source={{ uri: truck.truck_image }} style={styles.truckImage} />
      <Text style={styles.truckName}>{truck.truck_name}</Text>
      <Text style={styles.truckCapacity}>Capacity: {truck.capacity ?? "N/A"} Liters</Text>
      <Text style={styles.truckCategory}>Category: {truck.category_id?.name || "Unknown"}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 20, alignItems: "center" },
  truckImage: { width: "100%", height: 250, borderRadius: 10 },
  truckName: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  truckCapacity: { fontSize: 16, marginTop: 5 },
  truckCategory: { fontSize: 16, marginTop: 5, color: "#555" },
  errorText: { fontSize: 16, color: "red", textAlign: "center", marginTop: 20 },
});

export default TruckDetails;
