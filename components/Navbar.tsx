import React from "react";
import { View, Image, StyleSheet, TouchableOpacity, TextInput, Text } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogout }) => {
  const router = useRouter();

  const handleLogout = () => {
    onLogout();

    Toast.show({
      type: "success",
      text1: "Logged Out",
      text2: "You have successfully logged out!",
      position: "top",
      visibilityTime: 2000,
      autoHide: true,
    });

    setTimeout(() => {
      router.push("/auth/login");
    }, 2000);
  };

  return (
    <View style={styles.navbar}>
      {/* Logo */}
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <FontAwesome name="search" size={20} color="black" style={styles.searchIcon} />
        <TextInput placeholder="Search..." style={styles.searchInput} />
      </View>

      {/* User Section */}
      <View style={styles.userSection}>
        <MaterialIcons name="account-circle" size={30} color="white" />
        
        {/* Logout Button */}
        {isLoggedIn && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={18} color="white" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <Toast />
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#d9534f",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    marginLeft: 5,
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#f7c1e0",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    width: 200,
  },
  searchIcon: {
    marginLeft: 10,
  },
  searchInput: {
    marginLeft: 10,
    flex: 1,
  },
});

export default Navbar;
