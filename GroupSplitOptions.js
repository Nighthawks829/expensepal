import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import sharedStyles from "./styles";
import axios from "axios";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { UserContext } from "./UserContext";

export default function GroupSplitOptions({ route, navigation }) {
  const { user } = useContext(UserContext);
  const [splitMethod, setSplitMethod] = useState("equal");
  const [participants, setParticipants] = useState([])
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [splitDetails, setSplitDetails] = useState([]);
  const [payer, setPayer] = useState("");
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [payAmount, setPayAmount] = useState([]);
  const [groupExpenseId, setGroupExpenseId] = useState("")

  const { group_id, group_name, expenseName, category, description, date } = route.params;

  // const participants = [
  //   { username: "beeleng", user_id: 1 },
  //   { username: "Hannah", user_id: 2 },
  //   { username: "test", user_id: 3 },
  // ];

  useEffect(() => {
    if (groupExpenseId !== "" || groupExpenseId !== null) {
      handleAddGroupMemberExpense()
    }
  }, [groupExpenseId])

  useEffect(() => {
    console.log(payAmount);
  }, [payAmount])


  const getGroupMember = async () => {
    try {

      const response = await axios.get("http://192.168.0.112/expensepal_api/getGroupsMember.php", {
        params: { group_id: group_id },
      })
      if (response.data.success) {
        setParticipants(response.data.users);
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Failed to fetch user details."
        );
      }
    } catch (error) {
      console.error("Error fetching group member details:", error);
      Alert.alert("Error", "Something went wrong while fetching group member data.");
    }
  }

  const handleAddGroupExpense = async () => {
    try {
      const response = await axios.post("http://192.168.0.112/expensepal_api/addGroupExpense.php", {
        user_id: user.user_id,
        group_id: parseFloat(group_id),
        payer_id: parseFloat(payer),
        expense_name: expenseName,
        expense_amount: expenseAmount,
        category: category,
        date: date,
        description: description,
        split_method: splitMethod,
      })
      console.log(response.data);

      setGroupExpenseId(response.data.record_id);
    } catch (error) {
      console.error("Error add group expense:", error);
      Alert.alert("Error", "Something went wrong while add group expense.");
    }
  }

  const handleAddGroupMemberExpense = async () => {
    try {
      console.log("Group Expense Id", groupExpenseId);
      const response = await axios.post("http://192.168.0.112/expensepal_api/addGroupMemberExpense.php", {
        group_expense_id: groupExpenseId,
        user_id: user.user_id,
        pay_amount: payAmount,
        status: false,
      })
      console.log(response.data);
    } catch (error) {
      console.error("Error add group member expense:", error);
      Alert.alert("Error", "Something went wrong while add group member expense.");
    }
  }

  useEffect(() => {
    getGroupMember();
  }, [])

  const handleSplitMethodChange = (method) => {
    setSplitMethod(method);
    setSplitDetails([]);
    setSelectedParticipants([]);
  };

  const toggleParticipantSelection = (participant) => {
    if (selectedParticipants.includes(participant.user_id)) {
      setSelectedParticipants(
        selectedParticipants.filter((id) => id !== participant.user_id)
      );
    } else {
      setSelectedParticipants([...selectedParticipants, participant.user_id]);
    }
  };

  const updateExactAmount = (userId, amount) => {
    setSplitDetails((prevDetails) => {
      const updatedDetails = prevDetails.filter(
        (item) => item.user_id !== userId
      );
      updatedDetails.push({
        user_id: userId,
        amount: parseFloat(amount) || 0,
      });
      return updatedDetails;
    });
  };

  const updatePercentage = (userId, percentage) => {
    setSplitDetails((prevDetails) => {
      const updatedDetails = prevDetails.filter(
        (item) => item.user_id !== userId
      );
      updatedDetails.push({
        user_id: userId,
        percentage: parseFloat(percentage) || 0,
      });
      return updatedDetails;
    });
  };

  const renderEqualSplit = () => {
    const selectedCount = selectedParticipants.length;
    const share = selectedCount > 0 ? expenseAmount / selectedCount : 0;

    return (
      <View style={styles.splitContainer}>
        <Text>Select participants to split equally:</Text>
        {participants.map((participant) => (
          <TouchableOpacity
            key={participant.user_id}
            style={[
              styles.participantButton,
              selectedParticipants.includes(participant.user_id) &&
              styles.selectedParticipant,
            ]}
            onPress={() => toggleParticipantSelection(participant)}
          >
            <Text>{participant.username}</Text>
          </TouchableOpacity>
        ))}
        {selectedCount > 0 && (
          <Text style={styles.shareText}>
            Each participant owes: {share.toFixed(2)}
          </Text>
        )}
      </View>
    );
  };

  const renderExactAmountSplit = () => (
    <View style={styles.splitContainer}>
      <Text>Enter exact amount for each participant:</Text>
      {participants.map((participant) => (
        <View key={participant.user_id} style={styles.amountRow}>
          <Text>{participant.username}</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="Amount"
            keyboardType="numeric"
            onChangeText={(text) =>
              updateExactAmount(participant.user_id, text)
            }
          />
        </View>
      ))}
    </View>
  );

  const renderPercentageSplit = () => (
    <View style={styles.splitContainer}>
      <Text>Set the percentage for each participant:</Text>
      {participants.map((participant) => (
        <View key={participant.user_id} style={styles.percentageRow}>
          <Text>{participant.username}</Text>
          <TextInput
            style={styles.percentageInput}
            placeholder="Percentage"
            keyboardType="numeric"
            onChangeText={(text) => updatePercentage(participant.user_id, text)}
          />
        </View>
      ))}
      {splitDetails.length > 0 && (
        <Text style={styles.totalPercentage}>
          Total Percentage:{" "}
          {splitDetails.reduce((acc, curr) => acc + curr.percentage, 0)}%
        </Text>
      )}
    </View>
  );

  const renderPayerSelection = () => (
    <View style={styles.payerContainer}>
      <Text>Select the payer:</Text>
      {participants.map((participant) => (
        <TouchableOpacity
          key={participant.user_id}
          style={[
            styles.payerButton,
            payer === participant.user_id && styles.selectedPayer,
          ]}
          onPress={() => setPayer(participant.user_id)}
        >
          <Text>{participant.username}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const validateAndProceed = () => {
    if (splitMethod === "equal" && selectedParticipants.length === 0) {

      Alert.alert("Error", "Please select at least one participant.");
      return;
    } else if (splitMethod === 'equal') {
      const amountPerParticipant = (expenseAmount / selectedParticipants.length).toFixed(2);
      selectedParticipants.forEach(participant => {
        setPayAmount(prevPayAmount => [
          ...prevPayAmount,
          { user_id: participant, amount: parseFloat(amountPerParticipant) }
        ])
      })
    }

    if (
      splitMethod === "exact" &&
      splitDetails.reduce((total, detail) => total + detail.amount, 0) !==
      expenseAmount
    ) {
      Alert.alert("Error", "The total amount must equal the expense amount.");
      return;
    } else if (splitMethod === "exact") {
      setPayAmount(splitDetails)
    }

    if (splitMethod === "percentages") {
      const totalPercentage = splitDetails.reduce(
        (acc, curr) => acc + curr.percentage,
        0
      );
      if (totalPercentage !== 100) {
        Alert.alert(
          "Error",
          "The total percentage for participants must equal 100%."
        );
        return;
      } else if (totalPercentage === 100) {
        splitDetails.forEach(detail => {
          const amount = (expenseAmount * detail.percentage) / 100;
          setPayAmount(prevPayAmount => [
            ...prevPayAmount,
            { user_id: detail.user_id, amount: parseFloat(amount.toFixed(2)) }
          ])
        })
      }
    }

    // console.log(payAmount);


    if (!payer) {
      Alert.alert("Error", "Please select a payer.");
      return;
    }
    handleAddGroupExpense();
    navigation.goBack();

    // Alert.alert(
    //   "Split Saved",
    //   `Split Method: ${splitMethod}\nPayer: ${payer}\nSplit Details: ${JSON.stringify(
    //     payAmount
    //   )}`
    // );
  };

  return (
    <ScrollView>

      <View style={styles.container}>
        <TextInput
          style={styles.amountInput}
          placeholder="Enter total expense amount"
          keyboardType="numeric"
          onChangeText={(text) => setExpenseAmount(parseFloat(text) || 0)}
        />
        <ScrollView horizontal contentContainerStyle={styles.optionContainer}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleSplitMethodChange("equal")}
          >
            <Text>Equally</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleSplitMethodChange("exact")}
          >
            <Text>By Exact Amount</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleSplitMethodChange("percentages")}
          >
            <Text>By Percentage</Text>
          </TouchableOpacity>
        </ScrollView>

        {splitMethod === "equal" && renderEqualSplit()}
        {splitMethod === "exact" && renderExactAmountSplit()}
        {splitMethod === "percentages" && renderPercentageSplit()}

        <View style={styles.separator} />

        {renderPayerSelection()}

        <TouchableOpacity
          style={sharedStyles.button}
          onPress={validateAndProceed}
        >
          <Text style={sharedStyles.buttonText}>Save Split</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E1FFD4",
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  optionButton: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  splitContainer: {
    marginBottom: 20,
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  amountInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    width: "100%",
    textAlign: "left",
  },
  percentageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  percentageInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    width: 100,
    textAlign: "right",
  },
  participantButton: {
    marginVertical: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  selectedParticipant: {
    backgroundColor: "#B2F1C9",
  },
  shareText: {
    marginTop: 10,
    fontWeight: "bold",
  },
  payerContainer: {
    // height:1,
    marginBottom: 20,
  },
  payerButton: {
    marginVertical: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  selectedPayer: {
    backgroundColor: "#D4E8FF",
  },
  saveButton: {
    padding: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 20,
  },
});
