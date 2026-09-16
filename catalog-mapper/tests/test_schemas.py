import json
import unittest
from pathlib import Path


class SchemaTests(unittest.TestCase):
    def test_schema_pack_integrity(self):
        path = Path(__file__).parents[1] / "schemas" / "destinations.json"
        data = json.loads(path.read_text(encoding="utf-8"))
        destinations = data["destinations"]
        ids = [d["id"] for d in destinations]
        self.assertEqual(len(ids), len(set(ids)))
        for destination in destinations:
            if not destination.get("template_required"):
                self.assertTrue(destination["headers"])
                for field in destination.get("required", []):
                    self.assertIn(field, destination["headers"])
            else:
                self.assertTrue(destination.get("template_required"))


if __name__ == "__main__":
    unittest.main()
