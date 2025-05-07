import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Navbar from "@/components/Navbar";

const API_URL = "http://192.168.131.73:5000";

const TruckDetails = () => {
  const { id } = useLocalSearchParams();
  const [truck, setTruck] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [address, setAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [deliveryDate, setDeliveryDate] = useState<Date>(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    if (!id) {
      alert("No truck ID provided.");
      return;
    }
    fetchTruckDetails();
    fetchUserDetails();
  }, [id]);

  const fetchTruckDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        alert("You need to log in.");
        return;
      }

      const response = await axios.get(`${API_URL}/trucks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTruck(response.data);
    } catch (error) {
      console.error("❌ Error fetching truck details:", error);
      alert("Could not load truck details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      const res = await axios.get(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAddress(res.data.address || "");
      setPhoneNumber(res.data.phone || "");
    } catch (error) {
      console.error("❌ Error fetching user details:", error);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const userId = await AsyncStorage.getItem("ownerId");
  
      if (!token || !userId) {
        alert("Authentication required.");
        return;
      }
  
      if (!address || !phoneNumber || !deliveryDate) {
        alert("Please fill all booking details.");
        return;
      }
  
      const bookingPayload = {
        truck_id: id,
        customer_id: userId,
        address,
        phone: phoneNumber,
        delivery_time: deliveryDate.toISOString(),
      };
  
      // Make the booking request and log the response
      const response = await axios.post(`${API_URL}/bookings`, bookingPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      console.log("Booking Response:", response.data);
      
      const booking_id = response.data.booking_id; // <-- Corrected here
      
      console.log("Booking ID:", booking_id);
      
      if (!booking_id) {
        alert("Booking ID not received.");
        return;
      }
      
      setShowBookingForm(false);
      
      router.push({
        pathname: "/payments/checkout",
        params: {
          booking_id,
          user_id: userId,
          amount: truck.price.toString(),
        },
      });      
    } catch (error: any) {
      console.error("❌ Booking failed:", error.response?.data || error.message);
      alert("Booking failed. Something went wrong.");
    }
  };
  

  if (loading) return <ActivityIndicator size="large" color="#0080FF" style={{ marginTop: 20 }} />;
  if (!truck) return <Text style={styles.errorText}>Truck details not found.</Text>;

  return (
    <>
      <Navbar isLoggedIn={true} onLogout={() => console.log("Logging out...")} />
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: truck.truck_image }} style={styles.truckImage} />
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.truckName}>{truck.truck_name}</Text>
          <Text style={styles.price}>
            ₹{truck.price} <Text style={styles.discount}>{truck.original_price}</Text>
          </Text>
          <Text style={styles.truckDescription}>Description: {truck.category_description}</Text>
          <Text style={styles.truckCapacity}>💧 Capacity: {truck.capacity} Liters</Text>
          <Text style={styles.truckLocation}>📍 Location: {truck.location}</Text>
          <Text style={styles.truckType}>🚛 Type: {truck.truck_type}</Text>
          <Text style={[styles.truckAvailability, { color: truck.available ? "green" : "red" }]}>
            {truck.available ? "✅ Available" : "❌ Not Available"}
          </Text>

          {!showBookingForm ? (
            <TouchableOpacity style={styles.bookButton} onPress={() => setShowBookingForm(true)}>
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          ) : (
            <>
              <Text style={styles.label}>📍 Address</Text>
              <TextInput
                value={address}
                onChangeText={setAddress}
                placeholder="Enter your address"
                style={styles.inputBox}
              />

              <Text style={styles.label}>📞 Phone Number</Text>
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter your phone number"
                style={styles.inputBox}
                keyboardType="phone-pad"
              />

              <Text style={styles.label}>📅 Delivery Date & Time</Text>
              <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.inputBox}>
                <Text>{deliveryDate.toLocaleString()}</Text>
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                date={deliveryDate}
                onConfirm={(date) => {
                  setDeliveryDate(date);
                  setDatePickerVisibility(false);
                }}
                onCancel={() => setDatePickerVisibility(false)}
              />

              <TouchableOpacity style={[styles.bookButton, { backgroundColor: "#28A745" }]} onPress={handleConfirmBooking}>
                <Text style={styles.bookButtonText}>Confirm Booking</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", marginTop: 100 },
  imageContainer: { backgroundColor: "#fff", padding: 15, alignItems: "center" },
  truckImage: { width: "90%", height: 280, borderRadius: 10, resizeMode: "cover" },
  detailsCard: {
    backgroundColor: "#fff", padding: 20, margin: 15, borderRadius: 10,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 5, elevation: 5,
  },
  truckDescription: { fontSize: 16, marginVertical: 5, color: "#555" },
  truckName: { fontSize: 22, fontWeight: "bold", textAlign: "center", color: "#333" },
  price: { fontSize: 22, fontWeight: "bold", color: "#0080FF", textAlign: "center", marginVertical: 5 },
  discount: { fontSize: 18, textDecorationLine: "line-through", color: "gray" },
  truckCapacity: { fontSize: 18, fontWeight: "500", marginTop: 10 },
  truckLocation: { fontSize: 18, marginTop: 5, color: "#007BFF" },
  truckType: { fontSize: 18, marginTop: 5 },
  truckAvailability: { fontSize: 16, marginTop: 10, fontWeight: "500" },
  bookButton: {
    backgroundColor: "#0080FF", paddingVertical: 15, borderRadius: 5,
    marginVertical: 20, alignItems: "center", justifyContent: "center"
  },
  bookButtonText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  label: { fontSize: 16, fontWeight: "600", marginTop: 15 },
  inputBox: {
    backgroundColor: "#f1f1f1", padding: 15, borderRadius: 5, marginVertical: 5,
  },
  errorText: { color: "red", textAlign: "center", marginTop: 20 },
});

export default TruckDetails;