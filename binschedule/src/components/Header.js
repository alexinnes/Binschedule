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
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/calendar">Calendar</Link>
        </li>
      </ul>
      </nav>
    </header>
  );
}

export default Header;