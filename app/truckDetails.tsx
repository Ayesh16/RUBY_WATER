import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";

const truckDetailsData: Record<string, { image: any; details: string }> = {
  "Volvo FMX Water Tanker": {
    image: require("../assets/images/volvo_fmx.png"),
    details: "A powerful water tanker truck with high load capacity and durability.",
  },
  "Tata LPT 3118 Water Tanker": {
    image: require("../assets/images/tata_lpt.png"),
    details: "A highly reliable water tanker truck for urban and rural distribution.",
  },
  "Isuzu FVR900 Water Truck": {
    image: require("../assets/images/isuzu_fvr.png"),
    details: "A lightweight and efficient water supply truck for versatile applications.",
  },
  // Add more details for other models...
};

const TruckDetails = () => {
  const params = useLocalSearchParams();
  const truckName = params.name as string;
  const truck = truckDetailsData[truckName];

  if (!truck) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Truck Not Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={truck.image} style={styles.truckImage} />
      <Text style={styles.title}>{truckName}</Text>
      <Text style={styles.details}>{truck.details}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center", backgroundColor: "#fff" },
  truckImage: { width: 250, height: 150, resizeMode: "contain", marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  details: { fontSize: 16, textAlign: "center", color: "#666" },
});

export default TruckDetails;
