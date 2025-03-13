import React from "react";
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const categories = [
  { id: 1, name: "Drinking Water Delivery", image: require("../assets/images/Drinking.png") },
  { id: 2, name: "Construction Water Supply", image: require("../assets/images/Construction.png") },
  { id: 3, name: "Agricultural Water Trucks", image: require("../assets/images/Agri.png") },
  { id: 4, name: "Emergency Water Supply", image: require("../assets/images/Emergency.png") },
];

const home = () => {
  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.navbar}>
        <Image source={require("../assets/images/logo.png")} style={styles.logo} />
        <View style={styles.navLinks}>
          <Text style={styles.navText}>Home</Text>
          <Text style={styles.navText}>About us</Text>
          <Text style={styles.navText}>Contact</Text>
        </View>
      </View>

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

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <FontAwesome name="arrow-left" size={24} color="black" />
        <FontAwesome name="map-marker" size={24} color="black" />
        <FontAwesome name="phone" size={24} color="black" />
        <FontAwesome name="home" size={24} color="black" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  navbar: { backgroundColor: "#800080", paddingVertical: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 15 },
  logo: { width: 40, height: 40 },
  navLinks: { flexDirection: "row", gap: 15 },
  navText: { color: "white", fontSize: 16 },
  content: { paddingHorizontal: 15 },
  searchBar: { flexDirection: "row", backgroundColor: "#f7c1e0", borderRadius: 20, padding: 10, alignItems: "center", marginTop: 15 },
  searchIcon: { marginLeft: 10 },
  searchInput: { marginLeft: 10, flex: 1 },
  banner: { alignItems: "center", marginTop: 20 },
  bannerImage: { width: 150, height: 150 },
  welcomeText: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 10 },
  categoryTitle: { fontSize: 18, fontWeight: "600", marginTop: 20 },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 15 },
  categoryCard: { backgroundColor: "#f0f0f0", borderRadius: 10, padding: 10, alignItems: "center", width: "48%", marginBottom: 15 },
  categoryImage: { width: 100, height: 100 },
  categoryText: { fontSize: 14, fontWeight: "500", textAlign: "center", marginTop: 5 },
  bottomNav: { backgroundColor: "#d8a7e0", paddingVertical: 15, flexDirection: "row", justifyContent: "space-around", alignItems: "center" }
});

export default home;
