-- Create the users table
CREATE TABLE IF NOT EXISTS Users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  house_number INTEGER NOT NULL,
  condo_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create the sports facilities table
CREATE TABLE sports_facilities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  sport_type VARCHAR(50) NOT NULL,
  code VARCHAR(10) NOT NULL,
  CONSTRAINT unique_facility_code UNIQUE (code)
);

-- Create the reservations table
CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  facility_id INTEGER NOT NULL,
  reserved_at DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES Users(id),
  CONSTRAINT fk_facility FOREIGN KEY (facility_id) REFERENCES sports_facilities(id),
  CONSTRAINT chk_valid_end_time CHECK (end_time > start_time AND end_time <= (start_time + INTERVAL '1 hour'))
);

CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
