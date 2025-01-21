import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import sharedStyles from "./styles";

export default function AccountSettings({ route, navigation }) {
  //const { userData } = route.params;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = await AsyncStorage.getItem("user_id");
        if (!userId) {
          Alert.alert("Error", "User not found. Please log in again.");
          navigation.navigate("Login");
          return;
        }

        const response = await axios.get(
          `http://192.168.0.112/expensepal_api/getUserDetails.php`,
          {
            params: { user_id: userId },
          }
        );

        if (response.status === 200 && response.data) {
          const { username, email, phone_number } = response.data.data;
          setUsername(username || "");
          setEmail(email || "");
          setPhoneNumber(phone_number || "");
          //setPassword(response.data.password || '');
        } else {
          Alert.alert(
            "Error",
            response.data.message || "Failed to fetch user details."
          );
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleSave = async () => {
    if (!username || !email || !phoneNumber) {
      Alert.alert(
        "Validation Error",
        "All fields except password are required."
      );
      return;
    }

    try {
      const userId = await AsyncStorage.getItem("user_id");
      if (!userId) {
        Alert.alert("Error", "User session expired. Please log in again.");
        navigation.navigate("Login");
        return;
      }

      const response = await axios.post(
        "http://192.168.0.112/expensepal_api/getUserDetails.php",
        {
          user_id: userId,
          username,
          email,
          phoneNumber,
          password,
        }
      );

      if (response.data.success) {
        Alert.alert("Success", "Your details have been updated.");
        navigation.goBack();
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to update details."
        );
      }
    } catch (error) {
      console.error("Error updatin user details: ", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Username: </Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Enter username"
      />

      <Text style={styles.label}>Email: </Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="Enter email"
      />

      <Text style={styles.label}>Phone Number:</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        placeholder="Enter phone number"
      />

      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Enter new password (optional)"
      />

      <TouchableOpacity
        style={sharedStyles.button}
        onPress={handleSave}
        disabled={isLoading}
      >
        <Text style={sharedStyles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
});
