import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LocationGrade } from "../../lib/starkwell";
import { isPreciseLocation, formatPrice } from "../../lib/starkwell";

/**
 * Minimal shape the map needs. Deliberately not ProviderPrice: the same map
 * plots facilities (grouped by address) and individual providers, and the only
 * thing it needs from either is a label, a point and a price.
 */
export interface MapPoint {
  key: string;
  label: string;
  city: string | null;
  lat: number | null;
  lng: number | null;
  location_grade: LocationGrade | null;
  price: number;
  /** Optional second line, e.g. "496 providers · $249-$601". */
  detail?: string;
}

/**
 * Provider map — Leaflet + OpenStreetMap tiles.
 *
 * Replaces the Figma ProviderMap.tsx, which imported only Card/Badge/Button and
 * some icons: it was a styled placeholder with no mapping library behind it.
 *
 * Only plots the CURRENT RESULT SET (<= 25 pins), not all 31,271 providers, so
 * no clustering is needed and no tile budget or API key is involved.
 *
 * PROVIDERS WITHOUT A PRECISE GEOCODE ARE NOT PLOTTED. 1,427 providers carry a
 * ZIP or city centroid, which renders as a confident pin in a neighbourhood the
 * provider may not be in. Dropping them and saying so is honest; drawing them
 * is not. The count of omitted pins is surfaced under the map.
 *
 * Leaflet is imperative and owns its DOM node, so it lives behind a ref rather
 * than react-leaflet components — fewer moving parts and no version coupling to
 * React's rendering.
 */

// Leaflet's default marker icons resolve via relative URLs that break under a
// bundler. Build the icon from the packaged assets explicitly.
const icon = new L.Icon({
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url).href,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Utah, so the map is never empty while a search is in flight.
const UTAH_CENTER: [number, number] = [39.42, -111.95];

interface Props {
  providers: MapPoint[];
  className?: string;
}

export function ProviderMap({ providers, className }: Props) {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  const plottable = useMemo(
    () => providers.filter(
      p => p.lat != null && p.lng != null && isPreciseLocation(p.location_grade)),
    [providers],
  );
  const key = plottable.map(p => p.key).join("|");
  const omitted = providers.length - plottable.length;

  useEffect(() => {
    if (!nodeRef.current || mapRef.current) return;
    const map = L.map(nodeRef.current, { scrollWheelZoom: false })
      .setView(UTAH_CENTER, 7);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapRef.current, layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    if (plottable.length === 0) {
      map.setView(UTAH_CENTER, 7);
      return;
    }
    const pts: [number, number][] = [];
    for (const p of plottable) {
      const ll: [number, number] = [p.lat as number, p.lng as number];
      pts.push(ll);
      L.marker(ll, { icon })
        .bindPopup(
          `<strong>${escapeHtml(p.label)}</strong><br/>` +
          `${escapeHtml(p.city ?? "")}<br/>` +
          `<span style="font-size:15px;font-weight:600">${formatPrice(p.price)}</span>` +
          (p.detail ? `<br/><span style="color:#555">${escapeHtml(p.detail)}</span>` : ""))
        .addTo(layer);
    }
    map.fitBounds(L.latLngBounds(pts).pad(0.2), { maxZoom: 13 });
    // Keyed on the point identities, not the array reference: the parent
    // rebuilds this array on every render, which would otherwise refit the
    // map — and fight the user's pan and zoom — on unrelated state changes.
  }, [key]);   // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={className}>
      <div
        ref={nodeRef}
        className="h-[420px] w-full rounded-xl border border-gray-200 z-0"
        role="application"
        aria-label="Map of providers offering this service"
      />
      <p className="mt-2 text-xs text-gray-500">
        {providers.length === 1
          ? (plottable.length === 1 ? "Location shown" : "Location not mapped")
          : <>{plottable.length} of {providers.length} shown</>}
        {omitted > 0 && (
          <> · {omitted} hidden — only an approximate (ZIP-level) location is known</>
        )}
      </p>
    </div>
  );
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, c => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
}
