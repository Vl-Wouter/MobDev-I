let map
function initMap() {
    let gent = {lat:51.051024, lng:3.727080 };
    map = new google.maps.Map(
        document.getElementById('map'), {
            zoom: 15,
            center: gent
        });
}

function getData() {
    fetch('https://datatank.stad.gent/4/mobiliteit/bezettingparkingsrealtime.json').then(function(response) {
        response.json().then(function(data) {
            console.log(data);

            for(let i = 0; i < data.length; i++) {
                let card = `
                <div class='parkingCard'>
                    <div class='card-title'>
                        <h1>${data[i].name}</h1>
                        <p class='small'>${data[i].address}</p>
                    </div>
                    <div class='plaatsen'>
                        <p class='small'>Vrije plaatsen</p>
                        <p class='num'>${data[i].parkingStatus.availableCapacity}</p>
                    </div>
                </div>
                `;
                let parent = document.getElementById('list');
                parent.innerHTML += card;

                let marker = new google.maps.Marker({
                    position: {lat: data[i].latitude, lng: data[i].longitude},
                    title: data[i].name
                });

                marker.setMap(map);
            }
        });
    });
}

getData();