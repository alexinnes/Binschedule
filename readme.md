
# Carmunnock Bin Collection Reminder

This project provides a user-friendly interface for residents of Carmunnock to view their bin collection schedule. It includes a calendar view, dynamic updates for upcoming bin collections, and a responsive design for mobile and desktop users.

---

## Features

1. **Dynamic Bin Collection Schedule**:
   - Displays the next **Sunday** and **Thursday** bin collections.
   - Dynamically updates the `<title>` tag to reflect the upcoming Sunday bin color.

2. **Interactive Calendar**:
   - A calendar view shows the bin collection schedule for the entire month.
   - Colored pills represent the bins to be collected on specific days.

3. **Responsive Design**:
   - Fully responsive layout with a hamburger menu for mobile users.
   - Navigation links for "Home" and "Calendar" are accessible on all devices.

4. **Legend for Bin Colors**:
   - A legend explains the meaning of each bin color (e.g., Blue for paper/cardboard).

5. **Error Handling**:
   - Displays error messages if the bin schedule cannot be loaded.

---

## File Structure

### 1. **HTML Files**
- **`index.html`**:
  - The main page showing the next Sunday and Thursday bin collections.
  - Includes a legend for bin colors.
  - Dynamically updates the `<title>` tag based on the Sunday bin color.

- **`calendar.html`**:
  - Displays a calendar view of the bin collection schedule.
  - Uses colored pills to represent bins for each collection day.

### 2. **CSS File**
- **`style.css`**:
  - Contains styles for the header, navigation, cards, calendar, and legend.
  - Includes responsive styles for the hamburger menu and mobile layout.

### 3. **JavaScript File**
- **`script.js`**:
  - Handles dynamic updates for the bin collection schedule.
  - Fetches data from `bins.json` and calculates the next Sunday and Thursday collections.
  - Updates the `<title>` tag dynamically based on the Sunday bin color.

### 4. **JSON File**
- **`bins.json`**:
  - Stores the bin collection schedule in the format:
    ```json
    {
      "24/11/2025": ["Blue"],
      "26/11/2025": ["Green", "Brown"]
    }
    ```

---

## How It Works

### 1. **Dynamic Title Update**
- The `<title>` tag in `index.html` is updated dynamically based on the Sunday bin color.
- Logic in `script.js`:
  ```javascript
  const sundayBins = normaliseBins(schedule[sundayKey]);
  if (sundayBins && sundayBins.length) {
    const sundayBinColor = sundayBins.join(" & ");
    document.title = `Sunday Bin: ${sundayBinColor} - Carmunnock Bin Collection Reminder`;
  } else {
    document.title = "Carmunnock Bin Collection Reminder";
  }
  ```

### 2. **Bin Collection Cards**
- The `index.html` file displays cards for Sunday and Thursday collections.
- The `script.js` file fetches the schedule from `bins.json` and updates the cards dynamically.

### 3. **Calendar View**
- The `calendar.html` file uses a calendar layout to display the bin collection schedule.
- Colored pills represent the bins to be collected on specific days.
- Example:
  - **Blue**: Paper/Cardboard
  - **Green**: General Waste
  - **Brown**: Food and Garden Waste

### 4. **Responsive Navigation**
- The `style.css` file includes styles for a hamburger menu on mobile devices.
- The menu toggles between "Home" and "Calendar" links.

---

## How to Use

1. **Open the Project**:
   - Open `index.html` in a browser to view the next Sunday and Thursday bin collections.

2. **View the Calendar**:
   - Navigate to `calendar.html` to see the full bin collection schedule.

3. **Mobile Navigation**:
   - Use the hamburger menu to switch between "Home" and "Calendar" on smaller screens.

---

## Error Handling

- If the `bins.json` file cannot be loaded, an error message is displayed:
  ```javascript
  showFatal("Could not fetch or parse bins.json.");
  ```

---

## Future Improvements

1. **Add Notifications**:
   - Implement browser notifications to remind users of upcoming bin collections.

2. **User Preferences**:
   - Allow users to customize their bin collection reminders.

3. **API Integration**:
   - Fetch real-time bin collection schedules from a public API.

---

## Credits

- **Icons**: [Icons8](https://icons8.com)
- **Developer**: Alex I
- **Year**: 2025


---
