// global variables
var date = luxon.DateTime;

// City weather data
var mainContEl = $("#weather-data");
var mainCityEl = $("#main-city");
var mainDateEl = $("#data-date");
var mainIconEl = $("#icon");
var mainListEl = $("main-list");
var mainTempEl = $("#main-temp");
var mainWindEl = $("#main-wind");
var mainHummintyEl = $("#main-humminty");
var mainUVEl = $("#uv-data");

// City list
var cityContEl = $("#city-list");

// 5day forcast
var cardContainerEL = $("#card-container");
var cardsEl = $("#cards");

// Input
var inputEl = $("#city-input");
var submitBtnEl = $("#submit-button");
var city = "";
numDays = 5;

// main data
mainData = {
    date: "",
    icon: "",
    temp: 0,
    wind: 0,
    hum: 0,
    uv: 0
}

testArray = [];

// weekly forcast array
var weeklyForcast = [];

// city array to be stored
var cities = JSON.parse(localStorage.getItem("data")) || [];
console.log(cities);

// displays 5day forcast using cards
function displayCard(arry){
    
    cardContainerEL.attr("style","display: flex;");
    cardsEl.empty();

    for (var i = 0; i < arry.length; i++){

        var cardEl = $("<div>").addClass("card col");
        var cardBodyEl = $("<div>").addClass("card-body");

        var cardTitleEl = $("<h5>").addClass("card-title");
        cardTitleEl.text(arry[i].date);

        var cardIconEl = $("<img>");
        cardIconEl.attr("src",`http://openweathermap.org/img/wn/${arry[i].icon}.png`);

        var ulEl = $("<ul>");
        
        var tempEl = $("<li>").text(`Temp: ${arry[i].temp} F`);
        var windEl = $("<li>").text(`Wind: ${arry[i].wind} mph`);
        var humEl = $("<li>").text(`Humidity: ${arry[i].hum}%`);
        
        ulEl.append(tempEl);
        ulEl.append(windEl);
        ulEl.append(humEl);

        cardBodyEl.append(cardTitleEl);
        cardBodyEl.append(cardIconEl);
        cardBodyEl.append(ulEl);

        cardEl.append(cardBodyEl);
        
        cardsEl.append(cardEl);
    }
}

// displays current weather
function displayCurrent(date, icon, temp, wind, humidity, uv){
    mainContEl.attr("style","display: block;");

    mainDateEl.text(date);
    mainIconEl.attr("src",`http://openweathermap.org/img/wn/${icon}.png`);
    mainTempEl.text(`${temp} F`);
    mainWindEl.text(`${wind} mph`);
    mainHummintyEl.text(`${humidity}%`);
    mainUVEl.text(uv);
    
    if(uv < 5){
        mainUVEl.attr("style","background-color: green;");
    }else if(uv < 10){
        mainUVEl.attr("style","background-color: orange;");
    }else{
        mainUVEl.attr("style","background-color: red;");
    }
}

function addCity(name){
    if(cities.length >= 10){
        cities.pop();
        cities.splice(0,0,{name: name});
    }else{
        cities.push({name: name});
    }
    localStorage.setItem("data", JSON.stringify(cities));
}

function saveData(){
    
}

// displays cities for users to click on
function displayCites(arry){
    cityContEl.empty();

    if (cities.length > 0){
        for (var i =  0; i <arry.length; i++){
            var cityEl = $("<li>").text(arry[i].name);
            cityEl.addClass("city text-capitalize");
            cityContEl.append(cityEl);
        }
    }
}

displayCites(cities);

// when search button is clicked queries data and displays it.
submitBtnEl.on("click", function(){
    city = inputEl.val();

    mainCityEl.text(city);
    
    addCity(city)
    displayCites(cities);

    inputEl.val("");

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=965dabd699e5396f5d455158279bb13e`)
    .then(response => response.json())
    .then(data => {
    
        mainData.date = date.fromSeconds(data.dt).toLocaleString();
        mainData.icon = data.weather[0].icon;
        mainData.temp = data.main.temp;
        mainData.wind = data.wind.speed;
        mainData.hum = data.main.humidity;
        
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=hourly,minutely&appid=965dabd699e5396f5d455158279bb13e`)
        .then(response => response.json())
        .then(data => {

            mainData.uv = data.current.uvi;
            displayCurrent(mainData.date, mainData.icon, mainData.temp, mainData.wind, mainData.hum, mainData.uv);});
    });

    fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=${numDays}&units=imperial&appid=965dabd699e5396f5d455158279bb13e`)
    .then(response => response.json())
    .then(data =>{

    for (var i = 0; i < numDays; i++){

        weeklyForcast.push({
            date: date.fromSeconds(data.list[i].dt).toLocaleString(),
            icon: data.list[i].weather[0].icon,
            temp: data.list[i].temp.max,
            wind: data.list[i].speed,
            hum: data.list[i].humidity
        });
    }
    displayCard(weeklyForcast);
    weeklyForcast = [];
    });
});

// when one of the cities in the history clicked load that cities weather info
$(cityContEl).on( "click", "li",  function(){
    city = $(this).text();
    mainCityEl.text(city);

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=965dabd699e5396f5d455158279bb13e`)
    .then(response => response.json())
    .then(data => {
    
        mainData.date = date.fromSeconds(data.dt).toLocaleString();
        mainData.icon = data.weather[0].icon;
        mainData.temp = data.main.temp;
        mainData.wind = data.wind.speed;
        mainData.hum = data.main.humidity;
        
        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=hourly,minutely&appid=965dabd699e5396f5d455158279bb13e`)
        .then(response => response.json())
        .then(data => {

            mainData.uv = data.current.uvi;
            displayCurrent(mainData.date, mainData.icon, mainData.temp, mainData.wind, mainData.hum, mainData.uv);});
    });

    fetch(`https://api.openweathermap.org/data/2.5/forecast/daily?q=${city}&cnt=${numDays}&units=imperial&appid=965dabd699e5396f5d455158279bb13e`)
    .then(response => response.json())
    .then(data =>{

    for (var i = 0; i < numDays; i++){

        weeklyForcast.push({
            date: date.fromSeconds(data.list[i].dt).toLocaleString(),
            icon: data.list[i].weather[0].icon,
            temp: data.list[i].temp.max,
            wind: data.list[i].speed,
            hum: data.list[i].humidity
        });
    }
    displayCard(weeklyForcast);
    weeklyForcast = [];
    });
})