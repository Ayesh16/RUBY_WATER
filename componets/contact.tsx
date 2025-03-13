import React from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet, Image } from "react-native";
import { FontAwesome, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import Navbar from "./Navbar";

const Contact: React.FC = () => {
  return (
    <View style={styles.container}>
        <Navbar/>
      {/* Address */}
      <View style={styles.row}>
        <Entypo name="location-pin" size={20} color="red" />
        <Text style={styles.label}>Address:</Text>
      </View>
      <Text style={styles.text}>123 Water Supply, xxx</Text>

      {/* Phone */}
      <View style={styles.row}>
        <FontAwesome name="phone" size={18} color="black" />
        <Text style={styles.label}>Phone:</Text>
      </View>
      <TouchableOpacity onPress={() => Linking.openURL("tel:+919876543210")}>
        <Text style={styles.linkText}>+91 98765 43210</Text>
      </TouchableOpacity>

      {/* Email */}
      <View style={styles.row}>
        <MaterialCommunityIcons name="email-outline" size={18} color="black" />
        <Text style={styles.label}>Email:</Text>
      </View>
      <TouchableOpacity onPress={() => Linking.openURL("mailto:support@watersupply.com")}>
        <Text style={styles.linkText}>support@watersupply.com</Text>
      </TouchableOpacity>

      {/* Website */}
      <View style={styles.row}>
        <Entypo name="globe" size={18} color="black" />
        <Text style={styles.label}>Website:</Text>
      </View>
      <TouchableOpacity onPress={() => Linking.openURL("https://www.watersupply.com")}>
        <Text style={styles.linkText}>www.watersupply.com</Text>
      </TouchableOpacity>

      {/* Working Hours */}
      <View style={styles.row}>
        <MaterialCommunityIcons name="clock-time-four-outline" size={18} color="black" />
        <Text style={styles.label}>Working Hours:</Text>
      </View>
      <Text style={styles.text}>Monday - Saturday: 8:00 AM - 8:00 PM</Text>
      <Text style={styles.text}>Sunday: 10:00 AM - 4:00 PM</Text>

      {/* Social Icons */}
      <View style={styles.iconContainer}>
        <TouchableOpacity>
          <Image source={require("../../assets/icons/close.png")} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require("../../assets/icons/google.png")} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require("../../assets/icons/whatsapp.png")} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require("../../assets/icons/linkedin.png")} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FBEFF2",
    borderRadius: 15,
    width: 300,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  label: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  text: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    marginTop: 2,
  },
  linkText: {
    color: "#1E90FF",
    fontSize: 14,
    textAlign: "center",
    marginTop: 2,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  icon: {
    width: 30,
    height: 30,
    marginHorizontal: 5,
  },
});

export default Contact;
