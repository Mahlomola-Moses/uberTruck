import React from "react";
import { View, Button } from "react-native";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useNavigation } from "expo-router";
const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const handleLogout = async () => {
    // Clear the user token or any other data
    await AsyncStorage.removeItem("logged");
    // Navigate to the sign-in screen
    props.navigation.navigate("sign"); // Adjust this route to match your sign-in screen
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={{ paddingBottom: "20%" }}>
        <Button title="Logout" onPress={handleLogout} color="#d9534f" />
      </View>
    </View>
  );
};

export default CustomDrawerContent;
