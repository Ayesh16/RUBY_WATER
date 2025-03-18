import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const Footer = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.push("/home")}>
          <Text style={styles.footerText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/about")}>
          <Text style={styles.footerText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/contact")}>
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
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  footerText: {
    color: "white",
    fontSize: 16,
  },
});

export default Footer;
