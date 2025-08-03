# AI Marketing Advisor (এআই মার্কেটিং প্ল্যাটফর্ম)

An AI-powered marketing assistant designed to generate ad copy, hooks, target audience suggestions, and complete marketing strategies for Facebook campaigns. This application is built with a Bengali user interface.

## Tech Stack

-   **Frontend**: React, TypeScript, TailwindCSS
-   **AI**: Google Gemini API (`@google/genai`)
-   **Backend**: Vercel Serverless Function (acting as a secure proxy)
-   **Deployment**: Vercel

---

## Architecture

This project uses a secure architecture to protect the Google Gemini API key.

-   The **frontend** is a React single-page application (SPA). It **does not** contain the API key.
-   All requests to the Gemini API are sent from the frontend to a **serverless function** located at `/api/proxy.ts`.
-   This serverless function is the **only** part of the application that has access to the `API_KEY`. It reads the key from server-side environment variables and forwards the request to the Google Gemini API.
-   This ensures the API key is never exposed to the user's browser.

---

## Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [Vercel CLI](https://vercel.com/docs/cli) for local development that mirrors the production environment.

### Installation

1.  Clone the repository:
    ```bash
    git clone [your-repo-url]
    cd [your-repo-name]
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally

Because this project relies on a serverless function, running it with a simple static file server will not work. The recommended way to run it locally is using the Vercel CLI, which will simulate the entire production environment, including the serverless function.

1.  Create a file named `.env` in the root of the project.
2.  Add your Google Gemini API key to this file:
    ```
    API_KEY="YOUR_GEMINI_API_KEY"
    ```
    *(Note: The `.gitignore` file is configured to prevent this file from being committed to Git.)*

3.  Start the local development server:
    ```bash
    vercel dev
    ```
This will start a server, usually on `http://localhost:3000`, where you can access the full application.

---

## Deployment

This application is configured for easy deployment to [Vercel](https://vercel.com/).

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel from your GitHub repository. Vercel will automatically detect the configuration.
3.  **Set the Environment Variable**: This is the most important step.
    -   In your Vercel project dashboard, go to **Settings** > **Environment Variables**.
    -   Create a new variable:
        -   **Name**: `API_KEY`
        -   **Value**: Paste your Google Gemini API key here.
    -   Ensure the variable is available for all environments (Production, Preview, Development).
4.  Deploy your project. Vercel will build the frontend and deploy the serverless function from the `/api` directory.
