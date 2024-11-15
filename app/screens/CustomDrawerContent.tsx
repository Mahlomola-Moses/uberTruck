import * as React from "react";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  useDrawerStatus,
} from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, Image, StyleSheet } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const navigation = useNavigation();
  const [role, setRole] = React.useState("");
  const drawerStatus = useDrawerStatus();

  const handleLogout = async () => {
    await AsyncStorage.clear();
    const keys = await AsyncStorage.getAllKeys();

    props.navigation.navigate("Login");
  };
  const checkStates = async () => {
    const rolex = await AsyncStorage.getItem("role");
    if (rolex) {
      setRole(rolex);
    }
  };

  const home = async () => {
    if (role == "driver") {
      props.navigation.navigate("Orders");
    } else {
      props.navigation.navigate("Map");
    }
    console.log("role..", role);
  };

  React.useEffect(() => {
    checkStates();
  }, [role]);

  React.useEffect(() => {
    checkStates();
  }, [role]);

  useFocusEffect(
    React.useCallback(() => {
      // Function to refresh local storage
      const refreshLocalStorage = async () => {
        try {
          // const allKeys = await AsyncStorage.getAllKeys();
          // setKeys(allKeys); // Update state with the latest keys
          // console.log("Updated keys:", allKeys);

          // // If you need to fetch specific data, do it here
          // const user = await AsyncStorage.getItem("user");
          // console.log("Updated user data:", JSON.parse(user));
          checkStates();
        } catch (error) {
          console.error("Error refreshing local storage:", error);
        }
      };

      refreshLocalStorage();

      // Optional cleanup (if needed)
      return () => {
        console.log("Drawer no longer in focus");
      };
    }, [])
  );

  useEffect(() => {
    if (drawerStatus === "open") {
      checkStates();
    }
  }, [drawerStatus]);
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: "https://www.pngitem.com/pimgs/m/504-5040528_empty-profile-picture-png-transparent-png.png",
          }} // Replace with your profile image URL
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{role}</Text>
        {/* Replace with dynamic name if needed */}
      </View>
      <DrawerItem
        label="Home"
        onPress={() => {
          console.log("Press");
          home();
        }}
      />

      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <DrawerItem
          label="Chat"
          onPress={() => props.navigation.navigate("Chat")}
        />
      </View>
      {role == "driver" && (
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <DrawerItem
            label="Request"
            onPress={() => props.navigation.navigate("Request")}
          />
        </View>
      )}
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <DrawerItem label="Logout" onPress={handleLogout} />
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CustomDrawerContent;
