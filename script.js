async function loadSchedule() {
  const response = await fetch("bins.json");
  const schedule = await response.json();

  const today = new Date();
  const nextSunday = getNextSunday(today);
  const dateKey = formatDateUK(nextSunday);

  const bins = schedule[dateKey];

  if (bins) {
    document.getElementById("message").innerHTML =
      `On <strong>${dateKey}</strong>, put out: ${bins.map(getBinBadge).join(" ")}`;
  } else {
    document.getElementById("message").textContent =
      `No bin collection scheduled for ${dateKey}`;
  }
}

// ✅ Get the next Sunday after today
function getNextSunday(d) {
  const result = new Date(d);
  result.setDate(result.getDate() + (7 - result.getDay()));
  return result;
}

// ✅ Format date as DD/MM/YYYY
function formatDateUK(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// ✅ Convert bin name → styled badge
function getBinBadge(binName) {
  let colourClass = "";

  if (binName.includes("Blue")) colourClass = "blue";
  else if (binName.includes("Green") && !binName.includes("Brown")) colourClass = "green";
  else if (binName.includes("Grey")) colourClass = "grey";
  else if (binName.includes("Orange") || binName.includes("Brown")) colourClass = "orange";
  else if (binName.includes("Purple")) colourClass = "purple";

  return `<span class="bin ${colourClass}">${binName}</span>`;
}

loadSchedule();
