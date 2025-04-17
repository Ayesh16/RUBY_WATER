import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Checkout = () => {
  const { booking_id, user_id, amount } = useLocalSearchParams();
  
  // Loading state to show spinner while processing payment
  const [isLoading, setIsLoading] = useState(false);

  const handlePay = async () => {
    setIsLoading(true); // Show the loading spinner

    // Simulate payment processing with a delay
    setTimeout(() => {
      setIsLoading(false); // Hide the spinner after processing
      alert(`✅ Payment of ₹${amount} for booking ${booking_id} by user ${user_id} successful!`);
      router.push("/bookings/booking-success");
    }, 2000); // Simulate 2 seconds for payment processing
  };

  return (
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
  );
};

export default Checkout;
