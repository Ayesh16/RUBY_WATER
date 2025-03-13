import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const AboutUsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image source={require("./assets/tanker.png")} style={styles.tankerImage} />
      
      <Text style={styles.heading}>About us</Text>
      <Text style={styles.subheading}>Reliable Water Supply, Anytime, Anywhere! 🚛💧</Text>
      
      <View style={styles.gridContainer}>
        <Image source={require("./assets/water-plant.png")} style={styles.gridImage} />
        <Image source={require("./assets/tanker-delivery.png")} style={styles.gridImage} />
        <Image source={require("./assets/24-7-support.png")} style={styles.gridImage} />
        <Image source={require("./assets/affordable.png")} style={styles.gridImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    paddingTop: 20,
  },
  tankerImage: {
    width: "90%",
    height: 180,
    resizeMode: "cover",
    borderRadius: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 15,
  },
  subheading: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 5,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 15,
  },
  gridImage: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 10,
  },
});

export default AboutUsScreen;

