import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./lib/db.js";

const PORT = process.env.PORT || 5000;

// Connect to the database, then start accepting requests.
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  });

// Exported for serverless platforms (for Vercel).
export default app;
