import express from "express";
import { App } from "./app.js";
import { errorHandlerMiddleware } from "./errors.js";

const app = new App();

const server = express();
server.use(express.json());

server.get("/api/health-check", handleRequest(app.handleHealthCheck));
server.get("/api/query/account", handleRequest(app.handleGetAccount));
server.get("/api/query/balance", handleRequest(app.handleGetBalance));
server.post("/api/command/deposit", handleRequest(app.handlePostDeposit));
server.post("/api/command/withdraw", handleRequest(app.handlePostWithdraw));

server.use(errorHandlerMiddleware);

const PORT = 8080;
server.listen(PORT, () => console.log("Listening", PORT));

function handleRequest(handler) {
  return (req, res) => {
    const result = handler.bind(app)(req);
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(result));
  };
}
