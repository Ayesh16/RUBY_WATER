import React from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet, Image } from "react-native";
import { FontAwesome, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import Navbar from "../componets/Navbar";

const Contact: React.FC = () => {
  return (
    <View style={styles.container}>
        <Navbar/>
      {/* Address */}
      <View style={styles.row}>
        <Entypo name="location-pin" size={20} color="red" />
        <Text style={styles.label}>Address:</Text>
        <Text style={styles.text}>123 Water Supply, xxx</Text>
      </View>

      {/* Phone */}
      <View style={styles.row}>
        <FontAwesome name="phone" size={18} color="black" />
        <Text style={styles.label}>Phone:</Text>
        <TouchableOpacity onPress={() => Linking.openURL("tel:+919876543210")}>
        <Text style={styles.linkText}>+91 98765 43210</Text>
      </TouchableOpacity>
      </View>

      {/* Email */}
      <View style={styles.row}>
        <MaterialCommunityIcons name="email-outline" size={18} color="black" />
        <Text style={styles.label}>Email:</Text>
        <TouchableOpacity onPress={() => Linking.openURL("mailto:support@watersupply.com")}>
        <Text style={styles.linkText}>support@watersupply.com</Text>
      </TouchableOpacity>
      </View>
      

      {/* Website */}
      <View style={styles.row}>
        <Entypo name="globe" size={18} color="black" />
        <Text style={styles.label}>Website:</Text>
        <TouchableOpacity onPress={() => Linking.openURL("https://www.watersupply.com")}>
        <Text style={styles.linkText}>www.watersupply.com</Text>
      </TouchableOpacity>

      </View>
     
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
          <Image source={require("../assets/icons/close.png")} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require("../assets/icons/google.png")} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require("../assets/icons/whatsapp.png")} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require("../assets/icons/linkedin.png")} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FBEFF2",
    width: '100%',
    flex:1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    textAlign:'center',
    marginLeft: '20%'
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
    marginTop: 30,
    marginLeft:'25%',
    gap:24
  },
  icon: {
    width: 30,
    height: 30,
    marginHorizontal: 5,
  },
});

export default Contact;
