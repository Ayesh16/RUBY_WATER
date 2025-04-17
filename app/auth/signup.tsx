import React, { useEffect, useState } from "react";
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
} from "react-native";
import Checkbox from "expo-checkbox";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRouter } from "expo-router";
import { useForm, Controller, useWatch } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

const API_URL = "http://192.168.1.41:5000/auth/signup";
const CATEGORY_URL = "http://192.168.1.41:5000/categories";

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
  const [categories, setCategories] = useState<
    { name: string; _id: string; description: string }[]
  >([]);

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

      console.log("🚀 Payload:", payload);
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

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>

        {/* Basic Fields */}
        {(["name", "email", "password"] as const).map((field) => (
          <View key={field}>
            <Controller
              control={control}
              name={field}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value?.toString() || ""}
                  secureTextEntry={field === "password"}
                />
              )}
            />
            {errors[field] && <Text style={styles.errorText}>{String(errors[field]?.message)}</Text>}
          </View>
        ))}

        {/* Address */}
        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Address"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value || ""}
            />
          )}
        />
        {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}

        {/* Phone */}
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Phone"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value || ""}
              keyboardType="phone-pad"
            />
          )}
        />
        {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

        {/* Checkbox */}
        <View style={styles.checkboxContainer}>
          <Checkbox
            value={checked}
            onValueChange={(val) => setValue("checked", val)}
            color={checked ? "blue" : undefined}
          />
          <Text style={styles.checkboxLabel}>Register as Provider</Text>
        </View>

        {/* Provider Truck Fields */}
        {checked && (
          <>
            {(["truck_name", "capacity", "truck_type", "location", "price", "truck_image"] as const).map((field) => (
              <View key={field}>
                <Controller
                  control={control}
                  name={field}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder={field.replace("_", " ").toUpperCase()}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value?.toString() || ""}
                      keyboardType={["capacity", "price"].includes(field) ? "numeric" : "default"}
                    />
                  )}
                />
                {errors[field] && <Text style={styles.errorText}>{String(errors[field]?.message)}</Text>}
              </View>
            ))}

            {/* Category Dropdown */}
            <Text style={styles.label}>Select Category:</Text>
            <Controller
              control={control}
              name="category_id"
              render={({ field: { onChange, value } }) => (
                <Picker selectedValue={value} onValueChange={onChange} style={styles.input}>
                  <Picker.Item label="Select a category" value="" />
                  {categories.map((cat) => (
                    <Picker.Item key={cat._id} label={cat.name} value={cat._id} />
                  ))}
                </Picker>
              )}
            />
            {errors.category_id && <Text style={styles.errorText}>{errors.category_id.message}</Text>}
          </>
        )}

        {/* Submit Button */}
        {isLoading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        )}

        {/* Login Link */}
        <View style={styles.loginLinkContainer}>
          <Text>Already a user?</Text>
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text style={styles.loginLink}> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  label: { fontWeight: "bold", marginVertical: 5 },
  checkboxContainer: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  checkboxLabel: { marginLeft: 10, fontSize: 16 },
  button: { backgroundColor: "blue", padding: 15, borderRadius: 5, marginTop: 10 },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold" },
  errorText: { color: "red", marginBottom: 5 },
  loginLinkContainer: { flexDirection: "row", justifyContent: "center", marginTop: 15 },
  loginLink: { color: "#007BFF", fontWeight: "bold", textDecorationLine: "underline" },
});


