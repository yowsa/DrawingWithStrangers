import unittest
import draw

class TestDraw(unittest.TestCase):
    
    def test_return_value(self):
        n = draw.Draw()
        self.assertEqual(n.my_function(), "hejsan")


if __name__ == '__main__':
    unittest.main()