import { JSX } from "preact";
import { useEffect, useState } from "preact/hooks";

// Define the props for the FlowerGarden component, which expects an array of flower objects
interface FlowerGardenProps {
  flowers: { id: number; left: string; bottom: string }[];
}

export default function FlowerGarden(
  { flowers }: FlowerGardenProps,
): JSX.Element {
  // Define a state variable to hold colors for each flower based on its ID
  // The key is the flower ID and the value is the flower's color
  const [flowerColors, setFlowerColors] = useState<{ [key: number]: string }>(
    {},
  );

  // useEffect that runs whenever the flowers array changes
  useEffect(() => {
    const newColors = { ...flowerColors }; // Create a copy of the current flower colors
    flowers.forEach((flower) => {
      // For each flower, if it doesn't have a color assigned, assign a random color
      if (!newColors[flower.id]) {
        newColors[flower.id] = getRandomFlowerColor();
      }
    });
    // Update the flowerColors state with the new colors
    setFlowerColors(newColors);
  }, [flowers]); // This effect runs whenever the flowers array changes

  // Function to generate a random color from a predefined list
  const getRandomFlowerColor = () => {
    const colors = ["pink", "red", "blue", "purple", "orange"];
    // Randomly pick a color from the array
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Function to render the flowers as SVG elements
  const renderFlowers = () => {
    // Map over the flowers array to create SVG elements for each flower
    return flowers.map((flower) => (
      <svg
        key={flower.id} // Unique key based on the flower's ID
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        class="flower"
        style={{
          position: "absolute", // Position each flower absolutely
          left: flower.left, // Position horizontally based on the 'left' value from props
          bottom: flower.bottom, // Position vertically based on the 'bottom' value from props
          width: "40px", // Fixed size for the flower
          height: "40px",
        }}
      >
        {/* Render the center of the flower as a yellow circle */}
        <circle cx="32" cy="32" r="10" fill="yellow" />

        {/* Render five petals, rotating each one around the center */}
        {[0, 72, 144, 216, 288].map((rotation) => (
          <path
            key={rotation} // Unique key for each petal
            d="M32 2 C42 12, 42 20, 32 30 C22 20, 22 12, 32 2" // Path for the petal shape
            fill={flowerColors[flower.id]} // Use the color associated with the flower's ID
            transform={`rotate(${rotation} 32 32)`} // Rotate the petal around the center of the flower
          />
        ))}
      </svg>
    ));
  };

  // Render the flower SVGs by calling renderFlowers() within a fragment
  return <>{renderFlowers()}</>;
}
