import React, { useEffect, useState } from "react";
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
import { get } from "@/services/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const requests = [
  {
    id: "1",
    name: "Shipment #001",
    location: "Midrand",
    status: "Pending",
    distance: "15 miles",
    weight: "500 kg",
    description: "Electronic goods",
  },
  {
    id: "2",
    name: "Shipment #002",
    location: "Centurion",
    status: "Shipped",
    distance: "100 miles",
    weight: "1200 kg",
    description: "Furniture",
  },
  {
    id: "3",
    name: "Shipment #003",
    location: "PretoriaS",
    status: "Delivered",
    distance: "50 miles",
    weight: "700 kg",
    description: "Clothing",
  },
  // Add more requests as needed
];

const HistoryScreen = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [hisory, setHistory] = useState([]);
  const handleRequestPress = (request: any) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const fetchHistory = async () => {
    try {
      const url = `/api/ShipmentTransit/user-shipments/${userId}`;
      console.log("history", url);
      const response = await get(url);
      console.log("response h", response.shipmentTransits);
      setHistory(response.shipmentTransits);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };
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
  useEffect(() => {
    fetchUserData();
    fetchHistory();
  }, [userId]);

  const renderRequest = ({ item }) => (
    <TouchableOpacity onPress={() => handleRequestPress(item)}>
      <View style={styles.requestCard}>
        <Text style={styles.requestTitle}>{item.deliveryAddress}</Text>
        <Text style={styles.requestLocation}>
          Location: {item.pickupAddress}
        </Text>
        <Text style={styles.requestStatus}>
          Description: {item.description}
        </Text>
        <Text style={styles.requestLocation}>Price: R {item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      {/* <Text style={styles.header}>History</Text> */}
      <FlatList
        data={hisory}
        keyExtractor={(item) => item.id}
        renderItem={renderRequest}
        contentContainerStyle={styles.list}
      />
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
});

export default HistoryScreen;
