// import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";
import config from "../config";

// export const sql = neon(config.database_url);
export const pool = new Pool({
	connectionString: `${config.database_url}`,
});
export const initDB = async () => {
	await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(75) NOT NULL,  
        email VARCHAR(250) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'contributor' CHECK(role IN('contributor', 'maintainer')),
        created_at TIMESTAMP  NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()

    )`);

	await pool.query(`
CREATE TABLE IF NOT EXISTS issues(
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL CHECK(length(description) >= 20),
    type VARCHAR(20) NOT NULL CHECK(type IN ('bug', 'feature_request')),
    status VARCHAR(15) NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'in_progress', 'resolved')), 
    reporter_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
)
`);
	console.log(`database connected`);
};
