import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { UserContext } from "./UserContext";
import axios from "axios";

export default function SplitOptions({ route, navigation }) {
  const { user } = useContext(UserContext);
  const { friendId,
    friendUsername,
    expenseName,
    expenseAmount,
    expenseCategory,
    date,
    description } = route.params;

  const [splitMethod, setSplitMethod] = useState("equal");
  const [splitDetails, setSplitDetails] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [payer, setPayer] = useState("");
  const [payerDetails, setPayerDetails] = useState({
    single: true,
    payers: [],
  });

  const [userExactAmount, setUserExactAmount] = useState(0)
  const [friendExactAmount, setFriendExactAmount] = useState(0)
  const [remainingAmount, setRemainingAmount] = useState(0)

  const [userPercentage, setUserPercentage] = useState(0)
  const [friendPercentage, setFriendPercentage] = useState(0)
  const [remainingPercentage, setRemainingPercentage] = useState(100)

  const [userShare, setUserShare] = useState(0)
  const [friendShare, setFriendShare] = useState(0)


  const participants = [
    { username: user.username, user_id: user.user_id },
    { username: friendUsername, user_id: friendId },
  ];
  // const [participants, setParticipants] = useState([]);
  // const [friendUsername, setFriendUsername] = useState("");
  //   const [splitMethod, setSplitMethod] = useState("");

  // useEffect(() => {
  //   // setParticipants([
  //   //   { username: user.username, user_id: user.user_id },
  //   //   { username: friendUsername, user_id: friendUsername },
  //   //   // user.username, // Add user's username
  //   //   // route.params.friendUsername, // Add friend's username
  //   // ]);
  //   if (splitMethod === "equal") {
  //     console.log("Equal Method")
  //     setUserShare(Number(expenseAmount / 2).toFixed(2))
  //     setFriendShare(Number(expenseAmount / 2).toFixed(2))
  //   } else if (splitMethod === "amounts") {

  //   }
  // }, [splitMethod]);

  useEffect(()=>{
    console.log(route.params);
  },[])

  useEffect(() => {
    setRemainingAmount(expenseAmount - userExactAmount - friendExactAmount);
  }, [userExactAmount, friendExactAmount])

  useEffect(() => {
    setRemainingPercentage(100 - userPercentage - friendPercentage);
  }, [userPercentage, friendPercentage])

  useEffect(() => {
    if (userShare != 0 && friendShare != 0) {
      handleAddSplitExpense()
    }
  }, [userShare, friendShare])


  const handleSplitMethodChange = (method) => {
    setSplitMethod(method);
    // setSplitDetails([]);
    // setSelectedParticipants([]);
  };

  const toggleParticipantSelection = (participant) => {
    setSelectedParticipants((prev) =>
      prev.includes(participant.user_id)
        ? prev.filter((id) => id != participant.user_id)
        : [...prev, participant.user_id]
    );
    // if (selectedParticipants.includes(participant.user_id)) {
    //   setSelectedParticipants(
    //     selectedParticipants.filter((id) => id !== participant.user_id)
    //   );
    // } else {
    //   setSelectedParticipants([...selectedParticipants, participant.user_id]);
    // }
  };

  const renderEqualSplit = () => {
    const selectedCount = selectedParticipants.length;
    const share = selectedCount > 0 ? expenseAmount / selectedCount : 0;

    // const equalShare = expenseAmount / 2;

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
            Each participant owes: RM {share.toFixed(2)}
          </Text>
        )}
      </View>
    );
  };

  const renderExactAmountSplit = () => {
    // setRemainingAmount(expenseAmount);
    // const totalEntered = splitDetails.reduce(
    //   (sum, item) => sum + (item.amount || 0),
    //   0
    // );
    // const remainingAmount = expenseAmount - totalEntered;
    // if (!participants || participants.length === 0) {
    //   return <Text>No participants available</Text>;
    // }

    return (
      <View style={styles.splitContainer}>
        {/* {participants.map((participant, index) => (
          <View key={index} style={styles.inputRow}>
            <Text>{participant.username}</Text>
            <TextInput
              style={styles.input}
              placeholder="Amount"
              keyboardType="numeric"
              onChangeText={(value) => {
                const amount = parseFloat(value) || -1;
                const updatedDetails = [...splitDetails];
                updatedDetails[index] = { ...participant, amount };
                setSplitDetails(updatedDetails);
              }}
            />
          </View>
        ))} */}
        <View style={styles.inputRow}>
          <Text>{user.username}</Text>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
            onChangeText={(value) => {
              setUserExactAmount(value);
              setRemainingAmount(expenseAmount - userExactAmount - friendExactAmount)
            }}

          />
        </View>
        <View style={styles.inputRow}>
          <Text>{friendUsername}</Text>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
            onChangeText={(value) => {
              setFriendExactAmount(value);
              setRemainingAmount(expenseAmount - userExactAmount - friendExactAmount)
            }}

          />
        </View>
        <Text style={styles.remainingAmountText}>
          Remaining Amount: RM {remainingAmount.toFixed(2)}
        </Text>
      </View>
    );
  };

  const renderPercentageSplit = () => {
    if (splitDetails.length != participants.length) {
      setSplitDetails(
        participants.map((participant) => ({
          user_id: participant.user_id,
          username: participant.username,
          percentage: 0,
        }))
      );
    }

    const totalPercentage = splitDetails.reduce(
      (sum, item) => sum + (item.percentage || 0),
      0
    );
    // if (!participants || participants.length === 0) {
    //   return <Text>No participants available</Text>;
    // }

    return (
      <View style={styles.splitContainer}>
        {/* {splitDetails.map((participant, index) => (
          <View key={participant.user_id} style={styles.inputRow}>
            <Text>{participant.username}</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter %"
              keyboardType="numeric"
              value={String(participant.percentage || "")}
              onChangeText={(value) => {
                
                
              }}
            />
          </View>
        ))} */}
        <View style={styles.inputRow}>
          <Text>{user.username}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter %"
            keyboardType="numeric"
            onChangeText={(value) => {
              setUserPercentage(value)
            }}
          />
        </View>
        <View style={styles.inputRow}>
          <Text>{friendUsername}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter %"
            keyboardType="numeric"
            onChangeText={(value) => {
              setFriendPercentage(value)
            }}
          />
        </View>

        {remainingPercentage >= 0 && (
          <Text style={styles.remainingAmountText}>
            Remaining Percentage: {remainingPercentage.toFixed(2)}%
          </Text>
        )}


        {remainingPercentage < 0 && (
          <Text style={styles.errorText}>
            Total percentage exceeds 100%! Please adjust.
          </Text>
        )}
      </View>
    );
  };

  const renderPayerSelection = () => {
    return (
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
  };

  const renderSplitOptions = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.optionContainer}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleSplitMethodChange("equal")}
        >
          <Text>Equal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleSplitMethodChange("amounts")}
        >
          <Text>Exact Amount</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleSplitMethodChange("percentages")}
        >
          <Text>Percentage</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  // const handleSplitInput = (user_id, value, key) => {
  //     setSplitDetails((details) => {
  //         const updated = details.filter(item => item.user_id !== user_id);
  //         updated.push({ user_id, [key]: value });
  //         return updated;
  //     });
  // };

  // const renderSplitInputs = () => {
  //     if (!participants || participants.length === 0) {
  //         return <Text>No participants available for splitting</Text>
  //     }

  //     if (splitMethod === 'amounts') {
  //         return participants.map((user) => (
  //             <View key={user.user_id} style={styles.inputRow}>
  //                 <Text>{user.username}</Text>
  //                 <TextInput
  //                     style={styles.input}
  //                     placeholder="Amount"
  //                     keyboardType="numeric"
  //                     onChangeText={(value) =>
  //                         handleSplitInput(user.user_id, parseFloat(value) || 0, 'amount')
  //                     }
  //                 />
  //             </View>
  //         ));
  //     }
  //     if (splitMethod === 'percentages') {
  //         return participants.map((user) => (
  //             <View key={user.user_id} style={styles.inputRow}>
  //                 <Text>{user.username}</Text>
  //                 <TextInput
  //                     style={styles.input}
  //                     placeholder="%"
  //                     keyboardType="numeric"
  //                     onChangeText={(value) =>
  //                         handleSplitInput(user.user_id, parseFloat(value) || 0, 'percentage')
  //                     }
  //                 />
  //             </View>
  //         ));
  //     }

  //     return <Text>Splitting equally among all participants</Text>;
  // };

  // const renderPayerOptions = () => {
  //     if (!participants || participants.length === 0) {
  //         return <Text>No participants available to choose payers</Text>
  //     }

  //     return (
  //         <>
  //             <Text>Who paid for this expense?</Text>
  //             <TouchableOpacity
  //                 style={styles.optionButton}
  //                 onPress={() => setPayerDetails({ single: true, payers: [] })}
  //             >
  //                 <Text>Single Payer</Text>
  //             </TouchableOpacity>
  //             {payerDetails.single &&
  //                 participants.map((user) => (
  //                     <TouchableOpacity
  //                         key={user.user_id}
  //                         style={styles.optionButton}
  //                         onPress={() => setPayerDetails({ single: true, payers: [user] })}
  //                     >
  //                         <Text>{user.username}</Text>
  //                     </TouchableOpacity>
  //                 ))}
  //             <TouchableOpacity
  //                 style={styles.optionButton}
  //                 onPress={() => setPayerDetails({ single: false, payers: [] })}
  //             >
  //                 <Text>Multiple Payers</Text>
  //             </TouchableOpacity>
  //             {!payerDetails.single &&
  //                 participants.map((user, index) => (
  //                     <View key={user.user_id} style={styles.inputRow}>
  //                         <Text>{user.username}</Text>
  //                         <TextInput
  //                             style={styles.input}
  //                             placeholder="Paid Amount"
  //                             keyboardType="numeric"
  //                             onChangeText={(value) =>
  //                                 setPayerDetails((details) => {
  //                                     const updated = {...details};
  //                                     updated.payers[index] = {user_id: user.user_id, paid: parseFloat(value) || 0};
  //                                     return updated;
  //                                 })
  //                             }
  //                         />
  //                     </View>
  //                 ))}
  //         </>
  //     );
  // };

  const validateAndProceed = () => {
    let totalSplit = splitDetails.reduce(
      (sum, detail) => sum + (detail.amount || 0),
      0
    );
    if (!payer) {
      Alert.alert("Error", "Please select a payer.");
      return;
    }

    if (splitMethod === "equal") {
      const selectedCount = selectedParticipants.length;
      if (selectedCount === 0) {
        Alert.alert("Error", "Please select at least one participant.");
        return;
      } else {
        setUserShare((expenseAmount / 2).toFixed(2))
        setFriendShare((expenseAmount / 2).toFixed(2))
      }
      // const share = expenseAmount / selectedParticipants.length;
      // // const share = expenseAmount / selectedCount;
      // // totalSplit = selectedCount * share;
      // setSplitDetails(
      //   participants.map((participant) => ({
      //     ...participant,
      //     amount: selectedParticipants.includes(participant.user_id)
      //       ? share
      //       : 0,
      //   }))
      // );
    } else if (splitMethod === "amounts") {
      totalSplit = Number(userExactAmount) + Number(friendExactAmount)

      if (totalSplit != expenseAmount) {
        alert("The total split amounts do not match the expense amount.");
        return;
      } else {
        setUserShare(userExactAmount)
        setFriendShare(friendExactAmount)
      }
    } else if (splitMethod === "percentages") {
      const totalPercentage = Number(userPercentage) + Number(friendPercentage)
      if (totalPercentage != 100) {
        alert("The percentages do not add up to 100%");
        return;
      } else {
        setUserShare(Number(expenseAmount * Number(userPercentage) / 100))
        setFriendShare(Number(expenseAmount * Number(friendPercentage) / 100))
      }
    }



    Alert.alert("Split Successful", "The expense split has been saved.");

    // console.log("363totalSplit", totalSplit);
    // console.log("364expenseAmount", expenseAmount);
    // if (totalSplit === +expenseAmount) {
    //   navigation.navigate("SplitExpense", {
    //     splitDetails,
    //     payerDetails,
    //     splitMethod,
    //     expenseAmount,
    //     friendUsername,
    //   });
    // } else {
    //   Alert.alert("Error", "Split calculation error. Check the inputs.");
    // }
  };

  const handleAddSplitExpense = async () => {
    try {
      const response = await axios.post("http://192.168.0.112/expensepal_api/addSplitExpense.php", {
        user_id: user.user_id,
        friend_id: friendId,
        payer_id:payer,
        amount: expenseAmount,
        user_share: userShare,
        friend_share: friendShare,
        expense_name:expenseName,
        expense_category:expenseCategory,
        description: description,
        status: "unpaid",
      })
      console.log(response.data);
      navigation.pop(2);
    } catch (error) {
      console.error('Failed to add split expense:', error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Split Method</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.optionContainer}
      >
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleSplitMethodChange("equal")}
        >
          <Text>Equal</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleSplitMethodChange("amounts")}
        >
          <Text>Exact Amount</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleSplitMethodChange("percentages")}
        >
          <Text>Percentage</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* <TouchableOpacity style={styles.optionButton} onPress={() => handleSplitMethodChange('equal')}>
                <Text>Split Equally</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleSplitMethodChange('amounts')}>
                <Text>Split by Exact Amounts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} onPress={() => handleSplitMethodChange('percentages')}>
                <Text>Split by Percentages</Text>
            </TouchableOpacity>
            {renderSplitInputs()}
            {renderPayerOptions()} */}
      {/* {renderSplitOptions()} */}
      <View style={styles.splitContent}>
        {splitMethod === "equal" && renderEqualSplit()}
        {splitMethod === "amounts" && renderExactAmountSplit()}
        {splitMethod === "percentages" && renderPercentageSplit()}
      </View>
      {renderPayerSelection()}
      <Button title="Proceed" onPress={validateAndProceed} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#E1FFD4",
  },
  title: {
    fontSize: 20,
    textAlign: "left",
    marginBottom: 16,
  },
  optionContainer: {
    position: "static",
    right: 16, // Adjust to position horizontally
    top: 36, // Adjust to position vertically (below the text)
    flexDirection: "column", // Align buttons vertically
    //alignItems: 'flex-end',  // Align to the right
    //zIndex: 10,
    //flexDirection: 'row',
    //justifyContent: 'center',
    marginVertical: 16,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 5,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  splitContainer: {
    marginVertical: 10,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  input: {
    marginLeft: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 4,
    flex: 1,
  },
  remainingAmountText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  participantButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
  },
  selectedParticipant: {
    backgroundColor: "#c0f0c0",
  },
  payerContainer: {
    marginVertical: 16,
  },
  payerButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
  },
  selectedPayer: {
    backgroundColor: "#c0f0c0",
  },
  shareText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

// import React, { useState } from "react";
// import { View, Button, Text } from "react-native";

// export default function SplitOptions({ route, navigation }) {
//   const { expenseId } = route.params; // Expense ID passed from ExpenseForm

//   const [splitType, setSplitType] = useState("");

//   const handleSplitExpense = (type) => {
//     setSplitType(type);
//     console.log("Selected Split Type:", type);

//     // Proceed with the logic for different split types
//     // E.g., Split equally, by percentage, or by exact amounts
//     // Then, save the split details

//     navigation.goBack(); // Navigate back to the previous screen (ExpenseForm or other)
//   };

//   return (
//     <View>
//       <Text>Select Split Type</Text>
//       <Button
//         title="Split Equally"
//         onPress={() => handleSplitExpense("equal")}
//       />
//       <Button
//         title="Split by Percentage"
//         onPress={() => handleSplitExpense("percentage")}
//       />
//       <Button
//         title="Split by Amount"
//         onPress={() => handleSplitExpense("amount")}
//       />
//     </View>
//   );
// }
