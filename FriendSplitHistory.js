import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  FlatList,
  StyleSheet,
} from "react-native";
import { UserContext } from "./UserContext";
import { useFocusEffect } from "@react-navigation/native";
//import { useNavigation } from "@react-navigation/native";

export default function FriendSplitHistory({ route, navigation }) {
  //const navigation = useNavigation();
  const { user } = useContext(UserContext);
  const { friendUsername, friendId } = route.params;
  const [splitExpenses, setSplitExpenses] = useState([]);


  useFocusEffect(
    React.useCallback(() => {
      getSplitExpense()
    }, []),
  );


  const getSplitExpense = async () => {
    try {
      const response = await axios.get("http://192.168.0.112/expensepal_api/getSplitExpense.php", {
        params: {
          user_id: user.user_id,
          friend_id: friendId,
        }
      })
      console.log(response.data.splitExpense);

      if (response.data.splitExpense) {
        setSplitExpenses(response.data.splitExpense)
      }
    } catch (error) {
      console.error('Failed to get split expense:', error);
    }
  }

  const addSplitExpense = () => {
    navigation.navigate("SplitExpense", { friendUsername, friendId });
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{`Amount: ${item.amount}`}</Text>
      <Text>{`User owes: ${item.userShare}, Friend owes: ${item.friendShare}`}</Text>
      <Text>{`Payer: ${item.payer_name}`}</Text>
      {/* <Text>{`Status: ${item.status}`}</Text> */}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Split Expense History with {friendUsername}
      </Text>
      {splitExpenses.map((item) => (
        <View key={item.split_id.toString()} style={styles.item}>
            <Text>{`${item.expense_name}`}</Text>
          <Text>{`Amount: RM${item.amount}`}</Text>
          <Text>{`${item.user_name} owes: RM${item.user_share}, ${item.friend_name} owes: RM${item.friend_share}`}</Text>
          <Text>{`${item.payer_name} paid RM${item.amount}`}</Text>
          <Text>{`Category: ${item.category}`}</Text>
        </View>
      ))}
      <Button title="Add Split Expense" onPress={addSplitExpense} style={styles.addButton} />
      {splitExpenses.length > 0 && (
        <View style={styles.buttonContainer}>
          <Button title="Settle Up" onPress={() => navigation.navigate("SettleUpPayment", { friendId, splitExpenses })} />
        </View>
      )}
      <View style={styles.buttonContainer}>
          <Button title="Check Settle Up" onPress={() => navigation.navigate("CheckSettleUp", { friendId })} />
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#E1FFD4",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginTop: -25,
    marginBottom: 20,
  },
  item: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  buttonContainer: { marginTop: 20, },
});
