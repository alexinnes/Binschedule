import React from "react";

function SelectedDateDetails({ selectedDate, bins }) {
  const selectedBins = bins.find((bin) => {
    const [day, month, year] = bin.date.split("/");
    const isoDate = `${year}-${month}-${day}`;
    return isoDate === selectedDate;
  });

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Selected Date: {selectedDate}</h2>
      <p>
        Bins: {selectedBins?.bins.join(", ") || "No bins scheduled for this date."}
      </p>
    </div>
  );
}

export default SelectedDateDetails;