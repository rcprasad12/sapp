import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const messageSchema = new mongoose.Schema({
  senderId: String,
  receiverId: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model("Message", messageSchema);

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/socialapp")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId: string) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on("sendMessage", async (data: {
    senderId: string;
    receiverId: string;
    content: string;
  }) => {
    const message = await Message.create({
      senderId: data.senderId,
      receiverId: data.receiverId,
      content: data.content,
    });

    io.to(data.receiverId).emit("receiveMessage", message);
    io.to(data.senderId).emit("receiveMessage", message);
  });

  socket.on("getMessages", async (data: {
    senderId: string;
    receiverId: string;
  }) => {
    const messages = await Message.find({
      $or: [
        { senderId: data.senderId, receiverId: data.receiverId },
        { senderId: data.receiverId, receiverId: data.senderId },
      ],
    }).sort({ createdAt: 1 });

    socket.emit("messages", messages);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(3001, () => {
  console.log("Socket server running on port 3001");
});


