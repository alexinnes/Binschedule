import React from "react";

const binColors = {
  Grey: "grey",
  Green: "green",
  Blue: "blue",
  Brown: "brown",
  Purple: "purple",
};

function BinEventContent({ bins }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "5px", // Add spacing between pills
      }}
    >
      {bins.map((bin, index) => {
        const binParts = bin.split(" & ");
        const gradient =
          binParts.length > 1
            ? `linear-gradient(135deg, ${binColors[binParts[0]] || "lightgrey"} 50%, ${binColors[binParts[1]] || "lightgrey"} 50%)`
            : binColors[binParts[0]] || "lightgrey";

        return (
          <span
            key={index}
            style={{
              display: "inline-block",
              padding: "5px 10px",
              borderRadius: "20px", // Make it pill-shaped
              background: gradient, // Use gradient for slanted split
              color: "white",
              fontSize: "0.8rem",
              fontWeight: "bold",
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            {bin}
          </span>
        );
      })}
    </div>
  );
}

export default BinEventContent;