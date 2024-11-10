import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { BehaviorSubject, Observable } from "rxjs";

interface Message {
  user: string;
  message: string;
}
const createBasicAuthHeader = (username: string, password: string) => {
  const token = btoa(`${username}:${password}`);
  return `Basic ${token}`;
};
class ChatService {
  private hubConnection: HubConnection;
  private messagesSubject: BehaviorSubject<Message[]> = new BehaviorSubject<
    Message[]
  >([]);
  public messages$: Observable<Message[]> = this.messagesSubject.asObservable();

  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl("http://ubertrucking-001-site1.atempurl.com/chatHub", {
        withCredentials: true,
        headers: {
          Authorization: createBasicAuthHeader("11200974", "60-dayfreetrial"), // If you are using Bearer token authentication
        },
      })
      .build();
  }

  startConnection() {
    const connected = this.hubConnection
      .start()
      .then(() => console.log("Connection started"))
      .catch((err) => console.log("Error while starting connection: " + err));
    return connected;
  }

  joinChat(groupName: string) {
    this.hubConnection
      .invoke("JoinChat", groupName)
      .catch((err) => console.error(err));
  }

  sendMessage(groupName: string, user: string, message: string) {
    console.log("sendMessage", groupName, user, message);
    this.hubConnection
      .invoke("SendMessage", groupName, user, message)
      .catch((err) => console.error(err));
  }

  addReceiveMessageListener(callback: (user: string, message: string) => void) {
    this.hubConnection.on("ReceiveMessage", callback);
  }
}

const chatService = new ChatService();
export default chatService;
