import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const Confirmation = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Success Icon */}
      <Image source={require("../assets/images/success.png")} style={styles.successIcon} />

      {/* Confirmation Message */}
      <Text style={styles.title}>Payment Successful!</Text>
      <Text style={styles.subText}>Your transaction has been completed.</Text>

      {/* Transaction Details */}
      <View style={styles.infoCard}>
        <Text style={styles.label}>Transaction ID:</Text>
        <Text style={styles.value}>#TXN123456789</Text>

        <Text style={styles.label}>Amount Paid:</Text>
        <Text style={styles.value}>$85,000</Text>

        <Text style={styles.label}>Payment Method:</Text>
        <Text style={styles.value}>VISA</Text>
      </View>

      {/* Go Home Button */}
      <TouchableOpacity style={styles.homeButton} onPress={() => router.push("/home")}>
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3D6E4",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  successIcon: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  subText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginVertical: 5,
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
    width: "90%",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  value: {
    fontSize: 16,
    color: "#444",
  },
  homeButton: {
    backgroundColor: "#6200EE",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Confirmation;
