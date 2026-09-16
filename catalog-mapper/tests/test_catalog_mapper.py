import unittest

from catalog_mapper import (
    build_package,
    canonicalize,
    chunk_rows,
    generate_csv,
    infer_mapping,
    read_delimited,
    validate_records,
)


class CatalogMapperTests(unittest.TestCase):
    def test_read_and_semantic_mapping(self):
        rows = read_delimited("Product Name,SKU,Wholesale Price,Stock,Color,Size,Image URL\nTee,S-1,10,4,Black,L,https://example.com/a.jpg\n")
        mapping = infer_mapping(list(rows[0]), ["title", "sku", "cost", "inventory", "color", "size", "image_url"])
        self.assertEqual(mapping["title"], "Product Name")
        self.assertEqual(mapping["cost"], "Wholesale Price")
        canonical = canonicalize(rows, mapping)
        self.assertEqual(canonical[0]["images"], ["https://example.com/a.jpg"])

    def test_duplicate_sku_and_required_fields_fail(self):
        records = [{"sku": "A", "title": "x", "images": []}, {"sku": "A", "title": "x", "images": []}]
        result = validate_records(records, ["sku", "title", "images"])
        self.assertFalse(result["ok"])
        reasons = {p["reason"] for p in result["problems"]}
        self.assertIn("duplicate SKU", reasons)
        self.assertIn("required value missing", reasons)

    def test_variant_fields_are_not_invented(self):
        rows = [{"SKU": "A", "Color": "Mustard", "Size": "2XL"}]
        mapping = infer_mapping(list(rows[0]), ["sku", "color", "size", "title"])
        canonical = canonicalize(rows, mapping)
        self.assertEqual(canonical[0]["size"], "2XL")
        self.assertEqual(canonical[0]["color"], "Mustard")
        self.assertEqual(canonical[0]["title"], "")

    def test_chunking(self):
        rows = [{"sku": str(i), "title": "x" * 30} for i in range(100)]
        chunks = chunk_rows(rows, 500)
        self.assertGreater(len(chunks), 1)
        self.assertEqual(sum(len(c) for c in chunks), 100)

    def test_build_package_can_verify_valid_catalog(self):
        destination = {"headers": ["title", "sku", "price", "images"], "required": ["title", "sku", "price"]}
        rows = [{"Title": "Bottle", "SKU": "B1", "Price": "20", "Image URL": "https://example.com/b.jpg"}]
        package = build_package(rows, destination)
        self.assertEqual(package["state"], "VERIFIED")
        self.assertIn("B1", package["generated_csv"])
        self.assertEqual(package["counts"]["products"], 1)


if __name__ == "__main__":
    unittest.main()
