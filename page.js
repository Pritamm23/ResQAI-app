"use client";

import LiveMap from "./LiveMap";
import { useState } from "react";

export default function Home() {
  const [alertSent, setAlertSent] = useState(false);
  const [location, setLocation] = useState(null);
  const [nearestAmbulance, setNearestAmbulance] = useState(null);
  const [nearestFireUnit, setNearestFireUnit] = useState(null);

  // Dummy ambulance locations
  const ambulances = [
    { id: "AMB-101", lat: 22.5726, lng: 88.3639 },
    { id: "AMB-205", lat: 22.5850, lng: 88.3750 },
    { id: "AMB-309", lat: 22.5600, lng: 88.3500 },
  ];

  // Dummy fire station locations
  const fireStations = [
    { id: "FIRE-01", lat: 22.5697, lng: 88.3697 },
    { id: "FIRE-02", lat: 22.5900, lng: 88.3950 },
    { id: "FIRE-03", lat: 22.5480, lng: 88.3400 },
  ];

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const dx = lat1 - lat2;
    const dy = lng1 - lng2;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // MEDICAL
  const handleMedical = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        let nearest = ambulances[0];
        let minDist = Infinity;

        ambulances.forEach((amb) => {
          const dist = calculateDistance(userLat, userLng, amb.lat, amb.lng);

          if (dist < minDist) {
            minDist = dist;
            nearest = amb;
          }
        });

        setNearestAmbulance({
          ...nearest,
          eta: Math.floor(minDist * 120) + 3,
        });

        setNearestFireUnit(null);

        setLocation({
          lat: userLat,
          lng: userLng,
        });
      },
      () => alert("Location access denied")
    );
  };

  // FIRE
  const handleFire = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        let nearest = fireStations[0];
        let minDist = Infinity;

        fireStations.forEach((station) => {
          const dist = calculateDistance(
            userLat,
            userLng,
            station.lat,
            station.lng
          );

          if (dist < minDist) {
            minDist = dist;
            nearest = station;
          }
        });

        const severities = ["Low", "Medium", "High"];
        const severity =
          severities[Math.floor(Math.random() * severities.length)];

        setNearestFireUnit({
          ...nearest,
          eta: Math.floor(minDist * 120) + 2,
          severity,
        });

        setNearestAmbulance(null);

        setLocation({
          lat: userLat,
          lng: userLng,
        });
      },
      () => alert("Location access denied")
    );
  };

  // SOS
  const handleSOS = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLoc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setLocation(userLoc);
        setAlertSent(true);

        const emergencyNumber = "91XXXXXXXXXX";  //use ur own whatsapp number u want to send the message to

        const message =
          `🚨 ResQAI ALERT!\n` +
          `Emergency triggered.\n` +
          `Live Location: https://maps.google.com/?q=${userLoc.lat},${userLoc.lng}`;

        const whatsappURL =
          `whatsapp://send?phone=${emergencyNumber}&text=${encodeURIComponent(message)}`;

        window.location.href = whatsappURL;

        console.log("SOS SENT:", userLoc);
      },
      () => {
        alert("Location access denied");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">

        {/* LEFT PANEL */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-cyan-400/20">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">ResQAI</h1>
              <p className="text-cyan-300">AI Emergency Response</p>
            </div>

            <div className="w-12 h-12 rounded-full bg-white/20"></div>
          </div>

          {/* SOS BUTTON */}
          <button
            onClick={handleSOS}
            className="relative w-[490px] h-40 mx-auto rounded-full overflow-hidden
            bg-gradient-to-b from-red-500 via-red-700 to-red-950
            border-4 border-red-300
            shadow-[inset_0_8px_20px_rgba(255,255,255,0.25),inset_0_-10px_25px_rgba(0,0,0,0.45),0_0_45px_rgba(180,0,0,0.7)]
            hover:scale-105 active:scale-95 transition duration-200"
          >
            <span className="absolute inset-0 rounded-full animate-ping bg-red-800 opacity-20"></span>
            <span className="absolute top-3 left-6 w-24 h-10 rounded-full bg-white/20 blur-md"></span>

            <span className="relative z-10 text-white text-4xl font-extrabold tracking-wider">
              SOS
            </span>
          </button>

          {alertSent && (
            <div className="mt-4 text-center text-green-400 font-bold">
              Emergency Alert Sent 🚨
              <p className="text-sm text-white mt-2">
                Lat: {location?.lat} | Lng: {location?.lng}
              </p>
            </div>
          )}

          <p className="text-center text-slate-300 mt-4">
            Hold 3 seconds to activate emergency mode
          </p>

          {/* STATUS */}
          <div className="mt-8 bg-emerald-500/20 border border-emerald-400 rounded-2xl p-4">
            <p className="font-semibold">Status: SAFE</p>
            <p className="text-sm text-slate-300">AI monitoring active</p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-6">

          {/* MAP */}
          <div className="bg-white rounded-3xl p-6 text-slate-900 shadow-xl min-h-[320px]">
            <h2 className="text-xl font-bold mb-4">Live Location</h2>
            <LiveMap />
          </div>

          {/* QUICK ACTIONS */}
          <div className="grid grid-cols-2 gap-4">
            {["Accident", "Fire", "Medical", "Crime"].map((item) => (
              <button
                key={item}
                onClick={
                  item === "Medical"
                    ? handleMedical
                    : item === "Fire"
                    ? handleFire
                    : undefined
                }
                className="bg-white/10 rounded-2xl p-5 border border-white/10 hover:border-cyan-300 transition hover:bg-white/15"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Ambulance Card */}
          {nearestAmbulance && (
            <div className="bg-emerald-500/20 border border-emerald-400 rounded-2xl p-4">
              <h3 className="font-bold text-lg">🚑 Ambulance Assigned</h3>
              <p>ID: {nearestAmbulance.id}</p>
              <p>ETA: {nearestAmbulance.eta} mins</p>
              <p>Status: En Route</p>
            </div>
          )}

          {/* Fire Card */}
          {nearestFireUnit && (
            <div className="bg-orange-500/20 border border-orange-400 rounded-2xl p-4">
              <h3 className="font-bold text-lg">🔥 Fire Unit Assigned</h3>
              <p>ID: {nearestFireUnit.id}</p>
              <p>ETA: {nearestFireUnit.eta} mins</p>
              <p>Severity: {nearestFireUnit.severity}</p>
              <p>Status: Responding</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
