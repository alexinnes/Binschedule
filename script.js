async function loadSchedule() {
  try {
    const response = await fetch("bins.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    const schedule = await response.json();

    const today = new Date();
    const targetSunday = getRelevantSunday(today); // today if Sunday, else next Sunday
    const dateKey = formatDateUK(targetSunday);

    const bins = schedule[dateKey];

    const el = document.getElementById("message");
    if (!bins) {
      el.textContent = `No bin collection scheduled for ${dateKey}`;
      return;
    }

    const badges = bins.map(getBinBadge).join(" ");
    el.innerHTML = `On <strong>${dateKey}</strong>, put out: ${badges}`;
  } catch (err) {
    console.error(err);
    document.getElementById("message").textContent =
      "Could not load bin schedule. Please try again later.";
  }
}

// Use today if it’s Sunday; otherwise, next Sunday
function getRelevantSunday(d) {
  const result = new Date(d);
  if (result.getDay() === 0) return result; // Sunday
  result.setDate(result.getDate() + (7 - result.getDay()));
  return result;
}

// UK date (DD/MM/YYYY)
function formatDateUK(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/* ---- Badge helpers ---- */
function getBinBadge(name) {
  const n = name.toLowerCase().trim();

  // Combined: Blue & Green
  if (includesAll(n, "blue", "green")) {
    return splitBadge("blue", "green", "Blue & Green");
  }

  // Combined: Grey & Green
  if (includesAll(n, "grey", "green")) {
    return splitBadge("grey", "green", "Grey & Green");
  }

  // Combined: Green & Brown
  if (includesAll(n, "green", "brown") || n.includes("orange (green & brown")) {
    return splitBadge("green", "brown", "Green & Brown");
  }

  // Singles
  if (n.includes("blue"))   return solidBadge("blue",   name);
  if (n.includes("grey"))   return solidBadge("grey",   name);
  if (n.includes("green"))  return solidBadge("green",  name);
  if (n.includes("purple")) return solidBadge("purple", name);
  if (n.includes("brown"))  return solidBadge("brown",  name);   // ✅ NEW

  // Default (fallback)
  return `<span class="badge">${escapeHtml(name)}</span>`;
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

loadSchedule();
