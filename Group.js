import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { UserContext } from "./UserContext";
import { AntDesign } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";

export default function Group() {
  const { user } = useContext(UserContext);
  const navigation = useNavigation();
  const [groups, setGroups] = useState([
    {
      group_id: 1,
      group_name: "Trip",
    },
  ]);

  // useFocusEffect(
  //   fet
  //   // useCallback(() => {
  //   //   fetchGroups();
  //   // }, [])
  // );

  const fetchGroups = async () => {
    try {
      const response = await axios.get(
        "http://192.168.0.112/expensepal_api/getGroups.php",
        { params: { user_id: user?.user_id } }
      );
      console.log(response.data)
      if (response.data !== null) {
        setGroups(response.data);
      }
    } catch (error) {
      console.error("Fetch Groups Error:", error);
      Alert.alert("Error", "Unable to fetch groups. Please try again.");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchGroups();
    }, []),
  );

  // useEffect(()=>{
  //   fetchGroups();
  // },[])


  // useEffect(
  //   useCallback(() => {
  //     fetchGroups();
  //   }, [])
  // );

  const handleGroupClick = (group) => {
    navigation.navigate("GroupDetails", {
      group_id: group.group_id,
      group_name: group.group_name,
      currentBalance: group.currentBalance,
    });
  };

  const handleAddNewGroup = (newGroup) => {
    setGroups((prevGroups) => [...prevGroups, newGroup]);
  };

  // useEffect(() => {
  //   axios
  //     .get("http://192.168.0.112/expensepal_api/getGroups.php", {
  //       params: { user_id: user.user_id },
  //     })
  //     .then((response) => {
  //       console.log("Groups data:", response.data);
  //       setGroups((prevGroups) => [
  //         ...prevGroups,
  //         ...(response.data.groups || []),
  //       ]);
  //       // setGroups(response.data.groups || []);
  //     })
  //     .catch((error) => console.error("Error fetching groups:", error));
  // }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Groups</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("CreateGroup", {
              onGroupCreate: handleAddNewGroup,
            })
          }
        >
          <AntDesign name="pluscircle" size={32} color="#007BFF" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.group_id.toString()}
        // keyExtractor={(item, index) =>
        //   item.group_id ? item.group_id.toString() : index.toString()
        // }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleGroupClick(item)}
          // style={styles.groupItem}
          // onPress={() =>
          //   navigation.navigate("GroupDetails", {
          //     group_id: item.group_id,
          //     group_name: item.group_name,
          //   })
          // }
          >
            <View style={styles.groupItem}>
              <Icon
                name="groups"
                size={25}
                color="#48742C"
                style={styles.icon}
              />
              <Text style={styles.groupName}>{item.group_name}</Text>
            </View>
            <View style={styles.separator} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.noGroups}>No groups found. Create one!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E1FFD4",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  emptyMessage: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
  groupItem: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#E1FFD4",
    marginBottom: 10,
    borderRadius: 5,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  icon: {
    marginRight: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#000",
    // marginVertical: 10,
  },
  noGroups: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    fontSize: 16,
    color: "#999",
  },
});
