# Photographer Social App (Backend)

The server-side component of the Photographer Social Application, providing a robust RESTful API for user management, social interactions, and media handling.

## 🚀 Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL
* **Authentication:** JWT (JSON Web Tokens)

## 🛠 Features

* **User Management:** Registration, login, and profile customization.
* **Social Logic:** Follow/unfollow system and user search.
* **Post Management:** CRUD operations for photo posts, including likes and comments.
* **Security:** Password hashing with bcrypt and protected routes via JWT middleware.
* **API Documentation:** Structured responses for seamless frontend integration.

## 📦 Getting Started

### Prerequisites

* Node.js (v18.x or higher)
* PostgreSQL (Local instance)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/H1mka/photographer-social-app-server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    Copy a `.env` file in the root directory from .env.example:

4.  **Run the server:**
    ```bash
    # Development mode
    npm run dev
