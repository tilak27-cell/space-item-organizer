
# Supabase Setup Guide for Space Cargo Management

This guide will help you set up your Supabase project to work with the Space Cargo Management application.

## 1. Create a .env.local File

Create a `.env.local` file in the root of your project with the following variables:

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Replace `your_supabase_url_here` and `your_supabase_anon_key_here` with your actual Supabase URL and anon key.

You can find these values in your Supabase dashboard under Project Settings > API.

**Important**: After creating or updating the `.env.local` file, you must restart the development server for the changes to take effect.

## 2. Create Supabase Tables

In your Supabase dashboard, go to the SQL Editor and run the following SQL to create the required tables:

```sql
-- Create cargo_items table
CREATE TABLE public.cargo_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
    status TEXT NOT NULL CHECK (status IN ('stored', 'in-transit', 'waste')),
    location TEXT,
    weight FLOAT NOT NULL,
    volume FLOAT NOT NULL,
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expiration_date TIMESTAMP WITH TIME ZONE,
    usage_count INTEGER DEFAULT 0,
    user_id UUID REFERENCES auth.users(id)
);

-- Create storage_containers table
CREATE TABLE public.storage_containers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    capacity FLOAT NOT NULL,
    used_capacity FLOAT DEFAULT 0,
    location TEXT,
    user_id UUID REFERENCES auth.users(id)
);

-- Create action_logs table
CREATE TABLE public.action_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
    action TEXT NOT NULL,
    item_id UUID REFERENCES public.cargo_items(id),
    item_name TEXT,
    location TEXT,
    user TEXT,
    details TEXT,
    user_id UUID REFERENCES auth.users(id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.cargo_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_containers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own items" 
ON public.cargo_items FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own items" 
ON public.cargo_items FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own items" 
ON public.cargo_items FOR UPDATE 
USING (auth.uid() = user_id);

-- Similar policies for storage_containers and action_logs
CREATE POLICY "Users can view their own containers" 
ON public.storage_containers FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own containers" 
ON public.storage_containers FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own logs" 
ON public.action_logs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own logs" 
ON public.action_logs FOR INSERT 
WITH CHECK (auth.uid() = user_id);
```

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

1. Check that your environment variables are correct in the `.env.local` file
2. Restart the development server after making changes to `.env.local`
3. Verify that all tables were created successfully
4. Make sure RLS policies are set up as defined in the schema
5. Check the browser console for any specific error messages
6. If the database connection fails, you may need to set up CORS in your Supabase project settings
