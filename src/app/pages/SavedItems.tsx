import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Bookmark, ExternalLink, MapPin, Search, X } from "lucide-react";
import { SiteNav } from "../components/SiteNav";
import logo from "../../assets/b2725744d7bb552f20e2a7bcebca16e19b4a014d.png";
import {
  getSavedServices, getSavedFacilities, removeSavedService, removeSavedFacility,
  type SavedService, type SavedFacility,
} from "../../lib/savedItems";

/**
 * Everything on this page comes from the visitor's own browser storage, not
 * a Starkwell account — there's nothing to log in to, and nothing here syncs
 * to another device. See src/lib/savedItems.ts for why that's the deliberate
 * trade-off for now.
 */
export function SavedItems() {
  const navigate = useNavigate();
  const [services, setServices] = useState<SavedService[]>([]);
  const [facilities, setFacilities] = useState<SavedFacility[]>([]);

  useEffect(() => {
    setServices(getSavedServices());
    setFacilities(getSavedFacilities());
  }, []);

  function removeService(key: string) {
    removeSavedService(key);
    setServices(getSavedServices());
  }

  function removeFacility(key: string) {
    removeSavedFacility(key);
    setFacilities(getSavedFacilities());
  }

  const isEmpty = services.length === 0 && facilities.length === 0;

  return (
    <div className="min-h-screen bg-white">
      <header className="relative bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <img
              src={logo}
              alt="Starkwell"
              className="h-9 md:h-12 cursor-pointer rounded-[5px]"
              onClick={() => navigate("/")}
            />
            <SiteNav />
          </div>
        </div>
      </header>

      <section className="bg-[#0f1f3d] text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Saved</h1>
            <p className="text-lg text-blue-100">
              Procedures and locations you've bookmarked, kept right here in this browser —
              no account needed.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto space-y-12">

            {isEmpty && (
              <div className="text-center py-8">
                <Bookmark className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-6">
                  Nothing saved yet. Look up a procedure and tap the bookmark icon on a
                  result, or on a specific location, to keep it here.
                </p>
                <Button onClick={() => navigate("/prices")} className="bg-blue-600 hover:bg-blue-700">
                  <Search className="mr-2 h-4 w-4" />
                  Compare prices
                </Button>
              </div>
            )}

            {services.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Saved procedures</h2>
                <div className="space-y-3">
                  {services.map(s => (
                    <Card key={s.service_key}>
                      <CardContent className="p-4 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => navigate(`/prices?q=${encodeURIComponent(s.display_name)}`)}
                          className="text-left min-w-0 flex-1"
                        >
                          <p className="font-medium text-gray-900 truncate">{s.display_name}</p>
                          <p className="text-sm text-gray-500">{s.category}</p>
                        </button>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/prices?q=${encodeURIComponent(s.display_name)}`)}
                          >
                            See prices
                          </Button>
                          <button
                            type="button"
                            onClick={() => removeService(s.service_key)}
                            aria-label={`Remove ${s.display_name} from saved`}
                            className="p-1.5 text-gray-400 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {facilities.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Saved locations</h2>
                <div className="space-y-3">
                  {facilities.map(f => (
                    <Card key={f.facility_key}>
                      <CardContent className="p-4 flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate">{f.label}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3 shrink-0" />
                            {f.address}, {f.city}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${f.label} ${f.address} ${f.city} UT`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline whitespace-nowrap"
                          >
                            Map
                            <ExternalLink className="h-3 w-3" />
                          </a>
                          <button
                            type="button"
                            onClick={() => removeFacility(f.facility_key)}
                            aria-label={`Remove ${f.label} from saved`}
                            className="p-1.5 text-gray-400 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </section>
    </div>
  );
}
