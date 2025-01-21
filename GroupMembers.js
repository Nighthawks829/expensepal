import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  StyleSheet,
  Modal,
} from "react-native";
import axios from "axios";
import sharedStyles from "./styles";

export default function GroupMembers() {
  const [members, setMembers] = useState([
    { id: 1, name: "beeleng" },
    { id: 2, name: "Hannah" },
    { id: 3, name: "test" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchGroupMembers();
  }, []);

  const fetchGroupMembers = async () => {
    try {
      const response = await axios.get(
        "http://192.168.0.112/expensepal_api/getGroupMembers.php"
      );
      setMembers(response.data);
    } catch (error) {
      console.log("Error fetching group members:", error);
    }
  };

  const handleAddMember = async (userId, name) => {
    try {
      // await axios.post(
      //   "http://192.168.0.112/expensepal_api/addGroupMember.php",
      //   { userId }
      // );
      console.log("Attempting to add member:", userId, name);
      setMembers((prevMembers) => [...prevMembers, { id: userId, name: name }]);
      setIsModalVisible(false);
      console.log("Hannah added to the list");
      // fetchGroupMembers();
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      // await axios.delete(
      //   `http://192.168.0.112/expensepal_api/removeGroupMember.php?userId=${userId}`
      // );
      // fetchGroupMembers();
      setMembers((prevMembers) => prevMembers.filter((m) => m.id !== userId));
      console.log("Remove Member API call would happen for userId", userId);
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search Members"
        value={searchTerm}
        onChangeText={searchTerm}
        style={styles.searchInput}
      />
      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.name}</Text>
            <Button
              title="Remove"
              onPress={() => handleRemoveMember(item.id)}
              style={sharedStyles.button}
            />
          </View>
        )}
      />
      <Button title="Add Member" onPress={() => setIsModalVisible(true)} />

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Add Member</Text>
            <FlatList
              data={[{ id: 2, name: "Hannah" }]} // Only Hannah for now
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.memberItem}>
                  <Text style={styles.memberName}>{item.name}</Text>
                  <Button
                    title="Add"
                    onPress={() => {
                      console.log("Button pressed for", item.name);
                      handleAddMember(item.id, item.name);
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
