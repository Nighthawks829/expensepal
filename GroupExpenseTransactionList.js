import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, Button } from "react-native";
import axios from "axios";
import { StyleSheet } from "react-native";
import { UserContext } from "./UserContext";

export default function GroupExpenseTransactionList({ route, navigation }) {
  const { user } = useContext(UserContext)
  const { group_expense_id } = route.params;
  const [transactions, setTransactions] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [mergedData, setMergedData] = useState([]);
  const [payerId, setPayerId] = useState("")
  const [settleAmount, setSettleAmount] = useState(0)

  useEffect(() => {
    fetchTransactionsAndSettlements();
  }, []);

  useEffect(() => {
    if (settlements) {
      let total = 0;
      settlements.forEach(settlement => {
        if (parseInt(settlement.payer_id) !== user.user_id) {
          total += parseFloat(settlement.amount);
        }
      });
      setSettleAmount(total);
    }
  }, [settlements])


  // const fetchTransactionsAndSettlements = async () => {
  //   try {
  //     const [groupExpenseResponse, settlementsResponse, transactionsResponse,] = await Promise.all([
  //       axios.get("http://192.168.0.112/expensepal_api/getGroupExpense.php", {
  //         params: { group_expense_id: group_expense_id }
  //       }),
  //       axios.get("http://192.168.0.112/expensepal_api/getSettlementsExpense.php", {
  //         params: { group_expense_id: group_expense_id }
  //       }),
  //       axios.get("http://192.168.0.112/expensepal_api/getGroupSettleUpPaymentUserId.php", {
  //         params: { group_expense_id: group_expense_id, user_id: user.user_id, friend_id: payerId }
  //       }),
  //       // axios.get("http://192.168.0.112/expensepal_api/getSettlement.php", {
  //       //   params: { group_expense_id: group_expense_id }
  //       // }),
  //     ]);

  //     // console.log(transactionsResponse.data.settleup_payment);
  //     // console.log(settlementsResponse.data.settlements);


  //     setSettlements(settlementsResponse.data.settlements);
  //     setPayerId(groupExpenseResponse.data.group_expense[0].payer_id)

  //     const groupExpense = groupExpenseResponse.data.group_expense.map(item => ({
  //       ...item,
  //       type: 'group_expense',
  //       displayText: `${item.payer_name} paid RM ${item.expense_amount} at ${item.date} for ${item.description}`
  //     }))

  //     const settlements = settlementsResponse.data.settlements.map(item => ({
  //       ...item,
  //       type: 'settlement',
  //       displayText: item.member_username === item.payer_username
  //         ? `${item.member_username} paid ${item.total_amount}`
  //         : `${item.member_username} owed ${item.payer_username} RM ${item.total_amount} for ${item.description} at ${item.date}`
  //     }));

  //     const transactions = transactionsResponse.data.settleup_payment.map(item => ({
  //       ...item,
  //       type: 'transaction',
  //       displayText: `${item.payer_name} paid ${item.receiver_name} RM ${item.amount} at ${item.created_at}`
  //     }));

  //     console.log(transactionsResponse.data.settleup_payment);

  //     setMergedData([...groupExpense, ...settlements, ...transactions]);
  //   } catch (error) {
  //     console.error('Fetch Error:', error);
  //     Alert.alert('Error', 'Unable to fetch data. Please try again.');
  //   }
  // };

  const fetchTransactionsAndSettlements = async () => {
    try {
      const groupExpenseResponse = await axios.get(
        "http://192.168.0.112/expensepal_api/getGroupExpense.php",
        {
          params: { group_expense_id: group_expense_id }
        }
      );

      const groupExpense = groupExpenseResponse.data.group_expense.map(item => ({
        ...item,
        type: 'group_expense',
        displayText: `${item.payer_name} paid RM ${item.expense_amount} at ${item.date} for ${item.description}`
      }))

      const settlementsResponse = await axios.get("http://192.168.0.112/expensepal_api/getSettlementsExpense.php", {
        params: { group_expense_id: group_expense_id }
      })

      setSettlements(settlementsResponse.data.settlements);

      const settlements = settlementsResponse.data.settlements.map(item => ({
        ...item,
        type: 'settlement',
        displayText: item.member_username === item.payer_username
          ? `${item.member_username} paid ${item.total_amount}`
          : `${item.member_username} owed ${item.payer_username} RM ${item.total_amount} for ${item.description} at ${item.date}`
      }));

      setPayerId(groupExpenseResponse.data.group_expense[0].payer_id)

      const transactionsResponse = await axios.get("http://192.168.0.112/expensepal_api/getAllGroupSettleup.php", {
        params: {
          group_expense_id: group_expense_id,
          user_id: user.user_id,
          friend_id: groupExpenseResponse.data.group_expense[0].payer_id
        }
      })

      const transactions = transactionsResponse.data.settleup_payment.map(item => ({
        ...item,
        type: 'transaction',
        displayText: `${item.payer_name} paid ${item.receiver_name} RM${item.amount} at ${item.created_at}`
      }));

      setMergedData([...groupExpense, ...settlements, ...transactions]);
    } catch (error) {
      console.error('Fetch Error:', error);
      Alert.alert('Error', 'Unable to fetch data. Please try again.');
    }
  }





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
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
      {payerId !== user.user_id && (
        <View style={styles.buttonContainer}>
          <Button title="Group Settle Up" onPress={() => navigation.navigate("GroupSettleUpPayment", { friendId: payerId, settlements, group_expense_id })} />
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Button title="Group Check Settle Up" onPress={() => navigation.navigate("GroupCheckSettleUpPayment", { friendId: payerId, settlements, group_expense_id })} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E1FFD4",
  },
  buttonContainer: { marginTop: 20, },
});
