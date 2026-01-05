import {useEffect, useState} from "react";

export const useAutoComplete = (search: string) => {
    const [data, setData] = useState<{formatted:string}[]>([]);

    useEffect(() => {
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${search == "" ? "freehold" : search}&type=city&limit=10&filter=countrycode%3Aus&format=json&apiKey=b8568cb9afc64fad861a69edbddb2658`
        fetch(url)
            .then(res => res.json())
            .then(data => {
                setData(data.results);
            });
    }, [search]);

    return data;
}

export const useGetCityData = (search: string) => {
    type Weather = {
        current: {
            time: string;
            is_day: number;
            relative_humidity_2m: number;
            wind_speed_10m: number;
            apparent_temperature: number;
        };

        hourly: {
            time: string[];
            temperature_2m: number[];
            precipitation_probability: number[];
            is_day: number[];
            weather_code: number[];
            relative_humidity_2m: number[];
        };

        state: string;
        city: string;
    };

    const [coords, setCoords] = useState<{lat: number, lon: number, state: string, city: string}>({lat: 0, lon: 0, state: "unknown", city: "Unknown"});
    const [data, setData] = useState<Weather>();

    console.log("City: " + (search == "" ? "freehold" : search))

    // Getting Lat & Lon
    useEffect(() => {
        const url1 = `https://api.geoapify.com/v1/geocode/search?text=${search == "" ? "freehold" : search}&lang=en&limit=1&type=city&filter=countrycode:us&format=json&apiKey=b8568cb9afc64fad861a69edbddb2658`
        fetch(url1)
            .then(res => res.json())
            .then(data => {
                setCoords({lat: data.results[0].lat, lon: data.results[0].lon, state: data.results[0].state, city: data.results[0].city});
            });
    }, [search]);

    console.log("Coords: ", coords)

    // Getting Location Data From Coords
    useEffect(() => {
        const url2 = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=weather_code,temperature_2m_min,temperature_2m_max,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_hours,precipitation_probability_max,apparent_temperature_max,apparent_temperature_min,wind_speed_10m_max,wind_gusts_10m_max&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,weather_code,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation,uv_index,is_day&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,wind_speed_10m,wind_direction_10m,wind_gusts_10m,precipitation,weather_code&timezone=auto&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch`
        fetch(url2)
            .then(res => res.json())
            .then(data => {
                setData({
                    ...data,
                    state: coords.state,
                    city: coords.city
                });
            });
    }, [coords]);

    console.log("CityData: " , data)

    return data;
}
