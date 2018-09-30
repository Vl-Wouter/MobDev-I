let map
function initMap() {
    let gent = {lat:51.051024, lng:3.727080 };
    map = new google.maps.Map(
        document.getElementById('map'), {
            zoom: 15,
            center: gent,
            styles: [
                {
                    "featureType": "all",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "all",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "administrative",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "administrative.neighborhood",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "landscape.man_made",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "landscape.natural",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "road.highway.controlled_access",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road.local",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "transit.line",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "visibility": "off"
                        },
                        {
                            "gamma": "10.00"
                        },
                        {
                            "weight": "10.00"
                        }
                    ]
                },
                {
                    "featureType": "transit.station.airport",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                }
            ]
        });
}

function getSpots() {
    return localStorage.getItem('parkingSpots').split(',');

}

function getData() {
    fetch('https://datatank.stad.gent/4/mobiliteit/bezettingparkingsrealtime.json').then(function(response) {
        response.json().then(function(data) {
            console.log(data);
            let oldspots = [];
            let newspots = [];
            let icon = '';
            if(localStorage.getItem('parkingSpots') != null) {
                oldspots = getSpots();
            }
            for(let i = 0; i < data.length; i++) {
                let capacity = (data[i].parkingStatus.availableCapacity / data[i].parkingStatus.totalCapacity);
                if(capacity < 0.2) color = 'red';
                else if(capacity <= 0.5) color = 'orange';
                else color = 'green';

                if(localStorage.getItem('parkingSpots') != null) {
                    if(oldspots[i] < data[i].parkingStatus.availableCapacity) {
                        icon = `<i class='fas fa-arrow-up'></i>`;
                    }
                    else if(oldspots[i] > data[i].parkingStatus.availableCapacity) {
                        icon = `<i class='fas fa-arrow-down'></i>`;
                    }
                    else {
                        icon = `<i class='fas fa-equals'></i>`;
                    }
                }

                let card = `
                <div class='parkingCard'>
                    <div class='card-title'>
                        <h1>${data[i].name}</h1>
                        <p class='small'>${data[i].address}</p>
                    </div>
                    <div class='plaatsen'>
                        <p class='small'>Vrije plaatsen</p>
                        <p class='num' style='color: ${color}'><span id='icon'>${icon}</span>${data[i].parkingStatus.availableCapacity}</p>
                    </div>
                </div>
                `;

                newspots.push(data[i].parkingStatus.availableCapacity);
                let parent = document.getElementById('list');
                parent.innerHTML += card;

                let marker = new google.maps.Marker({
                    position: {lat: data[i].latitude, lng: data[i].longitude},
                    title: data[i].name
                });

                marker.setMap(map);
            }
            localStorage.setItem('parkingSpots', newspots.toString());
        });
    });
}

getData();