import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import bins from "../data/bins.json";
import BinEventContent from "../components/BinEventContent";
import SelectedDateDetails from "../components/SelectedDateDetails";
import "../style.css"; // Import your custom styles

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(null);

  // Map bins.json data to FullCalendar events
  const events = bins.map((bin) => {
    // Convert DD/MM/YYYY to YYYY-MM-DD
    const [day, month, year] = bin.date.split("/");
    const isoDate = `${year}-${month}-${day}`; // Rearrange to ISO format

    return {
      title: bin.bins.join(", "), // Combine bin names for the event title
      date: isoDate, // Use ISO format for FullCalendar
      bins: bin.bins, // Include the bins array for custom rendering
    };
  });

  // Handle date click
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <main>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          firstDay={1} // Set Monday as the first day of the week
          events={events}
          dateClick={handleDateClick}
          eventContent={(eventInfo) => (
            <BinEventContent bins={eventInfo.event.extendedProps.bins} />
          )}
        />
        {selectedDate && <SelectedDateDetails selectedDate={selectedDate} bins={bins} />}
      </main>
    </div>
  );
}

export default CalendarPage;