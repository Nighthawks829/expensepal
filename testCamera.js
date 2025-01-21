import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Camera } from "expo-camera";
// import Tesseract from "tesseract.js";

export default function App() {
  const [facing, setFacing] = useState("back"); // Use string values directly
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraVisible, setCameraVisible] = useState(false);
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [receiptDetails, setReceiptDetails] = useState("");

  React.useEffect(() => {
    (async () => {
      const [status] = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status == "granted");
    })();
    // console.log('useCameraPermissions:', permission);
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photoData = await cameraRef.current.takePictureAsync();
      setPhoto(photoData.uri);

      extractReceiptDetails(photo.uri);
    }
  };

  const extractReceiptDetails = (uri) => {
    Tesseract.recognize(uri, "eng", {
      logger: (m) => console.log(m),
    })
      .then(({ data: { text } }) => {
        console.log("OCR Extracted Text:", text);

        setReceiptDetails(parseReceiptText(text));
      })
      .catch((error) => {
        console.error("OCR Error: ", error);
        setReceiptDetails("Unable to extract details.");
      });
  };

  const parseReceiptText = (text) => {
    let amount = "";
    let date = "";

    // Regular expression for finding amounts (e.g. 99.99, 45.50, 10.00 etc.)
    const amountMatch = text.match(/\d+\.\d{2}/);
    if (amountMatch) amount = amountMatch[0]; // Match the first occurrence of amount

    // Regular expression for finding dates in dd/mm/yyyy format (or mm/dd/yyyy)
    const dateMatch = text.match(/\d{2}\/\d{2}\/\d{4}/);
    if (dateMatch) date = dateMatch[0]; // Match the first occurrence of date (you can refine this further if needed)

    // Example of more specific date format validation:
    // const validDateRegex = /\d{2}\/\d{2}\/\d{4}/;
    // if (validDateRegex.test(dateMatch)) date = dateMatch[0];

    // Return the extracted details in a readable format
    return `Date: ${date || "Not Found"}, Amount: RM ${amount || "Not Found"}`;
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
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

  // async function takePicture() {
  //   if (cameraRef.current) {
  //     try {
  //       const photo = await cameraRef.current.takePictureAsync();
  //       console.log("Photo taken:", photo.uri);
  //       // Here you can add logic to handle the captured photo
  //       // For example, save it to state, display it, or upload it
  //     } catch (error) {
  //       console.error("Error taking picture:", error);
  //     }
  //   }
  // }

  const handleScanReceipt = async () => {
    setCameraVisible(true);
  };

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
      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
          <View style={styles.topButtonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              onPress={handleCloseCamera}
            >
              <Text style={styles.text}>Close Camera</Text>
            </TouchableOpacity>
          </View>

          {/* Capture Button Container */}
          <View style={styles.captureButtonContainer}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>

      {/* {isCameraVisible && cameraPermission && (
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

      {/* <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
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
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    width: "100%",
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
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
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
});
