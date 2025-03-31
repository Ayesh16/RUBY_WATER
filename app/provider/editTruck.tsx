import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";

const EditTruck = () => {
  const router = useRouter();
  const { truckId } = useLocalSearchParams();
  const [truck, setTruck] = useState({
    truck_name: "",
    capacity: "",
    category: "",
  });

  useEffect(() => {
    fetchTruckDetails();
  }, []);

  const fetchTruckDetails = async () => {
    try {
      const response = await axios.get(`https://your-api.com/trucks/${truckId}`);
      setTruck(response.data);
    } catch (error) {
      console.error("Error fetching truck details:", error);
    }
  };

  const handleUpdateTruck = async () => {
    try {
      await axios.put(`https://bd28-2401-4900-4c1b-f348-b84a-4a06-30d9-a39a.ngrok-free.app/trucks/${truckId}`, truck);
      router.push("/provider/providerhome");
    } catch (error) {
      console.error("Error updating truck:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Truck</Text>

      <TextInput
        style={styles.input}
        placeholder="Truck Name"
        value={truck.truck_name}
        onChangeText={(text) => setTruck({ ...truck, truck_name: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Capacity (Liters)"
        keyboardType="numeric"
        value={String(truck.capacity)}
        onChangeText={(text) => setTruck({ ...truck, capacity: text })}
      />

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateTruck}>
        <Text style={styles.updateButtonText}>Update Truck</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 20 },
  heading: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 8, marginVertical: 8, borderWidth: 1, borderColor: "#ddd" },
  updateButton: { backgroundColor: "#0080FF", padding: 12, borderRadius: 10, marginTop: 10 },
  updateButtonText: { fontSize: 18, fontWeight: "bold", color: "#fff", textAlign: "center" },
});

export default EditTruck;
