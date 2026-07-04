"use client";

import * as React from "react";

import Map, {
    Marker,
    NavigationControl,
    GeolocateControl,
} from "react-map-gl/mapbox";

import "mapbox-gl/dist/mapbox-gl.css";

import {
    Search,
    Loader2,
    MapPin,
    Locate,
} from "lucide-react";

import { useDebouncedCallback } from "use-debounce";

const MAPBOX_TOKEN =
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

const LOCATIONIQ_KEY =
    process.env.NEXT_PUBLIC_LOCATIONIQ_TOKEN || "";

interface BookingMapProps {
    initialLocation: {
        latitude: number;
        longitude: number;
        address: string;
    };

    onLocationSelect: (location: {
        latitude: number;
        longitude: number;
        address: string;
    }) => void;
}

interface SearchResult {
    place_id: string;
    lat: string;
    lon: string;
    display_name: string;
}

export default function BookingMap({
    initialLocation,
    onLocationSelect,
}: BookingMapProps) {

    const [viewport, setViewport] = React.useState({
        longitude: initialLocation.longitude,
        latitude: initialLocation.latitude,
        zoom: 13,
    });

    const [searchQuery, setSearchQuery] = React.useState("");
    const [results, setResults] = React.useState<SearchResult[]>([]);
    const [selectedAddress, setSelectedAddress] = React.useState(
        initialLocation.address || "Select location..."
    );

    // ✅ SEARCH LOADING STATE
    const [isLoading, setIsLoading] = React.useState(false);

    // =========================
    // CAMERA MOVE (SMOOTH ZOOM)
    // =========================
    const moveCamera = (lat: number, lng: number, zoom = 16) => {
        setViewport(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng,
            zoom,
            transitionDuration: 1200,
        }));
    };

    // =========================
    // REVERSE GEOCODING
    // =========================
    const reverseGeocode = React.useCallback(
        async (lat: number, lng: number) => {
            try {
                const res = await fetch(
                    `https://api.locationiq.com/v1/reverse?key=${LOCATIONIQ_KEY}&lat=${lat}&lon=${lng}&format=json`
                );

                const data = await res.json();

                const address =
                    data.display_name || `${lat}, ${lng}`;

                setSelectedAddress(address);

                onLocationSelect({
                    latitude: lat,
                    longitude: lng,
                    address,
                });

            } catch (error) {

                const fallback =
                    `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

                setSelectedAddress(fallback);

                onLocationSelect({
                    latitude: lat,
                    longitude: lng,
                    address: fallback,
                });
            }
        },
        [onLocationSelect]
    );

    // =========================
    // MARKER DRAG
    // =========================
    const onMarkerDragEnd = React.useCallback(
        (event: any) => {
            const { lng, lat } = event.lngLat;

            moveCamera(lat, lng, 16);

            reverseGeocode(lat, lng);
        },
        [reverseGeocode]
    );

    // =========================
    // SEARCH API
    // =========================
    const debouncedSearch = useDebouncedCallback(
        async (text: string) => {

            if (text.length < 3) {
                setResults([]);
                setIsLoading(false);
                return;
            }

            try {

                setIsLoading(true);

                const res = await fetch(
                    `https://api.locationiq.com/v1/autocomplete?key=${LOCATIONIQ_KEY}&q=${text}&limit=5&countrycodes=tz&format=json`
                );

                const data = await res.json();

                if (Array.isArray(data)) {
                    setResults(data);
                }

            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }

        },
        500
    );

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (value.length > 2) setIsLoading(true);

        debouncedSearch(value);
    };

    // =========================
    // SELECT LOCATION
    // =========================
    const onSelectLocation = (
        lat: string,
        lon: string,
        name: string
    ) => {

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        moveCamera(latitude, longitude, 17);

        setSelectedAddress(name);

        onLocationSelect({
            latitude,
            longitude,
            address: name,
        });

        setSearchQuery("");
        setResults([]);
    };

    // =========================
    // CURRENT LOCATION
    // =========================
    const handleCurrentLocation = () => {

        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            async (pos) => {

                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;

                moveCamera(lat, lng, 17);

                reverseGeocode(lat, lng);

            },
            (err) => console.error(err)
        );
    };

    return (
        <div className="relative h-full w-full">

            {/* SEARCH BOX */}
            <div className="absolute top-4 left-4 z-20 w-80">

                <div className="bg-white rounded-2xl shadow-xl p-4">

                    <div className="relative">

                        <input
                            value={searchQuery}
                            onChange={handleInputChange}
                            placeholder="Search location..."
                            className="w-full px-4 py-3 rounded-xl bg-zinc-100"
                        />

                        <div className="absolute right-3 top-3 text-zinc-500">

                            {isLoading ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <Search size={18} />
                            )}

                        </div>

                    </div>

                    {/* LOADING STATE */}
                    {isLoading && (
                        <div className="mt-2 text-xs text-emerald-600 flex items-center gap-2">
                            <Loader2 size={14} className="animate-spin" />
                            Searching locations...
                        </div>
                    )}

                    {/* RESULTS */}
                    {results.length > 0 && (
                        <div className="mt-3 max-h-60 overflow-y-auto">

                            {results.map((item, index) => (
                                <button
                                    key={`${item.place_id}-${item.lat}-${index}`}
                                    onClick={() =>
                                        onSelectLocation(
                                            item.lat,
                                            item.lon,
                                            item.display_name
                                        )
                                    }
                                    className="w-full text-left p-3 hover:bg-emerald-50"
                                >
                                    <MapPin size={14} className="inline mr-2" />
                                    {item.display_name}
                                </button>
                            ))}

                        </div>
                    )}

                    <div className="mt-3 text-xs text-emerald-700">
                        {selectedAddress}
                    </div>

                    <button
                        onClick={handleCurrentLocation}
                        className="mt-3 w-full bg-black text-white py-2 rounded-xl"
                    >
                        Use Current Location
                    </button>

                </div>

            </div>

            {/* MAP */}
            <Map
                {...viewport}
                onMove={(evt) =>
                    setViewport(evt.viewState)
                }
                mapboxAccessToken={MAPBOX_TOKEN}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/streets-v11"
            >

                {/* MARKER */}
                <Marker
                    longitude={viewport.longitude}
                    latitude={viewport.latitude}
                    draggable
                    onDragEnd={onMarkerDragEnd}
                >
                    <div className="p-3 bg-emerald-600 text-white rounded-full shadow-xl">
                        <Locate size={16} />
                    </div>
                </Marker>

                <NavigationControl position="top-right" />

                <GeolocateControl
                    position="top-right"
                    trackUserLocation
                />

            </Map>

        </div>
    );
}