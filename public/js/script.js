const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition(function(position){
        const{latitude, longitude}=position.coords;
        socket.emit("send-location", {latitude, longitude});
    },function(error){
        console.error(error);
    },
    {
        enableHighAccuracy: true,
        timeout:5000,
        maximumAge: 0
    })
}
const map = L.map("map").setView([0,0],16);

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: "JSSATEN"
}).addTo(map);

const markers = {};

socket.on("recive-location", function(data){
    const{id, latitude,longitude}= data;
    map.setView([latitude,longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }
    else{
        markers[id]=L.marker([latitude,longitude]).addTo(map);
    }
})

socket.on("user-disconnect",function(id){
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }

})