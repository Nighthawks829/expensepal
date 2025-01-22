import React, { useContext, useEffect, useState } from 'react'
import { Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { UserContext } from './UserContext';
import axios from 'axios';
import { TextInput } from 'react-native-gesture-handler';

export default function GroupSettleUpPayment({ route, navigation }) {
    const { user } = useContext(UserContext)
    const { friendId, settlements, splitExpenses, group_expense_id } = route.params
    const [totalOwned, setTotalOwned] = useState(0);
    const [friend, setFriend] = useState([])
    const [settleUpList, setSettleUpList] = useState([])
    const [settleAmount, setSettleAmount] = useState(0)

    useEffect(() => {

        console.log("Settlements", settlements);
        getUser();
        getSettleUpPayment()
    }, [])

    useEffect(() => {
        if (settlements && settleUpList) {
            let totalOwned = 0;
            settlements.forEach(settlement => {
                if (parseInt(settlement.payer_id) !== user.user_id && parseInt(settlement.user_id) === user.user_id) {
                    console.log(settlement.total_amount);
                    totalOwned += parseFloat(settlement.total_amount);
                }
            });

            console.log(totalOwned);

            settleUpList.forEach(payment => {
                if (payment.status === 1) {
                    totalOwned -= parseFloat(payment.amount);
                }
            });

            console.log(totalOwned);

            setTotalOwned(totalOwned)

        }
    }, [splitExpenses, settleUpList])

    const getSettleUpPayment = async () => {
        try {
            const response = await axios.get("http://192.168.0.112/expensepal_api/getGroupSettleUpPaymentUserId.php", {
                params: {
                    group_expense_id: group_expense_id,
                    user_id: user.user_id,
                    friend_id: friendId,
                }
            })
            // console.log(response.data);

            if (response.data.success == true) {
                setSettleUpList(response.data.settleup_payment)
            }

        } catch (error) {
            console.error("Error get settle up payment:", error)
        }
    }

    const handleSettleUp = async () => {
        try {
            const response = await axios.post("http://192.168.0.112/expensepal_api/addGroupSettleUpPayment.php", {
                group_expense_id: group_expense_id,
                user_id: user.user_id,
                friend_id: friendId,
                amount: settleAmount,
                status: false,
            })

            console.log(response.data);
            if (response.data.success) {
                setSettleUpList(response.data.settleup_payment)
                navigation.goBack();
            }
        } catch (error) {

        }
    }

    const getUser = async () => {
        try {
            const response = await axios.get("http://192.168.0.112/expensepal_api/getUser.php", {
                params: {
                    friend_id: friendId
                }
            })
            // console.log(response.data.user[0]);
            if (response.data.success == true) {
                setFriend(response.data.user)
            }
        } catch (error) {
            console.error("Failed to get friend data:", error)
        }
    }
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>QR Code</Text>

            {friend[0] && (<Text style={styles.text}>You owe {friend[0].username} RM{totalOwned.toFixed(2)}</Text>)}
            {
                friend[0] && (
                    <View style={styles.item}>
                        <Image source={{ uri: `http://192.168.0.112/expensepal_api/uploads/${friend[0].file_name}` }} style={styles.image} />
                    </View>
                )
            }

            <View style={styles.settleContainer}>
                <Text style={styles.label}>Settle Amount</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setSettleAmount}
                    value={settleAmount}
                    keyboardType="numeric"
                />
            </View>
            <Button title="Settle Up" onPress={handleSettleUp} />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#E1FFD4",
    },
    title: {
        fontSize: 20,
        textAlign: "center",
        marginTop: 10,
        marginBottom: 20,
    },
    text: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: 20,
    },
    item: {
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        alignItems: "center", // Center the content within the item
    },
    buttonContainer: {
        marginTop: 20,
    },
    image: {
        width: 250,
        height: 250,
        marginTop: 10,
    },
    settleContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: "#ddd",
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
});
