import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SectionList,
  Alert,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import sharedStyles from "./styles";
import { UserContext } from "./UserContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
//import { AlphaSenderContextImpl } from "twilio/lib/rest/messaging/v1/service/alphaSender";

export default function Friend() {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const [notifications, setNotifications] = useState([]);
  const [friends, setFriends] = useState([]);
  const [newFriend, setNewFriend] = useState("");
  const [friendRequests, setFriendRequests] = useState([]);
  // const [requestMessage, setRequestMessage] = useState("");
  // const [requestCount, setRequestCount] = useState(0);
  const [username, setUsername] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFriends, setFilteredFriends] = useState([]);
  const sectionListRef = useRef(null);

  const resetFields = () => {
    setUsername("");
  };

  // useEffect(() => {
  //     fetchFriends();
  //     fetchFriendRequests()
  // }, []);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(
        "http://192.168.0.112/expensepal_api/getFriend.php",
        {
          params: { user_id: user?.user_id },
        }
      );
      if (response.data.success) {
        // const sortedFriends = (response.data.friends || []).sort((a, b) =>
        //     a.username.localeCompare(b.username)
        // );
        setFriends(response.data.friends);
      } else {
        console.error(response.data.message || "Error fetching friends.");
        Alert.alert(
          "Error",
          response.data.message || "Unable to fetch friends."
        );
      }
    } catch (error) {
      console.error("Fetch Friends Error:", error);
      Alert.alert("Error", "Unable to fetch friends. Please try again.");
    }
  };
  //fetchFriendRequests();

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(
        // "http://192.168.0.112/expensepal_api/getFriendRequests.php",
        "http://192.168.0.112/expensepal_api/getFriendRequestUserId.php",
        {
          params: { user_id: user?.user_id },
        }
      );
      // console.log(response.data);
      if (response.data.success) {
        // setFriendRequests(response.data.requests || []);
        setFriendRequests(response.data.friend_requests)
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

  const addFriend = async () => {
    if (!username) {
      Alert.alert("Error", "Please enter a username");
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.0.112/expensepal_api/addFriend.php",
        {
          username: user.username, //sender
          friendUsername: username, //receiver
        }
      );
      // console.log(response.data.success);

      if (response.data.success) {
        // setFriends([...friends, { username }]);
        // setUsername('');
        setFriends((prevFriends) => [...prevFriends, { username }]);
        resetFields();
        fetchFriends();
        Alert.alert("Success", response.data.message);
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to send friend request."
        );
      }
      // console.log(response.data);
    } catch (error) {
      console.error("Add Friend Error:", error);
      Alert.alert("Error", "Unable to add friend. Please try again.");
    }
  };

  const handleFriendRequestResponse = async (friendship_id, action) => {
    try {
      const response = await axios.post(
        "http://192.168.0.112/expensepal_api/handleFriendRequest.php",
        {
          action,
          friendship_id,
        }
      );

      if (response.data.success) {
        if (action === "accept") {
          const acceptedFriend = friendRequests.find(
            (req) => req.friendship_id === friendship_id
          );
          setFriendRequests(
            friendRequests.filter((req) => req.friendship_id !== friendship_id)
          );
          setFriends((prevFriends) =>
            [...prevFriends, { username: acceptedFriend.username }].sort(
              (a, b) => a.username.localeCompare(b.username)
            )
          );

          await sendNotificationToSender(
            acceptedFriend.user_id,
            user?.username
          );
        } else if (action === "decline") {
          setFriendRequests(
            friendRequests.filter((req) => req.friendship_id !== friendship_id)
          );
        }

        Alert.alert("Success", response.data.message);
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Unable to process the first request."
        );
      }
    } catch (error) {
      console.error("Friend Request Error:", error);
      Alert.alert(
        "Error",
        "Unable to process the friend request. Please try again."
      );
    }
  };

  const sendNotificationToSender = async (senderUserId, acceptedByUsername) => {
    try {
      const response = await axios.post(
        "http://192.168.0.112/expensepal_api/sendNotification.php",
        {
          user_id: senderUserId,
          message: `${acceptedByUsername} has accepted your friend request.`,
        }
      );

      if (!response.data.success) {
        console.error("Notification Error:", response.data.message);
      }
    } catch (error) {
      console.error("Send Notification Error:", error);
    }
  };

  const handleFriendRequestPress = useCallback(() => {
    // navigation.navigate("FriendRequest", {
    //     requests: friendRequests,
    //     onHandleRequest: handleFriendRequestResponse,
    // });
    if (friendRequests.length > 0) {
      navigation.navigate("FriendRequest", { requests: friendRequests });
    } else {
      Alert.alert("No Friend Requests", "You have no new friend requests.");
    }
  }, [friendRequests, navigation]);

  //         const [firstRequest] = friendRequests;
  //             user_id: user?.user_id,
  //             noti_id: firstRequest?.noti_id || null,
  //             friend_id: firstRequest?.friend_id || null,
  //         });
  //     } else {
  //         Alert.alert("No Friend Requests", "You have no new friend requests.");
  //     }
  // };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredFriends(friends);
    } else {
      const filtered = friends.filter((friend) =>
        friend.username.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredFriends(filtered);
    }
  };

  const groupFriendByAlphabet = (friendsList) => {
    if (!friendsList.length) return [];
    const groups = {};
    friendsList.forEach((friend) => {
      const firstLetter = friend.username[0]?.toUpperCase() || "#";
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(friend);
    });

    return Object.keys(groups)
      .sort()
      .map((letter) => ({
        title: letter,
        data: groups[letter],
      }));
  };

  const sections = groupFriendByAlphabet(filteredFriends);

  const scrollToSection = (letter) => {
    const index = sections.findIndex((section) => section.title === letter);
    if (index !== -1) {
      sectionListRef.current.scrollToLocation({
        sectionIndex: index,
        itemIndex: 0,
        animated: true,
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFriends();
      fetchFriendRequests();
    }, [])
  );

  return (
    (
      <View style={styles.container}>
        {friendRequests.length > 0 && (
          <TouchableOpacity
            style={styles.newFriendsContainer}
            onPress={() => handleFriendRequestPress(friendRequests)}
          >
            <View>
              <Text style={styles.friendRequestText}>
                New Friend Requests ({friendRequests.length})
              </Text>
              <Text style={styles.friendRequestMessage}>
              {friendRequests[0] ? `You have a friend request from ${friendRequests[0].friend_name}` : "No recent messages"}
              </Text>
            </View>
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>
                {friendRequests.length}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.addFriendContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Username"
            value={username}
            onChangeText={setUsername}
          />
          <TouchableOpacity
            style={[sharedStyles.button, styles.buttonWithIcon]}
            onPress={addFriend}
          >
            <Icon
              name="person-add"
              size={20}
              color="#000000"
              style={styles.icon}
            />
            <Text style={sharedStyles.buttonText}>Add Friend</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Search Friends"
          value={searchQuery}
          onChangeText={handleSearch}
        />

        <View style={styles.listAndSliderContainer}>
          <FlatList
            data={friends}
            keyExtractor={(item) => item.username}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("FriendSplitHistory", {
                    friendUsername: item.username,
                    friendId:item.user_id
                  })
                }
              >
                <View style={styles.friendItem}>
                  <Icon name="person" size={25} color="#48742C" />
                  <Text style={styles.friendText}>{item.username}</Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                No friends yet. Add some!
              </Text>
            }
          />

          <View style={styles.alphabetSlider}>
            {Array.from({ length: 26 }, (_, i) =>
              String.fromCharCode(65 + i)
            ).map((letter) => (
              <TouchableOpacity
                key={letter}
                onPress={() => scrollToSection(letter)}
              >
                <Text style={styles.alphabetLetter}>{letter}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* <FlatList
                data={friends}
                keyExtractor={(item) => item.username}
                renderItem={({ item }) => (
                    <View style={styles.friendItem}>
                        <Icon name="person" size={25} color="#48742C" />
                        <Text style={styles.friendText}>{item.username}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No friends yet. Add some!</Text>}
            />

            <ScrollView contentContainerStyle={styles.alphabetSlider}>
                {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map((letter) => (
                    <TouchableOpacity key={letter} onPress={() => scrollToSection(letter)}>
                        <Text style={styles.alphabetLetter}>{letter}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView> */}

        {/* <SectionList
                ref={sectionListRef}
                sections={sections}
                keyExtractor={(item) => item.username}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                )}
            /> */}
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E1FFD4",
  },
  addFriendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    //justifyContent: "space-between",
  },
  input: {
    flex: 1,
    padding: 10,
    borderColor: "#48742C",
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    //height: 40,
  },
  buttonWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
  },
  icon: {
    marginRight: 5,
  },
  searchInput: {
    padding: 10,
    borderColor: "#48742C",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCC",
  },
  friendText: {
    marginLeft: 10,
    fontSize: 18,
    color: "#333333",
  },
  listAndSliderContainer: {
    flex: 1,
    flexDirection: "row", // Align FlatList and alphabet slider side-by-side
    alignItems: "flex-start", // Align to the top
    justifyContent: "space-between", // Space elements appropriately
  },
  alphabetSlider: {
    justifyContent: "space-evenly", // Evenly distribute the letters
    alignItems: "center",
    paddingHorizontal: 5, // Space between letters and the edge
  },

  alphabetLetter: {
    fontSize: 14,
    color: "#48742C",
    marginVertical: 1,
    //padding: 1,
  },
  newFriendsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 20,
    // borderColor: "#48742C",
    // borderWidth: 1,
  },
  friendRequestText: {
    fontWeight: "bold",
    fontSize: 16,
    //color: "#333333",
  },
  friendRequestMessage: {
    color: "#555",
    fontSize: 14,
    //marginTop: 5,
  },
  notificationBadge: {
    backgroundColor: "#FF0000",
    //minWidth: 20,
    //height: 20,
    borderRadius: 15,
    //alignItems: "center",
    //justifyContent: "center",
    //marginLeft: 10,
    padding: 5,
  },
  notificationCount: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  notificationsTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "bold",
  },
  notificationItem: {
    padding: 10,
    borderBottonWidth: 1,
    borderBottomColor: "#CCC",
  },
  notificationText: {
    fontSize: 16,
  },

  // sectionHeader: {
  //     backgroundColor: "#48742C",
  //     color: "#FFFFFF",
  //     paddingVertical: 5,
  //     paddingHorizontal: 10,
  //     fontWeight: "bold",
  // },
});
