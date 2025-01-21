import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function OnlinePayment({ route, navigation }) {
  const { topUpAmount, currentBalance, group_id, group_name } = route.params;
  const [paymentStatus, setPaymentStatus] = useState("pending");

  const handlePaymentSuccess = () => {
    // Assuming successful payment, update the balance
    const newBalance = currentBalance + topUpAmount;

    // Here you will call an API to update the user's balance in your database
    // Example: axios.post('your_api_endpoint_to_update_balance', { balance: newBalance });

    console.log(`Payment successful. New Balance: RM ${newBalance.toFixed(2)}`);

    // Navigate back to Current Balance screen or update state directly
    navigation.navigate("GroupDetails", {
      group_id,
      group_name,
      currentBalance: newBalance,
    });
  };

  console.log("Payment Screen Params:", {
    group_id,
    group_name, // Log the group_name to check its value
    topUpAmount,
    currentBalance,
  });

  return (
    <View style={styles.container}>
      <Text>Top-Up Amount: RM {topUpAmount}</Text>
      <Text>Current Balance: RM {currentBalance}</Text>

      <Text>Proceed to Payment Gateway</Text>
      {/* Replace this section with your actual payment gateway integration */}
      <Button title="Confirm Payment" onPress={handlePaymentSuccess} />
      <Text>Status: {paymentStatus}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E1FFD4",
  },
});
