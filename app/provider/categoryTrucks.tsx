import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  StyleSheet, ActivityIndicator, Alert
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "@/components/Navbar";

const API_URL = "http://localhost:5000";

interface Truck {
  _id: string;  // ✅ Changed from truck_id to _id
  truck_name: string;
  truck_image?: string;
  category_id: string | { _id: string };
  capacity?: number;
}

const CategoryTruck = () => {
  const router = useRouter();
  const { category_id } = useLocalSearchParams();
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log("🟢 Category ID received from params:", category_id);
      const ownerId = await AsyncStorage.getItem("ownerId");

      if (!ownerId) {
        console.error("❌ Owner ID not found!");
        Alert.alert("Error", "You need to log in again.");
        setIsLoading(false);
        return;
      }

      fetchTrucks(ownerId, category_id as string);
    };

    fetchData();
  }, [category_id]);

  const fetchTrucks = async (ownerId: string, categoryId: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "Session expired. Please log in again.");
        return;
      }

      console.log("🔍 Fetching trucks for owner:", ownerId);
      const response = await axios.get(`${API_URL}/trucks/owner/${ownerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter trucks by category_id
      const filteredTrucks = response.data.filter((truck: Truck) => {
        const apiCategoryId = typeof truck.category_id === "object" && truck.category_id?._id
          ? truck.category_id._id
          : String(truck.category_id);

        return apiCategoryId.trim() === categoryId.trim();
      });

      setTrucks(filteredTrucks);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch trucks.");
      setTrucks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTruck = () => {
    router.push({ pathname: "/provider/addTruck", params: { categoryId: category_id } });
  };

  const handleEditTruck = (truckId: string) => {
    console.log("🟢 Edit button pressed for Truck ID:", truckId);

    if (!truckId) {
      Alert.alert("Error", "Invalid Truck ID. Please try again.");
      return;
    }

    router.push(`/provider/editTruck?truckId=${truckId}`);
  };

  return (
    <View style={styles.container}>
      <Navbar isLoggedIn={true} onLogout={() => console.log("Logging out...")} />

      <ScrollView>
        <Text style={styles.heading}>Your Trucks</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#0080FF" style={{ marginTop: 20 }} />
        ) : trucks.length === 0 ? (
          <Text style={styles.noTruckText}>No trucks available</Text>
        ) : (
          trucks.map((truck) => (
            <View key={truck._id} style={styles.truckCard}>  {/* ✅ Changed truck_id to _id */}
              <Image source={{ uri: truck.truck_image || "https://via.placeholder.com/80" }} style={styles.truckImage} />
              <View style={styles.truckInfo}>
                <Text style={styles.truckName}>{truck.truck_name || "Unnamed Truck"}</Text>
                <Text style={styles.truckCapacity}>Capacity: {truck.capacity ?? "N/A"} Liters</Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    console.log("📌 Truck Data:", truck); // Debugging log
                    if (!truck._id) {
                      Alert.alert("Error", "Truck ID is missing!");
                      return;
                    }
                    handleEditTruck(truck._id); // ✅ Changed truck_id to _id
                  }}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.addTruckButton} onPress={handleAddTruck}>
          <Text style={styles.addTruckButtonText}>Add Truck</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 15 },
  heading: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  noTruckText: { fontSize: 16, color: "#666", textAlign: "center", marginVertical: 10 },
  truckCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  truckImage: { width: 80, height: 80, borderRadius: 8 },
  truckInfo: { flex: 1, marginLeft: 15 },
  truckName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  truckCapacity: { fontSize: 14, color: "#666", marginTop: 3 },
  editButton: { marginTop: 8, backgroundColor: "#FF9500", padding: 5, borderRadius: 5 },
  editButtonText: { color: "#fff", textAlign: "center" },
  deleteButton: { marginTop: 8, backgroundColor: "#FF3B30", padding: 5, borderRadius: 5 },
  deleteButtonText: { color: "#fff", textAlign: "center" },
  addTruckButton: { backgroundColor: "#0080FF", padding: 10, borderRadius: 8, alignItems: "center", marginTop: 10 },
  addTruckButtonText: { fontSize: 16, fontWeight: "bold", color: "#fff" },
});

export default CategoryTruck;
