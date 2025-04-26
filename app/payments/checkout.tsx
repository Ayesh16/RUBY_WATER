import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import Navbar from "@/components/Navbar";

const Checkout = () => {
  const { booking_id = '', user_id = '', amount = 0 } = useLocalSearchParams(); // Set default values
  const [isLoading, setIsLoading] = useState(false);

  const handlePay = async () => {
    if (!booking_id || !user_id || !amount) {
      Alert.alert("Error", "Missing payment details. Please try again.");
      console.log("Missing parameters:", { booking_id, user_id, amount });
      return;
    }

    setIsLoading(true); // Show the loading spinner

    try {
      // Sending the payment request to the backend
      const response = await axios.post(
        "http://localhost:5000/payments",
        {
          booking_id,
          user_id,
          amount,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.message === "Payment processed successfully") {
        Alert.alert(
          "Payment Successful",
          `✅ Payment of ₹${amount} for booking ${booking_id} by user ${user_id} was successful!`
        );
        router.push("/bookings/booking-success"); // Navigate to success screen
      } else {
        Alert.alert("Payment Failed", response.data.message);
      }
    } catch (error) {
      console.error("Payment error:", error);
      Alert.alert("Payment Failed", "❌ Something went wrong. Please try again.");
    } finally {
      setIsLoading(false); // Hide the loading spinner
    }
  };

  return (
    <>
      <Navbar isLoggedIn={true} onLogout={() => console.log("Logging out...")} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#f4f4f5" }}>
        <View style={{ backgroundColor: "#fff", padding: 24, borderRadius: 16, width: "100%", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 6, elevation: 4 }}>
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <Ionicons name="card-outline" size={64} color="#4f46e5" />
            <Text style={{ fontSize: 28, fontWeight: "bold", color: "#1f2937", marginTop: 12 }}>Checkout</Text>
            <Text style={{ fontSize: 16, color: "#6b7280", marginTop: 4 }}>Confirm your payment</Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: "#374151", marginBottom: 4 }}>📄 Booking ID:</Text>
            <Text style={{ fontSize: 16, color: "#111827", fontWeight: "500" }}>{booking_id}</Text>
          </View>

          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: "#374151", marginBottom: 4 }}>👤 User ID:</Text>
            <Text style={{ fontSize: 16, color: "#111827", fontWeight: "500" }}>{user_id}</Text>
          </View>

          <View style={{ marginBottom: 32 }}>
            <Text style={{ fontSize: 16, color: "#374151", marginBottom: 4 }}>💰 Amount:</Text>
            <Text style={{ fontSize: 18, color: "#10b981", fontWeight: "700" }}>₹{amount}</Text>
          </View>

          {/* Loading spinner or Pay Now button */}
          {isLoading ? (
            <ActivityIndicator size="large" color="#4f46e5" />
          ) : (
            <TouchableOpacity
              onPress={handlePay}
              style={{
                backgroundColor: "#4f46e5",
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Pay Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};

export default Checkout;
