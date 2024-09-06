import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LocationSearch from "./map";
import SignInScreen from "./sign"; // Import your sign-in screen
import CustomHeader from "@/Components/CustomHeader";
import CustomDrawerContent from "../Components/sideContent";
import DrawerNavigator from "../Components/side";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Stack Navigator for Authentication Flow
const AuthStack: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="sign" component={SignInScreen} />
    <Stack.Screen
      name="map"
      options={{ header: () => <CustomHeader /> }}
      component={LocationSearch}
    />
  </Stack.Navigator>
);

// Main App Navigator with Drawer
const AppDrawer: React.FC = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
  >
    <Drawer.Screen
      name="map"
      component={LocationSearch}
      options={{ header: () => <CustomHeader /> }}
    />

    {/* Add other screens here */}
  </Drawer.Navigator>
);

export default function RootLayoutNav() {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);

  const checkLoginStatus = async () => {
    const userToken = await AsyncStorage.getItem("logged");
    if (userToken) {
      setIsLoggedIn(userToken === "YES" ? true : false);
    } else {
      setIsLoggedIn(false);
    }
  };

  React.useEffect(() => {
    checkLoginStatus();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <NavigationContainer>
          {isLoggedIn ? <AppDrawer /> : <AuthStack />}
        </NavigationContainer>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
