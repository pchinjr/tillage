import { useState, useEffect } from "preact/hooks";
import { JSX } from "preact";

export default function DarkModeToggle(): JSX.Element {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const darkModeSetting = localStorage.getItem("darkMode");
    if (darkModeSetting === "enabled") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle("dark-mode", newDarkMode);
    localStorage.setItem("darkMode", newDarkMode ? "enabled" : "disabled");
  };

  return (
    <div class="dark-mode-toggle" onClick={toggleDarkMode}>
    {darkMode ? (
      <svg id="sunIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5" fill="#FFA500" />
        <g stroke="#FFA500" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="4" />
          <line x1="12" y1="20" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
          <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="4" y2="12" />
          <line x1="20" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
          <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
        </g>
      </svg>
    ) : (
      <svg id="moonIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
          d="M21.64 13.66a9 9 0 01-9.3 9.3c-4.96-.24-9-4.36-9-9.34 0-4.98 4.03-9.1 9-9.34a9 9 0 019.3 9.38z"
          fill="#d4d4d4"
        />
      </svg>
    )}
    <div class="toggle-switch"></div>
  </div>
  );
}