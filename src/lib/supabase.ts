
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oolbgippceefzlgpvgyr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9vbGJnaXBwY2VlZnpsZ3B2Z3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk5NTc2MDAsImV4cCI6MjAwNTUzMzYwMH0.example-key'; // This is a placeholder key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);