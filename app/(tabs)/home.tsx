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
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

const API_BASE_URL = "http://localhost:5000"; // Change to your backend URL

const Home = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [categories, setCategories] = useState<{ _id: string; name: string; image: string }[]>([]);
  const [popularTrucks, setPopularTrucks] = useState<{ _id: string; truck_name: string; image: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Offers Banner Data
  const offers = [
    { id: 1, image: "https://static.vecteezy.com/system/resources/previews/002/416/827/large_2x/special-offer-sale-banner-design-template-with-fluid-gradient-background-vector.jpg" },
    { id: 2, image: "https://img.freepik.com/premium-vector/bulk-order-banner-design-bulk-order-icon-flat-style-vector-illustration_1089581-4198.jpg" },
    { id: 3, image: "https://thumbs.dreamstime.com/z/set-fast-delivery-banners-express-urgent-shipping-services-162274880.jpg" },
  ];

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
        {/* Offer Image Slider */}
        <View style={styles.carouselContainer}>
          <Carousel
            width={width}
            height={200}
            data={offers}
            autoPlay={true}
            loop
            scrollAnimationDuration={1000}
            renderItem={({ item }) => (
              <Image source={{ uri: item.image }} style={styles.offerImage} />
            )}
          />
        </View>

        {/* Categories Section */}
        <Text style={styles.sectionTitle}>💦 Choose Your Water Service</Text>
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

        {/* Popular Trucks Section */}
        <Text style={styles.sectionTitle}>🔥 Popular Water Trucks</Text>
        <FlatList
          data={popularTrucks}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.popularTruckCard}>
              <Image source={{ uri: item.image }} style={styles.popularTruckImage} />
              <Text style={styles.popularTruckText}>{item.truck_name}</Text>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  carouselContainer: { marginTop: 18, alignItems: "center" },
  offerImage: { width: width * 0.9, height: 200, borderRadius: 15, resizeMode: "cover" },
  sectionTitle: { fontSize: 22, fontWeight: "700", marginTop: 20, textAlign: "center", color: "#333" },
  categoryGrid: { 
    justifyContent: "space-between", 
    paddingHorizontal: 10, 
    marginTop: 10 
  },
  categoryCard: { 
    backgroundColor: "#fff",
    alignItems: "center",
    borderRadius: 12,
    width: (width - 40) / 2,  // Ensures proper fit
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3 
  },
  categoryImage: { 
    width: "100%",  // Make image responsive
    height: 100, 
    borderRadius: 10, 
    resizeMode: "contain" 
  },
  categoryText: { 
    fontSize: 16, 
    fontWeight: "bold", 
    color: "#333", 
    marginTop: 10, 
    textAlign: "center" 
  },
  popularTruckCard: { backgroundColor: "#fff", marginHorizontal: 10, padding: 10, borderRadius: 10, alignItems: "center" },
  popularTruckImage: { width: 120, height: 80, borderRadius: 8 },
  popularTruckText: { fontSize: 14, fontWeight: "bold", marginTop: 5 },

});

export default Home;
