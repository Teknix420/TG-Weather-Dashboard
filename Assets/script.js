        // Search function. When button is clicked, executes a function
        var searchBtn = $('#search-button');
        var searchText = $('#search-text');

        // Pull local storage and display in recent history list
        var searchHistory = $('<div>').addClass('list list-group-item text-left').text(localStorage.getItem('Previous Search'));
        $('#search').append(searchHistory);

        searchBtn.click(function () {
            event.preventDefault();
            // Pulls API based on search parameters
            //api.openweathermap.org/data/2.5/weather?q= (search variable) &appid=c8d4f7a61d9f9badd091573f3de37376
            var urlPiece1 = 'https://api.openweathermap.org/data/2.5/'
            var urlPiece12 = 'weather?q=';
            var urlPiece13 = 'forecast?q=';
            var urlPiece2 = searchText.val();
            var urlPiece3 = '&appid=c8d4f7a61d9f9badd091573f3de37376';
            var queryURLcurrent = urlPiece1 + urlPiece12 + urlPiece2 + urlPiece3;
            var queryURLforecast = urlPiece1 + urlPiece13 + urlPiece2 + urlPiece3;

            $.ajax({
                url: queryURLcurrent,
                method: "GET"
            }).then(function (weather) {

                var lat = 'uvi?lat=' + weather.coord.lat;
                var lon = '&lon=' + weather.coord.lon;
                var queryURLuv = urlPiece1 + lat + lon + urlPiece3;

                // Creates content based on current weather forecast; UV Index needs to display a color background depending on quality
                $.ajax({
                    url: queryURLuv,
                    method: "GET"
                }).then(function (uv) {

                    uvIndex = parseInt(uv.value);
                    $('#uv-index').text(uvIndex);
                    if (uvIndex >= 3 && uvIndex <= 5) {
                        $('#uv-index').css('background-color', 'yellow');
                    } else if (uvIndex >= 6 && uvIndex <= 7) {
                        $('#uv-index').css('background-color', 'orange');
                    } else if (uvIndex >= 8 && uvIndex <= 10) {
                        $('#uv-index').css('background-color', 'red');
                    } else if (uvIndex >= 11) {
                        $('#uv-index').css('background-color', 'violet');
                    }
                
                });

                if (weather.weather[0].main === 'Clear') {
                    var imgURLcurrent = 'Assets/icons/sun4.png';
                } else if (weather.weather[0].main === 'Rain') {
                    var imgURLcurrent = 'Assets/icons/cloud1.png';
                } else if (weather.weather[0].main === 'Clouds') {
                    var imgURLcurrent = 'Assets/icons/cloud2.png';
                };

                $('#city').text(weather.name + ' - ' + moment().format('MMMM Do YYYY') + ' ');
                var currentIcon = $('<img>').attr('src', imgURLcurrent).attr('alt', 'icon').addClass('icon');
                $('#city').append(currentIcon);

                $('#temperature').text((((weather.main.temp - 273.15) * 1.80 + 32).toFixed(2)) + ' F');
                $('#humidity').text(weather.main.humidity + '%');
                $('#wind-speed').text(weather.wind.speed + ' MPH');
            });

            // Create loop that creates a new card for each day of the weather forecast for 5 days; display an icon based on if sunny, cloudy, etc.
            $('#forecast').empty();

            $.ajax({
                url: queryURLforecast,
                method: "GET"
            }).then(function (forecast) {
                for (var i = 0; i < 5; i++) {

                    var cardHold = $('<div>').addClass('card col text-white bg-primary sm-2');
                    var date = $('<h6>').text(moment().add(i + 1, 'days').format('MMMM Do YYYY'));

                    if (forecast.list[i].weather[0].main === 'Clear') {
                        var imgURL = 'Assets/icons/sun4.png';
                    } else if (forecast.list[i].weather[0].main === 'Rain') {
                        var imgURL = 'Assets/icons/cloud1.png';
                    } else if (forecast.list[i].weather[0].main === 'Clouds') {
                        var imgURL = 'Assets/icons/cloud2.png';
                    };

                    var icon = $('<img>').attr('src', imgURL).attr('alt', 'Icon').addClass('icon');
                    var temp = $('<p>').text('Temperature: ' + (((forecast.list[i].main.temp - 273.15) * 1.80 + 32).toFixed(2)) + ' F');
                    var humidity = $('<p>').text('Humidity: ' + forecast.list[i].main.humidity + '%');

                    $('#forecast').append(cardHold);
                    cardHold.append(date, icon, temp, humidity);
                };
            });

            // Prepends search text in a new row below the search function and saves it to local storage
            searchHistory = $('<div>').addClass('list list-group-item text-left').text(searchText.val());
            $('#search').prepend(searchHistory);
            localStorage.setItem('Previous Search', searchText.val());

        });