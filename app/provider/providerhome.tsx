import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Navbar from "@/components/Navbar";

const categories = [
  { id: "drinking", label: "Drinking Water Delivery", image: require("../../assets/images/Drinking.png") },
  { id: "construction", label: "Construction Water Supply", image: require("../../assets/images/Construction.png") },
  { id: "agriculture", label: "Agricultural Water Trucks", image: require("../../assets/images/Agri.png") },
  { id: "emergency", label: "Emergency Water Supply", image: require("../../assets/images/Emergency.png") },
];

const ProviderHome = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Navbar isLoggedIn={true} onLogout={() => console.log("Logging out...")} />

      <ScrollView>
        {/* Banner */}
        <View style={styles.banner}>
          <Text style={styles.bannerText}>Manage Your Water Trucks</Text>
        </View>

        {/* Category Section */}
        <Text style={styles.heading}>Choose a Truck Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => router.push(`/provider/categoryTrucks?category=${category.id}`)}
            >
              <Image source={category.image} style={styles.categoryImage} />
              <Text style={styles.categoryText}>{category.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    borderColor: "#E0E0E0"
  },
  categoryImage: { width: 110, height: 110 },
  categoryText: { fontSize: 16, fontWeight: "500", textAlign: "center", marginTop: 5, color: "#333" },
});

export default ProviderHome;

