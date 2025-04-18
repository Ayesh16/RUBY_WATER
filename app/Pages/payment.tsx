import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Checkbox } from "react-native-paper";
import Toast from "react-native-toast-message";
import Navbar from "@/components/Navbar";


const Payment = () => {
  const params = useLocalSearchParams();
  const router = useRouter();

  const { booking_id = "N/A", user_id = "N/A", amount = "$0.00" } = params;
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const paymentMethods = [
    { id: "upi", image: require("../../assets/images/upi.png"), label: "UPI" },
    { id: "paypal", image: require("../../assets/images/paypal.png"), label: "PayPal" },
    { id: "visa", image: require("../../assets/images/visa.png"), label: "VISA" },
    { id: "mastercard", image: require("../../assets/images/mastercard.png"), label: "MasterCard" },
  ];

  const handlePayment = () => {
    if (!selectedPayment) {
      Toast.show({ type: "error", text1: "Payment Error", text2: "Please select a payment method!" });
      return;
    }
    Toast.show({ type: "success", text1: "Payment Successful", text2: `Paid with ${selectedPayment}` });
    setTimeout(() => {
      router.push("/Pages/confirmation");
    }, 2000);
  };

  return (
    <View style={styles.container}>
        <Navbar isLoggedIn={false} onLogout={function (): void {
        throw new Error("Function not implemented.");
      } }/>
      {/* Header */}
      <Text style={styles.title}>Payment</Text>

      {/* Payment Icon */}
      <Image source={require("../../assets/images/payment_icon.png")} style={styles.paymentIcon} />

      {/* Booking & User Details */}
      <View style={styles.infoCard}>
        <Text style={styles.label}>Booking ID:</Text>
        <Text style={styles.value}>{booking_id}</Text>
        <Text style={styles.label}>User ID:</Text>
        <Text style={styles.value}>{user_id}</Text>
      </View>

      {/* Payment Method Selection */}
      <Text style={styles.chooseText}>Choose Payment Method</Text>
      {paymentMethods.map((method) => (
        <TouchableOpacity key={method.id} style={styles.paymentOption} onPress={() => setSelectedPayment(method.label)}>
          <Checkbox
            status={selectedPayment === method.label ? "checked" : "unchecked"}
            color="#6200EE"
          />
          <Image source={method.image} style={styles.paymentImage} />
        </TouchableOpacity>
      ))}

      {/* Amount */}
      <View style={styles.amountContainer}>
        <Text style={styles.label}>Amount:</Text>
        <Image source={require("../../assets/images/currency_icon.png")} style={styles.currencyIcon} />
        <Text style={styles.value}>{amount}</Text>
      </View>

      {/* Proceed to Payment Button */}
      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        <Text style={styles.buttonText}>Proceed to Pay</Text>
      </TouchableOpacity>
      <Toast />
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3D6E4",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  paymentIcon: {
    width: 80,
    height: 80,
    alignSelf: "center",
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 15,
    width:"50%",
    borderRadius: 10,
    marginVertical: 10,
    alignSelf:"center"
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
    color: "#444",
  },
  chooseText: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    alignSelf:"center"
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    alignSelf:"center",
    width:"50%"
  },
  paymentImage: {
    width: 50,
    height: 30,
    marginLeft: 10,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    alignSelf:"center"
  },
  currencyIcon: {
    width: 30,
    height: 30,
    marginHorizontal: 10,
  },
  payButton: {
    backgroundColor: "#6200EE",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 6,
    alignItems: "center",
    alignSelf:"center",
    width:"50%"
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Payment;
