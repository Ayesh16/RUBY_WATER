import React, { useEffect, useState } from "react"; 
import { 
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator 
} from "react-native";
import { useRouter } from "expo-router"; 
import Carousel from "react-native-reanimated-carousel";
import Navbar from "@/components/Navbar";
import axios from "axios";

const { width } = Dimensions.get("window");

const API_URL = "http://localhost:5000/categories"; // Replace with actual backend URL

const sliderImages = [
  require("../../assets/images/Drinking.png"),
  require("../../assets/images/Construction.png"),
  require("../../assets/images/Agri.png"),
];

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
      const response = await axios.get(API_URL);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
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

        {/* 🔹 Categories Section */}
        <Text style={styles.categoryTitle}>Choose Your Water Service</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#0080FF" style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.categoryGrid}>
            {categories.map((category) => (
              <TouchableOpacity 
                key={category._id} 
                style={styles.categoryCard}
                onPress={() => router.push(`/Pages/truckModel?category=${category._id}`)}
              >
                <Image source={{ uri: category.image }} style={styles.categoryImage} />
                <Text style={styles.categoryText}>{category.name}</Text>  {/* ✅ Display category name */}
              </TouchableOpacity>
            ))}
          </View>
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
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginTop: 15, paddingHorizontal: 15 },
  categoryCard: { 
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    width: "48%",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#E0E0E0"
  },
  categoryImage: { width: 110, height: 110 },
  categoryText: { fontSize: 16, fontWeight: "500", textAlign: "center", marginTop: 5, color: "#333" },
  
  sliderContainer: { alignItems: "center", marginVertical: 20 },
  sliderImage: { 
    width: width * 0.9, 
    height: 250,  
    borderRadius: 18, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6, 
  },

  specialOffer: { backgroundColor: "#FF5733", padding: 20, borderRadius: 12, margin: 20, alignItems: "center" },
  offerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff", textAlign: "center" },
  offerButton: { backgroundColor: "#FFD700", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginTop: 10 },
  offerButtonText: { fontSize: 16, fontWeight: "bold", color: "#333" },
});

export default Home;
