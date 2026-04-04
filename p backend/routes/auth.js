const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const supabase = require("../supabase/client");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Helper: generate JWT token for a user
function generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

// Helper: extract safe user object for response
function safeUser(user) {
    return {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        level: user.level,
        xp: user.xp,
        gold: user.gold,
        points: user.points,
    };
}

// ─── SIGNUP ──────────────────────────────────────────────
router.post("/signup", async (req, res) => {
    console.log("SIGNUP HIT", req.body);
    try {
        const { email, password, username, avatar } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate Gmail format
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
        if (!gmailRegex.test(email)) {
            return res.status(400).json({ message: "Please use a valid @gmail.com address" });
        }

        // Validate username format (3-20 chars, alphanumeric + underscores)
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        if (!usernameRegex.test(username)) {
            return res.status(400).json({ message: "Username must be 3-20 characters (letters, numbers, underscores only)" });
        }

        // Check if email already exists
        const { data: existingEmail, error: emailError } = await supabase
            .from('users')
            .select('email')
            .eq('email', email.toLowerCase())
            .maybeSingle();

        if (emailError) {
            console.error("Signup emailError:", emailError);
            return res.status(500).json({ message: emailError.message || "Database error" });
        }
        if (existingEmail) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Check if username already taken
        const { data: existingUsername, error: usernameError } = await supabase
            .from('users')
            .select('username')
            .eq('username', username)
            .maybeSingle();

        if (usernameError) {
            console.error("Signup usernameError:", usernameError);
            return res.status(500).json({ message: usernameError.message || "Database error" });
        }
        if (existingUsername) {
            return res.status(400).json({ message: "Username already taken. Choose a unique name!" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([{
                email: email.toLowerCase(),
                password: hashedPassword,
                username,
                avatar: avatar || '🦊'
            }])
            .select()
            .single();

        if (insertError) {
            console.error("Signup insertError:", insertError);
            return res.status(500).json({ message: insertError.message || "Failed to create user" });
        }

        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Signup catch:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
});

// ─── LOGIN ──────────────────────────────────────────────
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;
        if (!gmailRegex.test(email)) {
            return res.status(400).json({ message: "Please use a valid @gmail.com address" });
        }

        // Find user
        const { data: user, error: findError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email.toLowerCase())
            .maybeSingle();

        if (findError) {
            console.error("Login findError:", findError);
            return res.status(500).json({ message: findError.message || "Database error" });
        }
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create token
        const token = generateToken(user.id);

        res.json({
            message: "Login successful",
            token,
            user: safeUser(user),
        });
    } catch (error) {
        console.error("Login catch:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
});

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ─── GOOGLE SIGN IN ──────────────────────────────────────
router.post("/google", async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ message: "Google credential is required" });
        }

        // 1. Verify the Google ID Token
        let ticket;
        try {
            ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
        } catch (verifError) {
            console.error("Google Token Verification Failed:", verifError);
            return res.status(401).json({ message: "Invalid Google token" });
        }

        const payload = ticket.getPayload();
        const googleEmail = payload.email;
        const googleName = payload.name || googleEmail.split('@')[0];
        const googleAvatar = payload.picture || '🦊';

        if (!googleEmail) {
            return res.status(400).json({ message: "Unable to retrieve email from Google" });
        }

        // 2. Check if user already exists
        let { data: user, error: findError } = await supabase
            .from('users')
            .select('*')
            .eq('email', googleEmail.toLowerCase())
            .maybeSingle();

        if (findError) {
            console.error("Google findError:", findError);
            return res.status(500).json({ message: findError.message || "Database error" });
        }

        // 3. If user doesn't exist, create one
        if (!user) {
            const { data: newUser, error: insertError } = await supabase
                .from('users')
                .insert([{
                    email: googleEmail.toLowerCase(),
                    password: 'GOOGLE_AUTH_USER', // Placeholder
                    username: googleName.replace(/\s+/g, '_').substring(0, 20), // Sanitize username
                    avatar: googleAvatar
                }])
                .select()
                .single();

            if (insertError) {
                console.error("Google insertError:", insertError);
                return res.status(500).json({ message: insertError.message || "Failed to create user" });
            }
            user = newUser;
        }

        // 4. Create token
        const token = generateToken(user.id);

        res.json({
            message: "Google login successful",
            token,
            user: safeUser(user),
        });
    } catch (error) {
        console.error("Google auth catch:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
});

// ─── GET CURRENT USER ────────────────────────────────────
router.get("/me", authMiddleware, async (req, res) => {
    try {
        const { data: user, error: findError } = await supabase
            .from('users')
            .select('id, email, username, avatar, level, xp, gold, points, total_focus_seconds, is_timer_running, timer_start_time, session_type, guild_id, last_daily_claim, active_theme, owned_themes')
            .eq('id', req.userId)
            .single();

        if (findError) {
            console.error("Me findError:", findError);
            return res.status(500).json({ message: findError.message || "Database error" });
        }
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Me catch:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
});

// ─── DAILY SIGN-IN (1 Gold per day) ─────────────────────
router.post("/daily", authMiddleware, async (req, res) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('id, gold, last_daily_claim')
            .eq('id', req.userId)
            .single();

        if (error) return res.status(500).json({ message: error.message });

        const today = new Date().toISOString().split('T')[0];
        if (user.last_daily_claim === today) {
            return res.status(400).json({ message: "Already claimed today! Come back tomorrow." });
        }

        const newGold = (user.gold || 0) + 1;
        await supabase.from('users').update({ gold: newGold, last_daily_claim: today }).eq('id', req.userId);

        res.json({ message: "Daily gold claimed! +1 💰", gold: newGold, lastClaim: today });
    } catch (error) {
        console.error("Daily claim error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
});

// ─── SAVE ACTIVE THEME ──────────────────────────────────
router.post("/theme", authMiddleware, async (req, res) => {
    try {
        const { theme } = req.body;
        if (!theme) return res.status(400).json({ message: "Theme name required" });

        const { data: user } = await supabase.from('users').select('owned_themes').eq('id', req.userId).single();
        if (!user?.owned_themes?.includes(theme)) {
            return res.status(400).json({ message: "You don't own this theme" });
        }

        await supabase.from('users').update({ active_theme: theme }).eq('id', req.userId);
        res.json({ message: `Theme "${theme}" activated!`, activeTheme: theme });
    } catch (error) {
        console.error("Theme error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
});

// ─── BUY THEME ──────────────────────────────────────────
router.post("/buy-theme", authMiddleware, async (req, res) => {
    try {
        const { theme, price } = req.body;
        if (!theme || !price) return res.status(400).json({ message: "Theme and price required" });

        const { data: user } = await supabase.from('users').select('gold, owned_themes').eq('id', req.userId).single();
        if (user.gold < price) return res.status(400).json({ message: "Not enough gold" });
        if (user.owned_themes?.includes(theme)) return res.status(400).json({ message: "You already own this theme" });

        const newThemes = [...(user.owned_themes || ['starfield']), theme];
        await supabase.from('users').update({ gold: user.gold - price, owned_themes: newThemes }).eq('id', req.userId);

        res.json({ message: `Theme "${theme}" purchased!`, gold: user.gold - price, ownedThemes: newThemes });
    } catch (error) {
        console.error("Buy theme error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
});

module.exports = router;