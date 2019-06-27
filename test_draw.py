import unittest
import draw
import main

class TestDraw(unittest.TestCase):
    
    def test_return_value(self):
        n = draw.Draw()
        self.assertEqual(n.my_function(), "hejsan")


class test_convertor(unittest.TestCase):

    def test_convertor_to_dict(self):
        # Arrange
        n = main.DrawReceiver()
        startLength = len(n.getLines())
        info = {"color" : 'black', "strokeWidth" : 5, 'positions' : [5,6]}
        n.addLine(info)
        addedLength = startLength + 1
        listOfLines = n.getLines()
        lastEntry = len(listOfLines)-1

        # Act
        postAddlines = len(n.getLines())

        # Assert
        self.assertEqual(postAddlines, addedLength)
        self.assertEqual(listOfLines[lastEntry], info)


if __name__ == '__main__':
    unittest.main()