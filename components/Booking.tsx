import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const BookingScreen = () => {
  return (
    <View style={styles.container}>
      {/* Truck Image */}
      <Image source={require("../assets/images/truck.png")}style={styles.truckImage} />

      {/* Customer Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Customer Details</Text>
        <Text style={styles.cardItem}>customer_id</Text>
        <Text style={styles.cardItem}>customer_name</Text>
        <Text style={styles.cardItem}>customer_number</Text>
        <Text style={styles.cardItem}>address</Text>
        <Text style={styles.cardItem}>pincode</Text>
      </View>

      {/* Truck Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Truck Details</Text>
        <Text style={styles.cardItem}>truck_id</Text>
        <Text style={styles.cardItem}>truck_name</Text>
        <Text style={styles.cardItem}>truck_type</Text>
      </View>

      {/* Booking Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Booking Info</Text>
        <Text style={styles.cardItem}>booking_time</Text>
        <Text style={styles.cardItem}>status</Text>
        <Text style={styles.cardItem}>location</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    paddingTop: 40,
  },
  truckImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    marginVertical: 10,
    width: "80%",
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardItem: {
    backgroundColor: "#E0E0E0",
    padding: 5,
    marginVertical: 2,
    borderRadius: 5,
  },
});

export default BookingScreen;
