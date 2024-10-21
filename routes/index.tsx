import Header from "../components/Header.tsx";
import TypingGarden from "../islands/TypingGarden.tsx";
import DarkModeToggle from "../islands/DarkModeToggle.tsx";
import { useEffect } from "preact/hooks";

export default function Home() {
  useEffect(() => {
    const darkModeSetting = localStorage.getItem("darkMode");
    if (darkModeSetting === "enabled") {
      document.body.classList.add("dark-mode");
    }
  }, []);

  return (
    <div>
      <Header />
      <TypingGarden />
      <DarkModeToggle />
    </div>
  );
}