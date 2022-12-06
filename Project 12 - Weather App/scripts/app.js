const city = document.querySelector('.city-name');
const cityWeather = document.querySelector('.weather-cond');
const temperature = document.querySelector('.temp');

const searchIt = document.querySelector('.form');
const clearData = document.querySelector('.app-name');
const error = document.querySelector('.error');
const card = document.querySelector('.card');
const warning = document.querySelector('.warning');
const photo = document.querySelector('.weather-photo');
const icon = document.querySelector('.icon img');
const add = document.querySelector('.add-button');
const popup = document.querySelector('.pop-button');
const popWin = document.querySelector('.popup-window');

const day = document.querySelector('#Day');
const night = document.querySelector('#Night');

const addIcon = 'fa-solid fa-plus';
const addedIcon = 'fa-solid fa-check';
const popIcon = 'fa-solid fa-bars';
const poppedIcon = 'fa-solid fa-xmark';

let savedData;
let cityArrayDatabase = [];
let cityStringDatabase;
const arrayCapacity = 4;

const forecast = new Forecast();

class City {
    constructor(data){
        this.name = data.cityData.EnglishName;
        this.time = data.weatherData.IsDayTime;
        this.weather = data.weatherData.WeatherText;
        this.icon = data.weatherData.WeatherIcon;
        this.temperature = data.weatherData.Temperature.Metric.Value;
    }

    display(element){
        let time = "";
        if(this.time) {
            time = "DAY";
        } else {
            time = "NIGHT";
        } 

        element.innerHTML = `
            <div class="detes text-muted text-center text-uppercase">
                <h5 class="city-nam my-2">${this.name}</h5>
                <h6 class="time my-3">${time}</h6>
                <div class="weather-condition my-2">${this.weather}</div>

                <div class="icon mx-light bg-auto text-center">
                <img src="./icons2/ic_accuweather_${this.icon}.png" alt="">
                </div>

                <div class="temperature display-4 my-3">
                    <span>${this.temperature}</span>
                    <span>&deg;C</span>
                </div>
            </div>
            <span class="delete-btn">
                <i class="delete-ico fa-solid fa-trash-can d-none"></i>
            </span>
        `;
    }
}









const managingInitialPage = () => {
    if(localStorage.length > 0){
        const city = localStorage.getItem("city string");
        const list = city.split(",");
        cityArrayDatabase = list;
    }
};

managingInitialPage();







//Displays weather info in the console.
const displayChart = (data, cityName) => {

    //Creates an array contaiing all the weather info and passes it to a function that then displays it all in the console.
    const consoleInfo = [ "City", cityName.charAt(0).toUpperCase() + cityName.slice(1), "Weather", data.WeatherText, "Temperature", data.Temperature.Metric.Value + String.fromCodePoint(8451)];

    for (let i = 0; i < consoleInfo.length; i += 2) {
        console.table(consoleInfo[i] + ": " + consoleInfo[i + 1]);
    }
    console.log('\n');
};





//Updates day/night image and weather icon
const updateImages = data => {

    if (data.IsDayTime) {
        day.classList.add('riseNshine');
        day.classList.remove('riseNshine-rest');


        night.classList.remove('riseNshine');
        night.classList.add('riseNshine-rest');

    
        card.classList.remove('card-night');
        card.classList.add('card-day');

    } else {

        day.classList.remove('riseNshine');
        day.classList.add('riseNshine-rest');


        night.classList.add('riseNshine');
        night.classList.remove('riseNshine-rest');
        

        card.classList.remove('card-day');
        card.classList.add('card-night');
    }

    icon.src = `./icons2/ic_accuweather_${data.WeatherIcon}.png`;
};





//Changes add button to its original state whenever new city is searched unless the city has already been added 
// to the city database
const regulateAddBtn = data => {
    if(!cityArrayDatabase.includes(data.cityData.EnglishName)) {
        add.children[0].classList = `add ${addIcon}`;
        add.style.pointerEvents = "initial";
        add.classList.remove('visible');
    }

    if(cityArrayDatabase.length === arrayCapacity){
        add.classList.add('d-none');
    } else {
        add.classList.remove('d-none');
    }
}
    





const displayInfo = (datta) => {
    const data = datta.weatherData;
    const cityName = datta.cityData.EnglishName;

    //Makes a card dispaying the weather info visible.
    if (card.classList.contains('d-none')) {
        card.classList.remove('d-none');
    }

    //Displays weather info on a card.
    city.innerHTML = cityName;
    cityWeather.innerHTML = data.WeatherText;
    temperature.children[0].innerHTML = data.Temperature.Metric.Value;

    updateImages(data);
    displayChart(data, cityName);
    regulateAddBtn(datta);
};





