// Wait for DOM before running
window.addEventListener("DOMContentLoaded", () => {
  loadSchedule().catch(err => {
    console.error(err);
    showFatal("Could not load bin schedule. See console for details.");
  });
});

async function loadSchedule() {
  const thursdayCard = byId("thursdayCard");
  const thursdayMsg  = byId("thursdayMessage");
  const sundayMsg    = byId("sundayMessage");

  if (!thursdayMsg || !sundayMsg) {
    console.warn("Missing expected elements #thursdayMessage or #sundayMessage.");
  }

  // Fetch bins.json (must be in same folder as index.html)
  let schedule;
  try {
    const resp = await fetch("bins.json", { cache: "no-store" });
    if (!resp.ok) throw new Error(`bins.json fetch failed: ${resp.status} ${resp.statusText}`);
    schedule = await resp.json();
  } catch (e) {
    console.error(e);
    showFatal("Could not fetch or parse bins.json.");
    return;
  }

  const today = stripTime(new Date());

  // Compute next Thursday and next Sunday (inclusive: if today is Thu/Sun, use today)
  const thursdayDate = getNextWeekday(today, 4); // 4 = Thu
  const sundayDate   = getNextWeekday(today, 0); // 0 = Sun

  const thursdayKey = formatDateUK(thursdayDate);
  const sundayKey   = formatDateUK(sundayDate);

  // ---- Thursday card ----
  const thursdayBins = normaliseBins(schedule[thursdayKey]);
  if (thursdayBins && thursdayBins.length) {
    if (thursdayCard) thursdayCard.style.display = "block";
    if (thursdayMsg)  thursdayMsg.innerHTML = renderLine(thursdayKey, thursdayBins);
  } else {
    // Fallback: find next Thursday in the JSON within 14 days
    const fallbackThu = findNextEventFrom(schedule, today, d => d.getDay() === 4, 14);
    if (fallbackThu) {
      if (thursdayCard) thursdayCard.style.display = "block";
      if (thursdayMsg)  thursdayMsg.innerHTML = renderLine(fallbackThu.uk, normaliseBins(fallbackThu.bins));
    } else if (thursdayCard) {
      thursdayCard.style.display = "none"; // no upcoming Thursday entry -> hide card
    }
  }

  // ---- Sunday card ----
  const sundayBins = normaliseBins(schedule[sundayKey]);
  if (sundayBins && sundayBins.length) {
    if (sundayMsg) sundayMsg.innerHTML = renderLine(sundayKey, sundayBins);
  } else {
    // Fallback: find next Sunday in the JSON within 14 days
    const fallbackSun = findNextEventFrom(schedule, sundayDate, d => d.getDay() === 0, 14);
    if (fallbackSun) {
      if (sundayMsg) sundayMsg.innerHTML = renderLine(fallbackSun.uk, normaliseBins(fallbackSun.bins));
    } else if (sundayMsg) {
      sundayMsg.textContent = `No bin collection scheduled for ${sundayKey}`;
    }
  }
}

/* ---------- helpers ---------- */

function byId(id) { return document.getElementById(id); }

function showFatal(message) {
  const th = byId("thursdayMessage");
  const su = byId("sundayMessage");
  if (th) th.textContent = message;
  if (su) su.textContent = message;
}

// Inclusive next weekday: if today is the target, returns today
function getNextWeekday(baseDate, targetDay) {
  const d = new Date(baseDate);
  const diff = (targetDay - d.getDay() + 7) % 7;
  d.setDate(d.getDate() + diff);
  return stripTime(d);
}

function stripTime(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// Parse UK date (DD/MM/YYYY) -> Date
function parseUKDate(uk) {
  const [dd, mm, yyyy] = uk.split("/").map(Number);
  return stripTime(new Date(yyyy, mm - 1, dd));
}

// Format Date -> UK date
function formatDateUK(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Turn value -> array of strings, and normalise each label
function normaliseBins(value) {
  if (!value) return null;
  const list = Array.isArray(value) ? value : [value];
  return list.map(normaliseLabel).filter(Boolean);
}

// Normalise label variants like "Grey & Green bins", " blue ", lowercase, etc.
function normaliseLabel(name) {
  if (!name) return null;
  const n = String(name)
    .toLowerCase()
    .replace(/\s+bins?$/i, "")   // drop trailing "bin"/"bins"
    .replace(/\s*&\s*/g, " & ")  // normalise ampersands
    .replace(/\s+/g, " ")        // collapse spaces
    .trim();

  // Map combined to canonical display strings
  if (includesAll(n, "blue", "green"))  return "Blue & Green";
  if (includesAll(n, "grey", "green"))  return "Grey & Green";
  if (includesAll(n, "green", "brown") || n.includes("orange (green & brown)")) return "Green & Brown";

  // Singles
  if (n === "blue")   return "Blue";
  if (n === "grey")   return "Grey";
  if (n === "green")  return "Green";
  if (n === "brown")  return "Brown";
  if (n === "purple") return "Purple";

  // Fallback: return original (capitalise first letter of each word)
  return name;
}

// Build the line HTML for a given date + bins
function renderLine(ukDate, bins) {
  return `On <strong>${escapeHtml(ukDate)}</strong>, put out: ${renderBadges(bins)}`;
}

// Turn array of bin labels into coloured badges
function renderBadges(bins) {
  return bins.map(getBinBadge).join(" ");
}

// Create the right badge (split or solid)
function getBinBadge(label) {
  const n = label.toLowerCase();

  // Combined
  if (n.includes("blue & green"))  return splitBadge("blue", "green", "Blue & Green");
  if (n.includes("grey & green"))  return splitBadge("grey", "green", "Grey & Green");
  if (n.includes("green & brown")) return splitBadge("green", "brown", "Green & Brown");

  // Singles
  if (n === "blue")   return solidBadge("blue",   "Blue");
  if (n === "grey")   return solidBadge("grey",   "Grey");
  if (n === "green")  return solidBadge("green",  "Green");
  if (n === "brown")  return solidBadge("brown",  "Brown");
  if (n === "purple") return solidBadge("purple", "Purple");

  // Fallback
  return `<span class="badge">${escapeHtml(label)}</span>`;
}

function solidBadge(color, label) {
  return `<span class="badge ${color}">${escapeHtml(label)}</span>`;
}

function splitBadge(left, right, label) {
  return `<span class="badge split ${left}-${right}">${escapeHtml(label)}</span>`;
}

function includesAll(text, ...parts) {
  return parts.every(p => text.includes(p));
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/**
 * Find the next event in schedule on/after 'fromDate' that satisfies 'dayPredicate',
 * within 'windowDays' days. Returns { date: Date, uk: string, bins } or null.
 */
function findNextEventFrom(schedule, fromDate, dayPredicate, windowDays = 14) {
  // Turn schedule into comparable entries
  const entries = Object.entries(schedule)
    .map(([uk, bins]) => ({ uk, date: parseUKDate(uk), bins }))
    .filter(e => e.date >= fromDate && dayPredicate(e.date))
    .sort((a, b) => a.date - b.date);

  if (entries.length === 0) return null;

  const limit = new Date(fromDate);
  limit.setDate(limit.getDate() + windowDays);
  const within = entries.find(e => e.date <= limit);
  return within || null;
}
