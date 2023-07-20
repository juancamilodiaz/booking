const { Client } = require('pg');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Other imports here...

// Parse incoming requests with JSON payloads
app.use(bodyParser.json());

// Register the route
const userController = require('./controllers/userController');
app.post('/register', userController.register);
app.post('/login', userController.login);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Replace with your PostgreSQL database connection details
const connectionString = 'postgres://postgres:admin@localhost:5432/reservation_system';

const client = new Client({
  connectionString: connectionString,
});

async function connect() {
  try {
    await client.connect();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database', error);
  }
}

async function createTables() {
  try {
    const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) NOT NULL,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        house_number INTEGER NOT NULL,
        condo_name VARCHAR(100) NOT NULL,
        house_code VARCHAR(10) NOT NULL,
        password VARCHAR(100) NOT NULL,
        CONSTRAINT unique_email UNIQUE (email),
        CONSTRAINT unique_house_code UNIQUE (house_code)
      )
    `;

    const createFacilitiesTableQuery = `
      CREATE TABLE IF NOT EXISTS sports_facilities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        sport_type VARCHAR(50) NOT NULL,
        code VARCHAR(10) NOT NULL,
        CONSTRAINT unique_facility_code UNIQUE (code)
      )
    `;

    const createReservationsTableQuery = `
      CREATE TABLE IF NOT EXISTS reservations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        facility_id INTEGER NOT NULL,
        reservation_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
        CONSTRAINT fk_facility FOREIGN KEY (facility_id) REFERENCES sports_facilities(id),
        CONSTRAINT chk_valid_end_time CHECK (end_time > start_time AND end_time <= (start_time + INTERVAL '1 hour'))
      )
    `;

    await client.query(createUsersTableQuery);
    await client.query(createFacilitiesTableQuery);
    await client.query(createReservationsTableQuery);

    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables', error);
  }
}

async function loginUser(email, password) {
  try {
    const getUserQuery = 'SELECT * FROM users WHERE email = $1';
    const result = await client.query(getUserQuery, [email]);

    if (result.rows.length === 0) {
      console.log('User not found');
      return false;
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      console.log('Login successful');
      return true;
    } else {
      console.log('Incorrect password');
      return false;
    }
  } catch (error) {
    console.error('Error while logging in', error);
    return false;
  }
}

async function main() {
  await connect();
  //await createTables();
  // Example usage of the login function
  const email = 'user@example.com';
  const password = 'userpassword';

  const loginSuccess = await loginUser(email, password);

  if (loginSuccess) {
    // Implement your logic for successful login here
    console.log('Welcome to the application!');
  } else {
    // Implement your logic for failed login here
    console.log('Login failed. Please check your email and password.');
  }

  await client.end();
  console.log('Disconnected from the database');
}

//main();
