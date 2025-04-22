import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import Checkbox from "expo-checkbox";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRouter } from "expo-router";
import { useForm, Controller, useWatch } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import * as Animatable from "react-native-animatable";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = "http://192.168.1.36:5000/auth/signup";
const CATEGORY_URL = "http://192.168.1.36:5000/categories";

const schema = yup.object({
  name: yup.string().required("Customer name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  address: yup.string().required("Address is required"),
  phone: yup.string().required("Phone number is required"),
  checked: yup.boolean(),
  truck_name: yup.string().when("checked", {
    is: true,
    then: (schema) => schema.required("Truck name is required"),
  }),
  capacity: yup.number().when("checked", {
    is: true,
    then: (schema) => schema.required("Truck capacity is required"),
  }),
  truck_type: yup.string().when("checked", {
    is: true,
    then: (schema) => schema.required("Truck type is required"),
  }),
  location: yup.string().when("checked", {
    is: true,
    then: (schema) => schema.required("Location is required"),
  }),
  price: yup.number().when("checked", {
    is: true,
    then: (schema) => schema.required("Price is required"),
  }),
  category_id: yup.string().when("checked", {
    is: true,
    then: (schema) => schema.required("Category is required"),
  }),
  truck_image: yup.string().when("checked", {
    is: true,
    then: (schema) => schema.required("Truck image URL is required"),
  }),
});

type FormData = yup.InferType<typeof schema>;

export default function SignUp() {
  const navigation = useNavigation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const inputRefs: { [key: string]: any } = {};

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { checked: false },
  });

  const checked = useWatch({ control, name: "checked" });

  useEffect(() => {
    navigation.setOptions?.({ headerShown: false });
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(CATEGORY_URL);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const onSubmit = async (data: FormData) => {
    const invalidFields = Object.keys(errors);
    invalidFields.forEach((field) => {
      const ref = inputRefs[field];
      if (ref && typeof ref.shake === "function") {
        ref.shake(500);
      }
    });
    if (invalidFields.length > 0) return;

    setIsLoading(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        checked: data.checked,
        role: data.checked ? "provider" : "user",
        address: data.address,
        phone: data.phone,
        ...(data.checked && {
          truck_name: data.truck_name,
          capacity: Number(data.capacity),
          truck_type: data.truck_type,
          location: data.location,
          price: Number(data.price),
          category_id: data.category_id,
          truck_image: data.truck_image,
        }),
      };

      await axios.post(API_URL, payload);
      Alert.alert("Success", "Signup Successful!");
      router.push("/auth/login");
    } catch (error: any) {
      console.error("❌ Signup Error:", error.response?.data || error.message);
      Alert.alert("Signup Failed", error.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (field: keyof FormData, placeholder: string, secure = false, keyboardType: any = "default") => (
    <Animatable.View
      ref={(ref) => (inputRefs[field] = ref)}
      animation="fadeInUp"
      duration={600}
      style={styles.animatedWrapper}
    >
      <Controller
        control={control}
        name={field}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value?.toString() || ""}
            secureTextEntry={secure}
            keyboardType={keyboardType}
          />
        )}
      />
      {errors[field] && <Text style={styles.errorText}>{String(errors[field]?.message)}</Text>}
    </Animatable.View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.title}>Sign Up</Text>

            {renderInput("name", "Name")}
            {renderInput("email", "Email")}
            {renderInput("password", "Password", true)}
            {renderInput("address", "Address")}
            {renderInput("phone", "Phone", false, "phone-pad")}

            <View style={styles.checkboxContainer}>
              <Checkbox
                value={checked}
                onValueChange={(val) => setValue("checked", val)}
                color={checked ? "blue" : undefined}
              />
              <Text style={styles.checkboxLabel}>Register as Provider</Text>
            </View>

            {checked && (
              <>
                {renderInput("truck_name", "Truck Name")}
                {renderInput("capacity", "Capacity", false, "numeric")}
                {renderInput("truck_type", "Truck Type")}
                {renderInput("location", "Location")}
                {renderInput("price", "Price", false, "numeric")}
                {renderInput("truck_image", "Truck Image URL")}

                <Text style={styles.label}>Select Category:</Text>
                <Controller
                  control={control}
                  name="category_id"
                  render={({ field: { onChange, value } }) => (
                    <Picker selectedValue={value} onValueChange={onChange} style={styles.input}>
                      <Picker.Item label="Select a category" value="" />
                      {categories.map((cat: any) => (
                        <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
                      ))}
                    </Picker>
                  )}
                />
                {errors.category_id && <Text style={styles.errorText}>{errors.category_id.message}</Text>}
              </>
            )}

            {isLoading ? (
              <ActivityIndicator size="large" color="blue" />
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            )}

            <View style={styles.loginLinkContainer}>
              <Text>Already a user?</Text>
              <TouchableOpacity onPress={() => router.push("/auth/login")}>
                <Text style={styles.loginLink}> Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  animatedWrapper: { marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  label: { fontWeight: "bold", marginVertical: 5 },
  checkboxContainer: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  checkboxLabel: { marginLeft: 10, fontSize: 16 },
  button: { backgroundColor: "blue", padding: 15, borderRadius: 10, marginTop: 15 },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold", fontSize: 16 },
  errorText: { color: "red", marginTop: 4, fontSize: 13 },
  loginLinkContainer: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  loginLink: { color: "#007BFF", fontWeight: "bold", textDecorationLine: "underline" },
});

