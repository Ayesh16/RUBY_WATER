import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const truckModelsData: Record<
  string,
  { name: string; image: any; service: string; capacity: string; price: string; description: string }[]
> = {
  drinking: [
    {
      name: "Volvo FMX Water Tanker",
      image: require("../../assets/images/volvo_fmx.png"),
      service: "Drinking Water Supply",
      capacity: "10,000 Liters",
      price: "$200 per trip",
      description: "Reliable drinking water transport with advanced filtration systems.",
    },
    {
      name: "Tata LPT 3118 Water Tanker",
      image: require("../../assets/images/tata_lpt.png"),
      service: "Drinking Water Supply",
      capacity: "8,000 Liters",
      price: "$180 per trip",
      description: "Cost-effective solution for residential and commercial water supply.",
    },
    {
      name: "Isuzu FVR900 Water Truck",
      image: require("../../assets/images/isuzu_fvr.png"),
      service: "Drinking Water Supply",
      capacity: "12,000 Liters",
      price: "$220 per trip",
      description: "High-capacity tanker suitable for large-scale water distribution.",
    },
  ],
  construction: [
    {
      name: "Mercedes-Benz Arocs",
      image: require("../../assets/images/mercedes_arocs.png"),
      service: "Construction Water Supply",
      capacity: "15,000 Liters",
      price: "$250 per trip",
      description: "Heavy-duty tanker designed for construction and dust suppression.",
    },
    {
      name: "Scania P410",
      image: require("../../assets/images/scania_p410.png"),
      service: "Construction Water Supply",
      capacity: "14,000 Liters",
      price: "$240 per trip",
      description: "Efficient water tanker for site and road construction needs.",
    },
    {
      name: "MAN TGS 26.400",
      image: require("../../assets/images/man_tgs.png"),
      service: "Construction Water Supply",
      capacity: "16,000 Liters",
      price: "$270 per trip",
      description: "Robust water transport vehicle with high-performance pumps.",
    },
  ],
};

const TruckModel = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const selectedCategory = params.category as keyof typeof truckModelsData;

  if (!selectedCategory || !truckModelsData[selectedCategory]) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Invalid Category</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Navbar />
      <Text style={styles.title}>Truck Models for {selectedCategory} Water Supply</Text>
      <FlatList
        data={truckModelsData[selectedCategory]}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.truckCard}
            onPress={() =>
              router.push(
                `/Pages/truckDetails?name=${item.name}&service=${item.service}&capacity=${item.capacity}&price=${item.price}&description=${item.description}`
              )
            }
          >
            <Image source={item.image} style={styles.truckImage} />
            <Text style={styles.model}>{item.name}</Text>
            <Text style={styles.service}>{item.service}</Text>
            <Text style={styles.details}>Capacity: {item.capacity}</Text>
            <Text style={styles.details}>Price: {item.price}</Text>
            <Text style={styles.details}>Description: {item.description}</Text>
          </TouchableOpacity>
        )}
      />
      <Footer/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures full-screen height usage
    backgroundColor: "#F3D6E4",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 15,
    textTransform: "capitalize",
    alignSelf: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  truckCard: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    width: "90%", // Adjusts width to fit various screen sizes
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  truckImage: {
    width: "100%", // Makes image responsive
    height: 120,
    resizeMode: "contain",
  },
  model: {
    fontSize: 18,
    paddingTop: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  service: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginTop: 5,
  },
  details: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
    textAlign: "center",
  },
});

export default TruckModel;
