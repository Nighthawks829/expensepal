import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import axios from "axios";
import { StyleSheet } from "react-native";

export default function GroupExpenseTransactionList({ route, navigation }) {
  const { group_expense_id } = route.params;
  const [transactions, setTransactions] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [mergedData, setMergedData] = useState([]);

  useEffect(() => {
    fetchTransactionsAndSettlements();
  }, []);


  const fetchTransactionsAndSettlements = async () => {
    try {
      const [groupExpenseResponse, transactionsResponse, settlementsResponse] = await Promise.all([
        axios.get("http://192.168.0.112/expensepal_api/getGroupExpense.php", {
          params: { group_expense_id: group_expense_id }
        }),
        axios.get("http://192.168.0.112/expensepal_api/getSettlement.php", {
          params: { group_expense_id: group_expense_id }
        }),
        axios.get("http://192.168.0.112/expensepal_api/getSettlementsExpense.php", {
          params: { group_expense_id: group_expense_id }
        }),
      ]);

      const groupExpense = groupExpenseResponse.data.group_expense.map(item => ({
        ...item,
        type: 'group_expense',
        displayText: `${item.payer_name} paid RM ${item.expense_amount} at ${item.date} for ${item.description}`
      }))

      const transactions = transactionsResponse.data.settlements.map(item => ({
        ...item,
        type: 'transaction',
        displayText: `${item.settlement_username} paid ${item.payer_username} RM ${item.amount} at ${item.settled_at}`
      }));

      const settlements = settlementsResponse.data.settlements.map(item => ({
        ...item,
        type: 'settlement',
        displayText: `${item.member_username} owed ${item.payer_username} RM ${item.total_amount} for ${item.description} at ${item.date}`
      }));

      setMergedData([...groupExpense,...settlements, ...transactions]);
    } catch (error) {
      console.error('Fetch Error:', error);
      Alert.alert('Error', 'Unable to fetch data. Please try again.');
    }
  };



  // useEffect(() => {
  //   fetchTransactions();
  //   fetchSettlements();
  // }, []);

  // const fetchSettlements = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://192.168.0.112/expensepal_api/getSettlementsExpense.php", {
  //       params: {
  //         group_expense_id: group_expense_id,
  //       }
  //     }
  //     );
  //     // console.log(response.data.settlements);
  //     setSettlements(response.data.settlements);
  //   } catch (error) {
  //     console.error("Error fetching settlements:", error);
  //   }
  // };


  // const fetchTransactions = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://192.168.0.112/expensepal_api/getSettlement.php", {
  //       params: {
  //         group_expense_id: group_expense_id,
  //       }
  //     }
  //     );
  //     console.log(response.data.settlements);
  //     setTransactions(response.data.settlements);
  //   } catch (error) {
  //     console.error("Error fetching transactions:", error);
  //   }
  // };

  const renderItem = ({ item }) => (
    <View>
      <Text>{item.displayText}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <FlatList
        data={settlements}
        keyExtractor={(item) => item.group_member_expense_id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.member_username} owned {item.payer_username} RM{" "}{item.total_amount} at {item.description}</Text>
          </View>
        )}
      /> */}
      <FlatList
        data={mergedData}
        keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
        renderItem={renderItem}
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
});
