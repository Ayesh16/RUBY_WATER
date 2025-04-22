import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, Image,
  StyleSheet, ActivityIndicator, Alert
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "@/components/Navbar";

const API_URL = "http://192.168.154.73:5000";

interface Truck {
  _id: string;
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

  const handleDeleteTruck = async (truckId: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      
      if (!token) {
        Alert.alert("Error", "Session expired. Please log in again.");
        return;
      }
  
      const response = await fetch(`${API_URL}/trucks/${truckId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete truck");
      }
  
      // Remove the deleted truck from the list
      setTrucks(trucks.filter((truck) => truck._id !== truckId));
      Alert.alert("Success", "Truck deleted successfully!");
  
    } catch (error) {
      console.error("❌ Error deleting truck:", error);
      Alert.alert("Error", "Failed to delete the truck.");
    }
  };
  

  return (
    <><Navbar isLoggedIn={true} onLogout={() => console.log("Logging out...")} /><View style={styles.container}>
      <ScrollView>
        <Text style={styles.heading}>Your Trucks</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#0080FF" style={{ marginTop: 20 }} />
        ) : trucks.length === 0 ? (
          <Text style={styles.noTruckText}>No trucks available</Text>
        ) : (
          trucks.map((truck) => (
            <View key={truck._id} style={styles.truckCard}>
              <Image source={{ uri: truck.truck_image || "https://via.placeholder.com/80" }} style={styles.truckImage} />
              <View style={styles.truckInfo}>
                <Text style={styles.truckName}>{truck.truck_name || "Unnamed Truck"}</Text>
                <Text style={styles.truckCapacity}>Capacity: {truck.capacity ?? "N/A"} Liters</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.editButton} onPress={() => handleEditTruck(truck._id)}>
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTruck(truck._id)}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.addTruckButton} onPress={handleAddTruck}>
          <Text style={styles.addTruckButtonText}>Add Truck</Text>
        </TouchableOpacity>
      </ScrollView>
    </View></>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 15,marginTop:100 },
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
  buttonContainer: { flexDirection: "row", marginTop: 10 },
  editButton: { backgroundColor: "#FF9500", padding: 5, borderRadius: 5, marginRight: 10 },
  editButtonText: { color: "#fff", textAlign: "center" },
  deleteButton: { backgroundColor: "#FF3B30", padding: 5, borderRadius: 5 },
  deleteButtonText: { color: "#fff", textAlign: "center" },
  addTruckButton: { backgroundColor: "#0080FF", padding: 10, borderRadius: 8, alignItems: "center", marginTop: 10 },
  addTruckButtonText: { fontSize: 16, fontWeight: "bold", color: "#fff" },
});

export default CategoryTruck;
