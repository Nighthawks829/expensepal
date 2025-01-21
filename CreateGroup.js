import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { UserContext } from "./UserContext";
import sharedStyles from "./styles";

export default function CreateGroup({ navigation, route }) {
  const { user } = useContext(UserContext);

  const [groupName, setGroupName] = useState("");
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);

  const onGroupCreate = route.params?.onGroupCreate;

  useEffect(() => {
    axios
      .get("http://192.168.0.112/expensepal_api/getFriend.php", {
        params: { user_id: user.user_id },
      })
      .then((response) => {
        console.log(response.data);
        setFriends(response.data);
      })
      .catch((error) => console.error("Error fetching friends:", error));
  }, []);

  const toggleFriendSelection = (friendId) => {
    if (selectedFriends.includes(friendId)) {
      setSelectedFriends(selectedFriends.filter((id) => id !== friendId));
    } else {
      setSelectedFriends([...selectedFriends, friendId]);
    }
  };


  const handleCreateGroup = async () => {
    // console.log("Selected friends", selectedFriends)
    if (!groupName || selectedFriends.length === 0) {
      alert("Please provide a group name and select members.");
      return;
    }
    try {
      const response = await axios.post("http://192.168.0.112/expensepal_api/addGroup.php", {
        user_id:user.user_id,
        groupName: groupName,
        selectedFriends: selectedFriends,
      })

      // console.log(resposne)
      console.log(response.data)

      if (response.data.success) {
        navigation.goBack();
        console.log(response.data.message);
      }
    } catch (error) {
      console.log('Error add group:', error)
    }
    // const newGroup = {
    //   group_id: Math.random().toString(),
    //   group_name: groupName,
    //   members: selectedFriends,
    // };

    // onGroupCreate?.(newGroup);

    // navigation.goBack();
    // console.log("Payload:", {
    //   user_id: user.user_id,
    //   group_name: groupName,
    //   members: selectedFriends,
    // });

    // axios
    //   .post(
    //     "http://192.168.0.112/expensepal_api/createGroup.php",
    //     {
    //       user_id: user.user_id,
    //       group_name: groupName,
    //       members: selectedFriends,
    //     }
    //     // {
    //     //   headers: {
    //     //     "Content-Type": "application/json",
    //     //   },
    //     // }
    //   )
    //   .then((response) => {
    //     if (response.data.success) {
    //       alert("Group created successfully.");
    //       navigation.goBack();
    //     } else {
    //       alert("Error creating group: " + response.data.message);
    //     }
    //   })
    //   .catch((error) => {
    //     console.error("Error creating group:", error);
    //   });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Group</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Group Name"
        value={groupName}
        onChangeText={setGroupName}
      />
      <Text style={styles.subtitle}>Select Friends:</Text>
      <FlatList
        data={friends.friends}
        keyExtractor={(item) => item.user_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.friendItem,
              selectedFriends.includes(item.user_id) && styles.selectedFriend,
            ]}
            onPress={() => toggleFriendSelection(item.user_id)}
          >
            <Text>{item.username}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={sharedStyles.button} onPress={handleCreateGroup}>
        <Text style={sharedStyles.buttonText}>Create Group</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E1FFD4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  friendItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBlockColor: "#ccc",
  },
  selectedFriend: {
    backgroundColor: "#d3f4ff",
  },
});
