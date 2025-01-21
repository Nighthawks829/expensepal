import React, {useContext, useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import { ExpenseContext } from './ExpenseContext';

export default function CurrencySelection() {
    const {updateCurrency} = useContext(ExpenseContext);

    const handleCurrencyChange = (currency) => {
        updateCurrency(currency);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Select Your Currency</Text>
            <Button title="RM (Ringgit Malaysia)" onPress={() => handleCurrencyChange('RM')}/>
            <Button title="USD (United States Dollar)" onPress={() => handleCurrencyChange('USD')} />
            <Button title="EUR (Euro)" onPress={() => handleCurrencyChange('EUR')} />
            <Button title="SGD (Singapore Dollar)" onPress={() => handleCurrencyChange('SGD')} />
            {/* add more currencies*/}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#E1FFD4',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
});