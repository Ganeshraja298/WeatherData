import React, { useState } from 'react';

function ExpandableDetails({ data }) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="expandable-details">
      <button onClick={toggleExpand}>{expanded ? 'Collapse' : 'Expand'}</button>
      {expanded && (
        <div>
          <p>Humidity: {data.main.humidity}%</p>
          <p>Wind Speed: {data.wind.speed} m/s</p>
          <p>Sunrise: {new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
          <p>Sunset: {new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
          {/* Additional forecast details can be added here */}
        </div>
      )}
    </div>
  );
}

export default ExpandableDetails;
