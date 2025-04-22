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
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import Navbar from "@/components/Navbar";

const API_URL = "http://192.168.154.73:5000/bookings"; // Replace with your LAN IP

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

const STATUS_COLORS: Record<string, string> = {
  Pending: "#FFC107",
  Confirmed: "#2196F3",
  Cancelled: "#F44336",
  Delivered: "#4CAF50",
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
    <>
      <Navbar isLoggedIn={true} onLogout={() => console.log("Logging out...")} />
      <ScrollView style={styles.container}>
        <Text style={styles.header}>🚛 All Bookings</Text>

        <TouchableOpacity onPress={fetchBookings} style={styles.refresh}>
          <Text style={{ color: "#2196F3" }}>🔄 Refresh</Text>
        </TouchableOpacity>

        {bookings.length === 0 ? (
          <Text style={styles.noBookings}>No bookings found</Text>
        ) : (
          bookings.map((booking) => (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              layout={Layout.springify()}
              key={booking._id}
              style={styles.card}
            >
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
                  <Text style={styles.text}>
                    {new Date(booking.delivery_time).toLocaleString()}
                  </Text>
                </>
              )}

              <Text style={styles.label}>Status:</Text>
              <Text
                style={[
                  styles.status,
                  { color: STATUS_COLORS[booking.status] || "#333" },
                ]}
              >
                {booking.status}
              </Text>

              <View style={styles.buttonRow}>
                {Object.keys(STATUS_COLORS).map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      {
                        backgroundColor:
                          booking.status === status ? "#ccc" : STATUS_COLORS[status],
                      },
                    ]}
                    onPress={() => updateStatus(booking._id, status)}
                    disabled={
                      updatingId === booking._id || status === booking.status
                    }
                  >
                    <Text style={styles.statusText}>
                      {updatingId === booking._id && status !== booking.status
                        ? "..."
                        : status.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { padding: 15, backgroundColor: "#f9f9f9", marginTop: 100 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  refresh: { alignSelf: "flex-end", marginBottom: 10 },
  noBookings: { textAlign: "center", marginTop: 20, fontSize: 16 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  label: { fontWeight: "bold", marginTop: 5 },
  text: { fontSize: 16 },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
  },
  buttonRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 8,
    columnGap: 8,
    marginTop: 10,
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default ProviderBookings;
