import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import axios, { AxiosError } from "axios";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Schema for validation using Yup
const truckSchema = Yup.object().shape({
  truckName: Yup.string().required("Truck Name is required"),
  capacity: Yup.number()
    .required("Capacity is required")
    .min(1, "Capacity must be a positive number"),
  categoryDescription: Yup.string().required("Category description is required"),
  truckImage: Yup.string()
    .url("Must be a valid URL")
    .required("Truck image is required"),
  truckType: Yup.string().required("Truck Type is required"),
  location: Yup.string().required("Location is required"),
});

const AddTruck = () => {
  const router = useRouter();
  const [truckName, setTruckName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [truckImage, setTruckImage] = useState("");
  const [category, setCategory] = useState("drinking");
  const [truckType, setTruckType] = useState(""); // Added truck type
  const [location, setLocation] = useState(""); // Added location
  const [available, setAvailable] = useState(true); // Added availability
  const [errors, setErrors] = useState<any>({});

  // Function to retrieve JWT token from AsyncStorage
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      return token;
    } catch (error) {
      console.error('Error retrieving the token:', error);
      return null; // Return null if there's an error
    }
  };

  const handleAddTruck = async () => {
    try {
      // Validate the form using Yup
      await truckSchema.validate(
        {
          truckName,
          capacity,
          categoryDescription,
          truckImage,
          category,
          truckType,
          location,
          available,
        },
        { abortEarly: false }
      );

      // Retrieve the JWT token
      const token = await getToken();
      console.log("Token:", token); // Check if the token is retrieved

      if (!token) {
        console.error("No token available");
        Alert.alert("Session Expired", "Please log in again.");
        router.push("/auth/login"); // Redirect to login screen
        return;
      }

      // Make API request to add truck
      await axios.post(
        "http://localhost:5000/trucks/register",
        {
          owner_id: "123", // Change with actual user ID
          truck_name: truckName,
          capacity: Number(capacity),
          category,
          category_description: categoryDescription,
          truck_image: truckImage,
          truck_type: truckType,
          location,
          available,
        },
        {
          headers: {
            "Content-Type": "application/json",  // Ensures proper JSON format
            Authorization: `Bearer ${token}`,  // Pass the JWT token
          },
        }
      );

      router.push("/provider/providerhome");
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const newErrors = error.inner.reduce((acc: any, curr: any) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setErrors(newErrors);
      } else if (error instanceof AxiosError) {
        // Handle Axios errors with specific type
        if (error.response) {
          if (error.response.status === 401) {
            Alert.alert("Unauthorized", "You are not authorized. Please log in again.");
            router.push("/auth/login");
          } else {
            console.error("Error adding truck:", error.response.data);
            Alert.alert("Error", "There was an issue adding the truck.");
          }
        } else {
          console.error("Axios Error:", error.message);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add a New Truck</Text>

      <TextInput
        style={styles.input}
        placeholder="Truck Name"
        value={truckName}
        onChangeText={setTruckName}
      />
      {errors.truckName && <Text style={styles.errorText}>{errors.truckName}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Capacity (Liters)"
        keyboardType="numeric"
        value={capacity}
        onChangeText={setCapacity}
      />
      {errors.capacity && <Text style={styles.errorText}>{errors.capacity}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Category Description"
        value={categoryDescription}
        onChangeText={setCategoryDescription}
      />
      {errors.categoryDescription && <Text style={styles.errorText}>{errors.categoryDescription}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Truck Image URL"
        value={truckImage}
        onChangeText={setTruckImage}
      />
      {errors.truckImage && <Text style={styles.errorText}>{errors.truckImage}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Truck Type"
        value={truckType}
        onChangeText={setTruckType}
      />
      {errors.truckType && <Text style={styles.errorText}>{errors.truckType}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

      <Text style={styles.checkboxLabel}>Available</Text>
      <TouchableOpacity onPress={() => setAvailable(!available)}>
        <Text style={styles.checkbox}>{available ? "Available" : "Not Available"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={handleAddTruck}>
        <Text style={styles.addButtonText}>Add Truck</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  addButton: {
    backgroundColor: "#0080FF",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginVertical: 4,
  },
  checkboxLabel: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
    color: "#333",
  },
  checkbox: {
    textAlign: "center",
    color: "#0080FF",
    fontWeight: "bold",
  },
});

export default AddTruck;
