import Colors from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { get } from "../../services/apiService";
import Spinner from "react-native-loading-spinner-overlay";
interface ModalProps {
  id: any;
  visible: boolean;
  closeModel: () => void;
}

const DriverModal: React.FC<ModalProps> = ({ id, visible, closeModel }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [driverInfos, setDriverInfos] = useState<any>();

  const driverInfo = {
    name: "John Doe",
    picture:
      "https://cdn-bcldb.nitrocdn.com/kLRdXZGeQymYELvyTfXVsQALHhzNRamH/assets/images/optimized/rev-306e71b/www.teamais.net/wp-content/uploads/2020/07/driver-hire-min.jpg", // Replace with actual image URL
    truckRegistration: "LJ 1234 GP",
    truckModel: "Volvo guun",
    truckColor: "Blue",
  };

  const nogotiate = async () => {
    await AsyncStorage.setItem("state", "nogotiate_with_driver");
    const statx = await AsyncStorage.getItem("state");
    navigation.navigate("Chat");
  };
  const fetchData = async (id: number) => {
    try {
      const url = `/api/Driver/drivers/${id}`;
      console.log(url);
      const response = await get(url);

      setDriverInfos(response);
      console.log(driverInfos);
      setLoading(true);
    } catch (error) {
      // setLoading(false);
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    (async () => {
      await fetchData(id);
    })();
  }, [driverInfos]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={closeModel}
    >
      {/* <Spinner
        visible={visible}
        textContent={"Looking for drivers..."}
        textStyle={{ color: "white" }}
        overlayColor="rgba(47, 149, 220, 0.75)"
      /> */}
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {loading && (
            <>
              {" "}
              <Text style={styles.modalTitle}>Driver Found</Text>
              <Image
                source={{
                  uri: "https://cdn-bcldb.nitrocdn.com/kLRdXZGeQymYELvyTfXVsQALHhzNRamH/assets/images/optimized/rev-306e71b/www.teamais.net/wp-content/uploads/2020/07/driver-hire-min.jpg",
                }}
                style={styles.driverImage}
              />
              <Text style={styles.driverName}>
                {driverInfos.driverDetail.driverName}
              </Text>
              <Text style={styles.truckInfo}>
                <Text style={styles.label}>Registration:</Text>{" "}
                {driverInfos.driverDetail.vehicleRegistration}
              </Text>
              <Text style={styles.truckInfo}>
                <Text style={styles.label}>Model:</Text>{" "}
                {driverInfos.driverDetail.vehicleModel}
              </Text>
              {/* <Text style={styles.truckInfo}>
                <Text style={styles.label}>Color:</Text> {driverInfo.truckColor}
              </Text> */}
              <TouchableOpacity
                onPress={() => {
                  closeModel();
                  nogotiate();
                }}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Negotiate</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  openButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 8,
  },
  openButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
  },
  driverImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  driverName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  truckInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    margin: 16,
    borderRadius: 4,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#28a745",
  },
});

export default DriverModal;
