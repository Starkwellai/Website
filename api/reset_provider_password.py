#!/usr/bin/env python3
"""
Reset a practice's password by hand. There is no automatic "forgot password"
email yet (the site can't send email), so when someone writes in, run this on
the droplet:

    python3 /root/starkwell/api/reset_provider_password.py someone@practice.com

It asks for the new password twice (nothing is echoed or logged), stores a fresh
salted PBKDF2 hash, and signs the account out everywhere by deleting its
sessions. Tell the practice the new password over a channel you trust and ask
them to change it. Standard library only, so it runs on the host without the
app's dependencies.

The hashing here must match api/serving_api.py (_hash_password and
PASSWORD_HASH_ITERATIONS); api/test_reset_provider_password.py checks that.
"""
import argparse
import getpass
import hashlib
import secrets
import sqlite3
import sys

PASSWORD_HASH_ITERATIONS = 260_000
DEFAULT_DB = "/root/starkwell-data/provider_accounts.db"


def hash_password(password: str, salt: str | None = None) -> tuple[str, str]:
    salt = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), PASSWORD_HASH_ITERATIONS)
    return digest.hex(), salt


def reset_password(db_path: str, email: str, new_password: str) -> int:
    """Returns the account id. Raises LookupError if there is no such account."""
    if len(new_password) < 8:
        raise ValueError("password must be at least 8 characters")
    con = sqlite3.connect(db_path)
    try:
        row = con.execute("SELECT id FROM provider_accounts WHERE email = ?", (email.strip().lower(),)).fetchone()
        if row is None:
            raise LookupError(f"no account with email {email!r}")
        pw_hash, salt = hash_password(new_password)
        con.execute("UPDATE provider_accounts SET password_hash = ?, password_salt = ? WHERE id = ?",
                    (pw_hash, salt, row[0]))
        con.execute("DELETE FROM provider_sessions WHERE provider_id = ?", (row[0],))
        con.commit()
        return row[0]
    finally:
        con.close()


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("email")
    ap.add_argument("--db", default=DEFAULT_DB)
    args = ap.parse_args()
    first = getpass.getpass("New password (8+ characters): ")
    if first != getpass.getpass("Again: "):
        print("The two entries don't match; nothing changed.", file=sys.stderr)
        return 1
    try:
        account_id = reset_password(args.db, args.email, first)
    except (LookupError, ValueError) as e:
        print(f"Nothing changed: {e}", file=sys.stderr)
        return 1
    print(f"Password reset for account {account_id}; it has been signed out everywhere.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
