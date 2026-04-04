require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials in .env file");
}

// Ensure the express backend runs with unrestricted DB privileges (like Mongoose did)
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
    }
});

module.exports = supabase;
