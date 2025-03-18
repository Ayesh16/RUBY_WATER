import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Navbar from "@/componets/Navbar";

const truckDetailsData: Record<
  string,
  { image: any; details: string; capacity: string; price: string }
> = {
  "Volvo FMX Water Tanker": {
    image: require("../assets/images/volvo_fmx.png"),
    details: "A powerful water tanker truck with high load capacity and durability.",
    capacity: "12,000 liters",
    price: "$85,000",
  },
  "Tata LPT 3118 Water Tanker": {
    image: require("../assets/images/tata_lpt.png"),
    details: "A highly reliable water tanker truck for urban and rural distribution.",
    capacity: "10,000 liters",
    price: "$75,000",
  },
  "Isuzu FVR900 Water Truck": {
    image: require("../assets/images/isuzu_fvr.png"),
    details: "A lightweight and efficient water supply truck for versatile applications.",
    capacity: "8,500 liters",
    price: "$65,000",
  },
};

const TruckDetails = () => {
  const params = useLocalSearchParams();
  const truckName = params.name as string;
  const truck = truckDetailsData[truckName];
  const router = useRouter();

  if (!truck) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Truck Not Found</Text>
        <TouchableOpacity style={styles.goBackButton} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBooking = () => {
    router.push(`/booking?truck=${encodeURIComponent(truckName)}`);
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <Image source={truck.image} style={styles.truckImage} />
      <Text style={styles.title}>{truckName}</Text>

      <View style={styles.detailsContainer}>
        <Text style={styles.details}>{truck.details}</Text>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Capacity:</Text>
          <Text style={styles.value}>{truck.capacity}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Price:</Text>
          <Text style={styles.value}>{truck.price}</Text>
        </View>
      </View>

      {/* Book Now Button */}
      <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
        <Text style={styles.buttonText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  truckImage: {
    width: 250,
    height: 150,
    resizeMode: "contain",
    marginTop: "10%",
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  detailsContainer: {
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  details: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    paddingVertical: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 18,
    color: "#555",
  },
  bookButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: "center",
  },
  goBackButton: {
    backgroundColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default TruckDetails;

