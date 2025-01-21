import React, {useContext, useState} from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { ExpenseContext } from "./ExpenseContext";

export default function SetCategoryBudget() {
    const {updateBudget} = useContext(ExpenseContext);
    const [foodBudget, setFoodBudget] = useState('');
    const [transportBudget, setTransportBudget] = useState('');
    const [shoppingBudget, setShoppingBudget] = useState('');
    const [othersBudget, setOthersBudget] = useState('');

    const handleSetBudgets = () => {
        if (!foodBudget || !transportBudget || !shoppingBudget || !othersBudget) {
            Alert.alert('Please fill in all fields.');
            return;
        }

        updateBudget('food', parseFloat(foodBudget));
        updateBudget('transport', parseFloat(transportBudget));
        updateBudget('shopping', parseFloat(shoppingBudget));
        updateBudget('others', parseFloat(othersBudget));

        Alert.alert('Success', 'Budget set successfully!');
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Set Food Budget"
                value={foodBudget}
                onChangeText={setFoodBudget}
                keyboardType="numeric"
                style={styles.input}
            />
            <TextInput
                placeholder="Set Transport Budget"
                value={transportBudget}
                onChangeText={setTransportBudget}
                keyboardType="numeric"
                style={styles.input}
            />
            <TextInput
                placeholder="Set Shopping Budget"
                value={shoppingBudget}
                onChangeText={setShoppingBudget}
                keyboardType="numeric"
                style={styles.input}
            />
            <TextInput
                placeholder="Set Others Budget"
                value={othersBudget}
                onChangeText={setOthersBudget}
                keyboardType="numeric"
                style={styles.input}
            />
            <Button title="Set Budgets" onPress={handleSetBudgets}/>
        </View>
    );
};

const styles=StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#E1FFD4',
    },
    input: {
        height: 40,
        borderColor: '#000',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 10,
        borderRadius: 5,
    },
});