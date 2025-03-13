import React from "react";
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Navbar from "@/componets/Navbar";

const categories = [
  { id: 1, name: "Drinking Water Delivery", image: require("../assets/images/Drinking.png") },
  { id: 2, name: "Construction Water Supply", image: require("../assets/images/Construction.png") },
  { id: 3, name: "Agricultural Water Trucks", image: require("../assets/images/Agri.png") },
  { id: 4, name: "Emergency Water Supply", image: require("../assets/images/Emergency.png") },
];

const Home = () => {
  return (
    <View style={styles.container}>
      <Navbar /> {/* Navbar remains on all pages */}

      <ScrollView style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <FontAwesome name="search" size={20} color="black" style={styles.searchIcon} />
          <TextInput placeholder="Search..." style={styles.searchInput} />
        </View>

        {/* Welcome Banner */}
        <View style={styles.banner}>
          <Image source={require("../assets/images/banner.png")} style={styles.bannerImage} />
          <Text style={styles.welcomeText}>Welcome to Water Supply Services</Text>
        </View>

        {/* Categories Section */}
        <Text style={styles.categoryTitle}>Categories</Text>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryCard}>
              <Image source={category.image} style={styles.categoryImage} />
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { paddingHorizontal: 15 },
  searchBar: { flexDirection: "row", backgroundColor: "#f7c1e0", borderRadius: 20, padding: 10, alignItems: "center", marginTop: 15 },
  searchIcon: { marginLeft: 10 },
  searchInput: { marginLeft: 10, flex: 1 },
  banner: { alignItems: "center", marginTop: 20 },
  bannerImage: { width: 150, height: 150 },
  welcomeText: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 10 },
  categoryTitle: { fontSize: 18, fontWeight: "600", marginTop: 20 , textAlign: "center"},
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 15 },
  categoryCard: { backgroundColor: "#f0f0f0", borderRadius: 10, padding: 10, alignItems: "center", width: "48%", marginBottom: 15 },
  categoryImage: { width: 100, height: 100 },
  categoryText: { fontSize: 14, fontWeight: "500", textAlign: "center", marginTop: 5 },
});

export default Home;
