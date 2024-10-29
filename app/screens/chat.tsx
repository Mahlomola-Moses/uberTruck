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
} from "react-native";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import Colors from "@/constants/Colors";
import chatService from "@/services/chatService";
import OrderCostModal from "../(modal)/orderCost";

interface Message {
  user: string;
  message: string;
}

const ChatScreen = () => {
  const [input, setInput] = useState<string>("");
  const [isEmojiPickerVisible, setEmojiPickerVisible] =
    useState<boolean>(false);
  const [groupName, setGroupName] = useState("General");
  const [user, setUser] = useState("User1"); // Replace with dynamic user retrieval
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);

  const scrollViewRef = useRef<ScrollView>(null); // Reference to scroll view

  useEffect(() => {
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
          chatService.removeReceiveMessageListener(messageListener); // Clean up listener
          connection.stop(); // Close SignalR connection
        }
      };
    };

    startConnection();
  }, []);

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() && !isSending) {
      console.log(input);
      setIsSending(true);
      try {
        await chatService.sendMessage(groupName, user, input);
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

  return (
    <>
      <OrderCostModal
        visible={true}
        onClose={() => {}}
        distance="20"
        price="45"
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
          <Button title="Accept order" />
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
    alignContent: "center",
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
    backgroundColor: Colors.green, // Sender bubble color
    alignSelf: "flex-end", // Align sender's message to the right
    borderRadius: 12,
    padding: 10,
    marginVertical: 8,
  },
  receiverText: {
    backgroundColor: Colors.grey, // Receiver bubble color
    alignSelf: "flex-start", // Align receiver's message to the left
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
  messageContainer: {
    flexDirection: "row", // Horizontal layout
    justifyContent: "space-between", // Texts at left and right
    padding: 10,
    alignItems: "center", // Center vertically
  },
});

export default ChatScreen;
