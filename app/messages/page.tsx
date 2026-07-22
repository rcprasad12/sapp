"use client";

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

type Message = {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
};

type User = {
  id: string;
  username: string;
};

export default function MessagesPage() {
  const { data: session } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);
    return () => { newSocket.disconnect(); };
  }, []);

  useEffect(() => {
    if (socket && currentUser) {
      socket.emit("join", currentUser.id);
      socket.on("receiveMessage", (message: Message) => {
      setMessages((prev) => {
      const exists = prev.find((m) => m._id === message._id);
      if (exists) return prev;
      return [...prev, message];
  });
}); 
    }
  }, [socket, currentUser]);

  useEffect(() => {
    async function fetchCurrentUser() {
  if (!session?.user?.name) return;
  const res = await fetch(`/api/users/${session.user.name}`);
  if (!res.ok) return;
  const data = await res.json();
  setCurrentUser({ id: data.id, username: data.username });
}
    fetchCurrentUser();
  }, [session]);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function openChat(user: User) {
    setSelectedUser(user);
    setMessages([]);
    if (socket && currentUser) {
      socket.emit("getMessages", {
        senderId: currentUser.id,
        receiverId: user.id,
      });
      socket.on("messages", (msgs: Message[]) => {
        setMessages(msgs);
      });
    }
  }

  function sendMessage() {
    if (!messageText.trim() || !socket || !currentUser || !selectedUser) return;
    socket.emit("sendMessage", {
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      content: messageText,
    });
    setMessageText("");
  }

  return (
    <main className="min-h-screen bg-black text-white flex">
      <div className="w-1/3 border-r border-gray-800 p-4">
        <h2 className="text-xl font-bold mb-4">Messages</h2>
        <div className="flex flex-col gap-2">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => openChat(user)}
              className={`flex items-center gap-3 p-3 rounded-xl hover:bg-gray-900 text-left ${
                selectedUser?.id === user.id ? "bg-gray-900" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold">
                {user.username[0].toUpperCase()}
              </div>
              <span>@{user.username}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="border-b border-gray-800 p-4">
              <h3 className="font-bold">@{selectedUser.username}</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                    msg.senderId === currentUser?.id
                      ? "bg-white text-black self-end"
                      : "bg-gray-800 text-white self-start"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-gray-800 p-4 flex gap-2">
              <input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-full outline-none border border-gray-700"
              />
              <button
                onClick={sendMessage}
                className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </main>
  );
}


