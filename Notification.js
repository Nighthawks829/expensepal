import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
//import { ExpenseContext } from "./ExpenseContext";
import { UserContext } from "./UserContext";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
// import sharedStyles from "./styles";

export default function Notification() {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendRequests, setFriendRequests] = useState([]);

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(
        "http://192.168.0.112/expensepal_api/getFriendRequests.php",
        {
          params: { user_id: user?.user_id },
        }
      );
      console.log(response.data);
      if (response.data.success) {
        setFriendRequests(response.data.requests || []);
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Error fetching requests."
        );
      }
    } catch (error) {
      console.error("Fetch Requests Error:", error);
      Alert.alert(
        "Error",
        "Unable to fetch friend requests. Please try again."
      );
    }
  };

  useEffect(() => {
    console.log(user.user_id);
    if (user?.user_id) {
      fetchNotifications();
      fetchFriendRequests();
    }
    console.log(notifications.length);
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        "http://192.168.0.112/expensepal_api/getNotifications.php",
        {
          params: { user_id: user.user_id },
        }
      );
      console.log(response.data);
      if (response.data.success) {
        const sortedNotifications = response.data.notifications.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setNotifications(sortedNotifications);
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to load notifications."
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while fetching notifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (noti_id, friend_id, action) => {
    try {
      const response = await axios.post(
        "http://192.168.0.112/expensepal_api/handleFriendRequest.php",
        {
          noti_id,
          friend_id,
          user_id: user.user_id,
          action,
        }
      );

      if (response.data.success) {
        Alert.alert("Success", response.data.message);
        fetchNotifications();
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to process request."
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred while processing the request.");
    }
  };

  const handleNotificationPress = (notification) => {
    if (notification.type === "friend request") {
      navigation.navigate("FriendRequest", { friendRequests });
      console.log("Friend requees", friendRequests);
    } else {
      Alert.alert("Notification", notification.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Notifications</Text> */}
      {loading ? (
        <Text style={styles.loadingText}>Loading notifications...</Text>
      ) : notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.noti_id.toString()}
          renderItem={({ item }) => (
            // <View style={styles.notificationItem}>
            //     <Text style={styles.notificationMessage}>{item.message}</Text>
            //     {item.type === "friend_request" && (
            //         <View style={styles.actions}>
            //             <TouchableOpacity
            //                 style={styles.acceptButton}
            //                 onPress={() => handleRequest(item.noti_id, item.user_id, "accept")}
            //             >
            //                 <Text style={styles.actionText}>Accept</Text>
            //             </TouchableOpacity>
            //             <TouchableOpacity
            //                 style={styles.deleteButton}
            //                 onPress={() => handleRequest(item.noti_id, item.user_id, "delete")}
            //             >
            //                 <Text style={styles.actionText}>Delete</Text>
            //             </TouchableOpacity>
            //         </View>
            //     )}
            //     <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
            // </View>
            <TouchableOpacity
              onPress={() => handleNotificationPress(item)}
              style={styles.notificationItem}
            >
              <Text style={styles.notificationMessage}>{item.message}</Text>
              <Text style={styles.date}>
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={styles.noNotifications}>No notifications available</Text>
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
  // title: {
  //     fontSize: 24,
  //     fontWeight: 'bold',
  //     marginBottom: 20,
  //     color: '#48742C',
  // },
  notificationItem: {
    // backgroundColor: '#F5F5F5',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    // borderRadius: 10,
    // marginBottom: 15,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.3,
    // shadowRadius: 2,
    // elevation: 2,
  },
  // notificationTitle: {
  //     fontSize: 18,
  //     fontWeight: 'bold',
  //     color: '#333',
  // },
  notificationMessage: {
    fontSize: 18,
    color: "#666",
    marginBottom: 5,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 5,
  },
  actionText: {
    color: "#FFF",
    fontSize: 14,
  },
  date: {
    fontSize: 12,
    color: "#666666",
  },
  noNotifications: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});
