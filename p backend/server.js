require("dotenv").config();
const express = require("express");
const cors = require("cors");
const supabase = require("./supabase/client");

const app = express();
app.use(express.json());

app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
}));

// Verify Supabase connection on startup
(async () => {
    const { error } = await supabase.from('users').select('id').limit(1);
    if (error) {
        console.error("❌ Supabase connection FAILED:", error.message);
    } else {
        console.log("✅ Supabase connected successfully");
    }
})();

// Routes
const authRoutes = require("./routes/auth");
const timerRoutes = require("./routes/timer");
const leaderboardRoutes = require("./routes/leaderboard");
const questRoutes = require("./routes/quests");
const guildRoutes = require("./routes/guild");
const authMiddleware = require("./middleware/authMiddleware");

app.use("/api/auth", authRoutes);
app.use("/api/timer", timerRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/quests", questRoutes);
app.use("/api/guild", guildRoutes);

// Health check
app.get("/", (req, res) => {
    res.send("FocusForge Backend Running with Supabase 🚀");
});

app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({
        message: "Protected route accessed.",
        userId: req.userId,
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
