// calendar-scripts.js
// Handles calendar rendering and error handling for calendar.html

function showCalendarError(container, message) {
  if (!message) return;
  container.innerHTML = `<div class='calendar-error' style='color:#fff;background:#e74c3c;padding:18px 12px;border-radius:10px;margin:18px auto;max-width:420px;text-align:center;font-weight:600;'>${message}</div>`;
}

// Helper: parse UK date (DD/MM/YYYY) -> Date
function parseUKDate(uk) {
  const [dd, mm, yyyy] = uk.split("/").map(Number);
  return new Date(yyyy, mm - 1, dd);
}

// Helper: get badge HTML with correct colour class
function badgeHtml(bin) {
  const n = bin.toLowerCase();
  if (n.includes("blue & green"))  return `<span class="badge split blue-green">${bin}</span>`;
  if (n.includes("grey & green"))  return `<span class="badge split grey-green">${bin}</span>`;
  if (n.includes("green & brown")) return `<span class="badge split green-brown">${bin}</span>`;
  if (n === "blue")   return `<span class="badge blue">Blue</span>`;
  if (n === "grey")   return `<span class="badge grey">Grey</span>`;
  if (n === "green")  return `<span class="badge green">Green</span>`;
  if (n === "brown")  return `<span class="badge brown">Brown</span>`;
  if (n === "purple") return `<span class="badge purple">Purple</span>`;
  return `<span class="badge">${bin}</span>`;
}

// Main calendar rendering

document.addEventListener('DOMContentLoaded', async function() {
  const calendarDiv = document.getElementById('visualCalendar');
  if (!calendarDiv) return;
  let schedule;
  try {
    const resp = await fetch('bins.json', { cache: 'no-store' });
    if (!resp.ok) throw new Error('bins.json fetch failed');
    schedule = await resp.json();
    if (!schedule || Object.keys(schedule).length === 0) throw new Error('No bin data found');
  } catch (e) {
    showCalendarError(calendarDiv, e.message || 'Could not load bin schedule.');
    return;
  }

  // Parse all dates and group by month
  const entries = Object.entries(schedule)
    .map(([uk, bins]) => ({ uk, date: parseUKDate(uk), bins }))
    .sort((a, b) => a.date - b.date);
  const months = Array.from(new Set(entries.map(e => `${e.date.getFullYear()}-${String(e.date.getMonth()+1).padStart(2,"0")}`)));
  if (months.length === 0) {
    showCalendarError(calendarDiv, 'No bin collection months found.');
    return;
  }

  // Month navigation controls
  let navWrapper = document.createElement('div');
  navWrapper.style.display = 'flex';
  navWrapper.style.justifyContent = 'center';
  navWrapper.style.alignItems = 'center';
  navWrapper.style.gap = '18px';
  navWrapper.style.marginBottom = '18px';

  let prevBtn = document.createElement('button');
  prevBtn.textContent = '◀';
  prevBtn.setAttribute('aria-label', 'Previous month');
  prevBtn.style.fontSize = '1.2rem';
  prevBtn.style.padding = '6px 14px';
  prevBtn.style.borderRadius = '8px';
  prevBtn.style.border = '1.5px solid var(--brand)';
  prevBtn.style.background = '#f8fafc';
  prevBtn.style.color = 'var(--brand)';
  prevBtn.style.cursor = 'pointer';

  let nextBtn = document.createElement('button');
  nextBtn.textContent = '▶';
  nextBtn.setAttribute('aria-label', 'Next month');
  nextBtn.style.fontSize = '1.2rem';
  nextBtn.style.padding = '6px 14px';
  nextBtn.style.borderRadius = '8px';
  nextBtn.style.border = '1.5px solid var(--brand)';
  nextBtn.style.background = '#f8fafc';
  nextBtn.style.color = 'var(--brand)';
  nextBtn.style.cursor = 'pointer';

  let monthLabel = document.createElement('span');
  monthLabel.style.fontWeight = '600';
  monthLabel.style.fontSize = '1.08rem';
  monthLabel.style.minWidth = '120px';
  monthLabel.style.textAlign = 'center';

  navWrapper.appendChild(prevBtn);
  navWrapper.appendChild(monthLabel);
  navWrapper.appendChild(nextBtn);
  calendarDiv.appendChild(navWrapper);

  let calendarGrid = document.createElement('div');
  calendarGrid.id = 'monthCalendar';
  calendarDiv.appendChild(calendarGrid);

  // Find the index of the current month if available
  const now = new Date();
  let currentMonthIdx = months.findIndex(m => {
    const [y, mo] = m.split('-').map(Number);
    return y === now.getFullYear() && mo === (now.getMonth() + 1);
  });
  if (currentMonthIdx === -1) currentMonthIdx = 0;

  function renderMonth(idx) {
    if (idx < 0) idx = 0;
    if (idx > months.length - 1) idx = months.length - 1;
    currentMonthIdx = idx;
    const monthKey = months[idx];
    const [year, month] = monthKey.split('-').map(Number);
    const firstDay = new Date(year, month-1, 1);
    const lastDay = new Date(year, month, 0);
    const daysInMonth = lastDay.getDate();
    // Map date string (uk) to bins
    const dateMap = Object.fromEntries(entries.filter(e => e.date.getFullYear() === year && e.date.getMonth() === month-1).map(e => [e.date.getDate(), e.bins]));

    // Build grid (Monday as first day, Sunday last)
    let html = '<table class="month-view"><thead><tr>';
    const weekDays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    html += weekDays.map(d=>`<th>${d}</th>`).join("") + '</tr></thead><tbody><tr>';
    let jsFirstDay = firstDay.getDay();
    let startCol = jsFirstDay === 0 ? 6 : jsFirstDay - 1; // 0=Sunday, so shift to end
    for(let i=0;i<startCol;i++) html += '<td></td>';
    let dayOfWeek = startCol;
    for(let d=1;d<=daysInMonth;d++) {
      if((dayOfWeek)%7===0 && d!==1) html += '</tr><tr>';
      if(dateMap[d]) {
        html += `<td class="bin-day">${d}<br>${dateMap[d].map(bin=>badgeHtml(bin)).join('<br>')}</td>`;
      } else {
        html += `<td>${d}</td>`;
      }
      dayOfWeek++;
    }
    while(dayOfWeek%7!==0) { html += '<td></td>'; dayOfWeek++; }
    html += '</tr></tbody></table>';
    calendarGrid.innerHTML = html;
    // Update label
    const d = new Date(year, month-1, 1);
    monthLabel.textContent = d.toLocaleString('default', { month: 'long', year: 'numeric' });
    // Enable/disable buttons
    prevBtn.disabled = (idx === 0);
    nextBtn.disabled = (idx === months.length - 1);
    prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
    nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
  }

  prevBtn.onclick = function() { if (currentMonthIdx > 0) renderMonth(currentMonthIdx - 1); };
  nextBtn.onclick = function() { if (currentMonthIdx < months.length - 1) renderMonth(currentMonthIdx + 1); };
  renderMonth(currentMonthIdx);
});
