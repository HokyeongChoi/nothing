import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import mun from '../seoul_municipalities_geo_simple.json';

let map, markerLayer, marker, layer;

const LeafMap = ({ fes, res, full, invalidate, preventSwipe }) => {
    const [init, setInit] = useState(true);

    const Icon = L.icon({
        iconUrl: '/icon.png',
        iconSize: [20, 30]
    });

    let style;
    if (full) {
        style = <style jsx>{`
                            #map {
                                height: 100vh;
                                width: 100vw;
                                z-index: 1;
                            }
                            img {
                                width: 10vw;
                                height: 10vw;
                            }
                            .leaflet-control-zoom{
                                display: none;
                            }
                        `}</style>;
    } else {
        style = <style jsx>{`
                            #map {
                                width: 90vw;
                                height: 40vmax;
                                position: relative;
                                margin-left: 2.5vmin;
                            }
                            // .mapContainer {
                            //     position: fixed;
                            //     top: 22vmin;
                            //     left: 103.5vw;
                            //     overflow: hidden
                            // }
                        `}</style>;
    }

    const colorScheme = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928'];
    // const colorScheme = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'];

    const municipalHandler = (feature, layer) => {
        const colorCode = colorScheme[[22,15].includes(feature.properties.ESRI_PK)? 1 : feature.properties.ESRI_PK % colorScheme.length];
        // console.log(colorCode)
        layer.addEventListener("click", ()=>{
            map.fitBounds(layer.getBounds());
            map.addLayer(markerLayer);
        });
        layer.setStyle({
            color: colorCode,
            fillColor: colorCode,
            fillOpacity: 0.5
        });
    }

    useEffect(() => {
        if (full) {
            map = L.map('map').fitBounds([
                [37.413294, 126.734086], 
                [37.715133, 127.269311]
            ]);
            L.geoJSON(mun, {
                onEachFeature: municipalHandler
            }).addTo(map);
            markerLayer = L.layerGroup();
            for (let f of fes) {
                L.marker(
                    [f.y, f.x],
                ).bindPopup(
                    `${f.name}<br><img src='img/${f.id}.jpg'></img>`
                ).addTo(markerLayer);
            }
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
        } else if (invalidate) {
            // console.log("invalidate");
            if (!init) {
                map.remove();
            }
            map = L.map('map').setView([fes.y, fes.x], 15);
            marker = L.marker([fes.y, fes.x]).bindPopup(fes.name)
                .addTo(map).openPopup();
            for (let r of res) {
                L.marker(
                    [r.y, r.x],
                    { icon: Icon }
                ).bindPopup(
                    `${r.place_name}\n<a href=${r.place_url}>${r.place_url}</a>`
                ).addTo(map);
            }
            setInit(false);
            // L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            //     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            //     maxZoom: 18,
            //     id: 'mapbox.streets',
            //     accessToken: 'pk.eyJ1IjoiZG9sbGh5IiwiYSI6ImNrMnNraHRraDBpeGUzbXRqcm9hMTIxNnMifQ.s5z_Pkw604EFu087friCtQ'
            // }).addTo(map);
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            layer = L.layerGroup().addTo(map);
        }
    }, [fes, invalidate])



    return (
        <div className="mapContainer"
            onTouchStart={
                (preventSwipe)
                &&
                (e => {
                    preventSwipe(true);
                    function unregisterSwipe() {
                        preventSwipe(false);
                        window.removeEventListener('touchend', unregisterSwipe);
                    }
                    window.addEventListener('touchend', unregisterSwipe)
                })}
        >
            <div id='map'></div>

            {style}
        </div>
    );
}

export default LeafMap;