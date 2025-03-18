import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";

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

      {/* User Icon & Logout Button */}
      <View style={styles.userSection}>
        <MaterialIcons name="account-circle" size={30} color="white" />
        {isLoggedIn && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={18} color="black" />
          </TouchableOpacity>
        )}
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
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoutButton: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 5,
  },
});

export default Navbar;
