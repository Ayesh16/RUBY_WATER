import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import Navbar from "@/components/Navbar";

const API_URL = "https://bd28-2401-4900-4c1b-f348-b84a-4a06-30d9-a39a.ngrok-free.app";

interface Truck {
  truck_id: string;
  truck_name: string;
  truck_image?: string;
  category: string;
  capacity?: number;
}

const ProviderHome = () => {
  const router = useRouter();
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrucks();
  }, []);

  const fetchTrucks = async () => {
    try {
      const response = await axios.get(`${API_URL}/trucks/owner/{ownerId}`);
      console.log("API Response:", response.data);

      if (Array.isArray(response.data)) {
        setTrucks(response.data);
      } else if (response.data?.trucks && Array.isArray(response.data.trucks)) {
        setTrucks(response.data.trucks);
      } else {
        setTrucks([]);
      }
    } catch (error) {
      console.error("Error fetching trucks:", error);
      setTrucks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (truckId: string) => {
    try {
      await axios.delete(`${API_URL}/trucks/${truckId}`);
      setTrucks((prevTrucks) => prevTrucks.filter((truck) => truck.truck_id !== truckId));
    } catch (error) {
      console.error("Error deleting truck:", error);
    }
  };

  const categories = [
    { id: "drinking", label: "Drinking Water Delivery", image: require("../../assets/images/Drinking.png") },
    { id: "construction", label: "Construction Water Supply", image: require("../../assets/images/Construction.png") },
    { id: "agriculture", label: "Agricultural Water Trucks", image: require("../../assets/images/Agri.png") },
    { id: "emergency", label: "Emergency Water Supply", image: require("../../assets/images/Emergency.png") },
  ];  

  return (
    <View style={styles.container}>
      <Navbar
        isLoggedIn={true}
        onLogout={() => {
          console.log("Logging out...");
        }}
      />

      <ScrollView>
        <Text style={styles.heading}>Your Trucks</Text>

        {Array.isArray(trucks) ? (
          categories.map((category) => {
            const filteredTrucks = trucks.filter((truck) => truck.category === category.id);

            return (
              <View key={category.id} style={styles.categorySection}>
  <View style={styles.categoryHeader}>
    <Image source={category.image} style={styles.categoryIcon} />
    <Text style={styles.categoryTitle}>{category.label}</Text>
  </View>
  
  {filteredTrucks.length === 0 ? (
    <Text style={styles.noTruckText}>No trucks in this category</Text>
  ) : (
    filteredTrucks.map((truck) => (
      <View key={truck?.truck_id || Math.random().toString()} style={styles.truckCard}>
        <Image
          source={{ uri: truck?.truck_image || "https://via.placeholder.com/80" }}
          style={styles.truckImage}
        />
        <View style={styles.truckInfo}>
          <Text style={styles.truckName}>{truck?.truck_name || "Unnamed Truck"}</Text>
          <Text style={styles.truckCapacity}>Capacity: {truck?.capacity ?? "N/A"} Liters</Text>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(truck.truck_id)}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push(`../provider/editTruck/${truck.truck_id}`)}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    ))
  )}
</View>

            );
          })
        ) : (
          <Text style={styles.noTruckText}>Loading...</Text>
        )}
      </ScrollView>

      {/* ✅ Corrected Route for Add Truck */}
      <TouchableOpacity style={styles.addButton} onPress={() => router.push("/provider/addTruck")}>
        <Text style={styles.addButtonText}>+ Add Truck</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 15 },
  heading: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  categorySection: { marginBottom: 20 },
  categoryTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 10, color: "#333" },
  noTruckText: { fontSize: 16, color: "#666", textAlign: "center" },
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
  deleteButton: { marginTop: 8, backgroundColor: "#FF3B30", padding: 5, borderRadius: 5 },
  deleteButtonText: { color: "#fff", textAlign: "center" },
  editButton: { marginTop: 8, backgroundColor: "#FF9500", padding: 5, borderRadius: 5 },
  editButtonText: { color: "#fff", textAlign: "center" },
  addButton: {
    backgroundColor: "#0080FF",
    padding: 12,
    borderRadius: 10,
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },
  addButtonText: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  categoryHeader: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 10 
  },
  categoryIcon: { 
    width: 40, 
    height: 40, 
    marginRight: 10 
  },
  
});

export default ProviderHome;
