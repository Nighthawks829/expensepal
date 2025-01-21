import React, { useContext, useEffect, useState, useSyncExternalStore } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { UserContext } from "./UserContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import sharedStyles from "./styles";

export default function AddGroupExpense({ route,navigation }) {
  const { user } = useContext(UserContext);
  const { group_id, group_name } = route.params;

  const [expenseName, setExpenseName] = useState("");
  const [category, setCategory] = useState("Food & Drinks");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false)

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  // const [amount, setAmount] = useState("");


  const handleAddExpense = () => {
    // if (!expenseName || !expenseAmount || !category || !date) {
    //   Alert.alert("Error", "Please fill in all fields.");
    //   return;
    // }

    navigation.navigate("GroupSplitOptions", {
      group_id,
      group_name,
      expenseName,
      // amount,
      date: date.toISOString().split("T")[0],
      category,
      description,
    });
    // async () => {
    // try {
    //   await axios.post(
    //     "http://192.168.0.112/expensepal_api/addGroupExpense.php",
    //     {
    //       description,
    //       amount: parseFloat(amount),
    //     }
    //   );
    //   setDescription("");
    //   setAmount("");
    // } catch (error) {
    //   console.error("Error adding expense:", error);
    // }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Expense Name"
        value={expenseName}
        onChangeText={setExpenseName}
      />
      {/* <TextInput
        placeholder="Enter Amount"
        value={amount}
        keyboardType="numeric"
        onChangeText={setAmount}
      /> */}
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Food & Drinks" value="Food & Drinks" />
        <Picker.Item label="Shopping" value="Shopping" />
        <Picker.Item label="Transport" value="Transport" />
        <Picker.Item label="Housing" value="Housing" />
        <Picker.Item label="Others" value="Others" />
      </Picker>

      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.datePicker}
      >
        <Text>{formatDate(date)}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
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

      <TouchableOpacity
        style={[sharedStyles.button]}
        onPress={handleAddExpense}
        // disabled={amount === ""}
      >
        <Text style={sharedStyles.buttonText}>Proceed to Split Options</Text>
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
    padding: 10,
    borderColor: "#48742C",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#48742C",
    borderRadius: 5,
    marginBottom: 15,
  },
  datePicker: {
    padding: 10,
    borderColor: "#48742C",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: "center",
  },
});
