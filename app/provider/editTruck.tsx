import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import Navbar from "@/components/Navbar";

const API_URL = "http://localhost:5000";

const EditTruck = () => {
  const router = useRouter();
  const { truckId } = useLocalSearchParams<{ truckId: string }>(); // Get truck ID from params
  const [truckName, setTruckName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTruckDetails();
  }, []);

  const fetchTruckDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/trucks/${truckId}`);
      const truck = response.data;
      setTruckName(truck.truck_name);
      setCapacity(truck.capacity.toString());
      setImage(truck.truck_image || null);
    } catch (error) {
      console.error("Error fetching truck details:", error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleEditTruck = async () => {
    if (!truckName || !capacity) {
      Alert.alert("Missing Fields", "Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      const updatedTruck = {
        truck_name: truckName,
        capacity: Number(capacity),
        truck_image: image || "",
      };

      await axios.put(`${API_URL}/trucks/${truckId}`, updatedTruck);
      Alert.alert("Success", "Truck details updated successfully!");
      router.push("/provider/categoryTrucks"); // Redirect to truck list
    } catch (error) {
      console.error("Error updating truck:", error);
      Alert.alert("Error", "Failed to update truck.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Navbar isLoggedIn={true} onLogout={() => console.log("Logging out...")} />
      <Text style={styles.heading}>Edit Truck</Text>

      <TextInput placeholder="Truck Name" style={styles.input} value={truckName} onChangeText={setTruckName} />
      <TextInput placeholder="Capacity (Liters)" style={styles.input} keyboardType="numeric" value={capacity} onChangeText={setCapacity} />

      {image && <Image source={{ uri: image }} style={styles.truckImage} />}
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        <Text style={styles.imagePickerText}>{image ? "Change Image" : "Pick an Image"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.updateButton} onPress={handleEditTruck} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.updateButtonText}>Update Truck</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FAFAFA", 
    padding: 20 
  },
  heading: { 
    fontSize: 24, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginBottom: 20, 
    color: "#333" 
  },
  input: { 
    backgroundColor: "#fff", 
    padding: 12, 
    marginBottom: 15, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: "#ccc", 
    fontSize: 16, 
    color: "#333" 
  },
  truckImage: { 
    width: 120, 
    height: 120, 
    alignSelf: "center", 
    marginBottom: 10, 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: "#ddd" 
  },
  imagePicker: { 
    backgroundColor: "#0080FF", 
    padding: 12, 
    borderRadius: 8, 
    alignItems: "center", 
    marginBottom: 15 
  },
  imagePickerText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16 
  },
  updateButton: { 
    backgroundColor: "#28A745", 
    padding: 15, 
    borderRadius: 8, 
    alignItems: "center", 
    marginTop: 10 
  },
  updateButtonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16 
  },
});


export default EditTruck;
