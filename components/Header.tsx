import { User } from "@/utils/db.ts";

export interface HeaderProps {
  /** Currently signed-in user */
  sessionUser?: User;
  /**
   * URL of the current page. This is used for highlighting the currently
   * active page in navigation.
   */
  url: URL;
}

export default function Header(props: HeaderProps) {
  return (
    <header class="header">
      <h1 class="title">Peaceful Typing Garden</h1>
      <div class="auth-container">
        {props.sessionUser
          ? (
            <>
              <p class="welcome-message">Welcome, {props.sessionUser.login}!</p>
              <a href="/signout" class="button logout-button">Log out</a>
            </>
          )
          : (
            <a href="/signin" class="button login-button">
              Log in with GitHub
            </a>
          )}
      </div>
    </header>
  );
}
