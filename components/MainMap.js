import L from "leaflet";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import getTime from "../lib/getTime";
import mun from "../seoul_municipalities_geo_simple.json";
import RangeSlider from "./RangeSlider";
import FestivalImage from "./FestivalImage";

const getLink = festival => {
  return (
    <>
      {festival.name} <br />
      <Link href="/p/[id]" as={`/p/${festival.id}&${getTime(festival.date)}`}>
        <a>
          <FestivalImage className="" id={festival.id} />
        </a>
      </Link>
    </>
  );
};

const addLinkToLayer = (festival, layer) => {
  const div = L.DomUtil.create("div");
  const link = getLink(festival);
  ReactDOM.hydrate(link, div);
  L.marker([festival.y, festival.x])
    .bindPopup(div)
    .addTo(layer);
};

let map;

function isInside(marker, poly) {
  // console.log(poly[0])
  const polyPoints = poly[0];
  const x = marker.y,
    y = marker.x;

  let inside = false;
  for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
    let xi = polyPoints[i][1],
      yi = polyPoints[i][0];
    let xj = polyPoints[j][1],
      yj = polyPoints[j][0];

    let intersect =
      yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

const MainMap = ({ fes, height }) => {
  const [periodOn, setPeriodOn] = useState(false);
  const periodOnRef = useRef(false);
  periodOnRef.current = periodOn;

  const style = (
    <style jsx>{`
      #map {
        height: ${height - 48}px;
        width: 100vw;
        z-index: 1;
      }
      .mapContainer {
      }
      img {
        width: 40vmin;
        max-width: 300px;
      }
      .leaflet-control-zoom {
        display: none;
      }
    `}</style>
  );

  useEffect(() => {
    if (map) {
      map.remove();
    }
    map = L.map("map").fitBounds([
      [37.413294, 126.734086],
      [37.715133, 127.269311]
    ]);

    for (let festival of fes) {
      addLinkToLayer(festival, map);
    }

    const markerElts = map.getPane("markerPane").children;
    const shadowElts = map.getPane("shadowPane").children;
    for (let i = 0; i < fes.length; i++) {
      shadowElts[i].style.display = "none";
      markerElts[i].style.display = "none";
    }

    const colorScheme = [
      "#a6cee3",
      "#1f78b4",
      "#b2df8a",
      "#33a02c",
      "#fb9a99",
      "#e31a1c",
      "#fdbf6f",
      "#ff7f00",
      "#cab2d6",
      "#6a3d9a",
      "#ffff99",
      "#b15928"
    ];

    const layers = [];

    const municipalHandler = (feature, layer) => {
      const colorCode =
        colorScheme[
          feature.properties.ESRI_PK === 15 || feature.properties.ESRI_PK === 22
            ? 1
            : feature.properties.ESRI_PK % colorScheme.length
        ];

      let festIndex = undefined;

      layers.push(layer);

      const zoomOutHandler = () => {
        map.fitBounds([
          [37.413294, 126.734086],
          [37.715133, 127.269311]
        ]);
        if (!periodOnRef.current) {
          layer.setStyle({
            fillOpacity: 0.5
          });
          for (let i of festIndex) {
            shadowElts[i].style.display = "none";
            markerElts[i].style.display = "none";
          }
        }
        map.removeLayer(layer);
        for (let l of layers) {
          map.addLayer(l);
        }

        map.removeEventListener("click", zoomOutHandler);
        layer.addEventListener("click", zoomInHandler);
      };

      const zoomInHandler = () => {
        map.fitBounds(layer.getBounds());
        for (let l of layers) {
          map.removeLayer(l);
        }

        map.addLayer(layer);
        if (!periodOnRef.current) {
          layer.setStyle({
            fillOpacity: 0.1
          });

          if (festIndex === undefined) {
            festIndex = [];
            for (let i = 0; i < fes.length; i++) {
              if (isInside(fes[i], feature.geometry.coordinates)) {
                festIndex.push(i);
                shadowElts[i].style.display = "";
                markerElts[i].style.display = "";
              }
            }
          } else {
            for (let i of festIndex) {
              shadowElts[i].style.display = "";
              markerElts[i].style.display = "";
            }
          }
        }
        layer.removeEventListener("click", zoomInHandler);
        map.addEventListener("click", zoomOutHandler);
      };

      layer.addEventListener("click", zoomInHandler);

      layer.setStyle({
        color: colorCode,
        fillColor: colorCode,
        fillOpacity: 0.5
      });
    };

    const addControlTo = map => {
      L.Control.Filter = L.Control.extend({
        onAdd: function(map) {
          const elt = L.DomUtil.create("div");

          const handleFilter = value => {
            const [start, end] = value;

            const getTime = festival => {
              let t = 0;
              const date = festival.date;
              if (date.length !== 0) {
                const { year, month } = date[date.length - 1];
                t = (year - 2019) * 12 + (month - 1);
              }
              return t;
            };

            for (let i = 0; i < fes.length; i++) {
              const t = getTime(fes[i]);
              if (start <= t && t <= end) {
                shadowElts[i].style.display = "";
                markerElts[i].style.display = "";
              } else {
                shadowElts[i].style.display = "none";
                markerElts[i].style.display = "none";
              }
            }
          };

          const inputs = (
            <>
              <RangeSlider
                map={map}
                maxDate={(() => {
                  let last = [];
                  for (let i = fes.length - 1; last.length === 0; i--) {
                    last = fes[i].date;
                  }
                  return last[last.length - 1];
                })()}
                handleFilter={handleFilter}
                handleOn={() => {
                  setPeriodOn(true);
                  layers.forEach(layer => {
                    layer.setStyle({ fillOpacity: 0.1 });
                  });
                }}
                handleOff={() => {
                  for (let i = 0; i < fes.length; ++i) {
                    shadowElts[i].style.display = "none";
                    markerElts[i].style.display = "none";
                  }
                  setPeriodOn(false);
                  layers.forEach(layer => {
                    layer.setStyle({ fillOpacity: 0.5 });
                  });
                }}
              />
            </>
          );

          ReactDOM.hydrate(inputs, elt);

          return elt;
        },

        onRemove: function() {}
      });

      L.control.filter = function(opts) {
        return new L.Control.Filter(opts);
      };

      L.control.filter({ position: "bottomleft" }).addTo(map);
    };

    setPeriodOn(false);

    L.geoJSON(mun, {
      onEachFeature: municipalHandler
    }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: `&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, 
        Geojson from: <a href="https://github.com/southkorea/seoul-maps">https://github.com/southkorea/seoul-maps</a>`
    }).addTo(map);

    addControlTo(map);
  }, [height]);

  return (
    <>
      <div className="mapContainer">
        <div id="map"></div>
      </div>
      {style}
    </>
  );
};

export default MainMap;
