
-- Create tables for Space Cargo Management System

-- Table for cargo items
CREATE TABLE IF NOT EXISTS cargo_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL CHECK (status IN ('stored', 'in-transit', 'waste')),
  location TEXT NOT NULL,
  weight NUMERIC NOT NULL,
  volume NUMERIC NOT NULL,
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expiration_date TIMESTAMP WITH TIME ZONE,
  usage_count INTEGER DEFAULT 0,
  user_id UUID REFERENCES auth.users
);

-- Table for storage containers
CREATE TABLE IF NOT EXISTS storage_containers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  capacity NUMERIC NOT NULL,
  used_capacity NUMERIC DEFAULT 0,
  location TEXT NOT NULL,
  user_id UUID REFERENCES auth.users
);

-- Table for action logs
CREATE TABLE IF NOT EXISTS action_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  action TEXT NOT NULL CHECK (action IN ('place', 'retrieve', 'relocate', 'dispose')),
  item_id UUID NOT NULL,
  item_name TEXT NOT NULL,
  location TEXT,
  user TEXT NOT NULL,
  details TEXT
);

-- Add RLS policies
ALTER TABLE cargo_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_containers ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for cargo_items
CREATE POLICY "Users can view their own cargo items"
  ON cargo_items
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cargo items"
  ON cargo_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cargo items"
  ON cargo_items
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policies for storage_containers
CREATE POLICY "Users can view their own storage containers"
  ON storage_containers
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own storage containers"
  ON storage_containers
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own storage containers"
  ON storage_containers
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policies for action_logs (simplified for now)
CREATE POLICY "Anyone can view action logs"
  ON action_logs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert action logs"
  ON action_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
