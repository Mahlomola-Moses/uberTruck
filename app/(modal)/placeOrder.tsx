import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import DriverModal from "@/app/(modal)/driver"; // Replace with your actual driver modal import
import { get, post } from "../../services/apiService";
import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils";
interface PlaceOrderProps {
  visible: boolean;
  onClose: () => void;
}

const PlaceOrder: React.FC<PlaceOrderProps> = ({ visible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [showDriver, setShowDriver] = useState(false);
  const [location, setLocation] = useState({
    address: "",
    latitude: 51.5078788,
    longitude: -0.0877321,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });
  const [pickUpLoc, setPickUpLoc] = useState({
    formatted_address: "",
    geometry: {
      location: { lat: -25.845246, lng: 28.1912538 },
    },
  });
  const [deliveryLoc, setDeliveryLoc] = useState({
    formatted_address: "",
    geometry: {
      location: { lat: -25.845246, lng: 28.1912538 },
    },
  });
  const [shipmentSize, setShipmentSize] = useState({
    height: 0,
    length: 0,
    width: 0,
  });
  const [shipmentDesc, setShipmentDesc] = useState("");

  const placeOrder = async () => {
    const user = await AsyncStorage.getItem("user");
    console.log("user", user);
    const order = {
      PickupAddress: pickUpLoc.formatted_address,
      PickupLatitude: pickUpLoc.geometry.location.lat,
      PickupLongitude: pickUpLoc.geometry.location.lng,
      DeliveryAddress: deliveryLoc.formatted_address,
      DeliveryLatitude: deliveryLoc.geometry.location.lat,
      DeliveryLongitude: deliveryLoc.geometry.location.lng,
      description: shipmentDesc,
      userId: JSON.parse(user)?.id,
      height: shipmentSize.height,
      width: shipmentSize.width,
      length: shipmentSize.length,
    };
    console.log("order", order);
    try {
      setLoading(true);
      const result = await post("/api/ShipmentTransit/create-shipment", order);
      setLoading(false);
      setShowDriver(true);
    } catch (error) {
      console.error("Error creating order:", error);
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.contentContainer}>
            <Spinner
              visible={loading}
              textContent={"Looking for drivers..."}
              textStyle={{ color: "white" }}
              overlayColor="rgba(47, 149, 220, 0.75)"
            />

            <DriverModal
              visible={showDriver}
              closeModel={() => {
                setShowDriver(false);
                onClose();
              }}
            />

            <Text style={styles.subheader}>Order details</Text>

            {/* Pickup Location Input */}
            <Text style={styles.subheader}>Pickup Location</Text>
            <GooglePlacesAutocomplete
              placeholder="Search or move the map"
              fetchDetails={true}
              onPress={(data, details) => {
                const point = details?.geometry?.location;
                if (!point) return;
                setLocation({
                  ...location,
                  latitude: point.lat,
                  longitude: point.lng,
                });
                setPickUpLoc(details);
              }}
              query={{
                key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
                language: "en",
              }}
              renderLeftButton={() => (
                <View style={styles.boxIcon}>
                  <Ionicons
                    name="location-outline"
                    size={24}
                    color={Colors.medium}
                  />
                </View>
              )}
              styles={{
                container: { flex: 0 },
                textInput: {
                  backgroundColor: Colors.grey,
                  paddingLeft: 35,
                  borderRadius: 10,
                },
                textInputContainer: { padding: 8, backgroundColor: "#fff" },
              }}
            />

            {/* Delivery Location Input */}
            <Text style={styles.subheader}>Delivery Location</Text>
            <GooglePlacesAutocomplete
              placeholder="Search for delivery location"
              fetchDetails={true}
              onPress={(data, details) => {
                const point = details?.geometry?.location;
                if (!point) return;
                setDeliveryLoc(details);
              }}
              query={{
                key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
                language: "en",
              }}
              renderLeftButton={() => (
                <View style={styles.boxIcon}>
                  <Ionicons
                    name="location-outline"
                    size={24}
                    color={Colors.medium}
                  />
                </View>
              )}
              styles={{
                container: { flex: 0 },
                textInput: {
                  backgroundColor: Colors.grey,
                  paddingLeft: 35,
                  borderRadius: 10,
                },
                textInputContainer: { padding: 8, backgroundColor: "#fff" },
              }}
            />

            {/* Shipment Dimensions */}
            <Text style={styles.subheader}>Shipment Size</Text>
            <TextInput
              style={styles.input}
              placeholder="Height"
              keyboardType="numeric"
              onChangeText={(value) =>
                setShipmentSize({ ...shipmentSize, height: parseFloat(value) })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Length"
              keyboardType="numeric"
              onChangeText={(value) =>
                setShipmentSize({ ...shipmentSize, length: parseFloat(value) })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Width"
              keyboardType="numeric"
              onChangeText={(value) =>
                setShipmentSize({ ...shipmentSize, width: parseFloat(value) })
              }
            />

            {/* Shipment Description */}
            <Text style={styles.subheader}>Description</Text>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Add description"
              multiline
              onChangeText={setShipmentDesc}
            />

            <TouchableOpacity style={styles.button} onPress={placeOrder}>
              <Text style={styles.buttonText}>Place order</Text>
            </TouchableOpacity>

            <Button title="Close" onPress={onClose} color={Colors.primary} />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  contentContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  subheader: { fontSize: 16, fontWeight: "600", marginVertical: 8 },
  input: {
    backgroundColor: Colors.grey,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  descriptionInput: { height: 100, textAlignVertical: "top" },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    marginVertical: 16,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  boxIcon: { position: "absolute", left: 15, top: 18, zIndex: 1 },
});

export default PlaceOrder;
