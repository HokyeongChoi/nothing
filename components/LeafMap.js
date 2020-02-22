import L from "leaflet";
import React, { useEffect, useState } from "react";

let map, marker, layer;

let restaurantMarkers = {};

const LeafMap = ({ fes, res, invalidate, preventSwipe, open }) => {
  const [init, setInit] = useState(true);

  const Icon = L.icon({
    iconUrl: "/icon.png",
    iconSize: [20, 30]
  });

  useEffect(() => {
    if (invalidate) {
      // console.log("invalidate");
      if (!init) {
        map.remove();
        restaurantMarkers = {};
      }
      map = L.map("map").setView([fes.y, fes.x], 16);
      marker = L.marker([fes.y, fes.x])
        .bindPopup(fes.name)
        .addTo(map)
        .openPopup();

      for (let r of res) {
        restaurantMarkers[r.id] = L.marker([r.y, r.x], { icon: Icon })
          .bindPopup(
            `${r.place_name}\n<a href=${r.place_url}>${r.place_url}</a>`
          )
          .addTo(map);
      }
      setInit(false);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      layer = L.layerGroup().addTo(map);
    }
  }, [fes, invalidate, res]);

  useEffect(() => {
    if (open) {
      restaurantMarkers[open].openPopup();
    }
  }, [open]);

  return (
    <div
      className="mapContainer"
      onTouchStart={
        preventSwipe &&
        (() => {
          preventSwipe(true);
          function unregisterSwipe() {
            preventSwipe(false);
            window.removeEventListener("touchend", unregisterSwipe);
          }
          window.addEventListener("touchend", unregisterSwipe);
        })
      }
    >
      <div id="map"></div>

      <style jsx>{`
        #map {
          width: 100%;
          height: 100%;
          min-height: 256px;
          margin: auto;
        }
        .mapContainer {
          position: sticky;
          top: 10px;
        }
      `}</style>
    </div>
  );
};

export default LeafMap;
