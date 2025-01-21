import React from 'react';
import {View, Image, TouchableOpacity, Text, StyleSheet}  from 'react-native';
import sharedStyles from './styles';

export default function LoginSignup({navigation}) {
    return(
        <View style={styles.container}>
            <Image
                source={require('./assets/expensepal_logo_180x180-removebg-preview.png')}
                style={styles.logo}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={sharedStyles.button}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={sharedStyles.buttonText}>Log In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={sharedStyles.button}
                    onPress={() => navigation.navigate('SignUp')}
                >
                    <Text style={sharedStyles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E1FFD4',
    },
    logo: {
        width: 180,
        height: 180,
    },
    buttonContainer: {
        position: 'absolute',
        top: '52%',
        alignItems: 'center',
    },
    /*button: {
        width: 171,
        height: 41,
        backgroundColor: '#FFFFFF',
        borderColor: '#000000',
        borderWidth: 1,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#000000',
        fontSize: 16,
    },*/
});