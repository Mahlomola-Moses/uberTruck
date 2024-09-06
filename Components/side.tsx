import * as React from "react";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Button, View, Text } from "react-native";
import LocationSearch from "../old/map";
import CustomHeader from "./CustomHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useNavigation } from "expo-router";
import AuthScreen from "@/old/sign";
import CustomDrawerContent from "./sideContent";
type DrawerParamList = {
  index: undefined;
  settings: undefined;
  sign: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {/* <Drawer.Screen
        name="index"
        component={LocationSearch}
        options={{
          header: () => <CustomHeader />,
        }}
      /> */}
      <Drawer.Screen
        name="sign"
        component={AuthScreen}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
