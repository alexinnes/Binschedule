async function loadSchedule() {
  const response = await fetch("bins.json");
  const schedule = await response.json();

  const today = new Date();
  const targetSunday = getRelevantSunday(today);
  const dateKey = formatDateUK(targetSunday);

  const bins = schedule[dateKey];

  if (bins) {
    document.getElementById("message").innerHTML =
      `On <strong>${dateKey}</strong>, put out: ${bins.map(getBinBadge).join(" ")}`;
  } else {
    document.getElementById("message").textContent =
      `No bin collection scheduled for ${dateKey}`;
  }
}

// ✅ Use today if it’s Sunday, otherwise get next Sunday
function getRelevantSunday(d) {
  const result = new Date(d);
  if (result.getDay() === 0) {
    // today is Sunday → use today
    return result;
  } else {
    // otherwise → move forward to next Sunday
    result.setDate(result.getDate() + (7 - result.getDay()));
    return result;
  }
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
