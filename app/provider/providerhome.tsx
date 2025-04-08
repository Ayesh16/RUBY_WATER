import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import Navbar from "@/components/Navbar";
import axios from "axios";

const API_URL = "http://localhost:5000/categories"; // Update with actual backend URL

const ProviderHome = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<{ _id: string; name: string; image: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_URL);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Navbar isLoggedIn={true} onLogout={() => console.log("Logging out...")} />

      <ScrollView>
        {/* Banner */}

        <View>
      <Text>Welcome Provider!</Text>
      <TouchableOpacity onPress={() => router.push("../provider/bookings")}>
        <Text style={{ color: "blue", marginTop: 20 }}>View Bookings</Text>
      </TouchableOpacity>
    </View>
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Manage Your Water Trucks</Text>
        </View>

        {/* Category Section */}
        <Text style={styles.heading}>Choose a Truck Category</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0080FF" style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
            <TouchableOpacity
            key={category._id}
            style={styles.categoryCard}
            onPress={() => router.push(`/provider/categoryTrucks?category_id=${category._id}&category_name=${encodeURIComponent(category.name)}`)}
          >
            <Image source={{ uri: category.image }} style={styles.categoryImage} />
            <Text style={styles.categoryText}>{category.name}</Text>  {/* ✅ Display category name */}
          </TouchableOpacity>
          
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 15 },
  banner: { alignItems: "center", padding: 20, margin: 20, backgroundColor: "#0080FF", borderRadius: 12 },
  bannerText: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  heading: { fontSize: 22, fontWeight: "700", marginTop: 20, textAlign: "center", color: "#222" },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 15 },
  categoryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    width: "48%",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  categoryImage: { width: 110, height: 110 },
  categoryText: { fontSize: 16, fontWeight: "500", textAlign: "center", marginTop: 5, color: "#333" },
});

export default ProviderHome;

