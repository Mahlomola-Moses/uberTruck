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
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import Colors from "../constants/Colors";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { get, post } from "../services/apiService";
import Spinner from "react-native-loading-spinner-overlay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OrderCostModal from "@/app/(modal)/orderCost";
import DriverModal from "@/app/(modal)/driver";
export type Ref = BottomSheetModal;

const PlaceOrder = forwardRef<Ref>((props, ref) => {
  const [loading, setLoading] = useState(false);
  const [costModel, setCostModel] = useState(false);
  const snapPoints = useMemo(() => ["100%"], []);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );
  const { dismiss } = useBottomSheetModal();
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
      location: {
        lat: -25.845246,
        lng: 28.1912538,
      },
    },
  });
  const [deliveryLoc, setDeliveryLoc] = useState({
    formatted_address: "",
    geometry: {
      location: {
        lat: -25.845246,
        lng: 28.1912538,
      },
    },
  });

  const [shipmentSize, setShipmentSize] = useState({
    height: 0,
    length: 0,
    width: 0,
  });
  const [shipmentDesc, setShipmentDesc] = useState("");
  const [showDriver, setShowDriver] = useState(false);
  const placeOrder = async () => {
    const user: any = await AsyncStorage.getItem("user");
    console.log("user", user.id);

    const order = {
      PickupAddress: pickUpLoc?.formatted_address,
      PickupLatitude: pickUpLoc?.geometry.location.lat,
      PickupLongitude: pickUpLoc?.geometry.location.lng,
      DeliveryAddress: deliveryLoc?.formatted_address,
      DeliveryLatitude: deliveryLoc.geometry.location.lat,
      DeliveryLongitude: deliveryLoc.geometry.location.lng,
      AddressData: "",
      description: shipmentDesc,
      userId: JSON.parse(user)?.id,
      height: shipmentSize.height,
      width: shipmentSize.width,
      length: shipmentSize.length,
    };
    console.log(order);
    try {
      setLoading(true);
      const result = await post("/api/ShipmentTransit/create-shipment", order);
      console.log("Success =>", result);
      //await AsyncStorage.setItem("orderData", JSON.stringify(result.user));
      setLoading(false);
      openModal();
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    } finally {
      console.log("done");
      setLoading(false);
    }
  };

  const openModal = () => {
    setCostModel(true);
  };

  const closeModal = () => {
    setCostModel(false);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowDriver(true);
      console.log("driver found");
    }, 5000);
  };

  const closeDriverModal = () => {
    setShowDriver(false);
  };

  return (
    <BottomSheetModal
      handleIndicatorStyle={{ display: "none" }}
      backgroundStyle={{ borderRadius: 0, backgroundColor: Colors.lightGrey }}
      overDragResistanceFactor={0}
      ref={ref}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
    >
      <Spinner
        visible={loading}
        textContent={"Looking for drivers..."}
        textStyle={{ color: "white" }}
        overlayColor="rgba(47, 149, 220, 0.75)"
      />
      <OrderCostModal
        visible={costModel}
        onClose={closeModal}
        distance="20"
        price="45"
      />
      <DriverModal visible={showDriver} closeMOdel={closeDriverModal} />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.contentContainer}
        >
          <View style={styles.contentContainer}>
            <View style={styles.toggle}>
              <Text style={styles.subheader}>Order details</Text>
            </View>

            <Text style={styles.subheader}>Pickup Location</Text>
            <GooglePlacesAutocomplete
              placeholder="Search or move the map"
              fetchDetails={true}
              onPress={(data, details) => {
                const point = details?.geometry?.location;
                console.log("Pickup =>", data, "***", details);

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
                container: {
                  flex: 0,
                },
                textInput: {
                  backgroundColor: Colors.grey,
                  paddingLeft: 35,
                  borderRadius: 10,
                },
                textInputContainer: {
                  padding: 8,
                  backgroundColor: "#fff",
                },
              }}
            />

            <Text style={styles.subheader}>Delivery Location</Text>
            <GooglePlacesAutocomplete
              placeholder="Search or move the map"
              fetchDetails={true}
              onPress={(data, details) => {
                const point = details?.geometry?.location;
                console.log("Delivery =>", data, details);
                if (!point) return;
                setLocation({
                  ...location,
                  latitude: point.lat,
                  longitude: point.lng,
                });
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
                container: {
                  flex: 0,
                },
                textInput: {
                  backgroundColor: Colors.grey,
                  paddingLeft: 35,
                  borderRadius: 10,
                },
                textInputContainer: {
                  padding: 8,
                  backgroundColor: "#fff",
                },
              }}
            />

            <Text style={styles.subheader}>Shipment size(Meter)</Text>
            <TouchableOpacity>
              <View style={styles.item}>
                <Ionicons name="add" size={20} color={Colors.medium} />
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="Height"
                  placeholderTextColor={Colors.medium}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onEndEditing={(e) => {
                    const value = e.nativeEvent.text;
                    setShipmentSize({
                      ...shipmentSize,
                      height: value ? Number(value) : 0,
                    });
                    console.log(shipmentSize);
                    console.log(e.nativeEvent.text);
                  }}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.item}>
                <Ionicons name="add" size={20} color={Colors.medium} />
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="Length"
                  placeholderTextColor={Colors.medium}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={(value: string) => {
                    setShipmentSize({
                      ...shipmentSize,
                      length: value ? Number(value) : 0,
                    });
                  }}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.item}>
                <Ionicons name="add" size={20} color={Colors.medium} />
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="Width"
                  placeholderTextColor={Colors.medium}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                  onChangeText={(value: string) => {
                    setShipmentSize({
                      ...shipmentSize,
                      width: value ? Number(value) : 0,
                    });
                  }}
                />
              </View>
            </TouchableOpacity>

            <Text style={styles.subheader}>Shipment description</Text>
            <TouchableOpacity>
              <View style={styles.item}>
                <Ionicons name="add" size={20} color={Colors.medium} />
                <TextInput
                  style={{ flex: 1, padding: 10 }}
                  placeholder="Shipment description"
                  placeholderTextColor={Colors.medium}
                  keyboardType="default"
                  autoCapitalize="sentences"
                  autoCorrect={false}
                  multiline={true}
                  value={shipmentDesc}
                  onChangeText={setShipmentDesc}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                placeOrder();
              }}
            >
              <Text style={styles.buttonText}>Place order</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  toggle: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 32,
  },
  toggleActive: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 32,
    paddingHorizontal: 30,
  },
  activeText: {
    color: "#fff",
    fontWeight: "700",
  },
  toggleInactive: {
    padding: 8,
    borderRadius: 32,
    paddingHorizontal: 30,
  },
  inactiveText: {
    color: Colors.primary,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    margin: 16,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  subheader: {
    fontSize: 16,
    fontWeight: "600",
    margin: 16,
  },
  item: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderColor: Colors.grey,
    borderWidth: 1,
  },
  boxIcon: {
    position: "absolute",
    left: 15,
    top: 18,
    zIndex: 1,
  },
});

export default PlaceOrder;
