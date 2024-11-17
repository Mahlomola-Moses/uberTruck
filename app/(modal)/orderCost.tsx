// MyModal.tsx
import React, { useState } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Colors from "@/constants/Colors";
import { get, post } from "../../services/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
interface ModalProps {
  visible: boolean;
  onClose: () => void;
  initialPrice: string;
  distance: string;
}

const OrderCostModal: React.FC<ModalProps> = ({
  visible,
  onClose,
  initialPrice,
  distance,
}) => {
  const navigation = useNavigation();
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [price, setPrice] = useState<string>(initialPrice);
  const submitTripDetails = async () => {
    try {
      console.log(paymentMethod, price);
      const shipId: any = await AsyncStorage.getItem("shipmentId");
      const data = {
        shipmentId: Number(shipId), //order in context
        price: price,
        paymentMethod: paymentMethod,
        distance: 0,
      };
      const results = await post(
        "/api/ShipmentTransit/create-transaction",
        data
      );
      await AsyncStorage.setItem("driverOrderStatus", "negotiated");
      onClose();
      navigation.navigate("Map");
    } catch (error) {
      console.log(error);
    }
  };
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
            {/* Modal Title */}
            <Text style={styles.modalTitle}>Trip Details</Text>

            {/* Price and Distance Display */}
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Price:</Text>
                <TextInput
                  style={styles.input}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                />
              </View>

              {/* <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Distance:</Text>
                <Text style={styles.infoValue}>{distance} km</Text>
              </View> */}
            </View>

            {/* Payment Method Picker */}
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

            {/* Confirm Order Button */}
            <TouchableOpacity style={styles.button} onPress={submitTripDetails}>
              <Text style={styles.buttonText}>Confirm Order</Text>
            </TouchableOpacity>

            {/* Close Modal Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
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
    alignItems: "center",
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
  input: {
    fontSize: 18,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    width: 150,
    textAlign: "right",
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#333",
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
