import React, { useState } from "react";
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

const RequestScreen = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleRequestPress = (request: any) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  const renderRequest = ({ item }) => (
    <TouchableOpacity onPress={() => handleRequestPress(item)}>
      <View style={styles.requestCard}>
        <Text style={styles.requestTitle}>{item.name}</Text>
        <Text style={styles.requestLocation}>Location: {item.location}</Text>
        <Text style={styles.requestStatus}>Status: {item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <Text style={styles.header}>Shipping Requests</Text>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        renderItem={renderRequest}
        contentContainerStyle={styles.list}
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
                <Text style={styles.modalTitle}>{selectedRequest.name}</Text>
                <Text style={styles.modalDetail}>
                  Location: {selectedRequest.location}
                </Text>
                <Text style={styles.modalDetail}>
                  Status: {selectedRequest.status}
                </Text>
                <Text style={styles.modalDetail}>
                  Distance: {selectedRequest.distance}
                </Text>
                <Text style={styles.modalDetail}>
                  Weight: {selectedRequest.weight}
                </Text>
                <Text style={styles.modalDetail}>
                  Description: {selectedRequest.description}
                </Text>
              </>
            )}
            <Button title="Close" onPress={() => setModalVisible(false)} />
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
});

export default RequestScreen;
