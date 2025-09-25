import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./mongoSeed";

// Environment validation
if (!process.env.DATABASE_URL) {
  console.warn("⚠️ DATABASE_URL environment variable is not set");
  console.warn(
    "The application will run with in-memory storage for development"
  );
  console.warn(
    "Please set DATABASE_URL in your .env file for data persistence"
  );
} else {
  // Validate database URL format for MongoDB
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl.startsWith("mongodb://") && !dbUrl.startsWith("mongodb+srv://")) {
    console.warn(
      "⚠️ DATABASE_URL should be a MongoDB connection string for full functionality"
    );
    console.warn("Current value starts with:", dbUrl.substring(0, 20) + "...");
    console.warn(
      "Expected format: mongodb://user:password@host:port/database or mongodb+srv://user:password@host/database"
    );
  } else {
    console.log("✅ Environment validation passed");
    console.log("Database type: MongoDB");
  }
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Initialize database and seed if needed
  if (process.env.DATABASE_URL) {
    log("Initializing database...");
    log("Checking if database needs seeding...");
    await seedDatabase();
  } else {
    log("No DATABASE_URL configured - using in-memory storage");
  }

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewall

  // Other ports are firewalled. Default to 5001 if not specified for development.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5001", 10);
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port http://0.0.0.0:${port}`);
  });
})();
