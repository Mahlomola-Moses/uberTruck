import * as React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleSignUp = () => {
    // Implement your sign-up logic here
    navigation.navigate("Login"); // Navigate to the Login screen after sign-up
  };

  return (
    <View>
      <Text>Sign Up Screen</Text>
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

export default SignUpScreen;
