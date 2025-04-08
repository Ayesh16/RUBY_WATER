import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const BookingSuccess = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/success.png")} // use a success image or emoji
        style={styles.image}
      />
      <Text style={styles.title}>Booking Confirmed! 🎉</Text>
      <Text style={styles.message}>Your water truck will arrive as scheduled.</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/user/userBookings")}>
        <Text style={styles.buttonText}>Go to My Bookings</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BookingSuccess;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#FAFAFA" },
  image: { width: 150, height: 150, marginBottom: 30 },
  title: { fontSize: 26, fontWeight: "bold", color: "#28A745", textAlign: "center", marginBottom: 10 },
  message: { fontSize: 18, textAlign: "center", color: "#333", marginBottom: 30 },
  button: { backgroundColor: "#0080FF", paddingVertical: 14, paddingHorizontal: 30, borderRadius: 10 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
