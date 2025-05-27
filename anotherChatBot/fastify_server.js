import fastify from "fastify";
import cors from "@fastify/cors";
import fetch from "node-fetch";

const server = fastify({ logger: true });

// Register CORS plugin
await server.register(cors, {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
});

server.post("/queryendpoint", async (request, reply) => {
  const { query } = request.body;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.1:8b",
        prompt: query,
        stream: false,
      }),
    });

    const data = await response.json();

    return reply.send({ answer: data.response });
  } catch (err) {
    server.log.error(err);
    return reply.status(500).send({ answer: "Error contacting Ollama" });
  }
});

// Start server
const start = async () => {
  try {
    await server.listen({ port: 8002, host: "0.0.0.0" });
    server.log.info(`Server listening at http://localhost:8002`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();