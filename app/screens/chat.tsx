import React, { useState, useEffect } from "react";
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
} from "react-native";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import * as signalR from "@microsoft/signalr";
import Colors from "@/constants/Colors";

const ChatScreen = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [isEmojiPickerVisible, setEmojiPickerVisible] =
    useState<boolean>(false);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );

  // Initialize SignalR connection
  useEffect(() => {
    const connectToSignalR = async () => {
      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://your-server-url/chatHub") // Replace with your SignalR hub URL
        .withAutomaticReconnect()
        .build();

      try {
        await newConnection.start();
        console.log("SignalR Connected.");
        setConnection(newConnection);

        // Receive message from the SignalR server
        newConnection.on("ReceiveMessage", (message: string) => {
          setMessages((prevMessages) => [...prevMessages, message]);
        });
      } catch (error) {
        console.error("SignalR connection failed:", error);
      }
    };

    connectToSignalR();

    // Cleanup on component unmount
    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  // Send message to SignalR server
  const sendMessage = async () => {
    if (input.trim()) {
      try {
        if (connection) {
          await connection.invoke("SendMessage", input); // "SendMessage" is the SignalR hub method
          setInput("");
          setEmojiPickerVisible(false); // Close emoji picker after sending a message
        }
      } catch (error) {
        console.error("Sending message failed:", error);
      }
    }
  };

  const addEmoji = (emoji: string) => {
    setInput(input + emoji); // Append selected emoji to input
  };

  const closeEmojiPicker = () => {
    setEmojiPickerVisible(false); // Close emoji picker
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        closeEmojiPicker();
        Keyboard.dismiss(); // Dismiss keyboard when tapping outside
      }}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90} // Adjust this value based on the height of your header
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chat</Text>
        </View>

        {/* Messages */}
        <ScrollView style={styles.messagesContainer}>
          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageBubble,
                index % 2 === 0 ? styles.receivedMessage : styles.sentMessage,
              ]}
            >
              <Text style={styles.messageText}>{message}</Text>
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
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Allows the container to fill the screen and be pushed up by the keyboard
    backgroundColor: Colors.light.background,
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
    maxWidth: "70%",
    borderRadius: 12,
    padding: 10,
    marginVertical: 8,
  },
  sentMessage: {
    backgroundColor: Colors.green,
    alignSelf: "flex-end",
  },
  receivedMessage: {
    backgroundColor: Colors.grey,
    alignSelf: "flex-start",
  },
  messageText: {
    color: Colors.light.text,
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
