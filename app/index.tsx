import "react-native-get-random-values";
import React from "react";
import { View, Text } from "react-native";
import RootLayoutNav from "./navigation/RootLayoutNav";
import { LogBox } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "./screens/CustomDrawerContent";
import CustomHeader from "@/Components/CustomHeader";
import LoginScreen from "./auth/LoginScreen";
import SignUpScreen from "./auth/SignUpScreen";
import ChatScreen from "./screens/chat";
import MapScreen from "./screens/MapScreen";
import OrdersScreen from "./screens/Orders";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Ignore all log notifications:
LogBox.ignoreAllLogs(true);

const Drawer = createDrawerNavigator();
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

    <Drawer.Screen
      name="SignUp"
      component={SignUpScreen}
      options={{ headerShown: false }}
    />

    {/* Add more screens to the drawer here if needed */}
  </Drawer.Navigator>
);

export default function App() {
  return (
    <NavigationContainer independent={true}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <AppDrawer />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </NavigationContainer>
  );
}
