import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Stack, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { get, post } from "../services/apiService";
interface AuthScreenProps {
  isSignup?: boolean;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ isSignup = false }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  const handleLogin = async () => {
    await AsyncStorage.setItem("logged", "YES");
    navigation.navigate("index");
  };
  useEffect(() => {
    console.log("useeffedt");
  }, []);

  const signUp = async () => {
    try {
      const result = await post("/api/user/create-user", {
        name: "test1",
        surname: "test1",
        phoneNumber: "0123456789",
        email: "test1@ladesh.com",
        password: "12345",
        roleId: 1,
      });
      console.log("Success =>", result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      console.log("done");
    }
  };
  const signIn = async () => {
    setLoading(true);
    try {
      const result = await post("/api/login", {
        Email: "test1@ladesh.com",
        Password: "12345",
      });
      console.log("Success =>", result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      console.log("done");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{isSignup ? "Sign Up" : "Login"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={Colors.medium}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={Colors.medium}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />

      {isSignup && (
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor={Colors.medium}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>{isSignup ? "Sign Up" : "Login"}</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={signInWithFacebook}
        >
          <FontAwesome name="facebook" size={24} color="#4267B2" />
          <Text style={styles.socialButtonText}>Facebook</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={signInWithGoogle}
        >
          <FontAwesome name="google" size={24} color="#DB4437" />
          <Text style={styles.socialButtonText}>Google</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const signInWithGoogle = async () => {
  try {
    // Initialize Google Sign-In (configure webClientId from Firebase)
    // GoogleSignin.configure({
    //   webClientId: 'YOUR_WEB_CLIENT_ID',
    // });
    // await GoogleSignin.hasPlayServices();
    // const userInfo = await GoogleSignin.signIn();
    // console.log(userInfo);
    // Handle the user information
  } catch (error) {
    console.error(error);
  }
};

const signInWithFacebook = async () => {
  //   try {
  //     const result = await LoginManager.logInWithPermissions([
  //       'public_profile',
  //       'email',
  //     ]);
  //     if (result.isCancelled) {
  //       throw 'User cancelled the login process';
  //     }
  //     const data = await AccessToken.getCurrentAccessToken();
  //     console.log(data);
  //     // Handle the access token
  //   } catch (error) {
  //     console.error(error);
  //   }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.mediumDark,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    borderRadius: 8,
    backgroundColor: Colors.grey,
    marginBottom: 15,
    color: Colors.mediumDark,
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  orText: {
    color: Colors.medium,
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    backgroundColor: Colors.grey,
    width: "48%",
    justifyContent: "center",
  },
  socialButtonText: {
    marginLeft: 10,
    color: Colors.mediumDark,
  },
});

export default AuthScreen;
