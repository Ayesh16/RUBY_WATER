import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const truckDetailsData: Record<string, { image: any; details: string; capacity: string; price: string }> = {
  "Volvo FMX Water Tanker": {
    image: require("../assets/images/volvo_fmx.png"),
    details: "A powerful water tanker truck with high load capacity and durability.",
    capacity: "10,000 liters",
    price: "$200",
  },
  "Tata LPT 3118 Water Tanker": {
    image: require("../assets/images/tata_lpt.png"),
    details: "A highly reliable water tanker truck for urban and rural distribution.",
    capacity: "8,000 liters",
    price: "$180",
  },
  "Isuzu FVR900 Water Truck": {
    image: require("../assets/images/isuzu_fvr.png"),
    details: "A lightweight and efficient water supply truck for versatile applications.",
    capacity: "12,000 liters",
    price: "$220",
  },
};

const TruckDetails = () => {
  const params = useLocalSearchParams();
  const truckName = params.name as string;
  const truck = truckDetailsData[truckName];
  const router = useRouter();

  const [customerDetails, setCustomerDetails] = useState({
    customer_name: "",
    address: "",
    pincode: "",
  });

  if (!truck) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Truck Not Found</Text>
      </View>
    );
  }

  const handleProceedToPayment = () => {
    if (!customerDetails.customer_name || !customerDetails.address || !customerDetails.pincode) {
      Alert.alert("Error", "Please fill in all fields before proceeding.");
      return;
    }
    // Navigate to payment with booking details
    router.push({
      pathname: "/payment",
      params: { truck: truckName, ...customerDetails },
    });
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <Image source={truck.image} style={styles.truckImage} />
      <Text style={styles.title}>{truckName}</Text>

      <View style={styles.detailsContainer}>
        <Text style={styles.details}>{truck.details}</Text>
        <Text style={styles.detailText}>Capacity: {truck.capacity}</Text>
        <Text style={styles.detailText}>Price: {truck.price}</Text>
      </View>

      {/* Booking Form */}
      <View style={styles.bookingContainer}>
        <Text style={styles.sectionTitle}>Enter Booking Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Customer Name"
          value={customerDetails.customer_name}
          onChangeText={(text) => setCustomerDetails({ ...customerDetails, customer_name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={customerDetails.address}
          onChangeText={(text) => setCustomerDetails({ ...customerDetails, address: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Pincode"
          keyboardType="numeric"
          value={customerDetails.pincode}
          onChangeText={(text) => setCustomerDetails({ ...customerDetails, pincode: text })}
        />

        {/* Proceed to Payment Button */}
        <TouchableOpacity style={styles.bookButton} onPress={handleProceedToPayment}>
          <Text style={styles.buttonText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </View>
      <Footer/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3D6E4"},
  truckImage: { width: 250, height: 150, resizeMode: "contain", marginTop: 20 ,alignSelf:"center"},
  title: { fontSize: 24, fontWeight: "bold", marginTop: 10, textAlign: "center" },
  detailsContainer: { marginTop: 10, alignItems: "center" },
  details: { fontSize: 16, textAlign: "center", marginBottom: 10 },
  detailText: { fontSize: 16, color: "#555", marginBottom: 5 },
  bookingContainer: {
    width: "50%",
    backgroundColor: "#F3D6E4",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignSelf:"center"
  },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  input: {
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  bookButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 15,
    alignSelf: "center",
    width: "100%",
    alignItems: "center",
  },
  buttonText: { fontSize: 18, color: "#fff", fontWeight: "bold" },
});

export default TruckDetails;
