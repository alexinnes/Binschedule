import React from "react";
import bins from "../data/bins.json";

// Map bin types to their respective colors
const binColors = {
  "Grey": "grey",
  "Green": "green",
  "Blue": "blue",
  "Brown": "brown",
  "Purple": "purple"
};

function Card({ title, message, note, hidden }) {
  // Helper function to find the next Sunday
  const getNextSunday = () => {
    const today = new Date();
    const nextSunday = new Date();
    nextSunday.setDate(today.getDate() + ((7 - today.getDay()) % 7)); // Calculate the next Sunday
    return nextSunday.toLocaleDateString("en-GB"); // Format as "DD/MM/YYYY"
  };

  const nextSunday = getNextSunday();

  // Find the bin data for the upcoming Sunday
  const binInfo = bins.find((bin) => bin.date === nextSunday);
  console.log("Bin Info for next Sunday:", binInfo);

  return (
    <section className="card" style={{ display: hidden ? "none" : "block" }}>
      <h2>{title}</h2>
      
      {binInfo ? (
  <div>
    <p>
      Bins for {nextSunday}:
      {Array.isArray(binInfo.bins)
        ? binInfo.bins.map((bin, index) => {
            const binParts = bin.split(" & "); // Split the bin into parts (e.g., "Green" and "Brown")
            const gradient =
              binParts.length > 1
                ? `linear-gradient(135deg, ${binColors[binParts[0]] || "lightgrey"} 50%, ${binColors[binParts[1]] || "lightgrey"} 50%)`
                : binColors[binParts[0]] || "lightgrey";

            return (
              <span
                key={index}
                style={{
                  display: "inline-block",
                  marginLeft: "10px", // Add spacing between pills
                  padding: "5px 15px", // Adjust padding for pill shape
                  borderRadius: "20px", // Make it pill-shaped
                  background: gradient, // Use diagonal gradient for slanted split
                  color: "white",
                  fontSize: "0.9rem", // Adjust font size for better appearance
                  fontWeight: "bold",
                  textAlign: "center",
                  whiteSpace: "nowrap",
                }}
              >
                {bin}
              </span>
            );
          })
        : (
          <span
            style={{
              display: "inline-block",
              marginLeft: "10px", // Add spacing before the pill
              padding: "5px 15px", // Adjust padding for pill shape
              borderRadius: "20px", // Make it pill-shaped
              backgroundColor: binColors[binInfo.bins.split(" ")[0]] || "lightgrey",
              color: "white",
              fontSize: "0.9rem", // Adjust font size for better appearance
              fontWeight: "bold",
            }}
          >
            {binInfo.bins}
          </span>
        )}
    </p>
  </div>
) : (
  <p>No bin data available for the upcoming Sunday.</p>
)}
      <p className="note">{note}</p>
      <p>{message}</p>
    </section>
  );
}

export default Card;