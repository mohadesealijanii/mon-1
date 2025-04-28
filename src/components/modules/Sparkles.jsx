import React, { useState } from "react";

const Sparkles = ({
  count = 80,
  duration = 0.9,
  size = 6,
  position = "50%",
}) => {
  const [sparkles, setSparkles] = useState([]);

  // Function to generate sparkles when mouse enters
  const generateSparkles = () => {
    const dots = Array.from({ length: count }).map((_, index) => ({
      id: Date.now() + index,
      transformEnd: `translate(${(Math.random() - 0.5) * 200}px, ${
        (Math.random() - 0.5) * 200
      }px)`,
    }));
    setSparkles(dots);

    // Remove sparkles after animation duration
    setTimeout(() => setSparkles([]), duration * 1000);
  };

  return (
    <div
      className="sparkle-container"
      onMouseEnter={generateSparkles}
      style={{
        position: "absolute", // Absolute to be positioned relative to the parent
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none", // Ensures sparkles don't block interactions
        zIndex: -1, // Place the sparkles behind the button
      }}
    >
      {/* Sparkles */}
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="sparkle-dot"
          style={{
            position: "absolute",
            top: position,
            left: position,
            transform: "translate(-50%, -50%)",
            "--transform-end": sparkle.transformEnd,
            width: size + "px",
            height: size + "px",
            animationDuration: `${duration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Sparkles;
