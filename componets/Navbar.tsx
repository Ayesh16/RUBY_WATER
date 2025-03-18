import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Navbar = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const user = await AsyncStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setIsLoggedIn(parsedUser.isLoggedIn);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/auth/signin");
  };

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

      {/* Logout Button (Only when Logged In) */}
      {isLoggedIn && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      )}
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
  logoutButton: {
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Navbar;
