import { createClient } from "@supabase/supabase-js";
import { logger } from "../utils/logger";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    logger.error("Supabase credentials not configured in .env");
    throw new Error(
        "Missing Supabase configuration. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file.",
    );
}

// Crear cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false, // No necesitamos auth de Supabase, solo usamos Edge Functions
    },
});

logger.info("Supabase client initialized successfully");

export default supabase;
