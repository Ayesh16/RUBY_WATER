import Navbar from "@/componets/Navbar";
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const AboutUs: React.FC = () => {
  return (
    <View style={styles.container}>
      <Navbar/>
      <Image source={require("../assets/images/tanker.png")} style={styles.tankerImage} />
      
      <Text style={styles.heading}>About us</Text>
      <Text style={styles.subheading}>Reliable Water Supply, Anytime, Anywhere! 🚛💧</Text>
      
      <View style={styles.gridContainer}>
        <Image source={require("../assets/images/water-plant.png")} style={styles.gridImage} />
        <Image source={require("../assets/images/tanker-delivery.png")} style={styles.gridImage} />
        <Image source={require("../assets/images/24-7-support.png")} style={styles.gridImage} />
        <Image source={require("../assets/images/affordable.png")} style={styles.gridImage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3D6E4",
  },
  tankerImage: {
    width: "100%",
    height: 180,
    resizeMode: "contain",
    marginTop:30
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 15,
    textAlign: 'center'
  },
  subheading: {
    fontSize: 16,
    fontWeight: "600",
    textAlign:'center',
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

export default AboutUs;

