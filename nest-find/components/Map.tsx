"use client"
import L from "leaflet"
import {MapContainer, Marker, Popup, TileLayer,} from "react-leaflet";

//Fix leaflet default icon (it breaks with webPack)
const icon = L.icon({
    iconUrl:  "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

type Props = {
    lat: number;
    lng: number;
    title: string;

}

export default function Map({ lat, lng, title}: Props){

    return (
        <MapContainer
            center={[lat, lng]}
            zoom={15}
            style={{height: "300px", width: "100%", borderRadius: "12px"}}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            <Marker
                position={[lat, lng]}
                icon={icon}
            >
                <Popup>
                    {title}
                </Popup>
            </Marker>

        </MapContainer>
    );
}

