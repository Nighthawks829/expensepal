// import React, { useCallback, useContext, useState, useRef } from "react";
// import {
//   View,
//   TextInput,
//   TouchableOpacity,
//   Text,
//   StyleSheet,
//   Alert,
//   Image,
//   Platform,
//   Button,
// } from "react-native";
// import { ExpenseContext } from "./ExpenseContext";
// import { UserContext } from "./UserContext";
// import sharedStyles from "./styles";
// import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
// import TextRecognition from "react-native-text-recognition";
// import { Picker } from "@react-native-picker/picker";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import axios from "axios";

// export default function AddExpense() {
//   const { addExpense } = useContext(ExpenseContext);
//   const { user } = useContext(UserContext);
//   const navigation = useNavigation();

//   const [expenseTitle, setExpenseTitle] = useState("");
//   const [amount, setAmount] = useState("");
//   const [date, setDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [category, setCategory] = useState("Food & Drinks");
//   const [comment, setComment] = useState("");
//   const [facing, setFacing] = useState("back");
//   const [permission, requestPermission] = useCameraPermissions();
//   const [cameraVisible, setCameraVisible] = useState(false);
//   const cameraRef = useRef(null);
//   // const [isCameraVisible, setIsCameraVisible] = useState(false);
//   // const [cameraPermission, setCameraPermission] = useState(null);

//   const resetFields = () => {
//     setExpenseTitle("");
//     setAmount("");
//     setDate(new Date());
//     setCategory("Food & Drinks");
//     setComment("");
//   };

//   const formatDate = (date) => {
//     const day = date.getDate().toString().padStart(2, "0");
//     const month = (date.getMonth() + 1).toString().padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   const handleAddExpense = async () => {
//     // if (!user) {
//     //     Alert.alert('Error', 'User not logged in. Please log in first.');
//     //     return;
//     // }

//     if (!expenseTitle || !amount || !date || !category) {
//       Alert.alert("Error", "Please fill in all required fields.");
//       return;
//     }

//     const newExpense = {
//       expenseTitle,
//       amount: parseFloat(amount) || 0,
//       category,
//       date: formatDate(date), //get current date in YYYY-MM-DD format
//       comment,
//     };

//     try {
//       const response = await axios.post(
//         "http://192.168.0.112/expensepal_api/addExpense.php",
//         {
//           user_id: user.user_id,
//           expense_title: expenseTitle,
//           amount: parseFloat(amount),
//           category,
//           date: date.toISOString().split("T")[0],
//           notes: comment,
//         }
//       );
//       console.log(response.data);

//       if (response.data.success) {
//         Alert.alert("Success", "Expense added successfully!");
//         addExpense({ ...newExpense, user_id: user.user_id });
//         resetFields();
//         navigation.navigate("Home");
//       } else {
//         Alert.alert("Error", response.data.message || "Failed to add expense");
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert("Error", "Something went wrong: " + error.message);
//     }
//   };

//   const fetchExpenses = async () => {
//     try {
//       const response = await axios.get(
//         `http://192.168.0.112/expensepal_api/getExpenses.php?user_id=${user.user_id}`
//       );

//       if (response.data.success) {
//         setExpenses(response.data.expenses);
//       } else {
//         Alert.alert("Error", response.data.message);
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert("Error", "Failed to fetch expenses: " + error.message);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       resetFields();
//     }, [])
//   );

//   if (!permission) {
//     return <View />;
//   }

//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>
//           We need your permission to show the camera
//         </Text>
//         <Button onPress={requestPermission} title="grant permission" />
//       </View>
//     );
//   }

//   function toggleCameraFacing() {
//     setFacing((current) => (current === "back" ? "front" : "back"));
//   }

//   function handleOpenCamera() {
//     setCameraVisible(true);
//   }

//   function handleCloseCamera() {
//     setCameraVisible(false);
//   }

//   async function takePicture() {
//     if (cameraRef.current) {
//       try {
//         const photo = await cameraRef.current.takePictureAsync();
//         console.log("Photo taken:", photo.uri);
//         // Here you can add logic to handle the captured photo
//         // For example, save it to state, display it, or upload it
//       } catch (error) {
//         console.error("Error taking picture:", error);
//       }
//     }
//   }

