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
import DriverModal from "../(modal)/driver";
import { get } from "../../services/apiService";
import { useRoute } from "@react-navigation/native";
import Colors from "@/constants/Colors";
const CheckDriverScreen = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDriver, setShowDriver] = useState(true);
  const [data, setData] = useState({});
  //const route = useRoute();
  //const { driverId } = route.params;

  // useEffect(() => {
  //   fetchData(driverId);
  // }, [showDriver]);

  // const fetchData = async (id: number) => {
  //   try {
  //     setShowDriver(false);
  //     const response = await get(
  //       `/api/Driver/drivers/${route.params?.driverId}`
  //     );
  //     setData(response);
  //     setShowDriver(true);
  //   } catch (error) {
  //     // setLoading(false);
  //     console.error("Error fetching data:", error);
  //   }
  // };

  //fetchData(driverId);
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <Text style={styles.header}>Driver details...</Text>
      <Button
        title="Close"
        onPress={() => {
          setShowDriver(true);
          console.log("driver");
        }}
        color="#fff"
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

export default CheckDriverScreen;
