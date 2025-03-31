import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";

const AddTruck = () => {
  const router = useRouter();
  const [truckName, setTruckName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [category, setCategory] = useState("drinking");

  const handleAddTruck = async () => {
    try {
      await axios.post("https://bd28-2401-4900-4c1b-f348-b84a-4a06-30d9-a39a.ngrok-free.app/trucks/register", {
        owner_id: "123", // Change with actual user ID
        truck_name: truckName,
        capacity: Number(capacity),
        category,
      });

      router.push("/provider/providerhome");
    } catch (error) {
      console.error("Error adding truck:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add a New Truck</Text>

      <TextInput style={styles.input} placeholder="Truck Name" value={truckName} onChangeText={setTruckName} />
      <TextInput style={styles.input} placeholder="Capacity (Liters)" keyboardType="numeric" value={capacity} onChangeText={setCapacity} />

      <TouchableOpacity style={styles.addButton} onPress={handleAddTruck}>
        <Text style={styles.addButtonText}>Add Truck</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", padding: 20 },
  heading: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 8, marginVertical: 8, borderWidth: 1, borderColor: "#ddd" },
  addButton: { backgroundColor: "#0080FF", padding: 12, borderRadius: 10, marginTop: 10 },
  addButtonText: { fontSize: 18, fontWeight: "bold", color: "#fff", textAlign: "center" },
});

export default AddTruck;
