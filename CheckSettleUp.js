import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { Alert, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { UserContext } from './UserContext';

export default function CheckSettleUp({ route, navigation }) {
    const { user } = useContext(UserContext)
    const [settleUpList, setSettleUpList] = useState([])
    useEffect(() => {
        getSettleUpPayment()
    }, [])

    const getSettleUpPayment = async () => {
        try {
            const response = await axios.get("http://192.168.0.112/expensepal_api/getSettleUpPayment.php", {
                params: {
                    user_id: user.user_id,
                }
            })
            console.log(response.data);

            if (response.data.success == true) {
                setSettleUpList(response.data.settleup_payment)
            }

        } catch (error) {
            console.error("Error get settle up payment:", error)
        }
    }

    const handleAccept = async (paymentId) => {
        // Alert.alert('Accepted', `Payment ${paymentId} accepted!`);
        // Add your accept logic here
        try {
            const response = await axios.post("http://192.168.0.112/expensepal_api/updateSettleUpPayment.php", {
                id: paymentId,
                status: true,
            })
            console.log(response.data);
        } catch (error) {
            console.error("Error update settle up payment:", error)
        }
        getSettleUpPayment();
    };

    const handleReject = async (paymentId) => {
        // Alert.alert('Rejected', `Payment ${paymentId} rejected!`);
        // Add your reject logic here
        try {
            const response = await axios.post("http://192.168.0.112/expensepal_api/updateSettleUpPayment.php", {
                id: paymentId,
                status: false,
            })
            console.log(response.data);
        } catch (error) {
            console.error("Error update settle up payment:", error)
        }
    };



    return (
        // <ScrollView contentContainerStyle={styles.container}>
        //     {settleUpList.map((payment) => (
        //         <View key={payment.id} style={styles.item}>
        //             <Text>{`${payment.payer_name} paid you RM${payment.amount} at ${payment.created_at}`}</Text>
        //             <View style={styles.buttonContainer}>
        //                 <Button title="Accept" onPress={() => handleAccept(payment.id)} />
        //                 <Button title="Reject" onPress={() => handleReject(payment.id)} />
        //             </View>
        //         </View>
        //     ))}
        // </ScrollView>
        <ScrollView contentContainerStyle={styles.container}>
            {settleUpList.filter(payment => payment.status == false).map(filteredPayment => (
                <View key={filteredPayment.id} style={styles.item}>
                    <Text>{`${filteredPayment.payer_name} paid you RM${filteredPayment.amount} at ${filteredPayment.created_at}`}</Text>
                    <View style={styles.buttonContainer}>
                        <Button title="Accept" onPress={() => handleAccept(filteredPayment.id)} />
                        <Button title="Reject" onPress={() => handleReject(filteredPayment.id)} />
                    </View>
                </View>
            ))}
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
        marginTop: -25,
        marginBottom: 20,
    },
    item: {
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
});
