
import axios from "axios";

export function getWether(lat,lon,timezone){
    return axios.get("https://api.open-meteo.com/v1/forecast?hourly=temperature_2m,apparent_temperature,precipitation_probability,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum&current_weather=true&timeformat=unixtime",{params:{
        latitude:lat,
        longitude:lon,
        timezone,
    },
}
).then(({data})=>{
    console.log(data)
    return{
        current:parseCurrentWther(data),
        daily:parsedailyWther(data),
        hourly:parsehourlyWther(data),
    }
})


}

function parseCurrentWther({current_weather,daily,timezone }){
    const {
        temperature:currentTemp,
        windspeed:windSpeed,
        weathercode:iconCode
    } =current_weather

    const {
        temperature_2m_max:[maxTemp],
        temperature_2m_min:[minTemp],
        apparent_temperature_max:[highFeelsLike],
        apparent_temperature_min:[lowFeelsLike],
        precipitation_sum:[precip]



    }=daily

    return{
        currentTemp:Math.round(currentTemp),
        highTemp:Math.round(maxTemp),
        lowTemp:Math.round(minTemp),
        highFeelsLike:Math.round(highFeelsLike),
        lowFeelsLike:Math.round(lowFeelsLike),
        windSpeed:Math.round(windSpeed),
        precip:Math.round(precip*100)/100,
        iconCode,
        timezone
    }
}


function parsedailyWther({daily}){
    return daily.time.map((time,index)=>{
        return {
            timestamp:time*1000,
            iconCode:daily.weathercode[index],
            maxTemp:Math.round(daily.apparent_temperature_max[index])
        }
    })
}

function parsehourlyWther({hourly,current_weather}){
    return hourly.time.map((time,index)=>{
        return{
            timestamp:time*1000,
            iconCode:hourly.weathercode[index],
            temp:Math.round(hourly.temperature_2m[index]),
            tempFellsLike:Math.round(hourly.apparent_temperature[index]),
            wind:Math.round(hourly.windspeed_10m[index]),
            precip:Math.round(hourly.precipitation_probability[index])
        }
    }).filter(({timestamp}) => timestamp >= current_weather.time*1000)
}