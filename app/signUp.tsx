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
  name?: string;
  surname?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ isSignup = false }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [signedUp, setSignedUp] = useState<boolean>(false);

  useEffect(() => {
    console.log("hook");
  }, []);

  const validateInputs = (): boolean => {
    let valid = true;
    let newErrors: Errors = {};

    if (!name) {
      newErrors.name = "Name is required";
      valid = false;
    }
    if (!surname) {
      newErrors.surname = "Surname is required";
      valid = false;
    }

    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
      valid = false;
    } else if (!/^0[6789]\d{8}$/.test(phoneNumber)) {
      newErrors.phoneNumber =
        "Please enter a valid South African cell phone number";
      valid = false;
    }
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
    navigation.navigate("index");
  };

  const signUp = async () => {
    if (validateInputs()) {
      setLoading(true);
      try {
        const result = await post("/api/user/create-user", {
          name: name,
          surname: surname,
          phoneNumber: phoneNumber,
          email: email,
          password: password,
          roleId: 1,
        });
        setLoading(false);
        setSignedUp(true);
        //navigation.navigate("sign");
      } catch (error) {
        console.error("Error signing:", error);
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
      <Text style={styles.title}>{"Sign Up"}</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor={Colors.medium}
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
        value={name}
        onChangeText={setName}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Surname"
        placeholderTextColor={Colors.medium}
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
        value={surname}
        onChangeText={setSurname}
      />
      {errors.surname && <Text style={styles.errorText}>{errors.surname}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor={Colors.medium}
        keyboardType="number-pad"
        autoCapitalize="none"
        autoCorrect={false}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      {errors.phoneNumber && (
        <Text style={styles.errorText}>{errors.phoneNumber}</Text>
      )}

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

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor={Colors.medium}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />
      <View style={{ marginBottom: 12, marginTop: 2 }}>
        {signedUp && (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("sign");
            }}
          >
            <Text style={styles.successText}>
              Successfully signed up, please{" "}
              <Text style={styles.link}>login</Text>
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={signUp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>{"Sign Up"}</Text>
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
      <TouchableOpacity>
        <Text style={styles.signUpText}>Login</Text>
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
  successText: {
    color: "#3acc00",
  },
  buttonDisabled: {
    backgroundColor: Colors.disabled,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default AuthScreen;
