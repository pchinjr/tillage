import { JSX } from "preact";
import { useState, useEffect } from "preact/hooks";

interface FlowerGardenProps {
  flowers: { id: number; left: string; bottom: string }[];
}

export default function FlowerGarden({ flowers }: FlowerGardenProps): JSX.Element {
  const [flowerColors, setFlowerColors] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const newColors = { ...flowerColors };
    flowers.forEach((flower) => {
      if (!newColors[flower.id]) {
        newColors[flower.id] = getRandomFlowerColor();
      }
    });
    setFlowerColors(newColors);
  }, [flowers]);

  const getRandomFlowerColor = () => {
    const colors = ["pink", "red", "blue", "purple", "orange"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const renderFlowers = () => {
    return flowers.map((flower) => (
      <svg
        key={flower.id}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        class="flower"
        style={{
          position: "absolute",
          left: flower.left,
          bottom: flower.bottom,
          width: "40px",
          height: "40px",
        }}
      >
        <circle cx="32" cy="32" r="10" fill="yellow" />
        {[0, 72, 144, 216, 288].map((rotation) => (
          <path
            key={rotation}
            d="M32 2 C42 12, 42 20, 32 30 C22 20, 22 12, 32 2"
            fill={flowerColors[flower.id]}
            transform={`rotate(${rotation} 32 32)`}
          />
        ))}
      </svg>
    ));
  };

  return <>{renderFlowers()}</>;
}