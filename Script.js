async function loadSchedule() {
  const response = await fetch("bins.json");
  const schedule = await response.json();

  const today = new Date();
  const nextSunday = getNextSunday(today);
  const dateKey = nextSunday.toISOString().split("T")[0];

  const bins = schedule[dateKey];

  if (bins) {
    document.getElementById("message").textContent =
      `On ${dateKey}, put out: ${bins.join(", ")}`;
  } else {
    document.getElementById("message").textContent =
      `No bin collection scheduled for ${dateKey}`;
  }
}

function getNextSunday(d) {
  const result = new Date(d);
  result.setDate(result.getDate() + (7 - result.getDay()));
  return result;
}

loadSchedule();
