import "./style.css"
import { getWether } from "./wether"
import { ICON_MAP } from "./iconMap"

navigator.geolocation.getCurrentPosition(positionSuccess,positionError)

function positionSuccess({coords}){
    getWether(coords.latitude,coords.longitude,Intl.DateTimeFormat().resolvedOptions().timeZone)
    .then(renderWether).catch(e=>{
        console.log(e)
        alert("Error Getting Wether")
    })
} 

function positionError(){
    alert("Location Getting Error")
}

function renderWether({current,daily,hourly}){
    displayCurrentWether(current)
    displayDailyWether(daily)
    displayhourlyWether(hourly)
    document.body.classList.remove("bluer")
}

function setValue(selctor,value,{parent=document}={}){
    parent.querySelector(`[data-${selctor}]`).textContent=value
}


function getIconUrl(iconCode){
    return `icons/${ICON_MAP.get(iconCode)}.svg`
}

const curentIcon=document.querySelector("[data-current-icon]")
function displayCurrentWether(current){
    curentIcon.src=getIconUrl(current.iconCode)
    setValue("current-temp",current.currentTemp)
    setValue("current-high",current.highTemp)
    setValue("current-flhigh",current.highFeelsLike)
    setValue("current-wind",current.windSpeed)
    setValue("current-low",current.lowTemp)
    setValue("current-fllow",current.lowFeelsLike)
    setValue("current-pre",current.precip)
    setValue("current-location",current.timezone)
}

const DAY_FOMATTER =new Intl.DateTimeFormat(undefined,{weekday:"long"})
const dailySection=document.querySelector("[data-day-section]")
const dayCardTemplae=document.getElementById("day-card-template")
function displayDailyWether(daily){
    dailySection.innerHTML=""
    daily.forEach(day=>{
        const element=dayCardTemplae.content.cloneNode(true)
        setValue("temp",day.maxTemp,{parent:element})
        setValue("date",DAY_FOMATTER.format(day.timestamp),{parent:element})
        element.querySelector("[data-icon]").src=getIconUrl(day.iconCode)
        dailySection.append(element)

    })

}

const HOUR_FOMATTER =Intl.DateTimeFormat(undefined,{hour:"numeric"})
const hourlySection = document.querySelector("[data-hourley-section]")
const houreRowTemp=document.getElementById("hour-row-template")
function  displayhourlyWether(hourly){
    hourlySection.innerHTML=""
    hourly.forEach(hour=>{
        const element=houreRowTemp.content.cloneNode(true)
        setValue("date" ,DAY_FOMATTER.format(hour.timestamp),{parent:element})
        setValue("time" ,HOUR_FOMATTER.format(hour.timestamp),{parent:element})
        element.querySelector("[data-icon]").src=getIconUrl(hour.iconCode)
        setValue("temp",hour.temp,{parent:element})
        setValue("wind",hour.wind,{parent:element})
        setValue("precip",hour.precip,{parent:element})
        setValue("fl-temp",hour.tempFellsLike,{parent:element})
        setValue("temp",hour.temp,{parent:element})
        hourlySection.append(element)
    })
}