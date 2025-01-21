import React, {useState, useContext} from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from "react-native";
import { ExpenseContext } from "./ExpenseContext";
import sharedStyles from "./styles";

export default function EditBudget({route, navigation}) {
    const {updateBudget} = useContext(ExpenseContext);
    const {budget, budgetName} = route.params;

    const [amount, setAmount] = useState(budget.amount.toString());
    const [categories, setCategories] = useState(budget.categories.join(","));

    const handleSave = () => {
        const updateBudget = {
            ...budget,
            amount: parseFloat(amount),
            categories: categories.split(",").map(cate => cate.trim()),
        };
        updateBudget(budgetName, updateBudget);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Budget: {budgetName}</Text>

            <TextInput
                placeholder="Amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={styles.input}
            />

            <TextInput
                placeholder="Categories"
                value={categories}
                onChangeText={setCategories}
                style={styles.input}
            />

            <TouchableOpacity onPress={handleSave} style={sharedStyles.button}>
                <Text style={sharedStyles.buttonText}>Save Changes</Text>
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
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
    },
    input: {
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        padding: 10,
    },
});