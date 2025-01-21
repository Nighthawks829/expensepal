import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";
import sharedStyles from "./styles";
import { useSafeAreaFrame } from "react-native-safe-area-context";

export default function GroupDetails({ route }) {
  const navigation = useNavigation();

  const { group_id, group_name, currentBalance: initialBalance } = route.params;
  console.log(`Group Name: ${group_name}`);

  const [currentBalance, setCurrentBalance] = useState(0.0);
  // const [groupDetails, setGroupDetails] = useState({});
  const [transactions, setTransactions] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   fetchGroupDetails();
  //   fetchTransactions();
  // }, []);

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("http://192.168.0.112/expensepal_api/getGroupDetails.php", {
        params: { group_id }
      })
      console.log(response.data.group_expense);
      setTransactions(response.data.group_expense)

    } catch (error) {
      console.error("Error fetching group expense details:", error);
      Alert.alert("Error", "Something went wrong while fetching group expense data.");
    }
  }

  // const fetchGroupDetails = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://192.168.0.112/expensepal_api/getGroupDetails.php",
  //       {
  //         params: { group_id },
  //       }
  //     );
  //     setGroupDetails(response.data);
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error("Error fetching group details:", error);
  //   }
  // };

  // const fetchTransactions = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://192.168.0.112/expensepal_api/getTransactions.php",
  //       {
  //         params: { group_id },
  //       }
  //     );
  //     setTransactions(response.data);
  //   } catch (error) {
  //     console.error("Error fetching transactions:", error);
  //   }
  // };

  useFocusEffect(
    React.useCallback(() => {
      fetchTransactions()
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("Group");
        return true;
      };

      const subscription = navigation.addListener("beforeRemove", (e) => {
        if (e.data.action.type === "GO_BACK") {
          e.preventDefault();
          onBackPress();
        }
      });

      return () => {
        subscription();
      };
    }, [navigation])
  );

  const tripGroupDetails = {
    currentBalance: 150.0,
    transactions: [
      {
        category: "Food & Drinks",
        expense_name: "Dinner",
        amount: 50.0,
        date: "2025-01-10",
        description: "Dinner with group",
      },
      {
        category: "Transport",
        expense_name: "Grab",
        amount: 30.0,
        date: "2025-01-9",
        description: "",
      },
      {
        category: "Food & Drinks",
        expense_name: "Dinner",
        amount: 120.0,
        date: "2025-01-12",
        description: "No comments",
      },
    ],
  };

  // useEffect(() => {
  //   const group = route.params?.group_name || "Default Group Name";
  //     setCurrentBalance(tripGroupDetails.currentBalance);
  //     setTransactions(tripGroupDetails.transactions);

  // }, [route.params]);

  const handleGroupNamePress = () => {
    navigation.navigate("GroupMembers", { group_id }); //group_name: groupDetails.group_id });
  };

  const handleBalancePress = () => {
    navigation.navigate("CurrentBalance", {
      group_id,
      group_name,
      currentBalance,
      // group_name: groupDetails.group_id,
      // currentBalance: groupDetails.currentBalance,
      // group_id: group_id,
    });
  };

  const handleSettleUpPress = () => {
    navigation.navigate("SettleUp", { group_id, group_name }); //group_name: groupDetails.group_id });
  };

  const handleAddExpensePress = () => {
    navigation.navigate("AddGroupExpense", {
      group_id,
      group_name,
      // group_name: groupDetails.group_id,
    });
  };

  const handleTransactionPress = (group_expense_id) => {
    navigation.navigate("GroupExpenseTransactionList", { group_expense_id });
  };

  // if (isLoading) {
  //   return <Text>Loading...</Text>;
  // }

  return (
    <View style={styles.container}>
      <View style={styles.overviewContainer}>
        <TouchableOpacity onPress={handleGroupNamePress}>
          <Text style={styles.groupName}>{group_name}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleBalancePress}>
          <Text style={styles.balanceText}>
            Current Balance: RM
            {currentBalance.toFixed(2) || "0.00"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* <View style={styles.buttonContainer}>
        <Button title="Settle Up" onPress={handleSettleUpPress} /> */}
      <TouchableOpacity
        style={sharedStyles.button}
        onPress={handleSettleUpPress}
      >
        <Text style={sharedStyles.buttonText}>Settle Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={sharedStyles.button}
        onPress={handleAddExpensePress}
      >
        <Text style={sharedStyles.buttonText}>Add Expense</Text>
      </TouchableOpacity>
      {/* <Button title="Add Group Expense" onPress={handleAddExpensePress} /> */}
      {/* </View> */}

      <ScrollView style={styles.transactionListContainer}>
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleTransactionPress(transaction.id)}
            >
              <View style={styles.transactionItem}>
                <Text style={styles.transactionCategory}>
                  Category: {transaction.category}
                </Text>
                <Text style={styles.transactionExpenseName}>
                  Expense Name: {transaction.expense_name}
                </Text>
                <Text style={styles.transactionAmount}>
                  Amount: RM{Number(transaction.expense_amount).toFixed(2)}
                </Text>
                <Text style={styles.transactionDate}>
                  Date: {transaction.date}
                </Text>
                <Text style={styles.transactionDescription}>
                  Description: {transaction.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noTransactionText}>
            No transactions available for this group.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E1FFD4",
  },
  overviewContainer: {
    marginBottom: 20,
  },
  groupName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007BFF",
  },
  balanceText: {
    fontSize: 18,
    marginTop: 10,
    color: "#333",
  },
  transactionListContainer: {
    marginTop: 20,
  },
  transactionItem: {
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  transactionDetails: {
    fontSize: 14,
    color: "#666",
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginTop: 5,
  },
  noTransactionText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
});
