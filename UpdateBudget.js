import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";
import axios from "axios";
import { UserContext } from "./UserContext";
import { ExpenseContext } from "./ExpenseContext";
import sharedStyles from "./styles";

export default function UpdateBudget({ route, navigation }) {
  const { budgetId } = route.params;
  const { user } = useContext(UserContext);
  const { UpdateBudget, deleteBudget } = useContext(ExpenseContext);

  const [budgetName, setBudgetName] = useState("");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [refreshPeriod, setRefreshPeriod] = useState("monthly");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [noEndDate, setNoEndDate] = useState(false);
  const [notificationPercentage, setNotificationPercentage] = useState(50);
  const [isRecurring, , setIsRecurring] = useState(false);
  const [recurrenceValue, setRecurrenceValue] = useState("");
  const [recurrenceUnit, setRecurrenceUnit] = useState("days");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const categories = [
    "Food & Drinks",
    "Shopping",
    "Transport",
    "Housing",
    "Others",
  ];
  const recurrenceUnits = ["days", "weeks", "months", "years"];

  useEffect(() => {
    const fetchBudgetDetails = async () => {
      try {
        const response = await axios.post(
          "http://192.168.0.112/expensepal_api/getBudgetDetails.php",
          {
            budget_id: budgetId,
            user_id: user.user_id,
          }
        );

        if (response.data.success) {
          const budget = response.data.budget;
          setBudgetName(budget.budget_name);
          setBudgetAmount(budget.amount.toString());
          setRefreshPeriod(budget.repeat_option);
          setStartDate(new Date(budget.start_date));
          setEndDate(budget.end_date ? new Date(budget.end_date) : new Date());
          setNoEndDate(!budget.end_date);
          setSelectedCategories(budget.categories.split(", "));
          setNotificationPercentage(budget.notification_percentage || 50);
          setIsRecurring(budget.repeat_frequency > 0);
          setRecurrenceValue(budget.repeat_frequency.toString());
          setRecurrenceUnit(budget.reccurrence_unit || "days");
        } else {
          Alert.alert("Error", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching budget details:", error);
        Alert.alert("Error", "Failed to fetch budget details.");
      }
    };
    fetchBudgetDetails();
  }, [budgetId, user.user_id]);

  const handleUpdateBudget = async () => {
    if (!budgetName.trim()) {
      Alert.alert("Error", "Please enter a budget name");
      return;
    }
    if (!budgetAmount || isNaN(budgetAmount) || parseFloat(budgetAmount) <= 0) {
      Alert.alert(
        "Error",
        "Please enter a valid budget amount greater than 0."
      );
      return;
    }
    if (!startDate) {
      Alert.alert("Error", "Please select a start date");
      return;
    }
    if (!noEndDate && (!endDate || endDate < startDate)) {
      Alert.alert(
        "Error",
        "Please select a valid end date (after the start date)."
      );
      return;
    }
    if (selectedCategories.length === 0) {
      Alert.alert("Error", "Please select at least one category");
      return;
    }

    const updatedBudget = {
      budget_id: budgetId,
      user_id: user.user_id,
      budget_name: budgetName,
      amount: parseFloat(budgetAmount),
      start_date: startDate.toISOString().split("T")[0],
      end_date: noEndDate ? null : endDate.toISOString().split("T")[0],
      categories: selectedCategories.join(", "),
      repeat_option: refreshPeriod,
      repeat_frequency: isRecurring ? parseInt(recurrenceValue, 10) : 0,
      recurrence_unit: isRecurring ? recurrenceUnit : null,
      notification_percentage: notificationPercentage,
    };

    try {
      const response = await axios.post(
        "http://192.168.0.112/expensepal_api/updateBudget.php",
        updatedBudget
      );

      if (response.data.success) {
        updateBudget(updatedBudget); // Update budget in context
        Alert.alert("Success", "Budget updated successfully");
        navigation.goBack();
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      Alert.alert("Eror", "Failed to update budget.");
    }
  };

  const handleDeleteBudget = async () => {
    try {
      const response = await axios.post(
        "http://192.168.0.112/expensepal_api/deleteBudget.php",
        {
          budget_id: budgetId,
          user_id: user.user_id,
        }
      );

      if (response.data.success) {
        deleteBudget(budgetId); // Delete budget from context
        Alert.alert("Success", "Budget deleted successfully");
        navigation.goBack();
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
      Alert.alert("Error", "Failed to delete budget.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          placeholder="Budget Name"
          value={budgetName}
          onChangeText={setBudgetName}
          style={styles.input}
        />

        <TextInput
          placeholder="Budget Amount"
          value={budgetAmount}
          onChangeText={setBudgetAmount}
          keyboardType="numeric"
          style={styles.input}
        />

        <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
          <Text style={styles.dateText}>
            Start Date: {startDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowStartDatePicker(false);
              if (selectedDate) {
                setStartDate(selectedDate);
              }
            }}
          />
        )}

        {!noEndDate && (
          <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
            <Text style={styles.dateText}>
              End Date: {endDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        )}
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowEndDatePicker(false);
              if (selectedDate) {
                setEndDate(selectedDate);
              }
            }}
          />
        )}

        <View style={styles.switchContainer}>
          <Text>No End Date:</Text>
          <Switch value={noEndDate} onValueChange={setNoEndDate} />
        </View>

        <Text>Refresh Period</Text>
        <Picker
          selectedValue={refreshPeriod}
          onValueChange={(itemValue) => setRefreshPeriod(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Daily" value="daily" />
          <Picker.Item label="Monthly" value="monthly" />
          <Picker.Item label="Yearly" value="yearly" />
          <Picker.Item label="Custom" value="custom" />
        </Picker>

        {refreshPeriod === "custom" && (
          <>
            <View style={styles.switchContainer}>
              <Text>Recurring Budget:</Text>
              <Switch value={isRecurring} onValueChange={setIsRecurring} />
            </View>
            {isRecurring && (
              <View>
                <TextInput
                  placeholder="Recurrence Value (e.g., 1 for daily, 2 for every 2 days)"
                  value={recurrenceValue}
                  onChangeText={setRecurrenceValue}
                  keyboardType="numeric"
                  style={styles.input}
                />
                <Picker
                  selectedValue={recurrenceUnit}
                  onValueChange={(itemValue) => setRecurrenceUnit(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Days" value="days" />
                  <Picker.Item label="Months" value="months" />
                  <Picker.Item label="Years" value="years" />
                </Picker>
              </View>
            )}
          </>
        )}

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Categories", { setSelectedCategories })
          }
          style={[sharedStyles.button, { backgroundColor: "#fff" }]}
        >
          <Text style={sharedStyles.buttonText}>Select Categories</Text>
        </TouchableOpacity>

        <Text style={styles.largeText}>
          Selected Categories:{" "}
          {selectedCategories.length === categories.length
            ? "All"
            : selectedCategories.join(", ")}
        </Text>

        <Text style={styles.largeText}>
          Notify when budget reached: {notificationPercentage}%
        </Text>
        <View style={styles.sliderInputContainer}>
          <TextInput
            style={[styles.input, styles.notificationInput]}
            keyboardType="numeric"
            value={String(notificationPercentage)}
            onChangeText={(value) => {
              const numericValue = parseInt(value) || 0;
              if (numericValue >= 0 && numericValue <= 100) {
                setNotificationPercentage(numericValue);
              }
            }}
            placeholder="Enter percentage"
            maxLength={3}
          />
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={notificationPercentage}
            onValueChange={(value) => setNotificationPercentage(value)}
            minimumTrackTintColor="#4CAF50"
            maximumTrackTintColor="d3d3d3"
            thumbTintColor="#4CAF50"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleUpdateBudget}
            style={sharedStyles.button}
          >
            <Text style={sharedStyles.buttonText}>Update Budget</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDeleteBudget}
            style={[sharedStyles.button, { backgroundColor: "#ff4444" }]}
          >
            <Text style={sharedStyles.buttonText}>Delete Budget</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#E1FFD4",
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  largeText: {
    fontSize: 18,
    marginVertical: 10,
  },
  picker: {
    marginBottom: 20,
  },
  dateText: {
    borderBottomWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sliderInputContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  slider: {
    width: "100%",
    height: 40,
    marginBottom: 20,
  },
  notificationInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    textAlign: "center",
    fontSize: 16,
    marginVertical: 10,
    width: "30%",
    alignSelf: "left",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
  },
});
