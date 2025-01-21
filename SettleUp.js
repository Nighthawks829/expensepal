import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import sharedStyles from "./styles";
import { UserContext } from "./UserContext";

export default function SettleUp({ route, navigation }) {
  const { user } = useContext(UserContext);
  const { group_id, group_name, currentBalance } = route.params;
  const [settlements, setSettlements] = useState([]);
  const [amount, setAmount] = useState("");
  const [memberId, setMemberId] = useState("");
  const [newBalance, setNewBalance] = useState({});
  const [selectedDebt, setSelectedDebt] = useState(null);

  const tripSettlements = [
    { id: "1", name: "beeleng", owedBy: "Hannah", oweAmount: 200 },
    { id: "2", name: "Hannah", owedBy: "beeleng", oweAmount: 120 },
    { id: "3", name: "test", owedBy: "Hannah", oweAmount: 80 },
  ];

  useEffect(() => {
    fetchSettlements();
  }, [])

  const fetchSettlements = async () => {
    try {
      const response = await axios.get(
        "http://192.168.0.112/expensepal_api/getSettlements.php", {
        params: {
          user_id: user.user_id,
          group_id: group_id,
        }
      }
      );
      console.log(response.data.settlements);
      setSettlements(response.data.settlements);
    } catch (error) {
      console.error("Error fetching settlements:", error);
    }
  };



  const handleSettleUp = async () => {

    const amountToSettle = parseFloat(amount);
    const oweAmount = parseFloat(selectedDebt.pay_amount)
    if (selectedDebt && amountToSettle > 0 && amountToSettle <= oweAmount) {
      console.log('Valid Amount');
    } else {
      alert("Enter a valid amount.");
      return;
    }

    try {
      const response = await axios.post("http://192.168.0.112/expensepal_api/addSettlement.php", {
        group_expense_id: selectedDebt.group_expense_id,
        user_id: user.user_id,
        amount: amountToSettle,
      })

      console.log(response.data);
      fetchSettlements();
    } catch (error) {
      console.error("Add Settlement Error:", error);
      Alert.alert("Error", "Unable to add settlement. Please try again.");
    }

    // if (
    //   selectedDebt &&
    //   amountToSettle > 0 &&
    //   amountToSettle <= selectedDebt.oweAmount
    // ) {
    //   setSettlements((prev) =>
    //     prev.map((debt) =>
    //       debt.id === selectedDebt.id
    //         ? { ...debt, oweAmount: debt.oweAmount - amountToSettle }
    //         : debt
    //     )
    //   );
    //   // navigation.navigate("GroupDetails", { group_id, currentBalance });
    //   setAmount("");
    //   setSelectedDebt(null);
    // } else {
    //   alert("Enter a valid amount.");
    // }
  };

  // try {
  //   await axios.post("http://192.168.0.112/expensepal_api/settleUp.php", {
  //     memberId,
  //     amount: parseFloat(amount),
  //   });
  //   fetchSettlements();
  //   setAmount("");
  //   setMemberId("");
  // } catch (error) {
  //   console.error("Error settling up:", error);
  // }
  // };

  const renderDebtItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => setSelectedDebt(item)}
      style={styles.debtItem}
    >
      <Text style={styles.debtText}>
        {user.username} owes {item.payer_username} RM {Number(item.pay_amount).toFixed(2)}
      </Text>
    </TouchableOpacity>
  );

  // useEffect(() => {
  //   if (route.params?.updatedSettlements) {
  //     setSettlements(route.params.updatedSettlements);
  //   }
  // }, [route.params?.updatedSettlements]);

  return (
    <View style={styles.container}>
      {settlements.length > 0 && settlements.some(item => item.payer_id !== user.user_id && item.pay_amount !== 0) ? (
        <FlatList
          data={settlements}
          keyExtractor={(item) => item.group_member_expense_id.toString()}
          renderItem={renderDebtItem}
        />
      ) : (
        <Text>No settlements to display.</Text>
      )}

      {selectedDebt && (
        <View style={styles.settleUpContainer}>
          <Text>
            Settling: {user.username} owes {selectedDebt.payer_username} RM{" "}
            {selectedDebt.pay_amount}
          </Text>
          <TextInput
            placeholder="Amount to Settle"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.input}
          />
          <TouchableOpacity
            onPress={handleSettleUp}
            style={sharedStyles.button}
          >
            <Text style={sharedStyles.buttonText}>Settle Up</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* <TextInput
        placeholder="Enter Member ID"
        value={memberId}
        onChangeText={setMemberId}
      />
      <TextInput
        placeholder="Enter Amount"
        value={amount}
        keyboardType="numeric"
        onChangeText={setAmount}
      />
      <Button title="Settle Up" onPress={handleSettleUp} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E1FFD4",
  },
  debtItem: {
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { wodth: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  debtText: {
    fontSize: 16,
    color: "#333",
  },
  noSettlementsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
  settleUpContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    paddingLeft: 10,
    marginVertical: 10,
  },
});
