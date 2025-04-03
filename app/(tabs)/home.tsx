import React, { useEffect, useState } from "react"; 
import { 
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator, FlatList 
} from "react-native";
import { useRouter } from "expo-router"; 
import Carousel from "react-native-reanimated-carousel";
import Navbar from "@/components/Navbar";
import axios from "axios";
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
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});
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

  const fetchTrucksByCategory = async (categoryId: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("❌ No authentication token found.");
        router.push("/auth/login");
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/trucks/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrucksByCategory((prev) => ({
        ...prev,
        [categoryId]: response.data,
      }));
    } catch (err) {
      console.error(`❌ Error fetching trucks for category ${categoryId}:`, err);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
    if (!trucksByCategory[categoryId]) {
      fetchTrucksByCategory(categoryId);
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
        <View style={styles.sliderContainer}>
          <Carousel
            loop
            width={width}
            height={250}  
            autoPlay
            autoPlayInterval={3000}
            data={sliderImages}
            scrollAnimationDuration={2000}
            renderItem={({ item }) => <Image source={item} style={styles.sliderImage} />}
          />
        </View>

        <View style={styles.banner}>
          <Text style={styles.welcomeText}>Get Water Delivered Instantly</Text>
        </View>

        <Text style={styles.categoryTitle}>Choose Your Water Service</Text>

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
                onPress={() => toggleCategory(item._id)}
              >
                <Image source={{ uri: item.image }} style={styles.categoryImage} />
                <Text style={styles.categoryText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Trucks under Selected Category */}
        {Object.keys(expandedCategories).map((categoryId) => (
          expandedCategories[categoryId] && trucksByCategory[categoryId] && (
            <View key={categoryId} style={styles.truckContainer}>
              <Text style={styles.truckTitle}>Trucks for {categories.find(c => c._id === categoryId)?.name}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.truckScroll}>
                {trucksByCategory[categoryId].map((truck) => (
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
            </View>
          )
        ))}

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
  banner: { alignItems: "center", marginTop: 20, padding: 20, marginHorizontal: 20, backgroundColor: "#0080FF", borderRadius: 12 },
  welcomeText: { fontSize: 22, fontWeight: "bold", textAlign: "center", color: "#fff" },
  categoryTitle: { fontSize: 22, fontWeight: "700", marginTop: 20, textAlign: "center", color: "#222" },

  categoryGrid: { justifyContent: "space-between", paddingHorizontal: 15, marginTop: 10 },
  categoryCard: { backgroundColor: "#fff", alignItems: "center", justifyContent: "center", borderRadius: 12, width: width * 0.44, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: "#E0E0E0" },
  categoryImage: { width: 80, height: 80, borderRadius: 10 },
  categoryText: { fontSize: 16, fontWeight: "bold", color: "#333", marginTop: 10, textAlign: "center" },

  truckContainer: { marginTop: 10, paddingHorizontal: 15 },
  truckTitle: { fontSize: 18, fontWeight: "bold", color: "#222", marginBottom: 10 },
  truckScroll: { paddingLeft: 10 },
  truckCard: { backgroundColor: "#fff", borderRadius: 12, padding: 10, alignItems: "center", width: 140, marginRight: 10, borderWidth: 1, borderColor: "#E0E0E0" },
  truckImage: { width: 120, height: 80, borderRadius: 8 },
  truckText: { fontSize: 14, fontWeight: "500", textAlign: "center", marginTop: 5, color: "#333" },

  specialOffer: { backgroundColor: "#FF5733", padding: 20, borderRadius: 12, margin: 20, alignItems: "center" },
  offerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff", textAlign: "center" },
  offerButton: { backgroundColor: "#FFD700", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginTop: 10 },
  offerButtonText: { fontSize: 16, fontWeight: "bold", color: "#333" },

  sliderContainer: { alignItems: "center", marginVertical: 20 },
  sliderImage: { width: width * 0.9, height: 250, borderRadius: 18 },
});

export default Home;