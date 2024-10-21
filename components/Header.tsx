import { JSX } from "preact";

export default function Header({ username }: { username: string | null }): JSX.Element {
  return (
    <header class="header">
      <h1 class="title">Peaceful Typing Garden</h1>
      <div class="auth-container">
        {username ? (
          <>
            <p class="welcome-message">Welcome, {username}!</p>
            <a href="/signout" class="button logout-button">Log out</a>
          </>
        ) : (
          <a href="/signin" class="button login-button">Log in with GitHub</a>
        )}
      </div>
    </header>
  );
}
