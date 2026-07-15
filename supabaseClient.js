import { createClient } from '@supabase/supabase-js';

// URL proyek Anda
const supabaseUrl = 'https://ppgcoiktgcmqhifnafag.supabase.co';

// Tempel kunci Publishable key yang Anda salin dari Langkah 1 ke dalam tanda petik di bawah ini
const supabaseAnonKey = 'sb_publishable_wFokC3m6X0DhaOVB3_kJVA_pljLK6Ao'; // Lanjutkan teks aslinya sampai habis

export const supabase = createClient(supabaseUrl, supabaseAnonKey);