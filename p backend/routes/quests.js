const express = require("express");
const supabase = require("../supabase/client");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all quests for a user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const { data: quests, error } = await supabase
            .from('quests')
            .select('*')
            .eq('user_id', req.userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(quests);
    } catch (error) {
        console.error("Get Quests Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// Create a new quest
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, category, xp, gold } = req.body;
        
        if (!title || !category) {
            return res.status(400).json({ message: "Title and category are required" });
        }

        const { data: newQuest, error } = await supabase
            .from('quests')
            .insert([
                {
                    user_id: req.userId,
                    title,
                    category,
                    xp: xp || 50,
                    gold: gold || 10,
                }
            ])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(newQuest);
    } catch (error) {
        console.error("Create Quest Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// Complete a quest (also updates user xp and gold)
router.patch("/:id/complete", authMiddleware, async (req, res) => {
    try {
        // 1. Fetch the quest
        const { data: quest, error: questError } = await supabase
            .from('quests')
            .select('*')
            .eq('id', req.params.id)
            .eq('user_id', req.userId)
            .single();
        
        if (questError || !quest) {
            return res.status(404).json({ message: "Quest not found" });
        }

        if (quest.completed) {
            return res.status(400).json({ message: "Quest already completed" });
        }

        // 2. Mark quest as completed
        const { error: updateQuestError } = await supabase
            .from('quests')
            .update({ completed: true })
            .eq('id', req.params.id);

        if (updateQuestError) throw updateQuestError;

        // 3. Update user stats
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', req.userId)
            .single();

        if (userError) throw userError;

        const newXp = (user.xp || 0) + quest.xp;
        const newPoints = (user.points || 0) + quest.xp;
        const newLevel = Math.floor(newXp / 1000) + 1;

        const { data: updatedUser, error: updateUserError } = await supabase
            .from('users')
            .update({
                xp: newXp,
                points: newPoints,
                level: newLevel
            })
            .eq('id', req.userId)
            .select()
            .single();

        if (updateUserError) throw updateUserError;

        res.json({ message: "Quest completed", quest: { ...quest, completed: true }, user: updatedUser });
    } catch (error) {
        console.error("Complete Quest Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// Delete a quest
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const { data: quest, error } = await supabase
            .from('quests')
            .delete()
            .eq('id', req.params.id)
            .eq('user_id', req.userId)
            .select()
            .single();

        if (error || !quest) {
            return res.status(404).json({ message: "Quest not found" });
        }
        res.json({ message: "Quest deleted successfully" });
    } catch (error) {
        console.error("Delete Quest Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;
