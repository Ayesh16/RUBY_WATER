import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import storage

const API_BASE_URL = "http://localhost:5000"; // Backend API URL

const TrucksList = () => {
  const router = useRouter();
  const { categoryId, categoryName } = useLocalSearchParams();
  const [trucks, setTrucks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrucks();
  }, []);

  const fetchTrucks = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken"); // Get token

      const response = await axios.get(`${API_BASE_URL}/trucks?categoryId=${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` }, // Pass token in headers
      });

      console.log("API Response:", response.data);
      setTrucks(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      console.error("Error fetching trucks:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        alert("Unauthorized! Please log in again.");
        router.push("/auth/login"); // Redirect to login if unauthorized
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚛 Trucks for {categoryName}</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0080FF" />
      ) : trucks.length === 0 ? (
        <Text style={styles.noTrucksText}>🚫 No trucks available for this category.</Text>
      ) : (
        <FlatList
          data={trucks}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.truckCard}
              onPress={() => router.push({ pathname: "/user/truckDetails", params: { id: item._id } })}
            >
              <Image source={{ uri: item.truck_image || "https://via.placeholder.com/150" }} style={styles.truckImage} />
              <Text style={styles.truckText}>{item.truck_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 15 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "#333" },
  noTrucksText: { fontSize: 18, fontWeight: "bold", textAlign: "center", color: "red", marginTop: 20 },
  truckCard: { backgroundColor: "#fff", borderRadius: 12, padding: 15, marginVertical: 8, alignItems: "center", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  truckImage: { width: 150, height: 100, borderRadius: 10 },
  truckText: { fontSize: 16, fontWeight: "bold", color: "#333", marginTop: 10 },
});

export default TrucksList;