const displayError = err => {
    error.classList.remove('d-none');
    card.classList.add('d-none');
    error.innerHTML = err;

    setTimeout(() => {
        error.classList.add('d-none');
    }, 1500);
};





//Takes a city name from the search bar and passes it to a function that returns promises.
searchIt.addEventListener('submit', e => {
    e.preventDefault();

    //This takes user input from search bar & makes sure there are no spaces around the word.
    let keyWord = searchIt.city.value.trim();

    forecast.getInfo(keyWord)
        .then(data => {
            //Displays all the weather info.
            displayInfo(data);
            savedData = data;
        })
        .catch(err => {
            displayError(err);
            console.log('ERROR', err);
            console.log('\n');
        });

    searchIt.city.value = '';
});





//Clearing console, disappering weather card and resetting the values of different things.
clearData.addEventListener('click', () => {
    console.clear();
    localStorage.clear();
    city.innerHTML = 'my city';
    cityWeather.innerHTML = 'weather condition';
    temperature.children[0].innerHTML = 'temp'
    card.classList.add('d-none');
    add.classList.remove('d-none');
    // cityArrayDatabase = [];
    // cityStringDatabase = '';
    // popWin.children[0].removeChild();
});






const displayCities = () => {
    if(localStorage.length > 0){
        const city = localStorage.getItem("city string");
        const list = city.split(",");
        console.log(list);
        
        for(let i=0; i<list.length; i++){
            forecast.getInfo(list[i])
            .then(data => {
                //Displays all the weather info.
                const city = new City(data);
                city.display(popWin.children[0].children[i]);
                popWin.children[0].children[i].classList.remove('d-none');
            })
            .catch(err => {
                displayError(err);
                console.log('ERROR', err);
                console.log('\n');
            });
        }
    }
};

setInterval (displayCities(), 1000);






add.addEventListener('click', () => {
    if(!cityArrayDatabase.includes(savedData.cityData.EnglishName) && cityArrayDatabase.length < arrayCapacity) {
        cityArrayDatabase.push(savedData.cityData.EnglishName);
    }

    if(cityArrayDatabase.length === arrayCapacity){
        add.classList.add('d-none');
    }
    cityStringDatabase = cityArrayDatabase.toString();
    localStorage.setItem("city string", cityStringDatabase);

    setTimeout(() => {
        add.children[0].classList = `add ${addedIcon}`;
        add.style.pointerEvents = "none";
        add.classList.add('visible');
    }, 300);

    console.log(localStorage.getItem("city string"));

    displayCities();
});






popup.addEventListener('click', () => {
    if(popup.children[0].classList.contains('fa-bars')){
        popup.children[0].classList = `popup ${poppedIcon}`;
        popup.children[0].style.transform = 'translateX(4px)';
        
        setTimeout(() => {
            popWin.classList.remove('d-none');
        }, 400);
    } else {
        popup.children[0].classList = `popup ${popIcon}`;
        popup.children[0].style.transform = 'translateX(0px)';

        setTimeout(() => {
            popWin.classList.add('d-none');
        }, 200);
    }
});






popWin.addEventListener('mouseover', e => {
    if(e.target.classList.contains('delete-btn')){
        e.target.classList.add('delete-btn-visible');
        setTimeout(() => {
                e.target.children[0].classList.remove('d-none');
        }, 100);
        
        e.target.addEventListener('mouseleave', e => {
            e.target.classList.remove('delete-btn-visible');
                e.target.children[0].classList.add('d-none');
         });
    }
});






popWin.addEventListener('click', e => {
    if(e.target.classList.contains('delete-btn')){
        cityArrayDatabase.splice(e.target.parentElement.classList[0].charAt(4, 1)-1);
        cityStringDatabase = cityArrayDatabase.toString();
        localStorage.setItem("city string", cityStringDatabase);

        if(cityArrayDatabase.length === 0){
            localStorage.removeItem("city string");
        }

        e.target.parentElement.classList.add('d-none');
        e.target.parentElement.innerHTML = '';
    } else if (e.target.parentElement.classList.contains('delete-btn')){
        cityArrayDatabase.splice(e.target.parentElement.parentElement.classList[0].charAt(4, 1)-1);
        cityStringDatabase = cityArrayDatabase.toString();
        localStorage.setItem("city string", cityStringDatabase);

        if(cityArrayDatabase.length === 0){
            localStorage.removeItem("city string");
        }

        e.target.parentElement.parentElement.classList.add('d-none');
        e.target.parentElement.parentElement.innerHTML = '';
    }

}); 
