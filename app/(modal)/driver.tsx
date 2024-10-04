import Colors from "@/constants/Colors";
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
interface ModalProps {
  visible: boolean;
  closeMOdel: () => void;
}

const DriverModal: React.FC<ModalProps> = (prop) => {
  // Example data
  const driverInfo = {
    name: "John Doe",
    picture:
      "https://cdn-bcldb.nitrocdn.com/kLRdXZGeQymYELvyTfXVsQALHhzNRamH/assets/images/optimized/rev-306e71b/www.teamais.net/wp-content/uploads/2020/07/driver-hire-min.jpg", // Replace with actual image URL
    truckRegistration: "LJ 1234 GP",
    truckModel: "Volvo guun",
    truckColor: "Blue",
  };

  const handleLogin = async () => {
    await AsyncStorage.setItem("state", "Tract_driver");
    const statx = await AsyncStorage.getItem("state");
    console.log("Tract_driver", statx);
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={prop.visible}
      onRequestClose={prop.closeMOdel}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Driver Found</Text>
          <Image
            source={{ uri: driverInfo.picture }}
            style={styles.driverImage}
          />
          <Text style={styles.driverName}>{driverInfo.name}</Text>
          <Text style={styles.truckInfo}>
            <Text style={styles.label}>Registration:</Text>{" "}
            {driverInfo.truckRegistration}
          </Text>
          <Text style={styles.truckInfo}>
            <Text style={styles.label}>Model:</Text> {driverInfo.truckModel}
          </Text>
          <Text style={styles.truckInfo}>
            <Text style={styles.label}>Color:</Text> {driverInfo.truckColor}
          </Text>
          <TouchableOpacity
            onPress={() => {
              prop.closeMOdel();
              handleLogin();
            }}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Track Driver</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  openButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
  },
  openButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
  },
  driverImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  driverName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  truckInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    margin: 16,
    borderRadius: 4,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#28a745",
  },
});

export default DriverModal;
