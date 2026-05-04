"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

function RecenterMap({ position }) {
  const map = useMapEvents({});

  useEffect(() => {
    map.flyTo(position, 17, {
      duration: 1.5,
    });
  }, [position, map]);

  return null;
}

export default function LiveMap() {
  const [position, setPosition] = useState([22.5726, 88.3639]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => console.log(err),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  return (
    <div className="h-[300px] w-full rounded-2xl overflow-hidden">
      <MapContainer
        center={position}
        zoom={17}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <RecenterMap position={position} />

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={position}>
          <Popup>You are here 📍</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
