import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Card from "./components/Card";
import Legend from "./components/Legend";
import CalendarPage from "./pages/CalendarPage";
import "./style.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            {/* Home Page */}
            <Route
              path="/"
              element={
                <>
                  <Card
                    title="Sunday Collection"
                    note="ℹ️: Sunday collections are in the morning approx. 0700."
                  />
                  <Legend />
                </>
              }
            />
            {/* Calendar Page */}
            <Route path="/calendar" element={<CalendarPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;