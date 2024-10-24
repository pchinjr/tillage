# tillage

sow despair and reap ambitions

tillage is a unique web application that transforms your typing into a garden of flowers. As you type into the text box, flowers "grow" in the garden, and the text you enter slowly fades away as characters are automatically deleted. The app also includes a user authentication system, allowing signed-in users to save and load their custom flower arrangements.

## Features

- **Dynamic Flower Growth**: As users type, each deleted character spawns a flower at random positions in the garden.
- **Auto-deletion Timer**: Text is automatically deleted at intervals, with each deletion growing a new flower.
- **User Authentication**: Users can sign in using GitHub OAuth to save and load their flower garden state.
- **Persisted Garden State**: The flower arrangements are saved to Deno KV for authenticated users, allowing them to revisit and see their previous creations.

## Technology Stack

- **Fresh Framework**: A modern, server-side rendering web framework built for Deno.
- **Preact**: A fast, lightweight alternative to React, used for rendering UI components.
- **Deno KV**: A key-value store used for storing flower arrangements tied to user sessions.
- **GitHub OAuth**: Used for user authentication, allowing users to sign in and save their garden state.

## Getting Started

### Prerequisites

- [Deno](https://deno.land/) must be installed on your machine.
- A GitHub OAuth application must be set up to provide the necessary client ID and secret for authentication.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/typing-garden.git
   cd typing-garden
   ```

2. Set up environment variables for GitHub OAuth:
   ```bash
   export GITHUB_CLIENT_ID=your-client-id
   export GITHUB_CLIENT_SECRET=your-client-secret
   ```

3. Run the development server:
   ```bash
   deno task start
   ```

4. Open your browser and go to `http://localhost:8000` to view the Typing Garden app.

### User Authentication

1. Click "Sign In" to authenticate via GitHub.
2. After signing in, you will be able to type into the text box and have your flower state automatically saved.
3. The next time you visit the app and sign in, your flower arrangement will be loaded from Deno KV.

## Folder Structure

```
├── components/        # Preact components for UI rendering
├── islands/           # Islands for rendering interactive components
│   ├── FlowerGarden.tsx   # Displays the flowers dynamically based on user typing
│   └── TypingGarden.tsx   # Main component where users type and see their flowers grow
├── plugins/           # Session and OAuth plugins
│   ├── kv_oauth.ts        # Handles GitHub OAuth login and session state
│   └── session.ts         # Middleware for managing user sessions
├── routes/            # API routes and page handlers
│   ├── index.tsx          # Main page route for Typing Garden
│   └── api/flowers.ts     # API route for saving and fetching flower state
└── utils/             # Utility functions for handling database and HTTP operations
```

## API Endpoints

- **POST `/api/flowers`**: Saves the current user's flower state.
- **GET `/api/flowers`**: Retrieves the flower state for the authenticated user.

## Development

To modify or extend the Typing Garden:

- **Add more flower types or animations**: Modify the `FlowerGarden.tsx` component to change how flowers are rendered.
- **Change the typing behavior**: Update the `TypingGarden.tsx` component to adjust how characters are deleted and flowers are created.
- **Enhance authentication**: The `plugins/kv_oauth.ts` plugin can be extended to support other OAuth providers or enhance session management.

## Contributing

Feel free to open issues or submit pull requests if you find bugs or want to contribute to the project!

## License

This project is licensed under the MIT License.