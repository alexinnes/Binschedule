import React from "react";

function Header() {
  return (
    <header>
      <img
        src="https://img.icons8.com/ios-filled/100/ffffff/trash.png"
        alt="Bin Icon"
        className="logo"
      />
      <h1>Carmunnock Bin Collection Reminder</h1>
      <nav className="main-nav">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/calendar">Calendar</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;