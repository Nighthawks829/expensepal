import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { UserContext } from "./UserContext";
import { ExpenseContext } from "./ExpenseContext";
import axios from "axios";
import sharedStyles from "./styles";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Login() {
  const navigation = useNavigation();
  const { setUser, loading } = useContext(UserContext);
  const { setUserId } = useContext(ExpenseContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleForgetPassword = async () => {
    try {
      const response = await fetch("/*api*/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username, //assuming username is the email
        }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Password reset email sent");
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong: " + error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://192.168.0.112/expensepal_api/login.php",
        {
          username: username,
          password: password,
        }
      );
      if (response.data.success) {
        // Alert.alert('Success', response.data.message);
        const userData = response.data.user;
        // console.log(userData);
        setUser(userData);
        setUserId(userData.user_id);
        navigation.reset({
          index: 0,
          routes: [{ name: "HomeTabs" }],
        });
      } else {
        if (
          response.data.message === "No account found. Please sign up first."
        ) {
          Alert.alert(
            "Account Not Found",
            "No account found with this username. Please sign up first.",
            [
              { text: "Sign Up", onPress: () => navigation.navigate("SignUp") },
              { text: "Cancel", style: "cancel" },
            ]
          );
        } else {
          Alert.alert("Error", response.data.message);
        }
      }
    } catch (error) {
      console.error("Login error:", error.message);
      Alert.alert("Error", "Network error: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            style={styles.iconButton}
            name={showPassword ? "visibility" : "visibility-off"}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleForgetPassword}>
        <Text style={styles.link}>Forgot password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={sharedStyles.button} onPress={handleLogin}>
        <Text style={sharedStyles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#E1FFD4",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#EAEAEA",
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
    backgroundColor: "#EAEAEA",
  },
  passwordInput: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    backgroundColor: "#EAEAEA",
  },
  iconButton: {
    marginRight: 15,
    fontSize: 22,
    color: "#808080",
  },
  link: {
    color: "blue",
    marginBottom: 20,
    alignSelf: "flex-end",
  },
});