//   const handleScanReceipt = async () => {
//     setCameraVisible(true);
//     // const { status } = await Camera.requestMicrophonePermissionsAsync();
//     // setCameraPermission(status === 'granted');
//     // if (status === 'granted') {
//     //     setIsCameraVisible(true);
//     // } else {
//     //     Alert.alert('Camera permission is required to scan receipts');
//     // }
//   };

//   // const handleCameraClose = () => {
//   //     setIsCameraVisible(false);
//   // };

//   const handleTakePicture = async (camera) => {
//     try {
//       const data = await camera.takePictureAsync({
//         quality: 0.5,
//         base64: true,
//       });
//       const recognizedText = await TextRecognition.recognize(data.uri);
//       const expenseDetails = parseRecognizedText(recognizedText);

//       if (expenseDetails) {
//         setAmount(expenseDetails.amount || "");
//         setCategory(expenseDetails.category || "General");
//       } else {
//         Alert.alert(
//           "Error",
//           "Could not extract expense details from the receipt."
//         );
//       }

//       handleCameraClose();
//     } catch (error) {
//       Alert.alert("Error", "Failed to scan the receipt. Please try again.");
//       handleCameraClose();
//     }
//   };

//   const parseRecognizedText = (recognizedText) => {
//     let amount = recognizedText.match(/\d+(\.\d+)?/);
//     let category = "General";
//     return {
//       amount: amount ? amount[0] : null,
//       category,
//     };
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.topRightButtonContainer}>
//         <TouchableOpacity onPress={handleAddExpense}>
//           <Text style={styles.addExpenseText}>Add</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.inputContainer}>
//         <Icon name="description" size={20} color="#000" />
//         <TextInput
//           placeholder="Expense Title"
//           value={expenseTitle}
//           onChangeText={setExpenseTitle}
//           style={styles.underlineInput}
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Icon name="attach-money" size={20} color="#000" />
//         <TextInput
//           placeholder="Amount"
//           value={amount}
//           onChangeText={setAmount}
//           keyboardType="numeric"
//           style={styles.underlineInput}
//         />
//       </View>

//       <View style={styles.inputContainer}>
//         <Icon name="category" size={20} color="#000" />
//         <Picker
//           selectedValue={category}
//           onValueChange={(itemValue) => setCategory(itemValue)}
//           style={styles.underlineInput}
//         >
//           <Picker.Item label="Food & Drinks" value="Food & Drinks" />
//           <Picker.Item label="Shopping" value="Shopping" />
//           <Picker.Item label="Transport" value="Transport" />
//           <Picker.Item label="Housing" value="Housing" />
//           <Picker.Item label="Others" value="Others" />
//         </Picker>
//       </View>

//       <View style={styles.inputContainer}>
//         <Icon name="calendar-today" size={20} color="#000" />
//         <TouchableOpacity
//           onPress={() => setShowDatePicker(true)}
//           style={styles.input}
//         >
//           <Text style={styles.underlineInput}>{formatDate(date)}</Text>
//         </TouchableOpacity>
//       </View>

//       {showDatePicker && (
//         <DateTimePicker
//           value={date || new Date()}
//           mode="date"
//           display="calendar"
//           onChange={(event, selectedDate) => {
//             setShowDatePicker(false);
//             if (selectedDate) {
//               setDate(selectedDate);
//             }
//           }}
//         />
//       )}

//       <View style={styles.inputContainer}>
//         <Icon name="comment" size={20} color="#000" />
//         <TextInput
//           placeholder="Notes (optional)"
//           value={comment}
//           onChangeText={setComment}
//           style={styles.underlineInput}
//         />
//       </View>

//       {/* {!cameraVisible ? ( */}
//       <TouchableOpacity
//         style={sharedStyles.button}
//         onPress={() => navigation.navigate("testCamera")}
//       >
//         <Text style={sharedStyles.buttonText}>Receipt Scanning</Text>
//       </TouchableOpacity>
//       {/* ) : (
//                 <View style={styles.cameraContainer}>
//                     <CameraView
//                         ref={cameraRef}
//                         style={styles.camera}
//                         facing={facing}
//                     >
//                         <View style={styles.topButtonContainer}>
//                             <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
//                                 <Text style={styles.text}>Flip Camera</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity
//                                 style={[styles.button, styles.closeButton]}
//                                 onPress={handleCloseCamera}
//                             >
//                                 <Text style={styles.text}>Close Camera</Text>
//                             </TouchableOpacity>
//                         </View>

