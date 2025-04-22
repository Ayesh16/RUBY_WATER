import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogout }) => {
  const router = useRouter();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleLogout = () => {
    setDropdownVisible(false);
    onLogout();
    setTimeout(() => {
      router.push("/auth/login");
    }, 1000);
  };

  return (
    <View style={styles.navbar}>
      {/* Logo */}
      <TouchableOpacity onPress={() => router.push("/")}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
      </TouchableOpacity>

      {/* Search */}
      <View style={styles.searchBar}>
        <FontAwesome name="search" size={20} color="gray" style={styles.searchIcon} />
        <TextInput placeholder="Search Services..." style={styles.searchInput} />
      </View>

      {/* User Icon */}
      <View style={styles.userSection}>
        {isLoggedIn && (
          <TouchableOpacity
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <FontAwesome name="user-circle-o" size={28} color="black" />
          </TouchableOpacity>
        )}

        {dropdownVisible && (
          <View style={styles.dropdown}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setDropdownVisible(false);
                router.push("/userDetails");
              }}
            >
              <Text style={styles.dropdownText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
              <Text style={styles.dropdownText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: "powderblue",
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  logo: {
    width: 45,
    height: 45,
    resizeMode: "contain",
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
    elevation: 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  userSection: {
    position: "relative",
  },
  dropdown: {
    position: "absolute",
    top: 40,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    width: 150,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 200,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownText: {
    fontSize: 16,
    color: "#111827",
  },
});

export default Navbar;
