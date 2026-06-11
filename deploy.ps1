$env:VERCEL_ORG_ID = ""
$env:VERCEL_PROJECT_ID = ""
npx vercel --prod --yes -e DATABASE_URL="postgresql://postgres.xwnqdhabtyqelujtbpzr:Arianca0107$@aws-1-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true" -e DIRECT_URL="postgresql://postgres.xwnqdhabtyqelujtbpzr:Arianca0107$@aws-1-us-west-2.pooler.supabase.com:5432/postgres" -e ADMIN_EMAIL="admin@vidriero.com" -e ADMIN_PASSWORD="admin123" -e AUTH_SECRET="a_very_secure_random_string_that_is_at_least_32_characters_long"
