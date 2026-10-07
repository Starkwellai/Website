"""
Tests for api/reset_provider_password.py. Run: python -m pytest api/ (or run this file directly).

The important one is the parity check: if serving_api.py ever changes how it hashes
passwords, the reset tool must change with it, or a reset would produce a password
the login endpoint rejects.
"""
import hashlib
import re
import sqlite3
import tempfile
from pathlib import Path

import reset_provider_password as rpp

API = Path(__file__).parent


def _make_db():
    path = str(Path(tempfile.mkdtemp()) / "accounts.db")
    con = sqlite3.connect(path)
    con.execute("""CREATE TABLE provider_accounts (id INTEGER PRIMARY KEY AUTOINCREMENT, practice_name TEXT,
        contact_name TEXT, email TEXT UNIQUE, password_hash TEXT, password_salt TEXT, created_at TEXT)""")
    con.execute("""CREATE TABLE provider_sessions (token TEXT PRIMARY KEY, provider_id INTEGER,
        created_at TEXT, expires_at TEXT)""")
    con.execute("INSERT INTO provider_accounts (practice_name, contact_name, email, created_at) "
                "VALUES ('P', 'C', 'a@b.com', 'x')")
    con.execute("INSERT INTO provider_sessions VALUES ('tok', 1, 'x', 'y')")
    con.commit()
    con.close()
    return path


def test_hash_parameters_match_the_server():
    src = (API / "serving_api.py").read_text(encoding="utf-8")
    iters = int(re.search(r"PASSWORD_HASH_ITERATIONS\s*=\s*([\d_]+)", src).group(1).replace("_", ""))
    assert iters == rpp.PASSWORD_HASH_ITERATIONS
    assert 'hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt)' in src


def test_reset_sets_a_verifiable_hash_and_signs_out():
    db = _make_db()
    assert rpp.reset_password(db, "A@B.com ", "correct horse") == 1   # email is trimmed and case-insensitive
    con = sqlite3.connect(db)
    h, salt = con.execute("SELECT password_hash, password_salt FROM provider_accounts").fetchone()
    assert hashlib.pbkdf2_hmac("sha256", b"correct horse", bytes.fromhex(salt), rpp.PASSWORD_HASH_ITERATIONS).hex() == h
    assert con.execute("SELECT count(*) FROM provider_sessions").fetchone()[0] == 0


def test_unknown_email_and_short_password_change_nothing():
    db = _make_db()
    try:
        rpp.reset_password(db, "nobody@x.com", "long enough")
        assert False, "expected LookupError"
    except LookupError:
        pass
    try:
        rpp.reset_password(db, "a@b.com", "short")
        assert False, "expected ValueError"
    except ValueError:
        pass
    con = sqlite3.connect(db)
    assert con.execute("SELECT password_hash FROM provider_accounts").fetchone()[0] is None
    assert con.execute("SELECT count(*) FROM provider_sessions").fetchone()[0] == 1


if __name__ == "__main__":
    for name, fn in list(globals().items()):
        if name.startswith("test_"):
            fn()
            print("ok", name)
