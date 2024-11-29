import { get } from "@/services/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Image } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const GOOGLE_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_API_KEY || "YOUR_BACKUP_API_KEY";

const TrackScreen = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [destination, setDestinationDestibation] = useState({
    latitude: -25.845246,
    longitude: 28.191254,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  useEffect(() => {
    (async () => {
      const orderx: any = await AsyncStorage.getItem("contextOrder");
      const order = JSON.parse(orderx);
      console.log("TRACK -", order?.shipmentTransit?.pickupLatitude);
      setDestinationDestibation({
        latitude: order?.shipmentTransit?.pickupLatitude,
        longitude: order?.shipmentTransit?.pickupLongitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    })();

    // Simulated location
    const fetchLocation = async () => {
      try {
        const driverId: any = await AsyncStorage.getItem("order_ship_driver");
        const url = `api/Driver/retrieve-driver-position/${driverId}`;
        const response = await get(url);
        const { latitude, longitude } = response.driverPosition;
        // Update the location state
        console.log(response);
        setLocation({ latitude: latitude, longitude: longitude });
      } catch (err) {
        //setError('Failed to fetch location');
        console.error(err);
      }
    };

    // Polling every 5 seconds
    fetchLocation();
    const interval = setInterval(fetchLocation, 5000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  if (!location) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <MapView
      showsUserLocation={true}
      style={styles.map}
      region={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      <Marker
        coordinate={location}
        title="Driver locatiom"
        description="driver is here.."
      >
        <Image
          source={require("@/assets/images/truck_driver_logo_transparent.png")}
          style={{ width: 50, height: 50 }}
        />
      </Marker>
      <Marker coordinate={destination} title="Track Driver" />
      <MapViewDirections
        origin={location}
        destination={destination}
        apikey={GOOGLE_API_KEY}
        strokeColor="blue"
        strokeWidth={6}
        onError={(errorMessage) =>
          console.error("Directions Error:", errorMessage)
        }
      />
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TrackScreen;
