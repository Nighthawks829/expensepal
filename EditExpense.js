import React, { useContext, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ExpenseContext } from "./ExpenseContext";
import axios from "axios";
import sharedStyles from "./styles";
import { UserContext } from "./UserContext";
import { useNavigation } from "@react-navigation/native";

export default function EditExpense({ route }) {
  const { expense } = route.params;
  const { user } = useContext(UserContext);
  const { updateExpense, deleteExpense } = useContext(ExpenseContext);
  const navigation = useNavigation();

  const [expenseTitle, setExpenseTitle] = useState(expense.expense_title);
  const [amount, setAmount] = useState(expense.amount.toString());
  const [category, setCategory] = useState(expense.category);
  const [date, setDate] = useState(new Date(expense.date));
  const [comment, setComment] = useState(expense.notes);

  const [showDatePicker, setShowDatePicker] = useState(false);

  // const formatDate = (date) => {
  //     const day = date.getDate().toString().padStart(2, "0");
  //     const month = (date.getMonth() + 1).toString().padStart(2, "0");
  //     const year = date.getFullYear();
  //     return `${day}/${month}/${year}`;
  // };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}/${month}/${day}`;
  };

  const handleUpdate = async () => {
    try {
      const updatedExpense = {
        expense_id: expense.expense_id,
        expense_title: expenseTitle,
        amount: parseFloat(amount),
        category,
        date: formatDate(date),
        notes: comment || "",
      };

      const response = await axios.post(
        "http://192.168.0.112/expensepal_api/updateExpense.php",
        {
          user_id: user.user_id,
          ...updatedExpense,
        }
      );
      console.log(response);

      if (response.data.success) {
        Alert.alert("Success", response.data.message);
        updateExpense(updatedExpense);
        navigation.navigate("ExpenseList", { reload: true });
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to update expense. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      console.log(expense.expense_id);
      const response = await axios.post(
        "http://192.168.0.112/expensepal_api/deleteExpense.php",
        {
          user_id: user.user_id,
          expense_id: expense.expense_id,
        }
      );

      if (response.data.success) {
        Alert.alert("Success", response.data.message);
        navigation.goBack();
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to delete expense. Please try again.");
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Expense Title</Text>
      <TextInput
        style={styles.input}
        value={expenseTitle}
        onChangeText={setExpenseTitle}
      />

      <Text style={styles.label}>Category</Text>
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

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        value={amount}
        keyboardType="numeric"
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.dateInput}
      >
        <Text>{formatDate(date)}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Text style={styles.label}>Comment</Text>
      <TextInput
        style={styles.input}
        value={comment}
        onChangeText={setComment}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={sharedStyles.button} onPress={handleUpdate}>
          <Text style={sharedStyles.buttonText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity style={sharedStyles.button} onPress={handleDelete}>
          <Text style={sharedStyles.buttonText}>Delete</Text>
        </TouchableOpacity>
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
  label: {
    fontSize: 16,
    marginVertical: 5,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#48742C",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#FFF",
  },
  picker: {
    height: 60,
    marginBottom: 15,
    backgroundColor: "#FFF",
  },
  dateInput: {
    height: 40,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#48742C",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#FFF",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
