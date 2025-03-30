import React from "react";
import { 
  View, Image, StyleSheet, TouchableOpacity, TextInput, Text 
} from "react-native";
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
      {/* Logo - Click to go Home */}
      <TouchableOpacity onPress={() => router.push("/")}>
        <Image source={require("../assets/images/logo.png")} style={styles.logo} />
      </TouchableOpacity>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <FontAwesome name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput placeholder="Search Services..." style={styles.searchInput} />
      </View>

      {/* User Section */}
      <View style={styles.userSection}>
        {/* Profile Icon - Click to go to Profile Page */}
        {/* <TouchableOpacity onPress={() => router.push("/profile")}>
          <MaterialIcons name="account-circle" size={32} color="white" />
        </TouchableOpacity> */}

        {/* Logout Button */}
        {isLoggedIn && (
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={20} color="white" />
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
    backgroundColor: "#4B0082", // Deep Purple for premium feel
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6, // Elevation for Android shadow
  },
  logo: {
    width: 45,
    height: 45,
    resizeMode: "contain",
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF5733",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    marginLeft: 5,
    fontWeight: "600",
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 30,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    width: 230,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4, // Smooth shadow for Android
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
});

export default Navbar;
