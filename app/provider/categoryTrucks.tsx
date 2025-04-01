import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import Navbar from "@/components/Navbar";

const API_URL = "http://localhost:5000";

interface Truck {
  truck_id: string;
  truck_name: string;
  truck_image?: string;
  category: CategoryType;
  capacity?: number;
}

// ✅ Define the allowed category types (using full category labels)
type CategoryType = "Drinking Water Delivery" | "Construction Water Supply" | "Agricultural Water Trucks" | "Emergency Water Supply";

// ✅ Define the categories with full category labels
const categories: Record<CategoryType, { label: string; image: any }> = {
  "Drinking Water Delivery": { label: "Drinking Water Delivery", image: require("../../assets/images/Drinking.png") },
  "Construction Water Supply": { label: "Construction Water Supply", image: require("../../assets/images/Construction.png") },
  "Agricultural Water Trucks": { label: "Agricultural Water Trucks", image: require("../../assets/images/Agri.png") },
  "Emergency Water Supply": { label: "Emergency Water Supply", image: require("../../assets/images/Emergency.png") },
};

const categoryTruck = () => {
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

        {isLoading ? (
          <Text style={styles.noTruckText}>Loading...</Text>
        ) : (
          Object.keys(categories).map((categoryKey) => {
            const category = categories[categoryKey as CategoryType]; // ✅ Ensures type safety
            const filteredTrucks = trucks.filter((truck) => truck.category === category.label); // Match category.label instead of categoryKey

            return (
              <View key={categoryKey} style={styles.categorySection}>
                <View style={styles.categoryHeader}>
                  <Image source={category.image} style={styles.categoryIcon} />
                  <Text style={styles.categoryTitle}>{category.label}</Text>
                </View>

                {filteredTrucks.length === 0 ? (
                  <Text style={styles.noTruckText}>No trucks in this category</Text>
                ) : (
                  filteredTrucks.map((truck) => (
                    <View key={truck.truck_id} style={styles.truckCard}>
                      <Image
                        source={{ uri: truck.truck_image || "https://via.placeholder.com/80" }}
                        style={styles.truckImage}
                      />
                      <View style={styles.truckInfo}>
                        <Text style={styles.truckName}>{truck.truck_name || "Unnamed Truck"}</Text>
                        <Text style={styles.truckCapacity}>Capacity: {truck.capacity ?? "N/A"} Liters</Text>
                        <TouchableOpacity
                          style={styles.editButton}
                          onPress={() => router.push(`../provider/editTruck/${truck.truck_id}`)}
                        >
                          <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => handleDelete(truck.truck_id)}
                        >
                          <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}

                {/* Add Truck Button for Each Category */}
                <TouchableOpacity
                  style={styles.addTruckButton}
                  onPress={() => router.push(`/provider/addTruck?category=${category.label}`)} // Pass the full label
                >
                  <Text style={styles.addTruckButtonText}>+ Add Truck</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 15 },
  heading: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  categorySection: { marginBottom: 20, backgroundColor: "#FFF", borderRadius: 10, padding: 15, elevation: 3 },
  categoryTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
  noTruckText: { fontSize: 16, color: "#666", textAlign: "center", marginVertical: 10 },
  categoryHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  categoryIcon: { width: 40, height: 40, marginRight: 10 },
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
  addTruckButton: {
    backgroundColor: "#0080FF",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addTruckButtonText: { fontSize: 16, fontWeight: "bold", color: "#fff" },
});

export default categoryTruck;

