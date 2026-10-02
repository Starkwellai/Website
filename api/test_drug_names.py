"""Pins friendly_dosage_form's behavior. It needed three fixes in one session
(decimal underscores, name duplication on 59% of drug names, combo-strength
separators) with nothing guarding any of them. Pure function, no server:

    python api/test_drug_names.py      (or: pytest api/test_drug_names.py)
"""
from drug_names import friendly_dosage_form as f


def test_simple():
    assert f("atorvastatin-10mg-tablet", "Atorvastatin") == "Atorvastatin 10 MG Tablet"
    assert f("atorvastatin-10mg-tablet", "Atorvastatin", include_name=False) == "10 MG Tablet"


def test_decimal_underscore_is_a_point():
    assert f("lisinopril-2_5mg-tablet", "Lisinopril") == "Lisinopril 2.5 MG Tablet"


def test_combo_name_slug_runs_words_together():
    assert f("lisinoprilhctz-10mg_12_5mg-tablet", "Lisinopril / HCTZ") == \
        "Lisinopril / HCTZ 10 MG 12.5 MG Tablet"


def test_combo_name_slug_keeps_dashes_no_doubled_name():
    got = f("amlodipine-atorvastatin-10-10mg-tablet-caduet", "Amlodipine-Atorvastatin")
    assert got == "Amlodipine-Atorvastatin 10/10 MG Tablet Caduet"
    assert got.count("Amlodipine") == 1


def test_shared_unit_gets_a_slash_but_paired_units_do_not():
    assert f("x-2_5-10mg-tablet", "X", include_name=False) == "2.5/10 MG Tablet"
    assert f("x-10mg_12_5mg-tablet", "X", include_name=False) == "10 MG 12.5 MG Tablet"


def test_unrelated_slug_returns_cleaned_slug_only():
    # Slug isn't a prefix-match for the name: don't glue two descriptions together.
    got = f("accu-chek-guide-me-care-kit", "Accu-Chek Guide Me Meter for Diabetic Blood Glucose Testing")
    assert got == "Accu Chek Guide Me Care Kit"


if __name__ == "__main__":
    for name, fn in list(globals().items()):
        if name.startswith("test_"):
            fn()
            print("ok", name)
