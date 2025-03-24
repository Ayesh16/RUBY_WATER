import React, { useState } from "react"; 
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router"; 
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const categories = [
  { id: 1, name: "drinking", label: "Drinking Water Delivery", image: require("../../assets/images/Drinking.png") },
  { id: 2, name: "construction", label: "Construction Water Supply", image: require("../../assets/images/Construction.png") },
  { id: 3, name: "agriculture", label: "Agricultural Water Trucks", image: require("../../assets/images/Agri.png") },
  { id: 4, name: "emergency", label: "Emergency Water Supply", image: require("../../assets/images/Emergency.png") },
];

const Home = () => {
  const router = useRouter(); 
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Simulated login state

  const handleLogout = () => {
    setIsLoggedIn(false);
    router.push("/auth/login");
  };

  return (
    <View style={styles.container}>
      {/* Updated Navbar with Props */}
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <ScrollView style={styles.content}>
        {/* Banner Section */}
        <View style={styles.banner}>
          <Image source={require("../../assets/images/banner.png")} style={styles.bannerImage} />
          <Text style={styles.welcomeText}>Welcome to Water Supply Services</Text>
        </View>

        {/* Categories */}
        <Text style={styles.categoryTitle}>Categories</Text>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity 
              key={category.id} 
              style={styles.categoryCard}
              onPress={() => router.push(`/Pages/truckModel?category=${category.name}`)}
            >
              <Image source={category.image} style={styles.categoryImage} />
              <Text style={styles.categoryText}>{category.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer */}
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3D6E4" },
  content: { paddingHorizontal: 15 },
  banner: { alignItems: "center", marginTop: 20 },
  bannerImage: { width: 150, height: 150 },
  welcomeText: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 10 },
  categoryTitle: { fontSize: 18, fontWeight: "600", marginTop: 20, textAlign: "center" },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 15 },
  categoryCard: { backgroundColor: "#f0f0f0", borderRadius: 10, padding: 10, alignItems: "center", width: "48%", marginBottom: 15 },
  categoryImage: { width: 100, height: 100 },
  categoryText: { fontSize: 14, fontWeight: "500", textAlign: "center", marginTop: 5 },
});

export default Home;
