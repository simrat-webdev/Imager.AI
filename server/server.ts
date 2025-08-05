import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { myAgent } from "./workflow";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { agentToolCallEvent, agentStreamEvent } from "@llamaindex/workflow";
import { date } from "zod/v4";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
const port = process.env.PORT;
app.use(cors());
app.use(express.json());

const __dirname = dirname(fileURLToPath(import.meta.url));
export const TEMP_IMAGES_DIR = path.join(__dirname, "temp-images");

app.use("/api/images", express.static(TEMP_IMAGES_DIR));

io.on("connection", (socket) => {
  console.log("websocket connected");
  socket.emit("connection_established", { message: "connection established" });
  socket.on("generate_image", async (msg: { prompt: string }) => {
    try {
      const llm_response_events = myAgent.runStream(
        `Create an image of ${msg.prompt}`
      );
      socket.emit("generation_started", {
        generationId: Math.random(),
        prompt: msg.prompt,
      });
      for await (const event of llm_response_events) {
        if (agentToolCallEvent.include(event)) {
          console.log(`Tool being called: ${event.data.toolName}`);
          if (event.data.toolName === "imageGenerationTool") {
            socket.emit("generation_progress", {
              progress: 33,
              message: "Image is being generated",
            });
          } else if (event.data.toolName === "imageEvaluationTool") {
            socket.emit("generation_progress", {
              progress: 66,
              message:
                "Image is being evaluated for faithfulness to prompt and for quality",
            });
          }
        }
        if (agentStreamEvent.include(event)) {
          console.log(event.data.delta);
        }
      }
    } catch (error) {
      console.log(error);
    }
    socket.emit("generation_complete", {
      success: true,
      imageUrl: `http://localhost:3001/api/images/generated_image.png`,
      generatedAt: new Date().toISOString(),
    });
  });
});

httpServer.listen(port, () => {
  console.log("Express app listening on port " + port);
});
