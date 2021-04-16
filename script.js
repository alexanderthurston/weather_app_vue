

var lat;
var lon;
var city;
var state;

const app = Vue.createApp({
        data() {
            return {
                ipstackAPI: "fe0459f51bb61fdfd921c506c397d4b0",
                owmAPI: "c0dd95e88b7c74c131108f31bf7e4029",
                longitude: undefined,
                latitude: undefined,
                city: undefined,
                region_name: undefined,
                curr_date: undefined,
                curr_weather: undefined,
                forecasts : []
            }
        },
        methods: {
             forecastToggle(event) {

                // Get the index of this <div> from the DOM
                let idx;
                if (event.target.nodeName === "DIV"){
                    idx = event.target.getAttribute('data-idx')
                } else {
                    idx = event.target.parentNode.getAttribute('data-idx');
                }

                //Toggle state
                if (this.forecasts[idx].state === 'neutral') {
                    this.forecasts[idx].state = 'likely';
                }
                else if (this.forecasts[idx].state === 'likely') {
                    this.forecasts[idx].state = 'unlikely';
                }
                else if (this.forecasts[idx].state === 'unlikely') {
                    this.forecasts[idx].state = 'neutral';
                }

            },

        },

        computed: {
            unlikely() {
                let u = 0;
                for (let forecast of this.forecasts) {
                    if (forecast.state === 'unlikely') {
                        u ++;
                    }
                }
                return u;
            },

            likely() {
                let l = 0;
                for (let forecast of this.forecasts) {
                    if (forecast.state === 'likely') {
                        l ++;
                    }
                }
                return l;
            },

            neutral() {
                let n = 0;
                for (let forecast of this.forecasts) {
                    if (forecast.state === 'neutral') {
                         n++;
                    }
                }
                return n;
            },
        },

        created() {
            console.log("the app was created");

            fetch_loc = fetch(`http://api.ipstack.com/check?access_key=${this.ipstackAPI}`)
                .then(r => r.json())
                .then(json => {
                    this.city = json.city;
                    this.region_name = json.region_name;
                    this.longitude = json.longitude;
                    this.latitude = json.latitude;
                    return fetch(`http://api.openweathermap.org/data/2.5/onecall?units=imperial&exclude=hourly,minutely,alerts&lat=${this.latitude}&lon=${this.longitude}&appid=${this.owmAPI}`);
                })

                .then(r => r.json())
                .then(json => {
                    this.stuff = json;

                    this.curr_date = new Date(json.current.dt * 1000).toLocaleString();
                    this.curr_weather = json.current;
                    this.daily_high = json.daily[0].temp.max;
                    this.daily_low = json.daily[0].temp.min;
                    this.curr_weather.description = json.current.weather[0].description;
                    return fetch(`http://api.openweathermap.org/data/2.5/forecast?units=imperial&lat=${this.latitude}&lon=${this.longitude}&appid=${this.owmAPI}`);
                })
                .then(r => r.json())
                .then(json => {

                    for (i=0; i < json.list.length; i++){
                        this.forecasts.push({state: 'neutral', date: json.list[i].dt_txt, weather_info: json.list[i].main, description: json.list[i].weather[0].description})
                    }
                });

        },

    });
    const vm = app.mount('#app');
