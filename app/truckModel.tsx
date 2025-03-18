import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const truckModelsData: Record<string, { name: string; image: any }[]> = {
  drinking: [
    { name: "Volvo FMX Water Tanker", image: require("../assets/images/volvo_fmx.png") },
    { name: "Tata LPT 3118 Water Tanker", image: require("../assets/images/tata_lpt.png") },
    { name: "Isuzu FVR900 Water Truck", image: require("../assets/images/isuzu_fvr.png") },
  ],
  construction: [
    { name: "Mercedes-Benz Arocs", image: require("../assets/images/mercedes_arocs.png") },
    { name: "Scania P410", image: require("../assets/images/scania_p410.png") },
    { name: "MAN TGS 26.400", image: require("../assets/images/man_tgs.png") },
  ],
  agriculture: [
    { name: "Ashok Leyland U-3518", image: require("../assets/images/ashok_leyland.png") },
    { name: "Mahindra Blazo X 28", image: require("../assets/images/mahindra_blazo.png") },
    { name: "Hino 500 Series", image: require("../assets/images/hino_500.png") },
  ],
  emergency: [
    { name: "Iveco Trakker Emergency", image: require("../assets/images/iveco_trakker.png") },
    { name: "Renault Kerax Rapid Response", image: require("../assets/images/renault_kerax.png") },
    { name: "Ford Cargo 1833", image: require("../assets/images/ford_cargo.png") },
  ],
};

const TruckModel = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const selectedCategory = params.category as keyof typeof truckModelsData;

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
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.truckCard}
            onPress={() => router.push(`/truckDetails?name=${item.name}`)}
          >
            <Image source={item.image} style={styles.truckImage} />
            <Text style={styles.model}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textTransform: "capitalize" },
  truckCard: { backgroundColor: "#f9f9f9", padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 15, width: 250 },
  truckImage: { width: 200, height: 120, resizeMode: "contain" },
  model: { fontSize: 18, paddingTop: 10, fontWeight: "500", textAlign: "center" },
});

export default TruckModel;
