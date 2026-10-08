import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { MapPin, Plus, X } from "lucide-react";
import {
  searchMyFacility, claimListing, getMyListings, updateListingDescription, unclaimListing,
  type FacilityMatch, type ClaimedListing,
} from "../../lib/starkwell";

/**
 * Real feature, not a placeholder: every location is already free and
 * searchable on Starkwell (see facility_rows in api/serving_api.py) — this
 * is what lets a signed-in provider take ownership of theirs and add a real
 * description, so a patient who found them on price sees more than a bare
 * address. Search is by street address, not clinic name, because
 * facility_key is derived from (address, city) and almost no real location
 * has a name on file in the underlying CMS data (see the search endpoint's
 * own docstring) — the provider supplies their real practice name at claim
 * time instead.
 */
export function ProviderListingsCard() {
  const [listings, setListings] = useState<ClaimedListing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<FacilityMatch[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [claimingFacility, setClaimingFacility] = useState<FacilityMatch | null>(null);
  const [claimLabel, setClaimLabel] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const loadListings = async () => {
    setLoadingListings(true);
    try {
      setListings(await getMyListings());
    } catch {
      // best effort on load — leave whatever was already there
    } finally {
      setLoadingListings(false);
    }
  };

  useEffect(() => {
    void loadListings();
  }, []);

  async function runSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim().length < 3) return;
    setSearching(true);
    setSearchError(null);
    setSearchResults([]);
    try {
      setSearchResults(await searchMyFacility(searchQuery));
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Search failed — try again.");
    } finally {
      setSearching(false);
      setHasSearched(true);
    }
  }

  function closeSearch() {
    setShowSearch(false);
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
    setClaimingFacility(null);
    setClaimError(null);
  }

  async function confirmClaim() {
    if (!claimingFacility || !claimLabel.trim()) return;
    setClaiming(true);
    setClaimError(null);
    try {
      await claimListing(claimingFacility, claimLabel.trim());
      closeSearch();
      await loadListings();
    } catch (err) {
      setClaimError(err instanceof Error ? err.message : "Couldn't claim that listing — try again.");
    } finally {
      setClaiming(false);
    }
  }

  function startEdit(listing: ClaimedListing) {
    setEditingKey(listing.facility_key);
    setEditDraft(listing.description ?? "");
  }

  async function saveEdit(facilityKey: string) {
    setSaving(true);
    try {
      await updateListingDescription(facilityKey, editDraft.trim());
      setEditingKey(null);
      await loadListings();
    } catch {
      // leave the editor open on failure so nothing typed is lost
    } finally {
      setSaving(false);
    }
  }

  async function remove(facilityKey: string) {
    await unclaimListing(facilityKey).catch(() => {});
    await loadListings();
  }

  return (
    <Card className="border-teal-200">
      <CardHeader>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-5 text-teal-600" />
              My Listings
            </CardTitle>
            <CardDescription>
              Claim your real location so patients who find you on price can see who you are.
              We review each claim before it appears publicly.
            </CardDescription>
          </div>
          {!showSearch && (
            <Button size="sm" onClick={() => setShowSearch(true)} className="bg-teal-600 hover:bg-teal-700">
              <Plus className="mr-1 size-4" />
              Claim a listing
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showSearch && (
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 space-y-3">
            <form onSubmit={runSearch} className="flex gap-2">
              <Input
                placeholder="Your clinic's street address"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setHasSearched(false); }}
                autoFocus
              />
              <Button type="submit" disabled={searching || searchQuery.trim().length < 3} size="sm">
                {searching ? "Searching…" : "Search"}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={closeSearch} aria-label="Close">
                <X className="size-4" />
              </Button>
            </form>
            <p className="text-xs text-gray-500">
              Search by your real street address — that's how we match you to your actual pricing data.
            </p>
            {searchError && <p className="text-sm text-red-700" role="alert">{searchError}</p>}

            {searchResults.length > 0 && !claimingFacility && (
              <div className="space-y-1 max-h-56 overflow-y-auto">
                {searchResults.map((f) => (
                  <button
                    key={f.facility_key}
                    type="button"
                    onClick={() => { setClaimingFacility(f); setClaimLabel(""); setClaimError(null); }}
                    className="w-full text-left text-sm px-3 py-2 rounded-md bg-white border border-gray-200 hover:border-teal-400 hover:bg-teal-50"
                  >
                    {f.address}, {f.city}
                  </button>
                ))}
              </div>
            )}
            {hasSearched && !searching && searchResults.length === 0 && !searchError && (
              <p className="text-sm text-gray-500">
                No matches — try less of the address, like just the street number and name.
              </p>
            )}

            {claimingFacility && (
              <div className="bg-white border border-teal-300 rounded-lg p-3 space-y-2">
                <p className="text-sm text-gray-700">
                  Claiming <strong>{claimingFacility.address}, {claimingFacility.city}</strong>
                </p>
                <Input
                  placeholder="Your practice's real name, e.g. Downtown Family Medicine"
                  value={claimLabel}
                  onChange={(e) => setClaimLabel(e.target.value)}
                  autoFocus
                />
                {claimError && <p className="text-sm text-red-700" role="alert">{claimError}</p>}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={confirmClaim}
                    disabled={claiming || !claimLabel.trim()}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    {claiming ? "Claiming…" : "Confirm — this is my clinic"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setClaimingFacility(null)}>
                    Back
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {loadingListings ? (
          <p className="text-sm text-gray-500">Loading your listings…</p>
        ) : listings.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-600">
            You haven't claimed a listing yet. Patients can already find your real prices —
            claiming your listing lets you add a real description so they know who you are.
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map((l) => (
              <div key={l.facility_key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{l.facility_label}</p>
                    <p className="text-xs text-gray-500">{l.address}, {l.city}</p>
                    <div className="mt-1.5">
                      {l.status === "approved" ? (
                        <Badge variant="outline" className="border-green-600 text-green-700 bg-green-50">Approved — shown publicly</Badge>
                      ) : l.status === "rejected" ? (
                        <Badge variant="outline" className="border-red-300 text-red-700 bg-red-50">Not approved</Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-300 text-amber-800 bg-amber-50">Waiting for review — not public yet</Badge>
                      )}
                    </div>
                    {l.status === "rejected" && (
                      <p className="text-xs text-gray-600 mt-1">
                        {l.review_note ? `Note from Starkwell: ${l.review_note}` : "We couldn't confirm this claim."}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => remove(l.facility_key)}
                  >
                    Remove
                  </Button>
                </div>

                {editingKey === l.facility_key ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editDraft}
                      onChange={(e) => setEditDraft(e.target.value)}
                      maxLength={1000}
                      rows={3}
                      placeholder="Tell patients who you are — what you treat, what makes your clinic worth choosing."
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => saveEdit(l.facility_key)}
                        disabled={saving}
                        className="bg-teal-600 hover:bg-teal-700"
                      >
                        {saving ? "Saving…" : "Save"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingKey(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {l.description ? (
                      <p className="text-sm text-gray-700 mb-2">{l.description}</p>
                    ) : (
                      <p className="text-sm text-gray-400 italic mb-2">
                        No description yet — patients only see your address until you add one.
                      </p>
                    )}
                    <Button variant="outline" size="sm" onClick={() => startEdit(l)}>
                      {l.description ? "Edit description" : "Add a description"}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
