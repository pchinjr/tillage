import { JSX } from "preact";

export default function Header(
  { username }: { username: string | null },
): JSX.Element {
  return (
    <header class="header">
      <h1 style="text-align: center">Peaceful Typing Garden</h1>
      {username
        ? (
          <>
            <p>Welcome, {username}!</p>
            <p>
              <a href="/signout">Log out</a>
            </p>
          </>
        )
        : (
          <p>
            <a href="/signin">Log in with GitHub</a>
          </p>
        )}
    </header>
  );
}
