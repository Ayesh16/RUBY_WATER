import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons"; // Import FontAwesome Icons

const Footer = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.push("/Pages/home")} style={styles.footerItem}>
          <FontAwesome name="home" size={20} color="white" />
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/Pages/about")} style={styles.footerItem}>
          <FontAwesome name="info-circle" size={20} color="white" />
          <Text style={styles.footerText}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/Pages/contact")} style={styles.footerItem}>
          <FontAwesome name="phone" size={20} color="white" />
          <Text style={styles.footerText}>Contact</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  footer: {
    backgroundColor: "#800080",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  footerItem: {
    alignItems: "center",
  },
  footerText: {
    color: "white",
    fontSize: 16,
    marginTop: 5, // Adds spacing between icon and text
  },
});

export default Footer;
