import * as React from "react";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await AsyncStorage.clear();
    const keys = await AsyncStorage.getAllKeys();
    console.log("loaclol", keys);
    props.navigation.navigate("Login"); // Navigate to the Login screen after logout
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: "https://www.pngitem.com/pimgs/m/504-5040528_empty-profile-picture-png-transparent-png.png",
          }} // Replace with your profile image URL
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>John Doe</Text>
        {/* Replace with dynamic name if needed */}
      </View>
      <DrawerItem
        label="Home"
        onPress={() => props.navigation.navigate("Map")}
      />
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <DrawerItem label="Logout" onPress={handleLogout} />
      </View>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <DrawerItem
          label="Chat"
          onPress={() => props.navigation.navigate("Chat")}
        />
      </View>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <DrawerItem
          label="Request"
          onPress={() => props.navigation.navigate("Request")}
        />
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
