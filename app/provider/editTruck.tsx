import React, { useEffect, useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Image,
  StyleSheet, ActivityIndicator, Alert, ScrollView, Switch
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "@/components/Navbar";

const API_URL = "http://192.168.161.73:5000";

const EditTruck = () => {
  const router = useRouter();
  const { truckId } = useLocalSearchParams<{ truckId?: string }>();

  const [truckName, setTruckName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [truckType, setTruckType] = useState("");
  const [location, setLocation] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [price, setPrice] = useState("");
  const [available, setAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!truckId) {
      Alert.alert("Error", "Invalid Truck ID. Redirecting...");
      router.push("/provider/categoryTrucks");
      return;
    }
    fetchTruckDetails();
  }, [truckId]);

  const fetchTruckDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "Session expired. Please log in again.");
        return;
      }

      const response = await axios.get(`${API_URL}/trucks/${truckId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const truckData = response.data;
      setTruckName(truckData.truck_name);
      setCapacity(String(truckData.capacity));
      setTruckType(truckData.truck_type);
      setLocation(truckData.location);
      setCategoryDescription(truckData.category_description);
      setImageUri(truckData.truck_image || "");
      setPrice(String(truckData.price || ""));
      setAvailable(truckData.available || false);
    } catch (error) {
      console.error("❌ Error fetching truck details:", error);
      Alert.alert("Error", "Failed to load truck details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTruck = async () => {
    if (!truckName || !capacity || !truckType || !location || !categoryDescription || !price) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    try {
      setIsUpdating(true);
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "Session expired. Please log in again.");
        return;
      }

      await axios.put(
        `${API_URL}/trucks/${truckId}`,
        {
          truck_name: truckName,
          capacity: Number(capacity),
          truck_type: truckType,
          location,
          category_description: categoryDescription,
          truck_image: imageUri,
          price: Number(price),
          available,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("Success", "Truck details updated!");
      router.push("/provider/providerhome");
    } catch (error) {
      console.error("❌ Update failed:", error);
      Alert.alert("Error", "Failed to update truck details.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <Navbar isLoggedIn={true} onLogout={() => console.log("Logging out...")} />
      <View style={styles.container}>
        <Text style={styles.heading}>Edit Truck</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color="#0080FF" style={{ marginTop: 20 }} />
        ) : (
          <ScrollView style={styles.scrollContainer}>
            <TextInput style={styles.input} placeholder="Truck Name" value={truckName} onChangeText={setTruckName} />
            <TextInput style={styles.input} placeholder="Capacity (Liters)" value={capacity} onChangeText={setCapacity} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Truck Type (e.g., Large, Small)" value={truckType} onChangeText={setTruckType} />
            <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
            <TextInput style={styles.input} placeholder="Category Description" value={categoryDescription} onChangeText={setCategoryDescription} />
            <TextInput style={styles.input} placeholder="Truck Image URL" value={imageUri} onChangeText={setImageUri} />
            <TextInput style={styles.input} placeholder="Price (₹)" value={price} onChangeText={setPrice} keyboardType="numeric" />
            
            {/* 🚛 Availability Switch */}
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Available:</Text>
              <Switch
                value={available}
                onValueChange={setAvailable}
                trackColor={{ false: "#ccc", true: "#4CD964" }}
                thumbColor={available ? "#fff" : "#f4f3f4"}
                ios_backgroundColor="#ccc"
              />
            </View>

            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.image} />
            ) : (
              <Text style={styles.imagePlaceholder}>Enter a valid image URL</Text>
            )}

            <TouchableOpacity style={styles.updateButton} onPress={handleUpdateTruck} disabled={isUpdating}>
              <Text style={styles.updateButtonText}>
                {isUpdating ? "Updating..." : "Update Truck"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 20,
    alignItems: "center",
    marginTop: 100,
  },
  scrollContainer: { width: "100%" },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginVertical: 10,
  },
  imagePlaceholder: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  updateButton: {
    backgroundColor: "#0080FF",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
  },
  updateButtonText: { fontSize: 16, fontWeight: "bold", color: "#fff" },
});

export default EditTruck;
