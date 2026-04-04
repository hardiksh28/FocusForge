const express = require("express");
const supabase = require("../supabase/client");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ─── START TIMER ─────────────────────────────────────────
router.post("/start", authMiddleware, async (req, res) => {
    try {
        const { data: user, error: findError } = await supabase
            .from('users')
            .select('is_timer_running')
            .eq('id', req.userId)
            .single();

        if (findError) return res.status(500).json({ message: findError.message });
        if (user.is_timer_running) {
            return res.status(400).json({ message: "Timer already running" });
        }

        const { error: updateError } = await supabase
            .from('users')
            .update({ is_timer_running: true, timer_start_time: new Date().toISOString() })
            .eq('id', req.userId);

        if (updateError) return res.status(500).json({ message: updateError.message });
        res.json({ message: "Timer started ⏱️ Focus mode ON" });
    } catch (error) {
        console.error("Start Timer Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
});

// ─── PAUSE TIMER ─────────────────────────────────────────
router.post("/pause", authMiddleware, async (req, res) => {
    try {
        const { data: user, error: findError } = await supabase
            .from('users')
            .select('is_timer_running, timer_start_time, session_type, total_focus_seconds, points')
            .eq('id', req.userId)
            .single();

        if (findError) return res.status(500).json({ message: findError.message });
        if (!user.is_timer_running) {
            return res.status(400).json({ message: "Timer not running ❌" });
        }

        const now = new Date();
        const elapsedSeconds = Math.floor((now - new Date(user.timer_start_time)) / 1000);

        let earnedPoints = 0;
        let newTotalFocusSeconds = user.total_focus_seconds || 0;
        let newPoints = user.points || 0;

        if (user.session_type === "focus") {
            newTotalFocusSeconds += elapsedSeconds;
            earnedPoints = Math.floor(elapsedSeconds / 60);
            newPoints += earnedPoints;
        }

        const { error: updateError } = await supabase
            .from('users')
            .update({
                is_timer_running: false,
                timer_start_time: null,
                total_focus_seconds: newTotalFocusSeconds,
                points: newPoints
            })
            .eq('id', req.userId);

        if (updateError) return res.status(500).json({ message: updateError.message });

        res.json({
            message: "Timer paused ⏸️",
            earnedPoints,
            totalPoints: newPoints,
        });
    } catch (error) {
        console.error("Pause Timer Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
});

// ─── RESUME TIMER ────────────────────────────────────────
router.post("/resume", authMiddleware, async (req, res) => {
    try {
        const { data: user, error: findError } = await supabase
            .from('users')
            .select('is_timer_running')
            .eq('id', req.userId)
            .single();

        if (findError) return res.status(500).json({ message: findError.message });
        if (user.is_timer_running) {
            return res.status(400).json({ message: "Timer already running ❌" });
        }

        const { error: updateError } = await supabase
            .from('users')
            .update({ is_timer_running: true, timer_start_time: new Date().toISOString() })
            .eq('id', req.userId);

        if (updateError) return res.status(500).json({ message: updateError.message });
        res.json({ message: "Timer resumed ▶️" });
    } catch (error) {
        console.error("Resume Timer Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
});

// ─── SWITCH SESSION ──────────────────────────────────────
router.post("/switch", authMiddleware, async (req, res) => {
    try {
        const { data: user, error: findError } = await supabase
            .from('users')
            .select('is_timer_running, session_type')
            .eq('id', req.userId)
            .single();

        if (findError) return res.status(500).json({ message: findError.message });
        if (user.is_timer_running) {
            return res.status(400).json({ message: "Stop timer before switching session ❌" });
        }

        const newSessionType = user.session_type === "focus" ? "break" : "focus";

        const { error: updateError } = await supabase
            .from('users')
            .update({ session_type: newSessionType })
            .eq('id', req.userId);

        if (updateError) return res.status(500).json({ message: updateError.message });
        res.json({ message: `Session switched to ${newSessionType} ✅` });
    } catch (error) {
        console.error("Switch Timer Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
});

// ─── STOP TIMER ──────────────────────────────────────────
router.post("/stop", authMiddleware, async (req, res) => {
    try {
        const { data: user, error: findError } = await supabase
            .from('users')
            .select('is_timer_running, timer_start_time, session_type, total_focus_seconds, points')
            .eq('id', req.userId)
            .single();

        if (findError) return res.status(500).json({ message: findError.message });
        if (!user.is_timer_running) {
            return res.status(400).json({ message: "No active timer running" });
        }

        const now = new Date();
        const elapsedSeconds = Math.floor((now - new Date(user.timer_start_time)) / 1000);

        if (elapsedSeconds > 60 * 60) {
            return res.status(400).json({ message: "Session too long. Possible abuse detected ❌" });
        }

        let earnedPoints = 0;
        let newTotalFocusSeconds = user.total_focus_seconds || 0;
        let newPoints = user.points || 0;

        if (user.session_type === "focus") {
            newTotalFocusSeconds += elapsedSeconds;
            earnedPoints = Math.floor(elapsedSeconds / 60);
            newPoints += earnedPoints;
        }

        const { error: updateError } = await supabase
            .from('users')
            .update({
                is_timer_running: false,
                timer_start_time: null,
                total_focus_seconds: newTotalFocusSeconds,
                points: newPoints
            })
            .eq('id', req.userId);

        if (updateError) return res.status(500).json({ message: updateError.message });

        res.json({
            message: "Timer stopped. Focus session saved ✅",
            sessionSeconds: elapsedSeconds,
            earnedPoints,
            totalPoints: newPoints,
            totalFocusSeconds: newTotalFocusSeconds,
        });
    } catch (error) {
        console.error("Stop Timer Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
});

module.exports = router;