const express = require("express");
const supabase = require("../supabase/client");

const router = express.Router();

//Get LEADERBOARD🏆
//RETURN top users sorted by points

router.get("/", async(req,res) =>{
    try{
        const { data: leaderboard, error } = await supabase
            .from('users')
            .select('email, points, total_focus_seconds')
            .order('points', { ascending: false })
            .limit(10);

        if (error) throw error;

        res.json({
            message: "Leaderboard fetched ✅",
            leaderboard,
        });
    }catch(error){
        console.error("Leaderboard Error:", error);
        res.status(500).json({message: "Server error"});
    }
});

module.exports = router;