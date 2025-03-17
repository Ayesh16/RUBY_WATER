import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router"; // Import useLocalSearchParams

const truckModelsData: Record<string, string[]> = {
  drinking: ["Volvo FMX Water Tanker", "Tata LPT 3118 Water Tanker", "Isuzu FVR900 Water Truck"],
  construction: ["Mercedes-Benz Arocs", "Scania P410", "MAN TGS 26.400"],
  agriculture: ["Ashok Leyland U-3518", "Mahindra Blazo X 28", "Hino 500 Series"],
  emergency: ["Iveco Trakker Emergency", "Renault Kerax Rapid Response", "Ford Cargo 1833"],
};

const TruckModel = () => {
  const params = useLocalSearchParams();
  const selectedCategory = params.category as keyof typeof truckModelsData; // Get category from URL

  if (!selectedCategory || !truckModelsData[selectedCategory]) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Invalid Category</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Truck Models for {selectedCategory} Water Supply</Text>
      <FlatList
        data={truckModelsData[selectedCategory]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.model}>{item}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textTransform: "capitalize" },
  model: { fontSize: 18, marginBottom: 10, color: "#333" },
});

export default TruckModel;
