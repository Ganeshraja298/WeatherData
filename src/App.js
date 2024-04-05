// WeatherTable.js
import React, { useState, useEffect } from 'react';
import './weather.css';
import { useTable } from 'react-table';
import ExpandableDetails from './ExpandableDetails';

const apiKey = 'e2f201f8f4fcb5144ed3f6893a732256';

async function fetchForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return {};
  }
}

function WeatherTable() {
  const [city] = useState('London');
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const forecastData = await fetchForecast(city);
    setData(forecastData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'dt',
        Cell: ({ value }) => new Date(value * 1000).toLocaleDateString(),
      },
      {
        Header: 'Temperature',
        accessor: 'main.temp',
        Cell: ({ value }) => `${value.toFixed(1)}°C`,
      },
      {
        Header: 'Summary',
        accessor: 'weather[0].description',
      },
      {
        Header: 'Weather Icon',
        accessor: 'weather[0].icon',
        Cell: ({ value }) => <img src={`http://openweathermap.org/img/wn/${value}.png`} alt="Weather Icon" />,
      },
      {
        Header: 'Expand',
        id: 'expand',
        Cell: ({ row }) => (
          <ExpandableDetails data={row.original} />
        ),
      },
    ],
    []
  );

  const tableInstance = useTable({ columns, data: [data] });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance;

  return (
    <div className="weather-container">
      <div className="weather-content">
        <h1>Weather in {city}</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : data.cod === 200 ? (
          <table {...getTableProps()} className="weather-table">
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map(row => {
                prepareRow(row);
                return (
                  <React.Fragment key={row.id}>
                    <tr {...row.getRowProps()}>
                      {row.cells.map(cell => (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      ))}
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>Error fetching data.</p>
        )}
        <button className="refresh-button" onClick={fetchData}>
          Refresh
        </button>
      </div>
    </div>
  );
}

export default WeatherTable;
