import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";

const API_URL = "http://localhost:5000";

const AddTruck = () => {
  const router = useRouter();
  const { categoryId } = useLocalSearchParams();
  const categoryIdString = Array.isArray(categoryId) ? categoryId[0] : categoryId || "";

  const [truckName, setTruckName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [truckType, setTruckType] = useState("");
  const [location, setLocation] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [truckImage, setTruckImage] = useState("");
  const [price, setPrice] = useState(""); // ✅ New price field
  const [loading, setLoading] = useState(false);

  const handleAddTruck = async () => {
    if (!truckName || !capacity || !truckType || !location || !categoryIdString || !categoryDescription || !truckImage || !price) {
      Alert.alert("Error", "Please fill all the fields.");
      return;
    }

    setLoading(true);

    try {
      const ownerId = await AsyncStorage.getItem("ownerId");
      const token = await AsyncStorage.getItem("authToken");

      if (!ownerId || !token) {
        console.error("❌ Missing Owner ID or Auth Token!");
        setLoading(false);
        return;
      }

      const truckData = {
        truck_name: truckName.trim(),
        owner_id: ownerId.trim(),
        category_id: categoryIdString.trim(),
        capacity: Number(capacity),
        truck_type: truckType.trim(),
        location: location.trim(),
        category_description: categoryDescription.trim(),
        truck_image: truckImage.trim(),
        price: Number(price), // ✅ Add price to payload
      };

      console.log("🚀 Sending Truck Data:", truckData);

      const response = await axios.post(`${API_URL}/trucks/register`, truckData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Truck added successfully:", response.data);
      Alert.alert("Success", "Truck added successfully!");
      router.push("/provider/providerhome");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error("❌ API Error:", err.response?.data || err.message);
        Alert.alert("Error", err.response?.data?.message || "Something went wrong!");
      } else {
        console.error("❌ Unknown Error:", err);
        Alert.alert("Error", "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add New Truck</Text>

      <TextInput placeholder="Truck Name" value={truckName} onChangeText={setTruckName} style={styles.input} />
      <TextInput placeholder="Capacity (Liters)" value={capacity} onChangeText={setCapacity} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Truck Type" value={truckType} onChangeText={setTruckType} style={styles.input} />
      <TextInput placeholder="Location" value={location} onChangeText={setLocation} style={styles.input} />
      <TextInput placeholder="Category ID" value={categoryIdString} editable={false} style={[styles.input, styles.disabledInput]} />
      <TextInput placeholder="Category Description" value={categoryDescription} onChangeText={setCategoryDescription} style={styles.input} />
      <TextInput placeholder="Truck Image URL" value={truckImage} onChangeText={setTruckImage} style={styles.input} />
      <TextInput placeholder="Price (₹)" value={price} onChangeText={setPrice} keyboardType="numeric" style={styles.input} /> {/* ✅ Price input */}

      <TouchableOpacity onPress={handleAddTruck} style={styles.addButton} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.addButtonText}>Add Truck</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 20 },
  heading: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  input: { backgroundColor: "#FFF", padding: 10, marginBottom: 10, borderRadius: 5, borderWidth: 1, borderColor: "#CCC" },
  disabledInput: { backgroundColor: "#E0E0E0", color: "#888" },
  addButton: { backgroundColor: "#0080FF", padding: 12, borderRadius: 5, alignItems: "center" },
  addButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});

export default AddTruck;