//                         Capture Button Container */}
//       {/* <View style={styles.captureButtonContainer}>
//                             <TouchableOpacity
//                                 style={styles.captureButton}
//                                 onPress={takePicture}
//                             >
//                                 <View style={styles.captureButtonInner} />
//                             </TouchableOpacity>
//                         </View>
//                     </CameraView>
//                 </View>
//             )}     */}

//       {/* <TouchableOpacity onPress={handleScanReceipt} style={sharedStyles.button}>
//                 <Text style={sharedStyles.buttonText}>Receipt Scanning</Text>
//             </TouchableOpacity>

//             {isCameraVisible && cameraPermission && (
//                 <Camera style={StyleSheet.absoluteFillObject} type={Camera.Constants.Type.back}>
//                     {({ camera }) => (
//                         <View style={styles.captureContainer}>
//                             <TouchableOpacity onPress={() => handleTakePicture(camera)} style={styles.capture}>
//                                 <Text style={{ fontSize: 14}}>CAPTURE</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity onPress={handleCameraClose} style={styles.capture}>
//                                 <Text style={{ fontSize: 14 }}>CLOSE</Text>
//                             </TouchableOpacity>
//                         </View>
//                     )}
//                 </Camera>
//             )} */}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#E1FFD4",
//   },
//   cameraContainer: {
//     flex: 1,
//   },
//   message: {
//     textAlign: "center",
//     paddingBottom: 10,
//   },
//   camera: {
//     flex: 1,
//   },
//   topButtonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     backgroundColor: "transparent",
//     margin: 64,
//   },
//   captureButtonContainer: {
//     position: "absolute",
//     bottom: 40,
//     alignSelf: "center",
//     width: "100%",
//     alignItems: "center",
//   },
//   button: {
//     flex: 1,
//     alignItems: "center",
//     padding: 10,
//     backgroundColor: "#007bff",
//     borderRadius: 5,
//     marginHorizontal: 5,
//   },
//   closeButton: {
//     backgroundColor: "#ff0000",
//   },
//   text: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "white",
//   },
//   captureButton: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: "rgba(255, 255, 255, 0.3)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   captureButtonInner: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "white",
//     borderWidth: 2,
//     borderColor: "rgba(0, 0, 0, 0.3)",
//   },
//   topRightButtonContainer: {
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     marginBottom: 10,
//   },
//   addExpenseText: {
//     fontSize: 16,
//     color: "#007BFF",
//     fontWeight: "bold",
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   underlineInput: {
//     flex: 1,
//     height: 50,
//     borderBottomWidth: 1,
//     borderColor: "#000",
//     marginLeft: 10,
//   },
//   captureContainer: {
//     flex: 1,
//     justifyContent: "flex-end",
//     alignItems: "center",
//   },
//   capture: {
//     flex: 0,
//     backgroundColor: "#fff",
//     borderRadius: 5,
//     padding: 10,
//     margin: 10,
//   },
// });

// import React, { useState, useEffect, useRef } from "react";
// import { Button, StyleSheet, Text, TextInput, View } from "react-native";
// import { Camera } from "expo-camera";
// // import Tesseract from "tesseract.js"; // Make sure you have Tesseract.js installed

// export default function AddExpense() {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [cameraVisible, setCameraVisible] = useState(false);
//   const [imageUri, setImageUri] = useState(null);
//   const [receiptDetails, setReceiptDetails] = useState("");
//   const cameraRef = useRef(null);
//   const [amount, setAmount] = useState("");
//   const [date, setDate] = useState("");

//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestPermissionsAsync();
//       setHasPermission(status === "granted");
//     })();
//   }, []);

//   const captureReceipt = async () => {
//     if (cameraRef.current) {
//       const photo = await cameraRef.current.takePictureAsync();
//       setImageUri(photo.uri); // Set the URI of the captured image
//       extractReceiptDetails(photo.uri); // Start OCR to extract details
//     }
//   };

//   const extractReceiptDetails = (uri) => {
//     Tesseract.recognize(uri, "eng", {
//       logger: (m) => console.log(m),
//     }).then(({ data: { text } }) => {
//       console.log("OCR Extracted Text:", text);

//       const { extractedDate, extractedAmount } = parseReceiptText(text);
//       setDate(extractedDate);
//       setAmount(extractedAmount);
//     });
//   };

//   const parseReceiptText = (text) => {
//     let amount = "";
//     let date = "";

//     // Regular expressions for amount and date
//     const amountMatch = text.match(/\d+\.\d{2}/);
//     const dateMatch = text.match(/\d{2}\/\d{2}\/\d{4}/);

//     if (amountMatch) {
//       amount = amountMatch[0];
//     }
//     if (dateMatch) {
//       date = dateMatch[0];
//     }

//     return {
//       extractedDate: date,
//       extractedAmount: amount,
//     };
//   };

//   if (hasPermission === null) {
//     return <View />;
//   }

//   if (!hasPermission) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>
//           We need your permission to show the camera
//         </Text>
//         <Button
//           title="Grant Permission"
//           onPress={() => Camera.requestPermissionsAsync()}
//         />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Camera Section */}
//       {cameraVisible && (
//         <View style={styles.cameraContainer}>
//           <Camera style={styles.camera} ref={cameraRef}>
//             <Button title="Capture Receipt" onPress={captureReceipt} />
//           </Camera>
//         </View>
//       )}

//       {/* Input Fields for Date and Amount */}
//       <View style={styles.inputs}>
//         <Text>Date: {date}</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter Date"
//           value={date}
//           onChangeText={setDate}
//         />
//         <Text>Amount: {amount}</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter Amount"
//           value={amount}
//           onChangeText={setAmount}
//         />
//       </View>

//       {/* Button to Start Camera */}
//       <Button title="Open Camera" onPress={() => setCameraVisible(true)} />

//       {/* Display Captured Image */}
//       {imageUri && <Text>Image URI: {imageUri}</Text>}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   cameraContainer: {
//     width: "100%",
//     height: "50%",
//   },
//   camera: {
//     flex: 1,
//   },
//   inputs: {
//     marginTop: 20,
//     width: "80%",
//   },
//   input: {
//     height: 40,
//     borderColor: "gray",
//     borderWidth: 1,
//     marginVertical: 10,
//     paddingLeft: 8,
//   },
//   message: {
//     fontSize: 16,
//     textAlign: "center",
//     paddingBottom: 20,
//   },
// });


import React, { useCallback, useContext, useState, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Image,
  Platform,
  Button,
} from "react-native";
import { ExpenseContext } from "./ExpenseContext";
import { UserContext } from "./UserContext";
import sharedStyles from "./styles";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import TextRecognition from "react-native-text-recognition";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import axios from "axios";

export default function AddExpense() {
  const { addExpense } = useContext(ExpenseContext);
  const { user } = useContext(UserContext);
  const navigation = useNavigation();

  const [expenseTitle, setExpenseTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [category, setCategory] = useState("Food & Drinks");
  const [comment, setComment] = useState("");
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraVisible, setCameraVisible] = useState(false);
  const cameraRef = useRef(null);
  // const [isCameraVisible, setIsCameraVisible] = useState(false);
  // const [cameraPermission, setCameraPermission] = useState(null);

  const resetFields = () => {
    setExpenseTitle("");
    setAmount("");
    setDate(new Date());
    setCategory("Food & Drinks");
    setComment("");
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleAddExpense = async () => {
    // if (!user) {
    //     Alert.alert('Error', 'User not logged in. Please log in first.');
    //     return;
    // }

    if (!expenseTitle || !amount || !date || !category) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    const newExpense = {
      expenseTitle,
      amount: parseFloat(amount) || 0,
      category,
      date: formatDate(date), //get current date in YYYY-MM-DD format
      comment,
    };

    try {
      const response = await axios.post(
        "http://192.168.0.112/expensepal_api/addExpense.php",
        {
          user_id: user.user_id,
          expense_title: expenseTitle,
          amount: parseFloat(amount),
          category,
          date: date.toISOString().split("T")[0],
          notes: comment,
        }
      );
      console.log(response.data);

      if (response.data.success) {
        Alert.alert("Success", "Expense added successfully!");
        addExpense({ ...newExpense, user_id: user.user_id });
        resetFields();
        navigation.navigate("Home");
      } else {
        Alert.alert("Error", response.data.message || "Failed to add expense");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong: " + error.message);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        `http://192.168.0.112/expensepal_api/getExpenses.php?user_id=${user.user_id}`
      );

      if (response.data.success) {
        setExpenses(response.data.expenses);
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch expenses: " + error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      resetFields();
    }, [])
  );

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function handleOpenCamera() {
    setCameraVisible(true);
  }

  function handleCloseCamera() {
    setCameraVisible(false);
  }

  async function takePicture() {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        console.log("Photo taken:", photo.uri);
        // Here you can add logic to handle the captured photo
        // For example, save it to state, display it, or upload it
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  }

  const handleScanReceipt = async () => {
    setCameraVisible(true);
    // const { status } = await Camera.requestMicrophonePermissionsAsync();
    // setCameraPermission(status === 'granted');
    // if (status === 'granted') {
    //     setIsCameraVisible(true);
    // } else {
    //     Alert.alert('Camera permission is required to scan receipts');
    // }
  };

  // const handleCameraClose = () => {
  //     setIsCameraVisible(false);
  // };

  const handleTakePicture = async (camera) => {
    try {
      const data = await camera.takePictureAsync({
        quality: 0.5,
        base64: true,
      });
      const recognizedText = await TextRecognition.recognize(data.uri);
      const expenseDetails = parseRecognizedText(recognizedText);

      if (expenseDetails) {
        setAmount(expenseDetails.amount || "");
        setCategory(expenseDetails.category || "General");
      } else {
        Alert.alert(
          "Error",
          "Could not extract expense details from the receipt."
        );
      }

      handleCameraClose();
    } catch (error) {
      Alert.alert("Error", "Failed to scan the receipt. Please try again.");
      handleCameraClose();
    }
  };

  const parseRecognizedText = (recognizedText) => {
    let amount = recognizedText.match(/\d+(\.\d+)?/);
    let category = "General";
    return {
      amount: amount ? amount[0] : null,
      category,
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.topRightButtonContainer}>
        <TouchableOpacity onPress={handleAddExpense}>
          <Text style={styles.addExpenseText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Icon name="description" size={20} color="#000" />
        <TextInput
          placeholder="Expense Title"
          value={expenseTitle}
          onChangeText={setExpenseTitle}
          style={styles.underlineInput}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="attach-money" size={20} color="#000" />
        <TextInput
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.underlineInput}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="category" size={20} color="#000" />
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue)}
          style={styles.underlineInput}
        >
          <Picker.Item label="Food & Drinks" value="Food & Drinks" />
          <Picker.Item label="Shopping" value="Shopping" />
          <Picker.Item label="Transport" value="Transport" />
          <Picker.Item label="Housing" value="Housing" />
          <Picker.Item label="Others" value="Others" />
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Icon name="calendar-today" size={20} color="#000" />
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.input}
        >
          <Text style={styles.underlineInput}>{formatDate(date)}</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="calendar"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}

      <View style={styles.inputContainer}>
        <Icon name="comment" size={20} color="#000" />
        <TextInput
          placeholder="Notes (optional)"
          value={comment}
          onChangeText={setComment}
          style={styles.underlineInput}
        />
      </View>

      {/* {!cameraVisible ? ( */}
      <TouchableOpacity
        style={sharedStyles.button}
        onPress={() => navigation.navigate("testCamera")}
      >
        <Text style={sharedStyles.buttonText}>Receipt Scanning</Text>
      </TouchableOpacity>
      {/* ) : (
                <View style={styles.cameraContainer}>
                    <CameraView
                        ref={cameraRef}
                        style={styles.camera}
                        facing={facing}
                    >
                        <View style={styles.topButtonContainer}>
                            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                                <Text style={styles.text}>Flip Camera</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.closeButton]}
                                onPress={handleCloseCamera}
                            >
                                <Text style={styles.text}>Close Camera</Text>
                            </TouchableOpacity>
                        </View>

                        Capture Button Container */}
      {/* <View style={styles.captureButtonContainer}>
                            <TouchableOpacity
                                style={styles.captureButton}
                                onPress={takePicture}
                            >
                                <View style={styles.captureButtonInner} />
                            </TouchableOpacity>
                        </View>
                    </CameraView>
                </View>
            )}     */}

      {/* <TouchableOpacity onPress={handleScanReceipt} style={sharedStyles.button}>
                <Text style={sharedStyles.buttonText}>Receipt Scanning</Text>
            </TouchableOpacity>

            {isCameraVisible && cameraPermission && (
                <Camera style={StyleSheet.absoluteFillObject} type={Camera.Constants.Type.back}>
                    {({ camera }) => (
                        <View style={styles.captureContainer}>
                            <TouchableOpacity onPress={() => handleTakePicture(camera)} style={styles.capture}>
                                <Text style={{ fontSize: 14}}>CAPTURE</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCameraClose} style={styles.capture}>
                                <Text style={{ fontSize: 14 }}>CLOSE</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Camera>
            )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E1FFD4",
  },
  cameraContainer: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  topButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "transparent",
    margin: 64,
  },
  captureButtonContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    width: "100%",
    alignItems: "center",
  },
  button: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    marginHorizontal: 5,
  },
  closeButton: {
    backgroundColor: "#ff0000",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.3)",
  },
  topRightButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  addExpenseText: {
    fontSize: 16,
    color: "#007BFF",
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  underlineInput: {
    flex: 1,
    height: 50,
    borderBottomWidth: 1,
    borderColor: "#000",
    marginLeft: 10,
  },
  captureContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  capture: {
    flex: 0,
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    margin: 10,
  },
});

// import React, { useState, useEffect, useRef } from "react";
// import { Button, StyleSheet, Text, TextInput, View } from "react-native";
// import { Camera } from "expo-camera";
// import Tesseract from "tesseract.js"; // Make sure you have Tesseract.js installed

// export default function AddExpense() {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [cameraVisible, setCameraVisible] = useState(false);
//   const [imageUri, setImageUri] = useState(null);
//   const [receiptDetails, setReceiptDetails] = useState("");
//   const cameraRef = useRef(null);
//   const [amount, setAmount] = useState("");
//   const [date, setDate] = useState("");

//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestPermissionsAsync();
//       setHasPermission(status === "granted");
//     })();
//   }, []);

//   const captureReceipt = async () => {
//     if (cameraRef.current) {
//       const photo = await cameraRef.current.takePictureAsync();
//       setImageUri(photo.uri); // Set the URI of the captured image
//       extractReceiptDetails(photo.uri); // Start OCR to extract details
//     }
//   };

//   const extractReceiptDetails = (uri) => {
//     Tesseract.recognize(uri, "eng", {
//       logger: (m) => console.log(m),
//     }).then(({ data: { text } }) => {
//       console.log("OCR Extracted Text:", text);

//       const { extractedDate, extractedAmount } = parseReceiptText(text);
//       setDate(extractedDate);
//       setAmount(extractedAmount);
//     });
//   };

//   const parseReceiptText = (text) => {
//     let amount = "";
//     let date = "";

//     // Regular expressions for amount and date
//     const amountMatch = text.match(/\d+\.\d{2}/);
//     const dateMatch = text.match(/\d{2}\/\d{2}\/\d{4}/);

//     if (amountMatch) {
//       amount = amountMatch[0];
//     }
//     if (dateMatch) {
//       date = dateMatch[0];
//     }

//     return {
//       extractedDate: date,
//       extractedAmount: amount,
//     };
//   };

//   if (hasPermission === null) {
//     return <View />;
//   }

//   if (!hasPermission) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.message}>
//           We need your permission to show the camera
//         </Text>
//         <Button
//           title="Grant Permission"
//           onPress={() => Camera.requestPermissionsAsync()}
//         />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Camera Section */}
//       {cameraVisible && (
//         <View style={styles.cameraContainer}>
//           <Camera style={styles.camera} ref={cameraRef}>
//             <Button title="Capture Receipt" onPress={captureReceipt} />
//           </Camera>
//         </View>
//       )}

//       {/* Input Fields for Date and Amount */}
//       <View style={styles.inputs}>
//         <Text>Date: {date}</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter Date"
//           value={date}
//           onChangeText={setDate}
//         />
//         <Text>Amount: {amount}</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter Amount"
//           value={amount}
//           onChangeText={setAmount}
//         />
//       </View>

//       {/* Button to Start Camera */}
//       <Button title="Open Camera" onPress={() => setCameraVisible(true)} />

//       {/* Display Captured Image */}
//       {imageUri && <Text>Image URI: {imageUri}</Text>}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   cameraContainer: {
//     width: "100%",
//     height: "50%",
//   },
//   camera: {
//     flex: 1,
//   },
//   inputs: {
//     marginTop: 20,
//     width: "80%",
//   },
//   input: {
//     height: 40,
//     borderColor: "gray",
//     borderWidth: 1,
//     marginVertical: 10,
//     paddingLeft: 8,
//   },
//   message: {
//     fontSize: 16,
//     textAlign: "center",
//     paddingBottom: 20,
//   },
// });