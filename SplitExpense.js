import React, { useContext, useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { UserContext } from "./UserContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import sharedStyles from "./styles";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
// import { createExpense } from "./splitwiseApi";

export default function SplitExpense({ route, navigation }) {
  const { user } = useContext(UserContext);
  const { friendUsername, friendId } = route.params;

  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState(
    route.params.expenseAmount || ""
  );
  const [expenseCategory, setExpenseCategory] = useState("Food & Drinks");
  // const [splitMethod, setSplitMethod] = useState("equally");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [payer, setPayer] = useState(route.params.payer || null);
  const [splitMethod, setSplitMethod] = useState(
    route.params.splitMethod || null
  );

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };


  useEffect(() => {
  
  }, [])

  useEffect(() => {
    if (route.params) {
      const { payer: selectedPayer, splitMethod: selectedSplitMethod } =
        route.params;

      if (selectedPayer) {
        setPayer(selectedPayer);
      }
      if (selectedSplitMethod) {
        setSplitMethod(selectedSplitMethod);
      }
      const { splitDetails, payerDetails } = route.params;
    }
  }, [route.params]);

  const handleSplitExpense = async () => {
    console.log("expneseAmount:", expenseAmount);
    console.log("number?:", !isNaN(Number(expenseAmount)));
    if (!expenseName || !expenseAmount || !expenseCategory || !date) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.0.112/expensepal_api/splitExpense.php",
        {
          user_id: user.user_id,
          friendUsername: friendUsername,
          expenseName,
          amount: expenseAmount,
          category: expenseCategory,
          date: date.toISOString().split("T")[0],
          splitMethod,
          description,
        }
      );
      console.log(response.data);

      if (response.data.success) {
        Alert.alert("Success", "Expense hass been split!");
        setExpenseName("");
        setExpenseAmount("");
        setDescription("");
        navigation.goBack();
      } else {
        Alert.alert("Error", "Unable to split expense. Please try agian.");
      }
    } catch (error) {
      console.error("Error splitting expense:", error);
      Alert.alert("Error", "Unable to split expense. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Split Expense with {friendUsername}</Text>

      <TextInput
        style={styles.input}
        placeholder="Expense Name"
        value={expenseName}
        onChangeText={setExpenseName}
      />

      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={expenseAmount}
        onChangeText={setExpenseAmount}
        keyboardType="numeric"
      />

      <Picker
        selectedValue={expenseCategory}
        onValueChange={(itemValue) => setExpenseCategory(itemValue)}
        style={styles.underlineInput}
      >
        <Picker.Item label="Food & Drinks" value="Food & Drinks" />
        <Picker.Item label="Shopping" value="Shopping" />
        <Picker.Item label="Transport" value="Transport" />
        <Picker.Item label="Housing" value="Housing" />
        <Picker.Item label="Others" value="Others" />
      </Picker>

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.input}
      >
        <Text style={styles.underlineInput}>{formatDate(date)}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="calendar"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      {/* {payer && splitMethod && (
        <Text style={styles.buttonText}>
          Paid by {payer} and split {splitMethod}
        </Text>
      )} */}

      <TouchableOpacity
        style={[
          styles.inputButton,
          !expenseAmount || Number(expenseAmount) <= 0
            ? styles.disabledButton
            : styles.enabledButton,
        ]}
        onPress={() => {
          if (expenseAmount && Number(expenseAmount) > 0) {
            navigation.navigate("SplitOptions", {
              friendId,
              friendUsername,
              expenseName,
              expenseAmount,
              expenseCategory,
              date: formatDate(date),
              description,
            });
          }
        }}
        disabled={!expenseAmount || Number(expenseAmount) <= 0}
      >
        <Text style={styles.buttonText}>
          {/* Paid by {payer || user.username} and split {splitMethod || "equally"} */}
          Split Options
        </Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={sharedStyles.button}
        onPress={handleSplitExpense}
      >
        <Text style={sharedStyles.buttonText}>Confirm Split</Text>
      </TouchableOpacity> */}
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    padding: 10,
    borderColor: "#48742C",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  underlineInput: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 5,
    fontSize: 16,
  },
  splitInfo: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  inputButton: {
    padding: 10,
    borderColor: "#48742C",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F3F3",
  },
  enabledButton: {
    backgroundColor: "#F3F3F3",
    borderColor: "#48742C",
    opacity: 1,
  },
  disabledButton: {
    backgroundColor: "#ccc",
    borderColor: "#aaa",
    opacity: 0.6,
  },
  // button: {
  //     padding: 15,
  //     //marginBottom: 1,
  //     borderColor: '#48742C',
  //     borderRadius: 5,
  //     //backgroundColor: '#e0e0e0',
  //     alignItems: 'center',
  // },
  // selectedMethod: {
  //     backgroundColor: '#b0b0b0',
  // },
  buttonText: {
    fontSize: 16,
    color: "#48742C",
  },
});
