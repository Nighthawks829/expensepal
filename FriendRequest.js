import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { UserContext } from "./UserContext";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function FriendRequest({ route }) {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  // const [friendRequests, setFriendRequests] = useState([]);
  //const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [requestDetails, setRequestDetails] = useState(null);
  const { friendRequests = [] } = route.params;

  const handleResponse = async (action, friendship_id) => {
    console.log("Sending request with:", { action, friendship_id });
    try {
      const response = await axios.post(
        "http://192.168.0.112/expensepal_api/handleFriendRequest.php",
        {
          action,
          friendship_id,
          user_id: user.user_id,
        }
      );

      console.log("Response", response.data);

      if (response.data.success) {
        const actionMessaage = action === "accept" ? "accepted" : "declined";
        Alert.alert("Success", `Request ${actionMessaage} successfully!`);
        setRequests((prev) =>
          prev.filter((req) => req.friendship_id != friendship_id)
        );

        // if (action === "accept") {
        navigation.navigate("Friend", { refresh: true });
        // }
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to process request."
        );
      }
    } catch (error) {
      console.error("Handle Error:", error);
      Alert.alert("Error", "An error occurred while processing the request.");
    }
  };

  const sendAcceptNotificaton = async (sender_id) => {
    try {
      const response = await axios.post(
        "http://192.168.0.112/expensepal_api/sendNotification.php",
        {
          user_id: sender_id,
          message: `$(user.username) accepted your friend request.`,
        }
      );

      if (response.data.success) {
        console.log("Notification sent to the sender successfully.");
      } else {
        console.error("Failed to send notification:", error);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* {loading ? (
                <Text style={styles.loadingText}>Loading friend requests...</Text>
            ) : friendRequests.length > 0 ? (
                <FlatList
                    data={friendRequests}
                    keyExtractor={(item) => item.friendship_id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.requestItem}>
                            <Text style={styles.requestMessage}>{item.message}</Text>
                            <View style={styles.actions}>
                                <TouchableOpacity
                                    style={styles.acceptButton}
                                    onPress={() => handleRequest(item.friendship_id, "accept")}
                                >
                                    <Text style={styles.actionText}>Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleRequest(item.friendship_id, "delete")}
                                >
                                    <Text style={styles.actionText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.noRequests}>No friend requests available</Text>
            )} */}
      {friendRequests.length > 0 ? (
        <FlatList
          data={friendRequests}
          keyExtractor={(item) => item.friendship_id?.toString()}
          renderItem={({ item }) => (
            <View style={styles.requestItem}>
              <Text style={styles.requestMessage}>
                {item.sender_username} sent you a friend request.
              </Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => handleResponse("accept", item.friendship_id)}
                >
                  <Text style={styles.actionText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleResponse("decline", item.friendship_id)}
                >
                  <Text style={styles.actionText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noRequests}>No friend requests available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E1FFD4",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  requestItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF",
    marginVertical: 5,
    borderRadius: 5,
    elevation: 2,
  },
  requestMessage: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    //marginTop: 10,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  actionText: {
    color: "#FFF",
    //fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
  },
  noRequests: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});
