import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import Navbar from "@/componets/Navbar";

const BookingDetails = () => {
  const router = useRouter();

  // State to handle user input
  const [customerDetails, setCustomerDetails] = useState({
    customer_id: "",
    customer_name: "",
    customer_number: "",
    address: "",
    pincode: "",
  });

  const [bookingDetails, setBookingDetails] = useState({
    booking_time: "",
    location: "",
  });

  const handleProceedToPayment = () => {
    if (
      !customerDetails.customer_id ||
      !customerDetails.customer_name ||
      !customerDetails.customer_number ||
      !customerDetails.address ||
      !customerDetails.pincode ||
      !bookingDetails.booking_time ||
      !bookingDetails.location
    ) {
      Alert.alert("Error", "Please fill in all the fields before proceeding.");
      return;
    }

    // Navigate to payment page with user data
    router.push({
      pathname: "/payment",
      params: { ...customerDetails, ...bookingDetails },
    });
  };

  return (
    <View style={styles.container}>
        <Navbar/>
      {/* Truck Image */}
      <Image source={require("../assets/images/truck.png")} style={styles.truckImage} />

      {/* Customer Details */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Customer Details</Text>
        {Object.keys(customerDetails).map((key) => (
          <TextInput
            key={key}
            style={styles.input}
            placeholder={key.replace("_", " ").toUpperCase()}
            value={customerDetails[key as keyof typeof customerDetails]}
            onChangeText={(text) => setCustomerDetails((prev) => ({ ...prev, [key]: text }))}
          />
        ))}
      </View>

      {/* Booking Info */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Booking Info</Text>
        {Object.keys(bookingDetails).map((key) => (
          <TextInput
            key={key}
            style={styles.input}
            placeholder={key.replace("_", " ").toUpperCase()}
            value={bookingDetails[key as keyof typeof bookingDetails]}
            onChangeText={(text) => setBookingDetails((prev) => ({ ...prev, [key]: text }))}
          />
        ))}
      </View>

      {/* Proceed to Payment Button */}
      <TouchableOpacity style={styles.paymentButton} onPress={handleProceedToPayment}>
        <Text style={styles.buttonText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3D6E4",
  },
  truckImage: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginVertical: 10,
  },
  infoCard: {
    backgroundColor: "#eee",
    padding: 15,
    marginVertical: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  paymentButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignSelf: "center",
    width: "80%",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default BookingDetails;
