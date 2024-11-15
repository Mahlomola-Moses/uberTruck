import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text } from "react-native";
import LoginScreen from "../auth/LoginScreen"; // Import your Login screen
import SignUpScreen from "../auth/SignUpScreen"; // Import your Sign-up screen
import MapScreen from "../screens/MapScreen"; // Import your Map screen
import CustomDrawerContent from "../screens/CustomDrawerContent"; // Custom Drawer Content
import CustomHeader from "@/Components/CustomHeader";
import ChatScreen from "../screens/chat";
import RequestScreen from "../screens/request";
import OrdersScreen from "../screens/Orders";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Stack Navigator for Authentication Flow
const AuthStack: React.FC = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="Map" component={MapScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
    <Stack.Screen name="Request" component={OrdersScreen} />
    <Stack.Screen name="Orders" component={OrdersScreen} />
  </Stack.Navigator>
);

// Main App Navigator with Drawer
const AppDrawer: React.FC = () => (
  <Drawer.Navigator
    drawerContent={(props) => {
      return <CustomDrawerContent {...props} />;
    }}
  >
    <Drawer.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Drawer.Screen
      name="Map"
      component={MapScreen}
      options={{ header: () => <CustomHeader /> }}
    />

    <Drawer.Screen
      name="Chat"
      component={ChatScreen}
      options={{ header: () => <CustomHeader /> }}
    />

    <Drawer.Screen
      name="Request"
      component={OrdersScreen}
      options={{ headerShown: false }}
    />
    <Drawer.Screen
      name="Orders"
      component={OrdersScreen}
      options={{ headerShown: false }}
    />

    {/* Add more screens to the drawer here if needed */}
  </Drawer.Navigator>
);

const RootLayoutNav: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const [appKey, setAppKey] = useState<number>(0);
  const navigation = useNavigation();
  const checkLoginStatus = async () => {
    const userToken = await AsyncStorage.getItem("logged");
    if (userToken) {
      setIsLoggedIn(userToken === "YES" ? true : false);
    } else {
      setIsLoggedIn(false);
    }

    const user: any = await AsyncStorage.getItem("logged");
    if (JSON.parse(user)?.role_Id == 2) {
      await AsyncStorage.setItem("role", "user");

      navigation.navigate("Map");
    } else {
      await AsyncStorage.setItem("role", "driver");
      navigation.navigate("Orders");
    }
  };

  React.useEffect(() => {
    const handleNavigation = async () => {
      const keys = await AsyncStorage.getAllKeys();
      console.log("loaclol1", keys);
      const user: any = await AsyncStorage.getItem("logged");
      if (isLoggedIn) {
        if (JSON.parse(user)?.role_Id == 2) {
          await AsyncStorage.setItem("role", "user");
          navigation.navigate("Map");
        } else {
          await AsyncStorage.setItem("role", "driver");
          navigation.navigate("Orders");
        }
      }
    };
    handleNavigation();
  }, [isLoggedIn]);

  React.useEffect(() => {
    checkLoginStatus();
  }, [isLoggedIn]);

  useEffect(() => {
    // const handleNavigation = async () => {
    //   const keys = await AsyncStorage.getAllKeys();
    //   console.log("loaclol2", keys);
    //   const user: any = await AsyncStorage.getItem("user ");
    //   if (isLoggedIn) {
    //     if (JSON.parse(user)?.role_Id == 1) {
    //       await AsyncStorage.setItem("role", "user");
    //       navigation.navigate("Map");
    //     } else {
    //       await AsyncStorage.setItem("role", "driver");
    //       navigation.navigate("Orders");
    //     }
    //   }
    // };
    // handleNavigation();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <NavigationContainer independent={true}>
          {/* {isLoggedIn ? <AppDrawer /> : <AuthStack />} */}
          <AppDrawer />
        </NavigationContainer>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayoutNav;
