import "react-native-get-random-values";
import React from "react";
import { View, Text } from "react-native";
import RootLayoutNav from "./navigation/RootLayoutNav";
import { LogBox } from "react-native";

// Ignore all log notifications:
LogBox.ignoreAllLogs(true);

export default function App() {
  return <RootLayoutNav />;
}
