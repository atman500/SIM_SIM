import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ycfcwoopugnvvyxfgrje.supabase.co'
const supabaseAnonKey = 'sb_publishable_rgcL-HgKdMUXO2sYmArKBA_RYEiIu32'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
