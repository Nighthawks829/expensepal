import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import sharedStyles from "./styles";

export default function CurrentBalance({ route, navigation }) {
  const { currentBalance, group_id, group_name } = route.params;
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [requestAmount, setRequestAmount] = useState("");

  useEffect(() => {
    // fetchCurrentBalance();
  }, []);

  // const fetchCurrentBalance = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://192.168.0.112/expensepal_api/getCurrentBalance.php"
  //     );
  //     setBalance(response.data.balance);
  //   } catch (error) {
  //     console.error("Error fetching balance:", error);
  //   }
  // };

  const handleTopUp = () => {
    // async () => {
    if (amount && parseFloat(amount) > 0) {
      navigation.replace("OnlinePayment", {
        group_id,
        group_name,
        topUpAmount: parseFloat(amount),
        currentBalance,
      });
      setAmount("");
    } else {
      alert("Please enter a valid amount to top-up.");
    }
    console.log(`Top-up amount: RM ${parseFloat(amount)}`);

    // try {
    //   await axios.post(
    //     "http://192.168.0.112/expensepal_api/topUpBalance.php",
    //     { amount: parseFloat(amount) }
    //   );
    //   fetchCurrentBalance();
    //   setAmount("");
    // } catch (error) {
    //   console.error("Error topping up:", error);
    // }
  };

  console.log("Navigating to OnlinePayment with params:", {
    group_id,
    group_name,
    currentBalance,
  });

  const handleRequestFunds = () => {
    if (requestAmount && parseFloat(requestAmount) > 0) {
      console.log(
        `Requesting RM ${parseFloat(requestAmount)} from group members.`
      );
      // axios.post("http://192.168.0.112/expensepal_api/requestFunds.php", {
      //   group_id, amount: parseFloat(requestAmount)
      // })
      // .then(response => alert("Fund request sent to members."))
      // .catch(error => console.error("Error requesting funds:", error));

      setRequestAmount("");
    } else {
      alert("Please enter a valid amount to request.");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Current Balance: RM{currentBalance.toFixed(2)}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter amount to top-up"
        value={amount}
        keyboardType="numeric"
        onChangeText={setAmount}
      />
      <TouchableOpacity
        style={[sharedStyles.button, { opacity: amount > 0 ? 1 : 0.6 }]}
        onPress={handleTopUp}
        disabled={amount <= 0}
      >
        <Text style={sharedStyles.buttonText}>Top-Up</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Enter amount to request from group"
        value={requestAmount}
        keyboardType="numeric"
        onChangeText={setRequestAmount}
      />
      <TouchableOpacity
        style={[sharedStyles.button, { opacity: requestAmount > 0 ? 1 : 0.6 }]}
        onPress={handleRequestFunds}
        disabled={requestAmount <= 0}
      >
        <Text style={sharedStyles.buttonText}>Request Funds</Text>
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
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});
