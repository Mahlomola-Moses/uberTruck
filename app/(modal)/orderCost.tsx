import React, { useState } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
} from "react-native";
import Colors from "@/constants/Colors";
import { get, post } from "../../services/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { Picker } from "@react-native-picker/picker";

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
        shipmentId: Number(shipId),
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
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              </View>

              {/* Payment Method Picker */}
              <Text style={styles.infoLabel}>Payment method:</Text>

              <View style={styles.radioGroup}>
                <TouchableOpacity
                  style={styles.radioItem}
                  onPress={() => setPaymentMethod("cash")}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      paymentMethod === "cash" && styles.radioSelected,
                    ]}
                  />
                  <Text style={styles.radioLabel}>Cash</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.radioItem}
                  onPress={() => setPaymentMethod("card")}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      paymentMethod === "card" && styles.radioSelected,
                    ]}
                  />
                  <Text style={styles.radioLabel}>Card</Text>
                </TouchableOpacity>
              </View>

              {/* Confirm Order Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={submitTripDetails}
              >
                <Text style={styles.buttonText}>Confirm Order</Text>
              </TouchableOpacity>

              {/* Close Modal Button */}
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
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
  input: {
    fontSize: 18,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    width: 150,
    textAlign: "right",
  },
  pickerContainer: {
    width: "100%",
    marginBottom: 20,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
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
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#555",
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: Colors.primary,
  },
  radioLabel: {
    fontSize: 16,
    color: "#333",
  },
});

export default OrderCostModal;
