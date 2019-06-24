import unittest
import draw
import main

class TestDraw(unittest.TestCase):
    
    def test_return_value(self):
        n = draw.Draw()
        self.assertEqual(n.my_function(), "hejsan")


if __name__ == '__main__':
    unittest.main()


class test_convertor(unittest.TestCase):

    def test_convertor_to_dict(self):
        # Arrange
        n = main.DrawReceiever()
        n.addLine(x, y)

        # Act
        lines = n.getLines()

        # Assert
        self.assertEqual(lines, {lines: [], color: []})
