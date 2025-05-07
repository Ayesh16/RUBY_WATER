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
import { Ionicons } from "@expo/vector-icons";
import Navbar from "@/components/Navbar";

const API_URL = "http://192.168.161.73:5000/bookings";

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

const statusPriority: Record<string, number> = {
  Pending: 1,
  Confirmed: 2,
  Delivered: 3,
  Cancelled: 4,
};

const ProviderBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showStatusOptions, setShowStatusOptions] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("authToken");

    try {
      const providerId = await AsyncStorage.getItem("ownerId");
      const res = await fetch(`${API_URL}?ownerId=${providerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data: Booking[] = await res.json();

      // Sort by delivery_time (newest first)
      const sorted = data.sort((a, b) => {
        const dateA = a.delivery_time ? new Date(a.delivery_time).getTime() : 0;
        const dateB = b.delivery_time ? new Date(b.delivery_time).getTime() : 0;
        return dateB - dateA;
      });

      // Optional: sort by status priority instead
      // const sorted = data.sort((a, b) => {
      //   return (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99);
      // });

      setBookings(sorted);
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
      setShowStatusOptions(null);
    }
  };

  const toggleStatusOptions = (bookingId: string) => {
    setShowStatusOptions(showStatusOptions === bookingId ? null : bookingId);
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
              <Text style={styles.label}>Customer ID:</Text>
              <Text style={styles.text}>{booking.customer_id || "N/A"}</Text>

              <Text style={styles.label}>Truck ID:</Text>
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
              <View style={styles.statusRow}>
                <Text
                  style={[
                    styles.status,
                    { color: STATUS_COLORS[booking.status] || "#333" },
                  ]}
                >
                  {booking.status}
                </Text>
                <TouchableOpacity
                  style={styles.statusButton}
                  onPress={() => toggleStatusOptions(booking._id)}
                >
                  <Ionicons name="ellipsis-vertical" size={20} color="#2196F3" />
                </TouchableOpacity>
              </View>

              <View style={styles.buttonRow}>
                {showStatusOptions === booking._id &&
                  Object.keys(STATUS_COLORS).map((status) => (
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
                      disabled={updatingId === booking._id || status === booking.status}
                    >
                      <Text style={styles.statusText}>{status.toUpperCase()}</Text>
                      {status === "Confirmed" && (
                        <Ionicons name="checkmark-circle" size={20} color="#fff" />
                      )}
                      {status === "Cancelled" && (
                        <Ionicons name="close-circle" size={20} color="#fff" />
                      )}
                      {status === "Delivered" && (
                        <Ionicons name="checkmark-done-circle" size={20} color="#fff" />
                      )}
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
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
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
    shadowColor: "#1010",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    marginRight: 8,
  },
});

export default ProviderBookings;
