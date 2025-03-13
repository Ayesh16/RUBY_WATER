import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const Navbar = () => {
  return (
    <View style={styles.navbar}>
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />
      <View style={styles.navLinks}>
        <Text style={styles.navText}>Home</Text>
        <Text style={styles.navText}>About us</Text>
        <Text style={styles.navText}>Contact</Text>
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
