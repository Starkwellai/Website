import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))


def test_prune_jsonl_drops_only_old_lines(tmp_path):
    from serving_api import prune_jsonl

    f = tmp_path / "log.jsonl"
    f.write_text("\n".join([
        json.dumps({"ts": "2025-01-01T00:00:00+00:00", "query": "old"}),
        json.dumps({"ts": "2026-10-01T00:00:00+00:00", "query": "new"}),
        "not json at all",
        json.dumps({"query": "no timestamp"}),
    ]) + "\n", encoding="utf-8")

    removed = prune_jsonl(f, "2025-10-11T00:00:00+00:00")

    assert removed == 1
    left = f.read_text(encoding="utf-8")
    assert "old" not in left
    assert "new" in left and "not json at all" in left and "no timestamp" in left


def test_prune_jsonl_missing_file_is_a_noop(tmp_path):
    from serving_api import prune_jsonl

    assert prune_jsonl(tmp_path / "nope.jsonl", "2030-01-01T00:00:00+00:00") == 0
