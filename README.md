# 🚼 DevPulse – A backend API building to Fulfill the Required Task for Assignement 2

### Live URL: [Live link](https://dev-plus-olive.vercel.app/)

### About the Build:

> ### Internal Tech Issue & Feature Tracker
>
> _A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions._

## Features:

- It is mostly a backend API development project
- It is built for purpose of assuming local developent team to communicate with each other regarding development features, reproting bugs, status etc.
- Building routes, controller and services, where all routes live in routes for each feature saparately, as the controller manage the request and responses through routes. The service module handels all business logic, calculations and database query.
- There are user having TWO roles with email has to be created, also login user need to be created without any third party login service. JWT is being used to generate token and varify user to allow login with token having user information in payload
- Issues can be created only by logged in users
- Issues can be seen and it is public via query params in URL, all of the issues with the assigned queries are fetched.
- Single issue can be retrive via id, which is also public like getting all issues above.
- Issues can be updated or deleted with specific Role assigned to said task.

## 🛠️ Technology Stack

| Technology   | Note                                                                          |
| ------------ | ----------------------------------------------------------------------------- |
| Node.js      | LTS runtime (24.x or higher)                                                  |
| TypeScript   | use latest version, dont use beta version                                     |
| Express.js   | Modular router architecture                                                   |
| PostgreSQL   | Relational database, native `pg` driver only                                  |
| Raw SQL      | Direct `pool.query()` calls, absolutely no query builders, ORMs, or SQL JOINs |
| bcrypt       | Password hashing, salt rounds between 8 and 12                                |
| jsonwebtoken | JWT generation & verification (standard tokens)                               |

## Porject Setup

- Initiating a node project and also initiating a typescipt configuration.
- creating .env files and install necesary npm package such as express, JWT, bcrypt, cookie-perser etc.
- setup neondb for serverless db service and setup and configure dotenv for connection string
- setup jwt secret in .env
- setting a server and app file to handle server and request, response.
- module router, controller and service forj each feature process.
- execute the whole app.

## 🌐 API Endpoints Specification

### 🔹 Authentication Module

### 1. User Registration

**Access:** Public

**Description:** Register a new user account with contributor or maintainer role

**Endpoint**

`POST /api/auth/signup`

**Request Body**

```json
{
	"name": "John Doe",
	"email": "john.doe@devpulse.com",
	"password": "securePassword123",
	"role": "contributor"
}
```

**Success Response (201 Created)**

```json
{
	"success": true,
	"message": "User registered successfully",
	"data": {
		"id": 1,
		"name": "John Doe",
		"email": "john.doe@devpulse.com",
		"role": "contributor",
		"created_at": "2026-01-20T09:00:00Z",
		"updated_at": "2026-01-20T09:00:00Z"
	}
}
```

---

### 2. User Login

**Access:** Public

**Description:** Authenticate user and receive JWT token

**Endpoint**

`POST /api/auth/login`

**Request Body**

```json
{
	"email": "john.doe@devpulse.com",
	"password": "securePassword123"
}
```

**Success Response (200 OK)**

```json
{
	"success": true,
	"message": "Login successful",
	"data": {
		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
		"user": {
			"id": 1,
			"name": "John Doe",
			"email": "john.doe@devpulse.com",
			"role": "contributor",
			"created_at": "2026-01-20T09:00:00Z",
			"updated_at": "2026-01-20T09:00:00Z"
		}
	}
}
```

> 💡 **Hint:** When signing the JWT during login, include the user's `id`, `name`, and `role` in the token payload. These fields will be needed later to identify the requester and enforce permissions.

---

### 🔹 Issues Module

### 3. Create Issue

**Access:** Authenticated users (`contributor`, `maintainer`)

**Description:** Create a new bug report or feature request

**Endpoint**

`POST /api/issues`

**Headers**

```
Authorization: <JWT_TOKEN>
```

**Request Body**

```json
{
	"title": "Database connection timeout under load",
	"description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
	"type": "bug"
}
```

**Success Response (201 Created)**

