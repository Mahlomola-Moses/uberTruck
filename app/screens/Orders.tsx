import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { get, post } from "../../services/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const OrdersScreen = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [userId, setUserId] = useState<string | null>(null);
  const handleRequestPress = async (request: any) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const acceptRequest = async (model: any) => {
    console.log("Accept request", model);
    try {
      const data = {
        shipmentId: Number(model?.id),
        driverId: Number(userId),
      };
      const results = await post(
        "/api/ShipmentTransit/update-shipment-driver",
        data
      );
      await AsyncStorage.setItem("shipmentId", model?.id.toString());
      await AsyncStorage.setItem("acceptedRequest", JSON.stringify(model));
      fetchRequests();
      setModalVisible(false);
      navigation.navigate("Chat");
    } catch (error) {}
  };
  const fetchRequests = async () => {
    try {
      const url = `/api/ShipmentTransit/available-shipments/${userId}`;
      console.log(url);
      const response = await get(url);

      setRequests(response?.shipmentTransits);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userx: any = await AsyncStorage.getItem("user");
        console.log("ordeers page user object ", JSON.parse(userx));
        if (userx) {
          setUserId(JSON.parse(userx).id);
          console.log("ordeers page user id ", userId);
        }
      } catch (error) {
        console.error("Failed to retrieve user data:", error);
      }
    };

    fetchUserData();
    fetchRequests(); // Call the fetch function
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [userId])
  );

  const renderRequest = ({ item }) => (
    <TouchableOpacity onPress={() => handleRequestPress(item)}>
      <View style={styles.requestCard}>
        <Text style={styles.requestTitle}>Shipment #{item.id}</Text>
        <Text style={styles.requestLocation}>
          Location: {item.deliveryAddress}
        </Text>
        <Text style={styles.requestStatus}>Status: Pending</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <Text style={styles.header}>Requests</Text>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={renderRequest}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No requests found</Text>
        }
      />

      {/* Modal for viewing request details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            {selectedRequest && (
              <>
                <Text style={styles.modalTitle}>
                  Shipment #{selectedRequest?.id}
                </Text>
                <Text style={styles.modalDetail}>
                  Location: {selectedRequest?.deliveryAddress}
                </Text>
                <Text style={styles.modalDetail}>Status:Pending</Text>
                {/* <Text style={styles.modalDetail}>
                  Distance: {selectedRequest.distance}
                </Text>
                <Text style={styles.modalDetail}>
                  Weight: {selectedRequest.weight}
                </Text> */}
                <Text style={styles.modalDetail}>
                  Description: {selectedRequest?.description}
                </Text>
              </>
            )}
            <Button
              title="Accept and negotiate"
              onPress={() => {
                acceptRequest(selectedRequest);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const colors = {
  light: {
    text: "#000",
    background: "#fff",
    tint: "#2f95dc",
    tabIconDefault: "#ccc",
    tabIconSelected: "#2f95dc",
  },
  dark: {
    text: "#fff",
    background: "#000",
    tint: "#fff",
    tabIconDefault: "#ccc",
    tabIconSelected: "#fff",
  },
  primary: "#1c2a33",
  lightGrey: "#FCF8FF",
  grey: "#EEE9F0",
  medium: "#9F9AA1",
  mediumDark: "#424242",
  green: "#437919",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grey,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  list: {
    paddingBottom: 16,
  },
  requestCard: {
    backgroundColor: colors.lightGrey,
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: colors.mediumDark,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
  },
  requestLocation: {
    fontSize: 16,
    color: colors.medium,
    marginTop: 4,
  },
  requestStatus: {
    fontSize: 16,
    color: colors.green,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: colors.lightGrey,
    padding: 20,
    borderRadius: 10,
    shadowColor: colors.mediumDark,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },
  modalDetail: {
    fontSize: 16,
    color: colors.medium,
    marginBottom: 5,
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});

export default OrdersScreen;
