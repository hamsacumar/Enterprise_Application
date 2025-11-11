import { Server } from "socket.io";
import { createServer } from "http";
import Client from "socket.io-client";
import { setupSocket } from "../socket.js";

describe("Socket.IO chat integration", () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    setupSocket(io);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = Client(`http://localhost:${port}`, {
        auth: { token: "valid_mock_token" },
      });
      io.on("connection", (socket) => {
        serverSocket = socket;
        done();
      });
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test("should send and receive messages", (done) => {
    const testMsg = { chatId: "c1", content: "Hello" };
    clientSocket.emit("sendMessage", testMsg);

    serverSocket.on("sendMessage", (msg) => {
      expect(msg.content).toBe("Hello");
      done();
    });
  });
});
