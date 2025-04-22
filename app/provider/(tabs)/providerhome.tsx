import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons"; // For icon in banner

const API_URL = "http://192.168.1.36:5000/categories"; // Replace with your IP on device testing

const ProviderHome = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<
    { _id: string; name: string; image: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_URL);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <><Navbar isLoggedIn={true} onLogout={() => console.log("Logging out...")} /><View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <AntDesign name="car" size={28} color="#fff" />
          <Text style={styles.bannerText}>Manage Your Water Trucks</Text>
        </View>

        {/* Category Section */}
        <Text style={styles.heading}>🚛 Choose a Truck Category</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0080FF" style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category._id}
                style={styles.categoryCard}
                onPress={() => router.push(
                  `/provider/categoryTrucks?category_id=${category._id}&category_name=${encodeURIComponent(
                    category.name
                  )}`
                )}
              >
                <Image
                  source={{ uri: category.image || "https://via.placeholder.com/110" }}
                  style={styles.categoryImage} />
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View></>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F8FF",
    padding: 15,
    marginTop:100
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    marginVertical: 20,
    backgroundColor: "#0080FF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  bannerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
    color: "#222",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  categoryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    alignItems: "center",
    width: "48%",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  categoryImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  categoryText: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 10,
    color: "#333",
  },
});

export default ProviderHome;
