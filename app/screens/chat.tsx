import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
  ActivityIndicator,
} from "react-native";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import Colors from "@/constants/Colors";
import chatService from "@/services/chatService";
import OrderCostModal from "../(modal)/orderCost";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OrderDetailsModal from "../(modal)/orderDetails";
import { get } from "@/services/apiService";
import { useNavigation } from "@react-navigation/native";

interface Message {
  user: string;
  message: string;
}

const ChatScreen = () => {
  const navigation = useNavigation();
  const [input, setInput] = useState<string>("");
  const [isEmojiPickerVisible, setEmojiPickerVisible] =
    useState<boolean>(false);
  const [groupName, setGroupName] = useState(`General`);
  const [user, setUser] = useState<string | null>(null); // Start with null
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [showOrderCost, setShowOrderCost] = useState<boolean>(false);
  const [showOrderDetails, setShowOrderDetails] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null); // Start with null
  const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state
  const [shipmentTransit, setShipmentTransit] = useState<any>({});
  const [checkShipment, setCheckShipment] = useState<boolean>(true); //
  const [driverStatus, setDriverStatus] = useState<any>("negotiating"); //
  let interval: any;
  const scrollViewRef = useRef<ScrollView>(null);

  const getTripDetails = async () => {
    const contextOrder: any = await AsyncStorage.getItem("contextOrder");

    const orderDetails: any = JSON.parse(contextOrder);
    try {
      const url = `/api/ShipmentTransit/shipment-has-driver/${(orderDetails?.shipmentTransit?.id).toString()}`;
      console.log(url, "***", orderDetails.shipmentTransit);
      const results = await get(url);
      console.log(shipmentTransit);
      if (results?.shipmentTransit.price != 0) {
        setShowOrderDetails(true);
        await AsyncStorage.setItem(
          "shipmentTransit",
          JSON.stringify(results?.shipmentTransit)
        );
        setShipmentTransit(results?.shipmentTransit);
      } else {
        alert("The driver hasn't accepted the negotiations price yet");
      }
    } catch (error) {
      alert("You dont ahve active order");
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userx = await AsyncStorage.getItem("user");
        const rolex = await AsyncStorage.getItem("role");

        if (userx && rolex) {
          setUser(JSON.parse(userx).email);
          setRole(rolex);
        }
      } catch (error) {
        console.error("Failed to retrieve user data:", error);
      } finally {
        setIsLoading(false); // Set loading to false after data retrieval
      }
    };

    fetchUserData();
    setMessages([]);
    let connection: any;
    const startConnection = async () => {
      connection = await chatService.startConnection();

      // Listener for receiving messages
      const messageListener = (receivedUser: string, message: string) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: receivedUser, message },
        ]);
      };

      chatService.addReceiveMessageListener(messageListener);
      chatService.joinChat(groupName);

      return () => {
        if (connection) {
          connection.stop(); // Close SignalR connection
        }
      };
    };

    console.log("driverStatusx", driverStatus, role);

    startConnection();
  }, [driverStatus]);

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() && !isSending) {
      setIsSending(true);
      try {
        await chatService.sendMessage(groupName, user as string, input);
        setInput("");
        setEmojiPickerVisible(false); // Close emoji picker after sending a message
      } catch (error) {
        console.error("Sending message failed:", error);
      } finally {
        setIsSending(false);
      }
    }
  };

  const addEmoji = (emoji: string) => {
    setInput((prevInput) => prevInput + emoji);
  };

  const closeEmojiPicker = () => {
    setEmojiPickerVisible(false);
  };

  if (isLoading) {
    // Show a loading spinner while fetching user data
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!user || !role) {
    // Show an error message if user or role data couldn't be loaded
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Failed to load user data. Please try again.
        </Text>
      </View>
    );
  }

  return (
    <>
      <OrderCostModal
        visible={showOrderCost}
        onClose={() => setShowOrderCost(false)}
        distance="20"
        price="45"
      />
      <OrderDetailsModal
        visible={showOrderDetails}
        onClose={() => setShowOrderDetails(false)}
        OrderDetails={shipmentTransit}
      />
      <TouchableWithoutFeedback
        onPress={() => {
          closeEmojiPicker();
          Keyboard.dismiss();
        }}
      >
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={90}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chat</Text>
          </View>
          {/* Messages */}
          <ScrollView ref={scrollViewRef} style={styles.messagesContainer}>
            {messages.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.messageBubble,
                  msg.user === user ? styles.senderText : styles.receiverText,
                ]}
              >
                <Text>{msg.message}</Text>
              </View>
            ))}
          </ScrollView>
          {/* Emoji Selector */}
          {isEmojiPickerVisible && (
            <EmojiSelector
              onEmojiSelected={addEmoji}
              columns={8}
              showSearchBar={false}
              showHistory={true}
              category={Categories.all}
            />
          )}
          {/* Input Section */}
          <View style={styles.inputContainer}>
            <TouchableOpacity
              onPress={() => setEmojiPickerVisible(!isEmojiPickerVisible)}
              style={styles.emojiButton}
            >
              <Text style={styles.emojiButtonText}>😊</Text>
            </TouchableOpacity>

            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Type a message"
              placeholderTextColor={Colors.medium}
              style={styles.input}
              onFocus={closeEmojiPicker} // Close emoji picker when focusing on input
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>

          {role === "driver" &&
            (driverStatus == "negotiating" ? (
              <Button
                title="Accept order"
                onPress={async () => {
                  const status: any = await AsyncStorage.getItem(
                    "driverOrderStatus"
                  );
                  setDriverStatus(status);
                  setShowOrderCost(true);
                }}
              />
            ) : (
              <Button
                title="Start trip"
                onPress={async () => {
                  await AsyncStorage.setItem("state", "Tract_driver");
                  navigation.navigate("Map");
                }}
              />
            ))}
          {role != "driver" && (
            <Button
              title="Accept order"
              onPress={async () => await getTripDetails()}
            />
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: Colors.danger,
    fontSize: 16,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    color: Colors.light.tint,
    fontWeight: "bold",
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: Colors.lightGrey,
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 12,
    padding: 10,
    marginVertical: 8,
  },
  senderText: {
    backgroundColor: Colors.green,
    alignSelf: "flex-end",
    borderRadius: 12,
    padding: 10,
    marginVertical: 8,
  },
  receiverText: {
    backgroundColor: Colors.grey,
    alignSelf: "flex-start",
    borderRadius: 12,
    padding: 10,
    marginVertical: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: Colors.light.background,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderColor: Colors.mediumDark,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: Colors.lightGrey,
    color: Colors.light.text,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 10,
  },
  sendButtonText: {
    color: Colors.light.tint,
    fontWeight: "bold",
  },
  emojiButton: {
    marginRight: 10,
  },
  emojiButtonText: {
    fontSize: 24,
  },
});

export default ChatScreen;
