import json
import threading
import unittest
from http.client import HTTPConnection

from server import Handler
from http.server import ThreadingHTTPServer


class ServerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.httpd = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        cls.thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.thread.start()
        cls.port = cls.httpd.server_address[1]

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()

    def request(self, method, path, body=None):
        conn = HTTPConnection("127.0.0.1", self.port, timeout=5)
        headers = {"Content-Type": "application/json"} if body is not None else {}
        encoded = json.dumps(body).encode() if body is not None else None
        conn.request(method, path, encoded, headers)
        response = conn.getresponse()
        data = response.read()
        conn.close()
        return response.status, json.loads(data.decode()) if data else None

    def test_destinations_endpoint(self):
        status, data = self.request("GET", "/api/destinations")
        self.assertEqual(status, 200)
        ids = {item["id"] for item in data}
        self.assertIn("shopify-csv", ids)
        self.assertIn("amazon-template", ids)

    def test_map_endpoint(self):
        status, data = self.request("POST", "/api/map", {
            "destination_id": "generic-csv",
            "source_csv": "Product Name,SKU,Price\nBottle,B1,20\n",
        })
        self.assertEqual(status, 200)
        self.assertEqual(data["state"], "VERIFIED")
        self.assertEqual(data["counts"]["products"], 1)
        self.assertIn("B1", data["generated_csv"])


if __name__ == "__main__":
    unittest.main()
