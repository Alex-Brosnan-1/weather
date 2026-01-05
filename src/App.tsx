import {useEffect, useState} from 'react'
import './App.css'
import './index.css'
import './SearchBar.css'
import {useAutoComplete, useGetCityData} from "./Hooks.tsx";
import Display from "./Display.tsx";

function App()
{
  const [currSearch, setCurrSearch] = useState('');
  const [searched, search] = useState("Freehold, NJ")
  const autoResults = useAutoComplete(currSearch);

  const cityData = useGetCityData(currSearch);

  const [showMore, setShowMore] = useState(false);
  useEffect(() => {console.log(searched);}, [searched]);

  return (
      <>
          <div className="navbar">
              <div className="navbar_location">
                  <h2 className="navbar_location_city">{cityData?.city}</h2>
                  <h3 className="navbar_location_state">{cityData?.state}</h3>
              </div>
              <div className="search">
                  <div className="search_input_container">
                      <input type="text" className="search_input style_transparent" placeholder="Type a Location..."
                             value={currSearch} onChange=
                                 {
                                     e => setCurrSearch(e.target.value)
                                 }
                      />
                      <div className="search_button">
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24"
                              viewBox="0 0 24 24"
                              width="24"
                          >
                              <path d="M0 0h24v24H0z" fill="none"></path>
                              <path
                                  d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
                              ></path>
                          </svg>
                      </div>
                      <div className="search_results style_transparent">
                          {
                              autoResults.map(res =>
                                  <p onClick={() => {
                                      setCurrSearch(res.formatted);
                                      search(res.formatted);
                                  }}>{res.formatted}</p>
                              )
                          }
                      </div>
                  </div>
                  <div className="glow"></div>
              </div>
              <div className="navbar_date">
                  <h3 className="navbar_date_calender">{cityData?.current?.time.split('T')[0].replaceAll('-', '/')}</h3>
                  <h4 className="navbar_date_time">{cityData?.current?.time.split('T')[1] + (cityData?.current?.is_day === 0 ? "AM " : "PM ")}</h4>
              </div>
          </div>

          <div className="current_weather">
              <div className="current_weather_stat">
                  <p className="current_weather_stat_icon">✻</p>
                  <p className="current_weather_stat_name">Humidity</p>
                  <p className="current_weather_stat_info">{cityData?.current?.relative_humidity_2m}</p>
              </div>
              <div className="current_weather_stat">
                  <p className="current_weather_stat_icon">→</p>
                  <p className="current_weather_stat_name">Wind</p>
                  <p className="current_weather_stat_info">{cityData?.current?.wind_speed_10m}</p>
              </div>
              <div className="current_weather_stat">
                  <p className="current_weather_stat_icon">☀</p>
                  <p className="current_weather_stat_name">Temperature</p>
                  <p className="current_weather_stat_info">{cityData?.current?.apparent_temperature}</p>
              </div>
          </div>

          <div className="hourly_weather">
              {
                  cityData?.hourly?.time?.slice(0, showMore ? cityData?.hourly?.time?.length : 5).map((_, i) => {
                      return (
                          <Display
                              key={i}
                              time={
                                  cityData.hourly.time[i].toString().split("T")[1] +
                                  (cityData.hourly.is_day[i] === 0 ? "AM" : "PM")
                              }
                              temp={`${cityData.hourly.temperature_2m[i]}`}
                              precipitation={`${cityData.hourly.precipitation_probability[i]}`}
                              humidity={cityData.hourly.relative_humidity_2m[i]}
                              weatherCode={cityData.hourly.weather_code[i]}
                          />
                      );
                  })
              }
          </div>
          <button className="hourly_weather_btn" onClick={() => (setShowMore(!showMore))}>Show More</button>
      </>
  )
}


export default App;
