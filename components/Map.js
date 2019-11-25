import React, { useEffect } from 'react';
import L from 'leaflet';


const LeafMap = ({ fes, res }) => {

    const Icon = L.icon({
        iconUrl: '/icon.png',
        iconSize: [20, 30]
    });

    useEffect(() => {
        let map = L.map('map').setView([fes.y, fes.x], 15);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoiZG9sbGh5IiwiYSI6ImNrMnNraHRraDBpeGUzbXRqcm9hMTIxNnMifQ.s5z_Pkw604EFu087friCtQ'
        }).addTo(map);

        let marker = L.marker([fes.y, fes.x]).bindPopup(fes.name)
            .addTo(map).openPopup();

        let layer = L.layerGroup().addTo(map);

        for (let r of res) {
            L.marker(
                [r.y, r.x],
                {icon: Icon}
            ).bindPopup(
                `${r.place_name}\n<a href=${r.place_url}>${r.place_url}</a>`
            ).addTo(map);
        }
    }, [])
    
    return (
        <div>
            <div id='map'></div>
            <style jsx>{`
        #map {
            height: 40vh;
        }
    `}</style>
        </div>
    );
}

export default LeafMap;