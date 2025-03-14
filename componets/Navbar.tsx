import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const Navbar = () => {
  const router = useRouter(); // Initialize the router

  return (
    <View style={styles.navbar}>
      {/* Logo */}
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />

      {/* Navigation Links */}
      <View style={styles.navLinks}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/about")}>
          <Text style={styles.navText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/contact")}>
          <Text style={styles.navText}>Contact</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: "#800080",
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  logo: {
    width: 40,
    height: 40,
  },
  navLinks: {
    flexDirection: "row",
    gap: 15,
  },
  navText: {
    color: "white",
    fontSize: 16,
  },
});

export default Navbar;
