import * as React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
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

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Stack Navigator for Authentication Flow
const AuthStack: React.FC = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="Map" component={MapScreen} />
    <Stack.Screen name="Chat" component={ChatScreen} />
    <Stack.Screen name="Request" component={RequestScreen} />
  </Stack.Navigator>
);

// Main App Navigator with Drawer
const AppDrawer: React.FC = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
  >
    <Drawer.Screen
      name="Map"
      component={MapScreen}
      options={{ header: () => <CustomHeader /> }}
    />
    <Drawer.Screen
      name="Login"
      component={LoginScreen}
      options={{ headerShown: false }}
    />
    <Drawer.Screen
      name="Chat"
      component={ChatScreen}
      options={{ header: () => <CustomHeader /> }}
    />

    <Drawer.Screen
      name="Request"
      component={RequestScreen}
      options={{ headerShown: false }}
    />
    {/* Add more screens to the drawer here if needed */}
  </Drawer.Navigator>
);

const RootLayoutNav: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);

  const checkLoginStatus = async () => {
    const userToken = await AsyncStorage.getItem("logged");
    if (userToken) {
      setIsLoggedIn(userToken === "YES" ? true : false);
    } else {
      setIsLoggedIn(false);
    }

    console.log("User is logged in", userToken);
  };

  React.useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <NavigationContainer independent={true}>
          {isLoggedIn ? <AppDrawer /> : <AuthStack />}
        </NavigationContainer>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayoutNav;
