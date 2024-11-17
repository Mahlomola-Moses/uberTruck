import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from "react-native-loading-spinner-overlay";
import { post } from "@/services/apiService";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";

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

const SignUpScreen: React.FC<AuthScreenProps> = ({ isSignup = false }) => {
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
  const [roleId, setRoleId] = useState<number>(2);
  const [vehicleRegistration, setVehicleRegistration] = useState<string>("");
  const [vehicleMake, setVehicleMake] = useState<string>("");
  const [vehicleModel, setVehicleModel] = useState<string>("");
  const [file, setFile] = useState<any>(null);

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
      const data = {
        name: name,
        surname: surname,
        phoneNumber: phoneNumber,
        email: email,
        password: password,
        roleId: roleId,
      };
      console.log(data);
      try {
        const result = await post("/api/user/create-user", {
          name: name,
          surname: surname,
          phoneNumber: phoneNumber,
          email: email,
          password: password,
          roleId: roleId,
        });

        console.log(result);

        if (roleId == 3) {
          const driver = await post("/api/Driver/create-driver-details", {
            driverId: result?.id,
            vehicleRegistration: vehicleRegistration,
            vehicleMake: vehicleMake,
            vehicleModel: vehicleModel,
            isAvailable: true,
          });
          console.log(driver);
        }
        await uploadFilex(String(result?.id));
        setLoading(false);
        setSignedUp(true);
      } catch (error) {
        console.error("Error signing:", error);
      } finally {
        console.log("done");
      }
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // all files
      });
      console.log(result);
      if (result.canceled === false) {
        // Single file selection
        const file = result.assets[0];
        setFile(file);
        console.log("Selected file:", {
          uri: file.uri,
          name: file.name,
          size: file.size,
          mimeType: file.mimeType,
        });
      }
    } catch (err) {
      console.error("Error picking document:", err);
    }
  };

  const createBasicAuthHeader = (username: string, password: string) => {
    const token = btoa(`${username}:${password}`);
    return `Basic ${token}`;
  };
  const handlePickAndUpload = async (id: any) => {
    try {
      console.log(`Uploading ${id}`, file);
      const formData = new FormData();
      formData.append("file", {
        uri: file.uri,
        name: file.name, // File name
        type: file.mimeType, // File MIME type
      });
      formData.append("driver_id", id);
      const response = await fetch(
        "http://ubertrucking-001-site1.atempurl.com/api/Driver/upload",
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: createBasicAuthHeader("11200974", "60-dayfreetrial"),
          },
        }
      );

      console.log("Server response:", response);
    } catch (error) {
      console.error("Error picking or uploading file:", error);
    }
  };

  const uploadFilex = async (id: any) => {
    try {
      const fileUri = file.uri;

      // Read the file using Expo's FileSystem module
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      if (!fileInfo.exists) {
        Alert.alert("Error", "File does not exist.");
        return;
      }

      // Prepare the form data
      const formData = new FormData();
      formData.append("File", {
        uri: fileUri,
        name: file.name, // The name of the file
        type: file.mimeType, // The MIME type of the file
      });
      console.log("id: ", id);
      formData.append("driver_id", id); // Add additional fields like driver_id

      // Configure the Axios request
      const config = {
        method: "POST",
        url: "http://ubertrucking-001-site1.atempurl.com/api/Driver/upload",
        headers: {
          Authorization: createBasicAuthHeader("11200974", "60-dayfreetrial"),
          "Content-Type": "multipart/form-data", // Let Axios handle the boundary for multipart form data
        },
        data: formData,
      };

      // Make the request to upload the file
      const response = await axios(config);
      console.log("Server Response:", response);

      // Handle success response
      // Alert.alert("Success", "File uploaded successfully");
    } catch (error) {
      console.log("Upload failed:", error, file);
      Alert.alert("Error", "Failed to upload file.");
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Spinner
          visible={loading}
          textContent={"Loading..."}
          textStyle={styles.spinnerTextStyle}
        />
        <Text style={styles.title}>{"Sign Up"}</Text>

        <Text style={styles.roleSelectionTitle}>Select Role:</Text>
        <View style={styles.roleSelectionContainer}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              roleId === 2 && styles.selectedRoleButton,
            ]}
            onPress={() => setRoleId(2)}
          >
            <Text style={styles.roleButtonText}>User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.roleButton,
              roleId === 3 && styles.selectedRoleButton,
            ]}
            onPress={() => setRoleId(3)}
          >
            <Text style={styles.roleButtonText}>Driver</Text>
          </TouchableOpacity>
        </View>

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
        {errors.surname && (
          <Text style={styles.errorText}>{errors.surname}</Text>
        )}

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

        {roleId === 3 && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Vehicle Registration"
              placeholderTextColor={Colors.medium}
              value={vehicleRegistration}
              onChangeText={setVehicleRegistration}
            />
            <TextInput
              style={styles.input}
              placeholder="Vehicle Make"
              placeholderTextColor={Colors.medium}
              value={vehicleMake}
              onChangeText={setVehicleMake}
            />
            <TextInput
              style={styles.input}
              placeholder="Vehicle Model"
              placeholderTextColor={Colors.medium}
              value={vehicleModel}
              onChangeText={setVehicleModel}
            />
            <TouchableOpacity
              style={styles.fileUploadButton}
              onPress={pickDocument}
            >
              <Text style={styles.fileUploadButtonText}>
                Upload Driver's License
              </Text>
            </TouchableOpacity>
          </>
        )}
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
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <View style={{ marginBottom: 12, marginTop: 2 }}>
          {signedUp && (
            <TouchableOpacity
              onPress={() => {
                setSignedUp(false);
                navigation.navigate("Login");
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

        {/* <Text style={styles.orText}>OR</Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="facebook" size={24} color="#4267B2" />
            <Text style={styles.socialButtonText}>Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome name="google" size={24} color="#DB4437" />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>
        </View> */}
        <TouchableOpacity
          onPress={() => {
            setSignedUp(false);
            navigation.navigate("Login");
          }}
        >
          <Text style={styles.signUpText}>Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
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
  roleSelectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.mediumDark,
    marginVertical: 10,
  },
  roleSelectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
  },
  roleButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.medium,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  selectedRoleButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  roleButtonText: {
    color: Colors.mediumDark,
  },
  fileUploadButton: {
    width: "100%",
    padding: 15,
    borderRadius: 8,
    backgroundColor: Colors.grey,
    alignItems: "center",
    marginBottom: 15,
  },
  fileUploadButtonText: {
    color: Colors.mediumDark,
  },
});

export default SignUpScreen;
