import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import axios from "axios";
import sharedStyles from "./styles";
import { UserContext } from "./UserContext";

export default function GroupMembers({ route, navigation }) {
  const { user } = useContext(UserContext);
  const { group_id } = route.params;
  const [members, setMembers] = useState([
    { id: 1, name: "beeleng" },
    { id: 2, name: "Hannah" },
    { id: 3, name: "test" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [membersNotInGroup, setMembersNotInGroup] = useState([])

  useEffect(() => {
    fetchGroupMembers();
    fetchFriendsNotInGroup();
  }, []);

  const fetchGroupMembers = async () => {
    try {
      const response = await axios.get(
        "http://192.168.0.112/expensepal_api/getGroupsMember.php", {
        params: {
          group_id: group_id
        }

      }
      );
      console.log(response.data.users);
      if (response.data.success == true) {
        setMembers(response.data.users)
      }
      // setMembers(response.data);
    } catch (error) {
      console.log("Error fetching group members:", error);
    }
  };


  const fetchFriendsNotInGroup = async () => {
    try {
      const response = await axios.get("http://192.168.0.112/expensepal_api/getFriendsNotInGroup.php", {
        params: {
          user_id: user.user_id,
          group_id: group_id,
        }
      })
      // console.log(response.data);
      if (response.data.success) {
        setMembersNotInGroup(response.data.users)
      }
    } catch (error) {

    }
  }

  const handleAddMember = async (userId, name) => {
    try {
      // await axios.post(
      //   "http://192.168.0.112/expensepal_api/addGroupMember.php",
      //   { userId }
      // );
      const response = await axios.post("http://192.168.0.112/expensepal_api/addGroupMember.php", {
        group_id: group_id,
        user_id: userId,
      })

      console.log(response.data);
      if (response.data.success) {
        fetchGroupMembers();
        fetchFriendsNotInGroup();
        Alert.alert("Success", `Success add ${name} to the group`);
      }

      setIsModalVisible(false);
      // fetchGroupMembers();
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const handleRemoveMember = async (userId) => {
    console.log(userId);
    try {
      const response = await axios.delete("http://192.168.0.112/expensepal_api/deleteGroupMember.php", {
        params: {
          group_id: group_id,
          user_id: userId,
        }
      })
      // console.log(response.data);
      // setMembers((prevMembers) => prevMembers.filter((m) => m.id !== userId));
      // console.log("Remove Member API call would happen for userId", userId);
      if (response.data.success) {
        Alert.alert("Success", "Success deleted user");
        fetchGroupMembers();
        fetchFriendsNotInGroup();
      }
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  const handleAddMemberModalButton = async () => {
    setIsModalVisible(true)
  }

  // const filteredMembers = members.filter((member) =>
  //   member.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search Members"
        value={searchTerm}
        onChangeText={searchTerm}
        style={styles.searchInput}
      />
      <FlatList
        data={members}
        keyExtractor={(item) => item.user_id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.username}</Text>
            <Button
              title="Remove"
              onPress={() => handleRemoveMember(item.user_id)}
              style={sharedStyles.button}
            />
          </View>
        )}
      />
      <Button title="Add Member" onPress={() => handleAddMemberModalButton()} />

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Add Member</Text>
            <FlatList
              data={membersNotInGroup} // Only Hannah for now
              keyExtractor={(item) => item.user_id}
              renderItem={({ item }) => (
                <View style={styles.memberItem}>
                  <Text style={styles.memberName}>{item.username}</Text>
                  <Button
                    title="Add"
                    onPress={() => {
                      console.log("Button pressed for", item.username);
                      handleAddMember(item.user_id, item.username);
                    }}
                    style={sharedStyles.button}
                  />
                </View>
              )}
            />
            <Button title="Close" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E1FFD4",
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  removeButton: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  searchInput: {
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
    marginBottom: 20,
  },
});
