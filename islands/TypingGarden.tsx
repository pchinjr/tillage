import { JSX } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import FlowerGarden from "@/islands/FlowerGarden.tsx";

// Define the props interface for the TypingGarden component
export interface TypingGardenProps {
  /** Endpoint URL of the REST API to make the fetch request to */
  endpoint: string;
  /** Whether the user is signed-in */
  isSignedIn: boolean;
}

export default function TypingGarden(_props: TypingGardenProps): JSX.Element {
  // Create a reference to the textarea element
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // State for managing the deletion timer, input value, and flowers
  const [deletionTimer, setDeletionTimer] = useState<number | null>(null);
  const [lastInputValue, setLastInputValue] = useState<string>("");
  const [flowers, setFlowers] = useState<
    { id: number; left: string; bottom: string }[]
  >([]);

  // Function to start a timer that will trigger character deletion after a delay
  const startDeletionTimer = (initialDelay: number) => {
    // Clear any existing timer
    if (deletionTimer) {
      clearTimeout(deletionTimer);
    }
    console.log("Starting deletion timer with delay: ", initialDelay);

    // Set a new timer to delete the first character after the specified delay
    const timer = globalThis.setTimeout(() => {
      console.log("Timer triggered, calling deleteFirstCharacter");
      deleteFirstCharacter();
    }, initialDelay);

    // Save the timer ID in the state
    setDeletionTimer(timer);
  };

  // Function to delete the first character from the textarea input
  const deleteFirstCharacter = () => {
    if (!inputRef.current) return; // Ensure the textarea is available

    const currentValue = inputRef.current.value;
    console.log("Deleting character, current value: ", currentValue);

    // If there are characters in the textarea, remove the first one
    if (currentValue.length > 0) {
      const newValue = currentValue.substring(1);
      inputRef.current.value = newValue;
      setLastInputValue(newValue); // Update the last input value
      console.log("Character deleted, new value: ", newValue);

      // Restart the timer for continuous deletion
      startDeletionTimer(1000);

      // Add a new "flower" with random left and bottom positions
      setFlowers((prevFlowers) => [
        ...prevFlowers,
        {
          id: prevFlowers.length,
          left: `${Math.random() * 90}%`,
          bottom: `${Math.random() * 30}%`,
        },
      ]);
    } else {
      console.log("Input is empty, stopping deletion");
      setDeletionTimer(null); // Stop the deletion process if no characters are left
    }
  };

  // Function to handle input changes in the textarea
  const handleInput = () => {
    if (!inputRef.current) return; // Ensure the textarea is available

    const newValue = inputRef.current.value;
    console.log("Input changed: ", newValue);
    setLastInputValue(newValue); // Update the last input value

    // Clear the existing deletion timer
    if (deletionTimer) {
      clearTimeout(deletionTimer);
    }

    // Start a new timer with a 5-second delay
    startDeletionTimer(5000);
  };

  // Function to save the current flower state to the server (if signed in)
  const saveFlowerState = async () => {
    if (_props.isSignedIn) {
      await fetch(`${_props.endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flowers }), // Send the current flowers to the API
      });
    }
  };

  // Function to load the flower state from the server (if signed in)
  const loadFlowerState = async () => {
    if (_props.isSignedIn) {
      const res = await fetch(`${_props.endpoint}`, {
        method: "GET",
      });
      if (res.ok) {
        const data = await res.json();
        setFlowers(data.flowers); // Load flowers from the API response
      }
    }
  };

  // Load flower state when the component mounts
  useEffect(() => {
    loadFlowerState();
  }, []);

  // Save flower state to the server whenever the flowers array changes
  useEffect(() => {
    if (flowers.length > 0) {
      saveFlowerState();
    }
  }, [flowers]);

  // Set the initial input value and start the deletion timer when the component mounts
  useEffect(() => {
    if (!inputRef.current) return;

    setLastInputValue(inputRef.current.value); // Initialize last input value
    startDeletionTimer(5000); // Start the timer with a 5-second delay

    // Cleanup: clear the timer when the component unmounts
    return () => {
      if (deletionTimer) {
        clearTimeout(deletionTimer);
      }
    };
  }, []);

  // Log when the component mounts and unmounts
  useEffect(() => {
    console.log("TypingGarden component mounted");
    return () => {
      console.log("TypingGarden component unmounted");
    };
  }, []);

  // Log when the last input value changes
  useEffect(() => {
    console.log("Last input value changed: ", lastInputValue);
  }, [lastInputValue]);

  // Log when the deletion timer is set or cleared
  useEffect(() => {
    console.log("Deletion timer set or cleared");
  }, [deletionTimer]);

  // Render the textarea and the flower garden (if there are any flowers)
  return (
    <div class="container" style={{ position: "relative" }}>
      <h2>Let Thoughts Grow</h2>
      <textarea
        ref={inputRef}
        id="userInput"
        autocomplete="off"
        placeholder="Start typing and let it all go..."
        onInput={handleInput} // Call handleInput whenever the user types
        style={{
          width: "100%",
          height: "300px",
          padding: "20px",
          fontSize: "18px",
        }}
      />
      {flowers.length > 0 && <FlowerGarden flowers={flowers} />}{" "}
      {/* Render flowers if any exist */}
    </div>
  );
}
