import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";
import Navbar from "@/components/Navbar";

const API_URL = "http://192.168.154.73:5000";

const TruckDetails = () => {
  const { id } = useLocalSearchParams();
  const [truck, setTruck] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryDate, setDeliveryDate] = useState<Date>(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [modalMessage, setModalMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [inputModalVisible, setInputModalVisible] = useState(false);
  const [inputLabel, setInputLabel] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [onInputConfirm, setOnInputConfirm] = useState<(val: string) => void>(() => {});

  useEffect(() => {
    if (!id) {
      showMessage("No truck ID provided.");
      return;
    }
    fetchTruckDetails();
  }, [id]);

  const fetchTruckDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        showMessage("You need to log in.");
        return;
      }

      const response = await axios.get(`${API_URL}/trucks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTruck(response.data);
    } catch (error) {
      console.error("❌ Error fetching truck details:", error);
      showMessage("Could not load truck details.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const userId = await AsyncStorage.getItem("ownerId");

      if (!token || !userId) {
        showMessage("Authentication required.");
        return;
      }

      if (!address || !phoneNumber || !deliveryDate) {
        showMessage("Please fill all booking details.");
        return;
      }

      const bookingPayload = {
        truck_id: id,
        customer_id: userId,
        address,
        phone: phoneNumber,
        delivery_time: deliveryDate.toISOString(),
      };

      const response = await axios.post(`${API_URL}/bookings`, bookingPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setShowBookingForm(false);
      router.push({
        pathname: "/payments/checkout",
        params: {
          booking_id: response.data._id, // Assuming booking ID is returned
          user_id: userId,
          amount: truck.price,
        },
      });
      
    } catch (error: any) {
      console.error("❌ Booking failed:", error.response?.data || error.message);
      showMessage("Booking failed. Something went wrong.");
    }
  };

  const showMessage = (msg: string) => {
    setModalMessage(msg);
    setIsModalVisible(true);
  };

  const openInputModal = (label: string, value: string, onConfirm: (val: string) => void) => {
    setInputLabel(label);
    setInputValue(value);
    setOnInputConfirm(() => onConfirm);
    setInputModalVisible(true);
  };

  if (loading) return <ActivityIndicator size="large" color="#0080FF" style={{ marginTop: 20 }} />;
  if (!truck) return <Text style={styles.errorText}>Truck details not found.</Text>;

  return (
    <><Navbar isLoggedIn={true} onLogout={() => console.log("Logging out...")} /><ScrollView style={styles.container}>
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
            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => openInputModal("Enter your address", address, setAddress)}
            >
              <Text>{address || "Tap to enter address"}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>📞 Phone Number</Text>
            <TouchableOpacity
              style={styles.inputBox}
              onPress={() => openInputModal("Enter your phone number", phoneNumber, setPhoneNumber)}
            >
              <Text>{phoneNumber || "Tap to enter phone number"}</Text>
            </TouchableOpacity>

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
              } }
              onCancel={() => setDatePickerVisibility(false)} />

            <TouchableOpacity style={[styles.bookButton, { backgroundColor: "#28A745" }]} onPress={handleConfirmBooking}>
              <Text style={styles.bookButtonText}>Confirm Booking</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Success/Error Modal */}
      <Modal isVisible={isModalVisible} onBackdropPress={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalMessage}>{modalMessage}</Text>
          <TouchableOpacity style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Input Modal */}
      <Modal isVisible={inputModalVisible} onBackdropPress={() => setInputModalVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalMessage}>{inputLabel}</Text>
          <TextInput
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={inputLabel}
            style={styles.modalInput}
            keyboardType={inputLabel.toLowerCase().includes("phone") ? "phone-pad" : "default"} />
          <TouchableOpacity
            style={[styles.modalButton, { backgroundColor: "#28A745" }]}
            onPress={() => {
              setInputModalVisible(false);
              onInputConfirm(inputValue);
            } }
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView></>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA",marginTop:100 },
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
  modalContainer: {
    backgroundColor: "#fff", padding: 20, borderRadius: 10, alignItems: "center",
  },
  modalMessage: { fontSize: 18, color: "#333", textAlign: "center" },
  modalButton: {
    backgroundColor: "#0080FF", paddingVertical: 15, borderRadius: 5, marginTop: 20, width: "80%",
    alignItems: "center", justifyContent: "center"
  },
  modalInput: {
    backgroundColor: "#f1f1f1", padding: 10, borderRadius: 5, marginVertical: 20, width: "80%",
  },
  errorText: { textAlign: "center", color: "red", fontSize: 16, marginTop: 20 },
});

export default TruckDetails;
