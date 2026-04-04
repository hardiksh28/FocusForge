const express = require("express");
const supabase = require("../supabase/client");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ─── CREATE GUILD ────────────────────────────────────────
router.post("/create", authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim().length < 3 || name.trim().length > 30) {
            return res.status(400).json({ message: "Guild name must be 3-30 characters" });
        }

        // Check user isn't already in a guild
        const { data: user } = await supabase.from('users').select('guild_id').eq('id', req.userId).single();
        if (user?.guild_id) {
            return res.status(400).json({ message: "You must leave your current guild first" });
        }

        // Check name not taken
        const { data: existing } = await supabase.from('guilds').select('id').eq('name', name.trim()).maybeSingle();
        if (existing) {
            return res.status(400).json({ message: "Guild name already taken" });
        }

        // Get current Monday for boss_week_start
        const now = new Date();
        const monday = new Date(now);
        monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
        monday.setHours(0, 0, 0, 0);

        // Create guild
        const { data: guild, error: createError } = await supabase
            .from('guilds')
            .insert([{ name: name.trim(), owner_id: req.userId, boss_hp_remaining: 20000, boss_week_start: monday.toISOString().split('T')[0] }])
            .select()
            .single();

        if (createError) {
            console.error("Guild Create Error:", createError);
            return res.status(500).json({ message: `Database error: ${createError.message}. Did you run the SQL setup?` });
        }

        // Set user's guild_id
        await supabase.from('users').update({ guild_id: guild.id }).eq('id', req.userId);

        res.status(201).json({ message: "Guild created!", guild });
    } catch (error) {
        console.error("Create Guild Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
});

// ─── GET MY GUILD ────────────────────────────────────────
router.get("/my", authMiddleware, async (req, res) => {
    try {
        const { data: user } = await supabase.from('users').select('guild_id').eq('id', req.userId).single();
        if (!user?.guild_id) {
            return res.json({ guild: null, members: [] });
        }

        // Get guild
        const { data: guild } = await supabase.from('guilds').select('*').eq('id', user.guild_id).single();
        if (!guild) {
            return res.json({ guild: null, members: [] });
        }

        // Check if boss needs weekly reset (every Monday)
        const now = new Date();
        const currentMonday = new Date(now);
        currentMonday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
        currentMonday.setHours(0, 0, 0, 0);
        const bossWeekStart = new Date(guild.boss_week_start);

        if (currentMonday > bossWeekStart) {
            // Reset boss for new week
            await supabase.from('guilds').update({
                boss_hp_remaining: 20000,
                boss_week_start: currentMonday.toISOString().split('T')[0]
            }).eq('id', guild.id);
            guild.boss_hp_remaining = 20000;
            guild.boss_week_start = currentMonday.toISOString().split('T')[0];
        }

        // Get members
        const { data: members } = await supabase
            .from('users')
            .select('id, username, avatar, level, xp, points')
            .eq('guild_id', user.guild_id)
            .order('xp', { ascending: false });

        res.json({ guild, members: members || [], isOwner: guild.owner_id === req.userId });
    } catch (error) {
        console.error("Get Guild Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
});

// ─── INVITE / ADD MEMBER BY USERNAME ─────────────────────
router.post("/invite", authMiddleware, async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) return res.status(400).json({ message: "Username is required" });

        // Get inviter's guild
        const { data: inviter } = await supabase.from('users').select('guild_id').eq('id', req.userId).single();
        if (!inviter?.guild_id) return res.status(400).json({ message: "You are not in a guild" });

        // Check guild size (max 5)
        const { data: members } = await supabase.from('users').select('id').eq('guild_id', inviter.guild_id);
        if (members && members.length >= 5) {
            return res.status(400).json({ message: "Guild is full (max 5 members)" });
        }

        // Find target user
        const { data: target } = await supabase.from('users').select('id, username, guild_id').eq('username', username).maybeSingle();
        if (!target) return res.status(404).json({ message: `User "${username}" not found` });
        if (target.guild_id) return res.status(400).json({ message: `${username} is already in a guild` });

        // Add to guild
        await supabase.from('users').update({ guild_id: inviter.guild_id }).eq('id', target.id);

        res.json({ message: `${username} has joined your guild!` });
    } catch (error) {
        console.error("Invite Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
});

// ─── LEAVE GUILD ─────────────────────────────────────────
router.post("/leave", authMiddleware, async (req, res) => {
    try {
        const { data: user } = await supabase.from('users').select('guild_id').eq('id', req.userId).single();
        if (!user?.guild_id) return res.status(400).json({ message: "You are not in a guild" });

        // Check if owner — if so, delete the guild entirely
        const { data: guild } = await supabase.from('guilds').select('owner_id').eq('id', user.guild_id).single();

        if (guild?.owner_id === req.userId) {
            // Remove all members first
            await supabase.from('users').update({ guild_id: null }).eq('guild_id', user.guild_id);
            // Delete guild
            await supabase.from('guilds').delete().eq('id', user.guild_id);
            return res.json({ message: "Guild disbanded (you were the owner)" });
        }

        // Regular member just leaves
        await supabase.from('users').update({ guild_id: null }).eq('id', req.userId);
        res.json({ message: "You left the guild" });
    } catch (error) {
        console.error("Leave Guild Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
});

// ─── BOSS ATTACK (contribute XP to damage boss) ─────────
router.post("/boss/attack", authMiddleware, async (req, res) => {
    try {
        const { xpAmount } = req.body;
        if (!xpAmount || xpAmount <= 0) return res.status(400).json({ message: "Invalid XP amount" });

        const { data: user } = await supabase.from('users').select('guild_id, xp').eq('id', req.userId).single();
        if (!user?.guild_id) return res.status(400).json({ message: "You are not in a guild" });

        // Check user has enough XP
        if (user.xp < xpAmount) return res.status(400).json({ message: "Not enough XP" });

        const { data: guild } = await supabase.from('guilds').select('*').eq('id', user.guild_id).single();
        if (!guild) return res.status(404).json({ message: "Guild not found" });
        if (guild.boss_hp_remaining <= 0) return res.status(400).json({ message: "Boss already defeated this week!" });

        // Deduct XP from user, reduce boss HP
        const damage = Math.min(xpAmount, guild.boss_hp_remaining);
        await supabase.from('users').update({ xp: user.xp - damage }).eq('id', req.userId);
        await supabase.from('guilds').update({ boss_hp_remaining: guild.boss_hp_remaining - damage }).eq('id', guild.id);

        const bossDefeated = (guild.boss_hp_remaining - damage) <= 0;

        if (bossDefeated) {
            // Award 5 gold to ALL members
            const { data: members } = await supabase.from('users').select('id, gold').eq('guild_id', guild.id);
            for (const m of (members || [])) {
                await supabase.from('users').update({ gold: (m.gold || 0) + 5 }).eq('id', m.id);
            }
        }

        res.json({
            message: bossDefeated ? "🎉 Boss defeated! All members earned 5 Gold!" : `Dealt ${damage} damage to the boss!`,
            bossDefeated,
            bossHpRemaining: Math.max(0, guild.boss_hp_remaining - damage),
        });
    } catch (error) {
        console.error("Boss Attack Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
});

module.exports = router;
