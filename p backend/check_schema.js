require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log("--- Supabase Schema Check ---");
  
  // Check users table
  const { data: userData, error: userError } = await supabase.from('users').select('*').limit(1);
  if (userError) {
    console.error("Error accessing users table:", userError.message);
  } else {
    console.log("Users table columns:", Object.keys(userData[0] || {}));
  }

  // Check guilds table
  const { data: guildData, error: guildError } = await supabase.from('guilds').select('*').limit(1);
  if (guildError) {
    console.error("Error accessing guilds table:", guildError.message);
  } else {
    console.log("Guilds table columns:", Object.keys(guildData[0] || {}));
  }
}

checkSchema();
