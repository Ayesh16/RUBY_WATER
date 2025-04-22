import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Navbar from "@/components/Navbar";

const API_URL = "http://192.168.1.36:5000/bookings"; // Replace with your LAN IP

type Booking = {
  _id: string;
  customer_id?: string;
  truck_id?: string;
  provider_id?: string;
  address: string;
  phone?: string;
  delivery_time?: string;
  status: string;
};

const ProviderBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("authToken");

    try {
      const providerId = await AsyncStorage.getItem("ownerId");
      const res = await fetch(`${API_URL}?ownerId=${providerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setBookings(data);
    } catch (error) {
      console.error("❌ Error fetching bookings:", error);
      Alert.alert("Error", "Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId: string, newStatus: string) => {
    setUpdatingId(bookingId);
    const token = await AsyncStorage.getItem("authToken");

    try {
      const res = await fetch(`${API_URL}/${bookingId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      await fetchBookings();
    } catch (error) {
      Alert.alert("Error", "Could not update booking status.");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
           <Navbar isLoggedIn={true} onLogout={() => console.log("Logging out...")} />
      <Text style={styles.header}>All Bookings</Text>

      <TouchableOpacity onPress={fetchBookings} style={{ alignSelf: "flex-end", marginBottom: 10 }}>
        <Text style={{ color: "#2196F3" }}>🔄 Refresh</Text>
      </TouchableOpacity>

      {bookings.length === 0 ? (
        <Text style={styles.noBookings}>No bookings found</Text>
      ) : (
        bookings.map((booking) => (
          <View key={booking._id} style={styles.card}>
            <Text style={styles.label}>Customer:</Text>
            <Text style={styles.text}>{booking.customer_id || "N/A"}</Text>

            <Text style={styles.label}>Truck:</Text>
            <Text style={styles.text}>{booking.truck_id || "N/A"}</Text>

            <Text style={styles.label}>Address:</Text>
            <Text style={styles.text}>{booking.address}</Text>

            {booking.phone && (
              <>
                <Text style={styles.label}>Phone:</Text>
                <Text style={styles.text}>{booking.phone}</Text>
              </>
            )}

            {booking.delivery_time && (
              <>
                <Text style={styles.label}>Delivery Time:</Text>
                <Text style={styles.text}>{new Date(booking.delivery_time).toLocaleString()}</Text>
              </>
            )}

            <Text style={styles.label}>Status:</Text>
            <Text style={styles.status}>{booking.status}</Text>

            <View style={styles.buttonRow}>
              {["Pending", "Confirmed", "Cancelled", "Delivered"].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusButton,
                    {
                      backgroundColor:
                        status === booking.status ? "#ccc" : "#4CAF50",
                    },
                  ]}
                  onPress={() => updateStatus(booking._id, status)}
                  disabled={updatingId === booking._id || status === booking.status}
                >
                  <Text style={styles.statusText}>
                    {updatingId === booking._id && status !== booking.status
                      ? "..."
                      : status.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: "#f2f2f2" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  noBookings: { textAlign: "center", marginTop: 20, fontSize: 16 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  label: { fontWeight: "bold", marginTop: 5 },
  text: { fontSize: 16 },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
    marginVertical: 5,
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    rowGap: 10,
    marginTop: 10,
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    marginRight: 8,
    marginTop: 5,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default ProviderBookings;
