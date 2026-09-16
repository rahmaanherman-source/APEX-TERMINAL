import unittest

from catalog_mapper import chunk_rows


class BulkTests(unittest.TestCase):
    def test_ten_thousand_rows_are_chunkable_without_loss(self):
        rows = [{"sku": f"SKU-{i}", "title": f"Product {i}"} for i in range(10000)]
        chunks = chunk_rows(rows, 50_000)
        self.assertGreater(len(chunks), 1)
        self.assertEqual(sum(len(chunk) for chunk in chunks), 10000)
        self.assertEqual(chunks[0][0]["sku"], "SKU-0")
        self.assertEqual(chunks[-1][-1]["sku"], "SKU-9999")


if __name__ == "__main__":
    unittest.main()
