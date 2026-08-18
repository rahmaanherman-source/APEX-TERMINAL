import unittest

from core.comparator import compare_system_status, verify_state


class ComparatorTests(unittest.TestCase):
    def test_exact_scalar_passes(self):
        result = verify_state(1.0, 1.0, epsilon=0.0)
        self.assertEqual(result.status, "PASS")
        self.assertEqual(result.delta, 0.0)

    def test_scalar_failure_with_zero_epsilon(self):
        result = verify_state(0.5, 0.3, epsilon=0.0)
        self.assertEqual(result.status, "FAIL_THRESHOLD_EXCEEDED")
        self.assertAlmostEqual(result.delta, 0.2)

    def test_system_status_verified(self):
        actual = {
            "status": "SOVEREIGN_ONLINE",
            "uptime": 120.55,
            "version": "3.0.OMEGA",
            "timestamp": "2026-08-18T12:00:00+00:00",
            "health_ok": True,
            "latency_ms": 412,
        }
        result = compare_system_status(actual, actual, epsilon=0.0)
        self.assertEqual(result["status"], "VERIFIED")
        self.assertEqual(result["delta"], 0.0)

    def test_missing_field_is_malformed_evidence(self):
        actual = {
            "status": "SOVEREIGN_ONLINE",
            "uptime": 120.55,
            "version": "3.0.OMEGA",
            "health_ok": True,
            "latency_ms": 412,
        }
        result = compare_system_status(actual, actual, epsilon=0.0)
        self.assertEqual(result["status"], "MALFORMED_EVIDENCE")

    def test_health_failure_cannot_be_green(self):
        actual = {
            "status": "SOVEREIGN_ONLINE",
            "uptime": 120.55,
            "version": "3.0.OMEGA",
            "timestamp": "2026-08-18T12:00:00+00:00",
            "health_ok": False,
            "latency_ms": 412,
        }
        result = compare_system_status(actual, actual, epsilon=0.0)
        self.assertEqual(result["status"], "FAILED")
        self.assertGreater(result["delta"], 0.0)


if __name__ == "__main__":
    unittest.main()
