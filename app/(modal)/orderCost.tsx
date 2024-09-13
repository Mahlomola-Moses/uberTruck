// MyModal.tsx
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import OrderCost from "./orderCost";
import Colors from "@/constants/Colors";
import RNPickerSelect from "react-native-picker-select";
import DriverModal from "./driver";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  price: string;
  distance: string;
}

const OrderCostModal: React.FC<ModalProps> = ({
  visible,
  onClose,
  price,
  distance,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            {/* Price and Distance Display */}
            <Text style={styles.modalTitle}>Trip Details</Text>

            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Price:</Text>
                <Text style={styles.infoValue}>R {price}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Distance:</Text>
                <Text style={styles.infoValue}>{distance} km</Text>
              </View>
            </View>

            <View style={styles.pickerContainer}>
              <Text style={styles.infoLabel}>Payment Method:</Text>
              <RNPickerSelect
                onValueChange={(value) => setPaymentMethod(value)}
                items={[
                  { label: "Card", value: "card" },
                  { label: "Cash", value: "cash" },
                ]}
                style={pickerSelectStyles}
                placeholder={{ label: "Select payment method", value: "" }}
              />
            </View>

            {/* Close Button */}
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Confirm order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: 350,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  infoContainer: {
    width: "100%",
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 18,
    color: "#555",
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  pickerContainer: {
    width: "100%",
    marginBottom: 20,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is not truncated behind the icon
    backgroundColor: "#f9f9f9",
    marginTop: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is not truncated behind the icon
    backgroundColor: "#f9f9f9",
    marginTop: 10,
  },
});

export default OrderCostModal;
