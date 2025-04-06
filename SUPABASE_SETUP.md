
# Supabase Setup Guide for Space Cargo Management

This guide will help you set up your Supabase project to work with the Space Cargo Management application.

## 1. Create Supabase Tables

Copy and paste the SQL from `supabase/schema.sql` into the Supabase SQL Editor and run it. 
This will create the following tables:

- `cargo_items` - For storing cargo item information
- `storage_containers` - For storing container information
- `action_logs` - For tracking all actions in the system

## 2. Set Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Replace `your_supabase_url_here` and `your_supabase_anon_key_here` with your actual Supabase URL and anon key.

You can find these values in your Supabase dashboard under Project Settings > API.

## 3. Enable Authentication

1. Go to Authentication > Settings in your Supabase dashboard
2. Enable "Email provider" if it's not already enabled
3. Optionally, disable "Email confirmations" during development

## 4. Add Test Data (Optional)

You can run the following SQL to add some test data:

```sql
-- Add test containers
INSERT INTO storage_containers (name, capacity, location, user_id)
VALUES 
  ('Container A', 1000, 'Bay 1', auth.uid()),
  ('Container B', 2000, 'Bay 2', auth.uid()),
  ('Container C', 1500, 'Bay 3', auth.uid());

-- Add test items
INSERT INTO cargo_items (name, priority, status, location, weight, volume, user_id)
VALUES
  ('Medical Supplies', 'high', 'stored', 'Container A', 50, 200, auth.uid()),
  ('Food Rations', 'medium', 'stored', 'Container B', 100, 400, auth.uid()),
  ('Scientific Equipment', 'low', 'in-transit', 'Container C', 75, 300, auth.uid());
```

Note: You'll need to be logged in for the test data to be associated with your user account.

## 5. Verify Connection

Open the application and check the database status indicator on the dashboard. If everything is set up correctly, it should show "Connected to Supabase database".

## Troubleshooting

If you encounter issues:

1. Check that your environment variables are correct
2. Verify that all tables were created successfully
3. Make sure RLS policies are set up as defined in the schema
4. Check the browser console for any specific error messages
