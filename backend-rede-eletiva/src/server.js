import fastify from "fastify";
import { studentsRouter } from "./routes/studentsRouter.js";
import { discplineRoutes } from "./routes/disciplineRouter.js";
import { administratorRouter } from "./routes/administratorRouter.js";
import multipart from "@fastify/multipart";
import cors from "@fastify/cors";
import path from "path";

const __dirname = path.resolve();

const app = fastify();

const tempUploadDir = path.join(__dirname, "temp");
app.register(multipart, {
  attachFieldsToBody: true,
  limits: { fileSize: 5242880 },
  storage: tempUploadDir,
});
app.register(studentsRouter, { prefix: "/api/v1/students" });
app.register(discplineRoutes, { prefix: "/api/v1/discipline" });
app.register(administratorRouter, { prefix: "/api/v1/administrator" });

app.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  preflightContinue: true,
  optionsSuccessStatus: 204,
});

app.listen(
  { port: process.env.PORT || 3000, host: process.env.HOST || "0.0.0.0" },
  (err) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(
      "Server listening on http://localhost:${app.server.address().port}"
    );
  }
);
