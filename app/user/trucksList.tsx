import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import storage
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Navbar from "@/components/Navbar";

const { width } = Dimensions.get("window");
const API_BASE_URL = "http://192.168.1.36:5000"; // Backend API URL

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
      const token = await AsyncStorage.getItem("authToken");

      const response = await axios.get(`${API_BASE_URL}/trucks?categoryId=${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("API Response:", response.data);
      setTrucks(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      console.error("Error fetching trucks:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        alert("Unauthorized! Please log in again.");
        router.push("/auth/login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <><Navbar isLoggedIn={true} onLogout={() => console.log("Logging out...")} /><View style={styles.container}>
      <Text style={styles.title}>🚛 Trucks for {categoryName}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0080FF" style={{ marginTop: 20 }} />
      ) : trucks.length === 0 ? (
        <Text style={styles.noTrucksText}>🚫 No trucks available for this category.</Text>
      ) : (
        <FlatList
          data={trucks}
          numColumns={2} // ✅ Show in two columns for a better eCommerce look
          columnWrapperStyle={styles.row} // ✅ Ensure proper spacing
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.truckCard}
              onPress={() => router.push({ pathname: "/user/truckDetails", params: { id: item._id } })}
            >
              <Image
                source={{ uri: item.truck_image || "https://via.placeholder.com/150" }}
                style={styles.truckImage} />
              <Text style={styles.truckName}>{item.truck_name}</Text>

              {/* Price & Ratings */}
              <View style={styles.truckInfo}>
                <Text style={styles.price}>₹{item.price}/hr</Text>
                <View style={styles.rating}>
                  <Icon name="star" size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{item.rating || "4.5"}</Text>
                </View>
              </View>

              {/* CTA Button */}
              <TouchableOpacity
                style={styles.bookNowButton}
                onPress={() => router.push({ pathname: "/user/truckDetails", params: { id: item._id } })}
              >
                <Text style={styles.bookNowText}>View Details</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )} />
      )}
    </View></>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5", padding: 15 ,marginTop:100},
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 15, color: "#333" },
  noTrucksText: { fontSize: 18, fontWeight: "bold", textAlign: "center", color: "red", marginTop: 20 },

  row: { justifyContent: "space-between" }, // ✅ Ensure spacing in grid layout
  truckCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    width: width * 0.45, // ✅ Adjust width to fit two in a row
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  truckImage: { width: "100%", height: 100, borderRadius: 10, resizeMode: "cover" },
  truckName: { fontSize: 16, fontWeight: "bold", color: "#333", marginTop: 8, textAlign: "center" },

  truckInfo: { flexDirection: "row", justifyContent: "space-between", width: "100%", paddingHorizontal: 10, marginTop: 5 },
  price: { fontSize: 16, fontWeight: "bold", color: "#0080FF" },
  rating: { flexDirection: "row", alignItems: "center" },
  ratingText: { fontSize: 14, fontWeight: "bold", color: "#444", marginLeft: 5 },

  bookNowButton: { backgroundColor: "#0080FF", padding: 10, borderRadius: 8, width: "100%", marginTop: 10, alignItems: "center" },
  bookNowText: { color: "#fff", fontSize: 14, fontWeight: "bold" },
});

export default TrucksList;
