async function loadSchedule() {
  try {
    const response = await fetch("bins.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    const schedule = await response.json();

    const today = new Date();
    const thursdayDate = getNextWeekday(today, 4); // 4 = Thursday
    const sundayDate   = getNextWeekday(today, 0); // 0 = Sunday

    const thursdayKey = formatDateUK(thursdayDate);
    const sundayKey   = formatDateUK(sundayDate);

    const thursdayBins = schedule[thursdayKey];
    const sundayBins   = schedule[sundayKey];

    // Thursday card
    const thursdayCard = document.getElementById("thursdayCard");
    const thursdayMsg  = document.getElementById("thursdayMessage");
    if (thursdayBins) {
      thursdayCard.style.display = "block";
      thursdayMsg.innerHTML = renderLine(thursdayKey, thursdayBins);
    } else {
      thursdayCard.style.display = "none";
    }

    // Sunday card
    const sundayMsg = document.getElementById("sundayMessage");
    if (sundayBins) {
      sundayMsg.innerHTML = renderLine(sundayKey, sundayBins);
    } else {
      sundayMsg.textContent = `No bin collection scheduled for ${sundayKey}`;
    }
  } catch (err) {
    console.error(err);
  }
}

function getNextWeekday(baseDate, targetDay) {
  const d = new Date(baseDate);
  const currentDay = d.getDay();
  const diff = (targetDay - currentDay + 7) % 7;
  d.setDate(d.getDate() + diff);
  return d;
}
