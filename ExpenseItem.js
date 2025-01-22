import React from "react";
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

export default function ExpenseItem({item, onEdit, editable}) {
    // console.log(item);
    
    if (!item) return null;

    const handlePress = () => {
        if (editable && onEdit) {
            onEdit(item);
        }
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handlePress}>
            <View style={styles.details}>
                {/* <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.comment}>{item.comment}</Text>
                <Text style={styles.date}>{item.date}</Text> */}
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.expense_title}>{item.expense_title}</Text>
                <Text style={styles.amount}>RM {item.amount}</Text>
                <Text style={styles.date}>{item.date}</Text>
                <Text style={styles.notes}>{item.notes || "No comments"}</Text>
            </View>
            {/* <Text style={styles.amount}>
                {currency} {Number(item.amount).toFixed(2)}
            </Text> */}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#F9F9F9",
        marginBottom: 10,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 2,
    },
    details: {
        flex: 1,
    },
    expense_title: {
        fontSize: 16,
    },
    category: {
        fontSize: 16,
        color: "#666",
        fontWeight: "bold",
    },
    amount: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#2E8B57",
    },
    date: {
        // marginTop: 5,
        fontSize: 14,
        color: "#999",
    },
    notes: {
        fontSize: 14,
        color: "#999",
        fontStyle: 'italic',
    },
});