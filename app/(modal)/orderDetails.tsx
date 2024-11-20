import React, { useEffect, useState } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Image,
} from "react-native";
import Colors from "@/constants/Colors";
import { get } from "../../services/apiService";
import { useNavigation } from "@react-navigation/native";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  OrderDetails: any;
}

const OrderDetailsModal: React.FC<ModalProps> = ({
  visible,
  onClose,
  OrderDetails,
}) => {
  const navigation = useNavigation();
  const [paymentMethod, setPaymentMethod] = useState<string>(
    OrderDetails?.paymentMethod || ""
  );
  const [cardType, setCardType] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>(""); // Added state for expiry
  const [vcc, setVcc] = useState<string>(""); // Added state for VCC

  const userAccept = async () => {
    try {
      // Validation for payment details
      if (paymentMethod === "card") {
        if (!cardType || !cardNumber || !cardExpiry || !vcc) {
          alert("Please fill in all card details.");
          return;
        }
        // Validate card expiry date (MM/YY format)
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        if (!expiryRegex.test(cardExpiry)) {
          alert("Invalid expiry date. Use MM/YY format.");
          return;
        }

        // Validate VCC (3-digit number)
        const vccRegex = /^\d{3}$/;
        if (!vccRegex.test(vcc)) {
          alert("Invalid VCC. Must be a 3-digit number.");
          return;
        }
      }

      const url = `/api/ShipmentTransit/update-shipment-transaction-cost/${OrderDetails?.id}`;
      const results = await get(url);

      if (results) {
        alert("Thanks for your order!");
        onClose();
        navigation.navigate("Map");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setPaymentMethod(OrderDetails?.paymentMethod || "");
  }, [OrderDetails]);

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                      value={OrderDetails?.price?.toString()}
                      editable={false}
                    />
                  </View>
                </View>

                {/* Payment Method */}
                <View style={styles.infoContainer}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Payment method:</Text>
                    <TextInput
                      style={styles.input}
                      value={paymentMethod}
                      editable={false}
                    />
                  </View>
                </View>

                {/* Card Details Form */}
                {paymentMethod === "card" && (
                  <View style={styles.cardDetailsContainer}>
                    <Text style={styles.infoLabel}>Card Type:</Text>
                    <View style={styles.radioGroup}>
                      <TouchableOpacity
                        style={styles.radioButton}
                        onPress={() => setCardType("Visa")}
                      >
                        <Image
                          source={{
                            uri: "https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png",
                          }}
                          style={styles.cardImage}
                        />
                        <Text
                          style={[
                            styles.radioText,
                            cardType === "Visa" && styles.selectedText,
                          ]}
                        >
                          Visa
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.radioButton}
                        onPress={() => setCardType("MasterCard")}
                      >
                        <Image
                          source={{
                            uri: "https://upload.wikimedia.org/wikipedia/commons/0/0c/MasterCard_logo.png",
                          }}
                          style={styles.cardImage}
                        />
                        <Text
                          style={[
                            styles.radioText,
                            cardType === "MasterCard" && styles.selectedText,
                          ]}
                        >
                          MasterCard
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.infoLabel}>Card Number:</Text>
                    <TextInput
                      style={styles.inputCardNumber}
                      placeholder="Enter card number"
                      value={cardNumber}
                      onChangeText={setCardNumber}
                      keyboardType="numeric"
                    />

                    <Text style={styles.infoLabel}>Card Expiry Date:</Text>
                    <TextInput
                      style={styles.inputCardNumber}
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChangeText={setCardExpiry}
                      keyboardType="numbers-and-punctuation"
                    />

                    <Text style={styles.infoLabel}>VCC:</Text>
                    <TextInput
                      style={styles.inputCardNumber}
                      placeholder="Enter VCC"
                      value={vcc}
                      onChangeText={setVcc}
                      keyboardType="numeric"
                      maxLength={3}
                    />
                  </View>
                )}

                {/* Confirm Order Button */}
                <TouchableOpacity style={styles.button} onPress={userAccept}>
                  <Text style={styles.buttonText}>Confirm Order</Text>
                </TouchableOpacity>

                {/* Close Modal Button */}
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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
  inputCardNumber: {
    fontSize: 18,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    width: "100%",
    textAlign: "right",
  },
  cardDetailsContainer: {
    width: "100%",
    marginBottom: 20,
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardImage: {
    width: 40,
    height: 25,
    resizeMode: "contain",
    marginRight: 10,
  },
  radioText: {
    fontSize: 16,
    color: "#555",
  },
  selectedText: {
    fontWeight: "bold",
    color: Colors.primary,
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
});

export default OrderDetailsModal;
