import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { Stack, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { get, post } from "../services/apiService";
import Spinner from "react-native-loading-spinner-overlay";

interface AuthScreenProps {
  isSignup?: boolean;
}

interface Errors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ isSignup = false }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [user, setUser] = useState("not");

  useEffect(() => {
    console.log("hook");
  }, []);

  const validateInputs = (): boolean => {
    let valid = true;
    let newErrors: Errors = {};

    if (!email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 4) {
      newErrors.password = "Password must be at least 6 characters long";
      valid = false;
    }

    if (isSignup) {
      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
        valid = false;
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };
  const handleLogin = async () => {
    await AsyncStorage.setItem("logged", "YES");
    navigation.navigate("map");
  };
  const signIn = async () => {
    if (validateInputs()) {
      try {
        setLoading(true);
        const result = await post("/api/login", {
          Email: email,
          Password: password,
        });

        setLoading(false);
        if (result) {
          console.log("Success =>", result);
          await AsyncStorage.setItem("user", JSON.stringify(result.user));
          setUser("logged-in");
          handleLogin();
        } else {
          setUser("failed");
        }
      } catch (error) {
        setUser("failed");
        console.log("Error fetching data:", error);
        setLoading(false);
      } finally {
        console.log("done");
      }
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Spinner
        visible={loading}
        textContent={"Loading..."}
        textStyle={styles.spinnerTextStyle}
      />
      <Text style={styles.title}>{isSignup ? "Sign Up" : "Login"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={Colors.medium}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={Colors.medium}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        value={password}
        onChangeText={setPassword}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}
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
      {user == "failed" && (
        <Text style={styles.errorText}>Credentials don't match.</Text>
      )}
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={signIn}
        disabled={loading}
      >
        {/* <Text style={styles.buttonText}>{isSignup ? "Sign Up" : "Login"}</Text> */}
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>
            {isSignup ? "Sign Up" : "Login"}
          </Text>
        )}
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
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("signUp");
        }}
      >
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>
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
  signUpText: {
    color: Colors.medium,
    marginTop: 20,
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
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: Colors.disabled,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
});

export default AuthScreen;
