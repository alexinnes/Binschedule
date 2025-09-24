import React from "react";

function Legend() {
  return (
    <section className="legend">
      <h3>Bins</h3>
      <table className="bin-legend-table">
        <tbody>
          <tr>
            <td><span className="bin blue"></span></td>
            <td>Blue Bin</td>
            <td>Paper/Cardboard</td>
          </tr>
          <tr>
            <td><span className="bin green"></span></td>
            <td>Green Bin</td>
            <td>General Waste</td>
          </tr>
          <tr>
            <td><span className="bin grey"></span></td>
            <td>Grey Bin</td>
            <td>Cans and Plastics</td>
          </tr>
          <tr>
            <td><span className="bin brown"></span></td>
            <td>Brown Bin</td>
            <td>Food and Garden Waste <small>(⚠️ Garden waste requires a <a href="https://www.glasgow.gov.uk/gardenwaste">permit</a>)</small></td>
          </tr>
          <tr>
            <td><span className="bin purple"></span></td>
            <td>Purple Bin</td>
            <td>Glass</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

export default Legend;