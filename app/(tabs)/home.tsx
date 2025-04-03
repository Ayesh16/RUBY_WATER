import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "@/components/Navbar";

const { width } = Dimensions.get("window");

const API_BASE_URL = "http://localhost:5000"; // Change to your backend URL

const Home = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [categories, setCategories] = useState<{ _id: string; name: string; image: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    router.push({
      pathname: "/user/trucksList",
      params: { categoryId, categoryName },
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    router.push("/auth/login");
  };

  return (
    <View style={styles.container}>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.categoryTitle}>💦 Choose Your Water Service</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0080FF" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={categories}
            numColumns={2}
            columnWrapperStyle={styles.categoryGrid}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(item._id, item.name)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: item.image }} style={styles.categoryImage} />
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  categoryTitle: { fontSize: 22, fontWeight: "700", marginTop: 20, textAlign: "center", color: "#333" },
  categoryGrid: { justifyContent: "space-between", paddingHorizontal: 15, marginTop: 10 },
  categoryCard: { backgroundColor: "#fff", alignItems: "center", borderRadius: 12, width: width * 0.44, padding: 15, marginBottom: 15, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  categoryImage: { width: 80, height: 80, borderRadius: 10 },
  categoryText: { fontSize: 16, fontWeight: "bold", color: "#333", marginTop: 10, textAlign: "center" },
});

export default Home;

