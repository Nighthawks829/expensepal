import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import sharedStyles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { debounce } from "lodash";
import Icon from "react-native-vector-icons/MaterialIcons";
// import { ApiKeyContextImpl } from 'twilio/lib/rest/iam/v1/apiKey';
// import { TextInput } from 'react-native-paper';

export default function SignUp() {
  const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usernameExists, setUsernameExists] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  // const sendOtp = async () => {
  //     try {
  //         const response = await axios.post('http://192.168.0.112/expensepal_api/send-otp.php', {
  //             phoneNumber: phoneNumber
  //         });
  //         if (response.data.success) {
  //             setIsOtpSent(true);
  //             Alert.alert('OTP Sent', 'Please check your phone for the OTP.');
  //         } else {
  //             Alert.alert('Error', response.data.message || 'Failed to send OTP');
  //         }
  //     } catch (error) {
  //         Alert.alert('Error', 'Could not send OTP. ' + error.message);
  //     }
  // };

  const checkUsernameExists = async (username) => {
    if (username.trim()) {
      try {
        const response = await axios.post(
          "http://192.168.0.112/expensepal_api/checkUsername.php",
          {
            username: username,
          }
        );
        setUsernameExists(response.data.exists);
      } catch (error) {
        console.error("Error checking username: ", error);
      }
    } else {
      setUsernameExists(false);
    }
  };

  const handleSignUp = async () => {
    if (usernameExists) {
      Alert.alert("Error", "Username is already taken");
      return;
    }

    if (
      !username.trim() ||
      !email.trim() ||
      !phoneNumber.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    // if (!isOtpSent) {
    //     Alert.alert('Error', 'Please request OTP first');
    //     return;
    // }

    try {
      const response = await axios.post(
        "http://192.168.0.112/expensepal_api/register.php",
        {
          username: username,
          email: email,
          phone_number: phoneNumber,
          password: password,
        }
      );
      console.log(response.data);

      if (response.data.success) {
        Alert.alert("Success", "Sign up successful!", [
          { text: "OK", onPress: () => navigation.navigate("Login") },
        ]);
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to register user"
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Username"
          value={username}
          onChangeText={setUsername}
        />
        {usernameExists && (
          <Text style={styles.errorText}>Username already exists</Text>
        )}
        <Text>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
        />
        <Text>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        <Text>Password</Text>
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

        <Text>Confirm Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              style={styles.iconButton}
              name={showPassword ? "visibility" : "visibility-off"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* {isOtpSent && (
                <View style={styles.inputContainer}>
                    <Text>Enter OTP</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter OTP"
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="number-pad"
                    />
                </View>
            )} */}

      {/* {!isOtpSent ? (
                <TouchableOpacity style={sharedStyles.button} onPress={sendOtp}>
                    <Text style={sharedStyles.buttonText}>Send OTP</Text>
                </TouchableOpacity> 
            ) : ( */}
      <TouchableOpacity style={sharedStyles.button} onPress={handleSignUp}>
        <Text style={sharedStyles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      {/* )} */}
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
  inputContainer: {
    width: "100%",
    alignItems: "flex-start",
    bottom: "10%",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    // borderColor: 'gray',
    // borderWidth: 1,
    borderRadius: 5,
    // marginBottom: 10,
    backgroundColor: "#EAEAEA",
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    //borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
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
});