```json
{
	"success": true,
	"message": "Issue created successfully",
	"data": {
		"id": 45,
		"title": "Database connection timeout under load",
		"description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
		"type": "bug",
		"status": "open",
		"reporter_id": 1,
		"created_at": "2026-01-20T10:30:00Z",
		"updated_at": "2026-01-20T10:30:00Z"
	}
}
```

> 💡 **Hint:** The `reporter_id` is extracted from the decoded JWT (`req.user.id`), not from the request body.

---

### 4. Get All Issues

**Access:** Public

**Description:** Retrieve all issues with optional sorting and filtering

**Endpoint**

`GET /api/issues?sort=newest`

**Query Parameters (`let’s take a challenge`)**

| Param    | Values                            | Default  |
| -------- | --------------------------------- | -------- |
| `sort`   | `newest`, `oldest`                | `newest` |
| `type`   | `bug`, `feature_request`          | (none)   |
| `status` | `open`, `in_progress`, `resolved` | (none)   |

**Success Response (200 OK)**

```json
{
	"success": true,
	"message": "Issues retrived successfully",
	"data": [
		{
			"id": 45,
			"title": "Database connection timeout under load",
			"description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
			"type": "bug",
			"status": "open",
			"reporter": {
				"id": 1,
				"name": "John Doe",
				"role": "contributor"
			},
			"created_at": "2026-01-20T10:30:00Z",
			"updated_at": "2026-01-20T14:45:00Z"
		}
	]
}
```

---

### 5. Get Single Issue

**Access:** Public

**Description:** Retrieve full details of a specific issue

**Endpoint**

`GET /api/issues/:id`

**Success Response (200 OK)**

```json
{
	"success": true,
	"message": "Issue retrived successfully",
	"data": {
		"id": 45,
		"title": "Database connection timeout under load",
		"description": "Pool exhausts after 50+ concurrent queries, causing 500 errors",
		"type": "bug",
		"status": "open",
		"reporter": {
			"id": 1,
			"name": "John Doe",
			"role": "contributor"
		},
		"created_at": "2026-01-20T10:30:00Z",
		"updated_at": "2026-01-20T14:45:00Z"
	}
}
```

---

### 6. Update Issue

**Access:** Maintainer (any issue) OR Contributor (own issue, only if status is `open`)

**Description:** Update issue title, description, or type

**Endpoint**

`PATCH /api/issues/:id`

**Headers**

```
Authorization: <JWT_TOKEN>
```

**Request Body**

```json
{
	"title": "Updated: Database pool exhaustion fix needed",
	"description": "Updated description with reproduction steps...",
	"type": "bug"
}
```

**Success Response (200 OK)**

```json
{
	"success": true,
	"message": "Issue updated successfully",
	"data": {
		"id": 45,
		"title": "Updated: Database pool exhaustion fix needed",
		"description": "Updated description with reproduction steps...",
		"type": "bug",
		"status": "in_progress",
		"reporter_id": 1,
		"created_at": "2026-01-20T10:30:00Z",
		"updated_at": "2026-01-20T14:45:00Z"
	}
}
```

---

### 7. Delete Issue

**Access:** Maintainer only

**Description:** Permanently remove an issue from the system

**Endpoint**

`DELETE /api/issues/:id`

**Headers**

```
Authorization: <JWT_TOKEN>
```

**Success Response (200 OK)**

```json
{
	"success": true,
	"message": "Issue deleted successfully"
}
```

## Database Schema

### Create USERS table

```sql
    CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(75) NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(20) NOT NULL,
        created_at TIMESTAMP  NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
```

### Create ISSUES table

```sql
CREATE TABLE IF NOT EXISTS issues(
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL CHECK(length(description) >= 20),
    type VARCHAR(20) NOT NULL CHECK(type IN ('bug', 'feature_request')),
    status VARCHAR(15) NOT NULL CHECK(status IN ('open', 'in_progress', 'resolved')),
    reporter_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
```

# Concluding Remarks

This backend app development project **demonestrate creating server using Node.js with it's popular framework `Express.js`.** We are also required to build API according to instruction. We cater the whole project into popular moduler pattern splittin the whole into `router`, `controller` and `service`

```

```

---
