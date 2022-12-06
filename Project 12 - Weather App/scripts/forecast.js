class Forecast {
    constructor(){
        this.key = '9CoHAFAL5psFgQq7lOoQzuSv4JYp4oLb';
        this.weatherURI = 'https://dataservice.accuweather.com/currentconditions/v1/';
        this.cityURI = 'https://dataservice.accuweather.com/locations/v1/cities/search';
    }

    async getInfo (city){
        const cityData = await this.getCity(city);
        const weatherData = await this.getWeather(cityData.Key);

        return {cityData, weatherData};
    }

    async getCity (city) {
        const query = `?apikey=${this.key}&q=${city}`;

        const response = await fetch(this.cityURI + query);
        const data = await response.json();

        return data[0];
    }

    async getWeather (id) {
        const query = `${id}?apikey=${this.key}`;

        const response = await fetch(this.weatherURI + query);
        const data = await response.json();

        return data[0];
    }
}
