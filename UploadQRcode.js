import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Button, Alert, View, Text, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { UserContext } from './UserContext';

export default function UploadQRcode({ route, navigation }) {
    const { user } = useContext(UserContext)
    const [document, setDocument] = useState(null);

    useEffect(() => {
        // console.log(`${user.file_name}`);
    }, [])

    const handleUploadImage = async () => {
        if (!document) {
            console.error("No document selected for upload");
            return;
        }

        const formData = new FormData();
        formData.append('user_id', user.user_id);
        formData.append('file_name', document.name);
        formData.append('file_size', document.size);
        formData.append('file', {
            uri: document.uri,
            type: document.mimeType || 'image/jpeg',
            name: document.name,
        });

        try {
            const response = await axios.post("http://192.168.0.112/expensepal_api/uploadQrCode.php", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success == true) {
                navigation.goBack();
                console.log("QR Code uploaded successfully:", response.data);
                Alert.alert('Success', 'QR Code uploaded successfully!');
            }
        } catch (error) {
            console.error("Failed to upload QR Code:", error);
            Alert.alert('Error', 'Failed to upload QR Code.');
        }
    };

    const handleDocumentPicker = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'image/*', // To restrict the picker to images only
                copyToCacheDirectory: false,
            });
            console.log(result.assets[0]);
            if (result.assets) {
                setDocument(result.assets[0]);
                // Alert.alert('Success', 'QR Code uploaded successfully!');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to upload QR code.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Upload QR Code</Text>
            <Button title="Upload QR Code" onPress={handleDocumentPicker} />
            {document ? (
                <View style={styles.item}>
                    <Text>File Name: {document.name}</Text>
                    <Text>Size: {document.size} bytes</Text>
                    <Image source={{ uri: document.uri }} style={styles.image} />
                </View>
            ) : (
                user.file_name && (
                    <View style={styles.item}>
                        <Text>Current QR Code:</Text>
                        <Image source={{ uri: `http://192.168.0.112/expensepal_api/uploads/${user.file_name}` }} style={styles.image} />
                    </View>
                )
            )}
            <View style={styles.buttonContainer}>
                <Button title="Submit" onPress={handleUploadImage} />
            </View>
        </ScrollView>
    );
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
        alignItems: "center"
    },
    buttonContainer: {
        marginTop: 20,
    },
    image: { width: 250, height: 250, marginTop: 10, },
});
