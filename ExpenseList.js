import React, { useContext, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { ExpenseContext } from "./ExpenseContext";
import ExpenseItem from "./ExpenseItem";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { UserContext } from "./UserContext";

export default function ExpenseList() {
    const { expenses, currency, fetchExpenses } = useContext(ExpenseContext);
    const { user } = useContext(UserContext);
    const route = useRoute();
    const editable = route.params?.editable ?? true;
    const navigation = useNavigation();

    const handleEditExpense = (expense) => {
        console.log("handleEditExpense:", handleEditExpense);
        navigation.navigate("EditExpense", {expense});
    };

    useEffect(() => {
        if (route.params?.reload) {
            fetchExpenses(user.user_id);
            navigation.setParams({ reload: false });
        }
        console.log(expenses);
    }, [route.params?.reload]);

    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <View style={styles.container}>
            <Text style={styles.title}>All Expenses</Text>
            <FlatList
                data={sortedExpenses}
                renderItem={({ item }) => 
                    item ? <ExpenseItem item={item} currency={currency} editable={editable} onEdit={handleEditExpense} /> : null
                }
                keyExtractor={(item, index) => 
                    item.expense_id ? item.expense_id.toString() : index.toString()
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#E1FFD4',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
});