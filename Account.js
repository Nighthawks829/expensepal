import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import sharedStyles from "./styles";
import { UserContext } from "./UserContext";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Account() {
  const navigation = useNavigation();
  const { user, setUser } = useContext(UserContext);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // const user_id = user.user_id;
        if (!user || !user.user_id) {
          // Alert.alert("Error", "User not found. Please log in again.");
          navigation.navigate("LoginSignup");
          return;
        }

        const response = await axios.get(
          `http://192.168.0.112/expensepal_api/handleUserDetails.php`,
          {
            params: { user_id: user.user_id },
          }
        );

        console.log("API Response:", response.data);

        if (response.data.success) {
          setUserData(response.data.data);
        } else {
          Alert.alert(
            "Error",
            response.data.message || "Failed to fetch user details."
          );
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        Alert.alert("Error", "Something went wrong while fetching user data.");
      }
    };

    fetchUserData();
  }, [user?.user_id]);

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user_id");
      setUser(null);
      navigation.navigate("LoginSignup");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Failed to log out.");
    }
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.profileContainer}>
                {userData.profileImage ? (
                    <Image
                        source={{ uri: userData.profileImage }}
                        style={styles.profileImage}
                    />
                ) : (
                    <Icon name="account-circle" size={120} color="#ccc" style={styles.profileIcon} />
                )} */}
      <TouchableOpacity
        style={styles.profileContainer}
        onPress={() => navigation.navigate("AccountSettings", { userData })}
      >
        {userData.profilePicture ? (
          <Image
            source={{ uri: userData.profilePicture }}
            style={styles.profileImage}
          />
        ) : (
          <Icon
            name="account-circle"
            size={110}
            color="#ccc"
            style={styles.profileIcon}
          />
        )}

        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Username: {userData.username}</Text>
          <Text style={styles.label}>Email: {userData.email}</Text>
          <Text style={styles.label}>
            Phone Number: {userData.phone_number || "Not provided"}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.preferences}>
        <TouchableOpacity
          style={styles.preferenceItem}
          onPress={() =>
            navigation.navigate("NotificationPreferences", { userData })
          }
        >
          <Text style={styles.preferenceText}>Notification Preferences</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.preferenceItem}
          onPress={() => navigation.navigate("uploadQRCode", { userData })
          }
        >
          <Text style={styles.preferenceText}>Upload QR Code</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.preferenceItem}
          onPress={() =>
            navigation.navigate("CurrencyPreferences", { userData })
          }
        >
          <Text style={styles.preferenceText}>Currency Preferences</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={sharedStyles.button} onPress={handleLogout}>
          <Text style={sharedStyles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
      {/* </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E1FFD4",
    padding: 20,
    justifyContent: "flex-start",
    //alignItems: 'center',
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 60,
    marginBottom: 20,
  },
  profileIcon: {
    width: 110,
    height: 110,
  },
  detailsContainer: {
    justifyContent: "center",
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "gray",
  },
  preferences: {
    marginVertical: 20,
  },
  preferenceItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  preferenceText: {
    fontSize: 16,
    color: "#007BFF",
  },
  profileIcon: {
    marginRight: 20,
  },
  detailsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    // marginTop: -130,
    // marginLeft: 140,
  },
  // name: {
  //     fontSize: 20,
  //     fontWeight: 'bold',
  // },
  label: {
    fontSize: 16,
    //fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
