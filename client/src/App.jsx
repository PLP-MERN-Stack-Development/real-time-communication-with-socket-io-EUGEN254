// App.jsx
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function App() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("global");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    socket.on("receiveMessage", (msg) => setMessages((prev) => [...prev, msg]));
    socket.on("privateMessage", (msg) => setMessages((prev) => [...prev, msg]));
    socket.on("notification", (msg) =>
      setMessages((prev) => [...prev, { sender: "System", text: msg, timestamp: new Date() }])
    );
    socket.on("onlineUsers", (users) => setOnlineUsers(users));
    socket.on("userTyping", (user) => {
      setTypingUser(user);
      setTimeout(() => setTypingUser(""), 1500);
    });
  }, []);

  const handleLogin = () => {
    if (!username) return alert("Enter a username");
    socket.emit("setUsername", username);
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const sendMessage = () => {
    if (!message && !file) return;

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        socket.emit("sendMessage", {
          roomName: room,
          message: message,
          file: reader.result,
          fileName: file.name,
          fileType: file.type,
        });
        setFile(null);
        setMessage("");
      };
      reader.readAsDataURL(file);
    } else {
      socket.emit("sendMessage", { roomName: room, message });
      setMessage("");
    }
  };

  const handleTyping = () => socket.emit("typing", room);

  const joinRoom = (roomName) => {
    setRoom(roomName);
    socket.emit("joinRoom", roomName);
  };

  const sendPrivateMessage = (socketId) => {
    const msg = prompt("Enter private message:");
    if (msg) socket.emit("privateMessage", { toSocketId: socketId, message: msg });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 mt-8">
      {!username ? (
        <div className="flex flex-col items-center gap-4">
          <input
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded w-64"
          />
          <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded w-32">
            Join Chat
          </button>
        </div>
      ) : (
        <>
          {/* Rooms & Online Users */}
          <div className="flex justify-between mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => joinRoom("global")}
                className={`px-3 py-1 rounded ${room === "global" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                Global
              </button>
              <button
                onClick={() => joinRoom("sports")}
                className={`px-3 py-1 rounded ${room === "sports" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                Sports
              </button>
              <button
                onClick={() => joinRoom("music")}
                className={`px-3 py-1 rounded ${room === "music" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              >
                Music
              </button>
            </div>
            <div>
              Online Users:
              {onlineUsers.map((u, i) => (
                <span
                  key={i}
                  className="ml-2 cursor-pointer text-green-600 hover:underline"
                  onClick={() => sendPrivateMessage(u.socketId)}
                >
                  {u.username}
                </span>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="border p-4 h-96 overflow-y-auto mb-2 bg-gray-50 rounded">
            {messages.map((msg, i) => (
              <div key={i} className={`mb-2 ${msg.private ? "text-red-500" : ""}`}>
                <b>{msg.sender}</b>: {msg.text}{" "}
                <small className="text-gray-400">{new Date(msg.timestamp).toLocaleTimeString()}</small>
                {msg.file && (
                  <div className="mt-1">
                    {msg.fileType.startsWith("image/") ? (
                      <img src={msg.file} alt={msg.fileName} className="max-w-xs rounded" />
                    ) : (
                      <a
                        href={msg.file}
                        download={msg.fileName}
                        className="text-blue-500 underline"
                      >
                        Download {msg.fileName}
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
            {typingUser && <div className="text-gray-500">{typingUser} is typing...</div>}
          </div>

          {/* Input Area */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleTyping}
              placeholder="Type a message..."
              className="border p-2 flex-1 rounded"
            />
            <input type="file" onChange={handleFileChange} className="border p-2 rounded" />
            <button onClick={sendMessage} className="bg-green-500 text-white p-2 rounded">
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}
