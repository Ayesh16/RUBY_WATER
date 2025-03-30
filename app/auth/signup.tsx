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
import { useNavigation, useRouter } from "expo-router";
import { useForm, Controller, useWatch } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";

const API_URL = "https://b458-2401-4900-925e-8a8e-1db1-b735-f3c8-2969.ngrok-free.app/auth/signup".trim();

const schema = yup.object({
  name: yup.string().required("Customer name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  checked: yup.boolean(),
  truck_name: yup.string().when("checked", { is: true, then: (schema) => schema.required("Truck name is required") }),
  capacity: yup.number().when("checked", { is: true, then: (schema) => schema.required("Truck capacity is required") }),
  truck_type: yup.string().when("checked", { is: true, then: (schema) => schema.required("Truck type is required") }),
  location: yup.string().when("checked", { is: true, then: (schema) => schema.required("Location is required") }),
  category: yup.string().when("checked", { is: true, then: (schema) => schema.required("Category is required") }),
  category_description: yup.string().when("checked", { is: true, then: (schema) => schema.required("Description is required") }),
  truck_image: yup.string().when("checked", { is: true, then: (schema) => schema.required("Truck image URL is required") }),
});

type FormData = yup.InferType<typeof schema>;

export default function SignUp() {
  const navigation = useNavigation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { checked: false },
  });

  const checked = useWatch({ control, name: "checked" });

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        checked: data.checked,
        role: data.checked ? "provider" : "user",
        truckDetails: data.checked
          ? {
              owner_id: "",
              truck_name: data.truck_name,
              capacity: data.capacity,
              truck_type: data.truck_type,
              location: data.location,
              available: true,
              category: data.category,
              category_description: data.category_description,
              truck_image: data.truck_image,
            }
          : undefined,
      };

      console.log("🚀 Sending Payload:", JSON.stringify(payload, null, 2));
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

        <TouchableOpacity style={styles.toggleButton} onPress={() => setValue("checked", !checked)}>
          <Text style={styles.toggleButtonText}>{checked ? "Register as User" : "Register as Provider"}</Text>
        </TouchableOpacity>

        {checked &&
          (["truck_name", "capacity", "truck_type", "location", "category", "category_description", "truck_image"] as const).map((field) => (
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
                  />
                )}
              />
              {errors[field] && <Text style={styles.errorText}>{String(errors[field]?.message)}</Text>}
            </View>
          ))}

        {isLoading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 },
  toggleButton: { marginVertical: 10, backgroundColor: "#ddd", padding: 10 },
  toggleButtonText: { textAlign: "center" },
  button: { backgroundColor: "blue", padding: 15, borderRadius: 5 },
  buttonText: { color: "white", textAlign: "center" },
  errorText: { color: "red" },
});

