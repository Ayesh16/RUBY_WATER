import React, { useEffect, useState } from "react"; 
import { 
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator 
} from "react-native";
import { useRouter } from "expo-router"; 
import Carousel from "react-native-reanimated-carousel";
import Navbar from "@/components/Navbar";
import axios, { AxiosError }  from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const API_BASE_URL = "http://localhost:5000"; // Update with actual backend URL

const sliderImages = [
  require("../../assets/images/Drinking.png"),
  require("../../assets/images/Construction.png"),
  require("../../assets/images/Agri.png"),
];

const Home = () => {
  const router = useRouter(); 
  const [isLoggedIn, setIsLoggedIn] = useState(true); 
  const [categories, setCategories] = useState<{ _id: string; name: string; image: string }[]>([]);
  const [trucksByCategory, setTrucksByCategory] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(response.data);

      // Fetch trucks for each category
      response.data.forEach((category: { _id: string }) => fetchTrucksByCategory(category._id));
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };



  const fetchTrucksByCategory = async (categoryId: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
  
      if (!token) {
        console.error("❌ No authentication token found. User might be logged out.");
        router.push("/auth/login");
        return;
      }
  
      const response = await axios.get(`${API_BASE_URL}/trucks/categories/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      console.log(`✅ Trucks fetched for category ${categoryId}:`, response.data);
  
      setTrucksByCategory((prev) => ({
        ...prev,
        [categoryId]: response.data,
      }));
    } catch (err) {
      console.error(`❌ Error fetching trucks for category ${categoryId}:`, err);
    }
  };
  

  
  const handleLogout = () => {
    setIsLoggedIn(false);
    router.push("/auth/login");
  };

  return (
    <View style={styles.container}>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} /> 

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🔹 Image Slider */}
        <View style={styles.sliderContainer}>
          <Carousel
            loop
            width={width}
            height={250}  
            autoPlay={true}
            autoPlayInterval={3000}
            data={sliderImages}
            scrollAnimationDuration={2000}
            renderItem={({ item }) => (
              <Image source={item} style={styles.sliderImage} />
            )}
          />
        </View>

        {/* 🔹 Banner Section */}
        <View style={styles.banner}>
          <Text style={styles.welcomeText}>Get Water Delivered Instantly</Text>
        </View>

        {/* 🔹 Categories & Trucks Section */}
        <Text style={styles.categoryTitle}>Choose Your Water Service</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0080FF" style={{ marginTop: 20 }} />
        ) : (
          categories.map((category) => (
            <View key={category._id} style={styles.categoryBlock}>
              {/* Category Title */}
              <TouchableOpacity 
                style={styles.categoryCard}
                onPress={() => router.push(`/Pages/truckModel?category=${category._id}`)}
              >
                <Image source={{ uri: category.image }} style={styles.categoryImage} />
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>

              {/* Trucks under this category */}
              {trucksByCategory[category._id]?.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.truckScroll}>
                  {trucksByCategory[category._id].map((truck) => (
                   <TouchableOpacity 
                   key={truck._id} 
                   style={styles.truckCard}
                   onPress={() => router.push({ pathname: "/user/truckDetails", params: { id: truck._id } })}
                 >
                   <Image source={{ uri: truck.truck_image }} style={styles.truckImage} />
                   <Text style={styles.truckText}>{truck.truck_name}</Text>
                 </TouchableOpacity>
                 
                  ))}
                </ScrollView>
              ) : (
                <Text style={styles.noTrucksText}>No trucks available in this category.</Text>
              )}
            </View>
          ))
        )}

        {/* 🔹 Special Offers Section */}
        <View style={styles.specialOffer}>
          <Text style={styles.offerTitle}>💧 Limited-Time Offer: 20% Off Drinking Water 💧</Text>
          <TouchableOpacity style={styles.offerButton}>
            <Text style={styles.offerButtonText}>Claim Offer</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" }, 
  banner: { alignItems: "center", marginTop: 20, padding: 20, marginHorizontal:20, backgroundColor: "#0080FF", borderRadius: 12 },
  welcomeText: { fontSize: 22, fontWeight: "bold", textAlign: "center", color: "#fff" },
  categoryTitle: { fontSize: 22, fontWeight: "700", marginTop: 20, textAlign: "center", color: "#222" },

  categoryBlock: { marginTop: 20, paddingHorizontal: 15 },
  categoryCard: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  categoryImage: { width: 50, height: 50, marginRight: 10 },
  categoryText: { fontSize: 18, fontWeight: "bold", color: "#333" },

  truckScroll: { paddingLeft: 10, marginTop: 10 },
  truckCard: { backgroundColor: "#fff", borderRadius: 12, padding: 10, alignItems: "center", width: 140, marginRight: 10, borderWidth: 1, borderColor: "#E0E0E0" },
  truckImage: { width: 120, height: 80, borderRadius: 8 },
  truckText: { fontSize: 14, fontWeight: "500", textAlign: "center", marginTop: 5, color: "#333" },

  noTrucksText: { textAlign: "center", fontSize: 14, fontStyle: "italic", color: "#999", marginVertical: 5 },

  sliderContainer: { alignItems: "center", marginVertical: 20 },
  sliderImage: { width: width * 0.9, height: 250, borderRadius: 18 },

  specialOffer: { backgroundColor: "#FF5733", padding: 20, borderRadius: 12, margin: 20, alignItems: "center" },
  offerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff", textAlign: "center" },
  offerButton: { backgroundColor: "#FFD700", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginTop: 10 },
  offerButtonText: { fontSize: 16, fontWeight: "bold", color: "#333" },
});

export default Home;
