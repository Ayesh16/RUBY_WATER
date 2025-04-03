import React, { useEffect, useState } from "react";
import { 
  View, Text, Image, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, ScrollView 
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:5000";

const TruckDetails = () => {
  const { id } = useLocalSearchParams();
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
    <ScrollView style={styles.container}>
      {/* Truck Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: truck.truck_image }} style={styles.truckImage} />
      </View>

      {/* Truck Details Card */}
      <View style={styles.detailsCard}>
        <Text style={styles.truckName}>{truck.truck_name || "Unknown Truck"}</Text>
        
        <Text style={styles.price}>₹{truck.price || "N/A"} <Text style={styles.discount}>₹{truck.original_price || "N/A"}</Text></Text>

        <Text style={styles.truckCapacity}>💧 Capacity: {truck.capacity ?? "N/A"} Liters</Text>
        <Text style={styles.truckLocation}>📍 Location: {truck.location || "Not Available"}</Text>
        <Text style={styles.truckType}>🚛 Type: {truck.truck_type || "Unknown"}</Text>

        <Text style={[styles.truckAvailability, { color: truck.available ? "green" : "red" }]}>
          {truck.available ? "✅ Available" : "❌ Not Available"}
        </Text>

        {/* Book Now Button */}
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },

  /* Image Section */
  imageContainer: { backgroundColor: "#fff", padding: 15, alignItems: "center" },
  truckImage: { width: "90%", height: 280, borderRadius: 10, resizeMode: "cover" },

  /* Truck Details Card */
  detailsCard: { 
    backgroundColor: "#fff", padding: 20, margin: 15, borderRadius: 10, 
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, shadowRadius: 5, elevation: 5 
  },

  truckName: { fontSize: 22, fontWeight: "bold", textAlign: "center", color: "#333" },
  price: { fontSize: 22, fontWeight: "bold", color: "#0080FF", textAlign: "center", marginVertical: 5 },
  discount: { fontSize: 18, textDecorationLine: "line-through", color: "gray", marginLeft: 5 },
  
  truckCapacity: { fontSize: 18, fontWeight: "500", marginTop: 10 },
  truckLocation: { fontSize: 18, marginTop: 5, color: "#007BFF" },
  truckType: { fontSize: 18, marginTop: 5, fontWeight: "500" },
  truckAvailability: { fontSize: 18, marginTop: 5, fontWeight: "bold", textAlign: "center" },

  /* Book Now Button */
  bookButton: { backgroundColor: "#0080FF", padding: 15, borderRadius: 10, marginTop: 20, alignItems: "center" },
  bookButtonText: { fontSize: 18, fontWeight: "bold", color: "#fff" },

  errorText: { fontSize: 16, color: "red", textAlign: "center", marginTop: 20 },
});

export default TruckDetails;
