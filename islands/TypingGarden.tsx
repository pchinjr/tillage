import { JSX } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import FlowerGarden from "@/islands/FlowerGarden.tsx";

export interface TypingGardenProps {
  /** Endpoint URL of the REST API to make the fetch request to */
  endpoint: string;
  /** Whether the user is signed-in */
  isSignedIn: boolean;
}

export default function TypingGarden(_props: TypingGardenProps): JSX.Element {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [deletionTimer, setDeletionTimer] = useState<number | null>(null);
  const [lastInputValue, setLastInputValue] = useState<string>("");
  const [flowers, setFlowers] = useState<
    { id: number; left: string; bottom: string }[]
  >([]);

  const startDeletionTimer = (initialDelay: number) => {
    if (deletionTimer) {
      clearTimeout(deletionTimer);
    }
    console.log("Starting deletion timer with delay: ", initialDelay);
    const timer = globalThis.setTimeout(() => {
      console.log("Timer triggered, calling deleteFirstCharacter");
      deleteFirstCharacter();
    }, initialDelay);
    setDeletionTimer(timer);
  };

  const deleteFirstCharacter = () => {
    if (!inputRef.current) return;

    const currentValue = inputRef.current.value;
    console.log("Deleting character, current value: ", currentValue);
    if (currentValue.length > 0) {
      const newValue = currentValue.substring(1);
      inputRef.current.value = newValue;
      setLastInputValue(newValue);
      console.log("Character deleted, new value: ", newValue);
      startDeletionTimer(1000);
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
      setDeletionTimer(null);
    }
  };

  const handleInput = () => {
    if (!inputRef.current) return;

    const newValue = inputRef.current.value;
    console.log("Input changed: ", newValue);
    setLastInputValue(newValue);
    if (deletionTimer) {
      clearTimeout(deletionTimer);
    }
    startDeletionTimer(5000);
  };

  const saveFlowerState = async () => {
    if (_props.isSignedIn) {
      await fetch(`${_props.endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flowers }),
      });
    }
  };

  const loadFlowerState = async () => {
    if (_props.isSignedIn) {
      const res = await fetch(`${_props.endpoint}`, {
        method: "GET",
      });
      if (res.ok) {
        const data = await res.json();
        setFlowers(data.flowers);
      }
    }
  };

  useEffect(() => {
    loadFlowerState();
  }, []);

  useEffect(() => {
    if (flowers.length > 0) {
      saveFlowerState();
    }
  }, [flowers]);

  useEffect(() => {
    if (!inputRef.current) return;

    setLastInputValue(inputRef.current.value);
    startDeletionTimer(5000);

    return () => {
      if (deletionTimer) {
        clearTimeout(deletionTimer);
      }
    };
  }, []);

  useEffect(() => {
    console.log("TypingGarden component mounted");
    return () => {
      console.log("TypingGarden component unmounted");
    };
  }, []);

  useEffect(() => {
    console.log("Last input value changed: ", lastInputValue);
  }, [lastInputValue]);

  useEffect(() => {
    console.log("Deletion timer set or cleared");
  }, [deletionTimer]);

  return (
    <div class="container" style={{ position: "relative" }}>
      <h2>Let Thoughts Grow</h2>
      <textarea
        ref={inputRef}
        id="userInput"
        autocomplete="off"
        placeholder="Start typing and let it all go..."
        onInput={handleInput}
        style={{
          width: "100%",
          height: "300px",
          padding: "20px",
          fontSize: "18px",
        }}
      />
      {flowers.length > 0 && <FlowerGarden flowers={flowers} />}
    </div>
  );
}
