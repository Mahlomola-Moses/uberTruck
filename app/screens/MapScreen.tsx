import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  PermissionsAndroid,
  Keyboard,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Colors from "@/constants/Colors";
import { useNavigation } from "expo-router";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import PlaceOrder from "../../Components/PlaceOrder";
import Geolocation from "react-native-geolocation-service";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MapScreen: React.FC = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const navigation = useNavigation();
  const [location, setLocation] = useState({
    latitude: -25.858458,
    longitude: 28.18961,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });
  const [address, setAddress] = useState<string | null>(null);
  const openModal = () => {
    bottomSheetRef.current?.present();
  };

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "App needs access to your location",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Location permission denied");
          return;
        }
      }
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        console.log("Location", location);
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
        let [reverseGeocode] = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (reverseGeocode) {
          setAddress(
            `${reverseGeocode.name}, ${reverseGeocode.street}, ${reverseGeocode.city}, ${reverseGeocode.region}, ${reverseGeocode.country}`
          );
          await AsyncStorage.setItem(
            "city",
            reverseGeocode.city || "searching city.."
          );
          console.log(address);
        }
      })();
    };

    requestLocationPermission();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1, height: "50%" }}>
        <PlaceOrder ref={bottomSheetRef} />

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
          }}
          query={{
            key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
            language: "en",
          }}
          renderLeftButton={() => (
            <View style={styles.boxIcon}>
              <Ionicons name="search-outline" size={24} color={Colors.medium} />
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

        <MapView
          showsUserLocation={true}
          style={styles.map}
          region={location}
          showsMyLocationButton={true}
        >
          {/* <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Your Location"
            description="You are here"
          /> */}
        </MapView>
        <View style={styles.absoluteBox}>
          <TouchableOpacity style={styles.button} onPress={openModal}>
            <Text style={styles.buttonText}>Place order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  absoluteBox: {
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 16,
    margin: 16,
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  boxIcon: {
    position: "absolute",
    left: 15,
    top: 18,
    zIndex: 1,
  },
});

export default MapScreen;
