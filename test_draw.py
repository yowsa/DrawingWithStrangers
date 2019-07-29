# -*- coding: utf-8 -*-
import unittest
import draw
import main

class TestDraw(unittest.TestCase):
    
    def test_return_value(self):
        n = draw.Draw()
        self.assertEqual(n.my_function(), "hejsan")




"""

klass som testar js linje till backend
1 superenklet test, kalla addlines med enjle linje en gang och kolla sa det blir ratt
2 en lång linje där positioner läggs till
3 flera linjer, där positioner läggs till



"""

class test_convertor(unittest.TestCase):


    def test_line_reciever_get_lines(self):
        lineReciever = main.LineReceiver()
        self.assertEqual(lineReciever.getLines(), [])


    def test_line_reciever_add_lines_one_line(self):
        # Arrange
        lineReciever = main.LineReceiver()
        info = {"lineNo" : 0.14659992255522303, "strokeStyle" : 'black', "lineWidth" : 5, 'positions' : [5,6]}
        
        # Act
        lineReciever.addLine(info)

        # Assert
        self.assertEqual(lineReciever.getLines(), [info])

    def test_line_reciever_add_lines_multiple_positions(self):
        lineReciever = main.LineReceiver()
        info = {"lineNo" : 0.14659992255522303, "strokeStyle" : 'black', "lineWidth" : 5, 'positions' : [5,6,600,344]}
        updatedInfo1 = {"lineNo" : 0.14659992255522303, "strokeStyle" : 'black', "lineWidth" : 5, 'positions' : [5,6,600,344, 53, 233]}
        updatedInfo2 = {"lineNo" : 0.14659992255522303, "strokeStyle" : 'black', "lineWidth" : 5, 'positions' : [5,6,600,344, 53, 233, 455, 22]}

        lineReciever.addLine(info)
        self.assertEqual(lineReciever.getLines(), [info])

        lineReciever.addLine(updatedInfo1)
        self.assertEqual(lineReciever.getLines(), [updatedInfo1])

        lineReciever.addLine(updatedInfo2)
        self.assertEqual(lineReciever.getLines(), [updatedInfo2])


    def test_line_reciever_add_lines_multiple_lines_multiple_positions(self):
        lineReciever = main.LineReceiver()
        line1_1 = {"lineNo" : 0.14659992255522303, "strokeStyle" : 'black', "lineWidth" : 5, 'positions' : [5,6,600,344]}
        line1_2 = {"lineNo" : 0.14659992255522303, "strokeStyle" : 'black', "lineWidth" : 5, 'positions' : [5,6,600,344, 53, 233]}
        line1_3 = {"lineNo" : 0.14659992255522303, "strokeStyle" : 'black', "lineWidth" : 5, 'positions' : [5,6,600,344, 53, 233, 455, 22]}    
        line2_1 = {"lineNo" : 0.5659992255522303, "strokeStyle" : 'yellow', "lineWidth" : 5, 'positions' : [500,436,600,344]}
        line2_2 = {"lineNo" : 0.5659992255522303, "strokeStyle" : 'yellow', "lineWidth" : 5, 'positions' : [500,436,600,344, 53, 233]}
        line2_3 = {"lineNo" : 0.5659992255522303, "strokeStyle" : 'yellow', "lineWidth" : 5, 'positions' : [500,436,600,344, 53, 233, 455, 22, 544, 633]}      
        line3_1 = {"lineNo" : 0.2659992255522303, "strokeStyle" : 'black', "lineWidth" : 15, 'positions' : [23,436,600,344, 12, 14]}
        line3_2 = {"lineNo" : 0.2659992255522303, "strokeStyle" : 'black', "lineWidth" : 15, 'positions' : [23,436,600,344, 12, 14, 53, 233]}
        line3_3 = {"lineNo" : 0.2659992255522303, "strokeStyle" : 'black', "lineWidth" : 15, 'positions' : [23,436,600,344, 12, 14, 53, 233, 455, 22, 544, 633]}  

        lineReciever.addLine(line1_1)
        lineReciever.addLine(line1_2)
        lineReciever.addLine(line1_3)
        self.assertEqual(lineReciever.getLines(), [line1_3])

        lineReciever.addLine(line2_1)
        lineReciever.addLine(line2_2)
        lineReciever.addLine(line2_3)
        self.assertEqual(lineReciever.getLines(), [line1_3, line2_3])

        lineReciever.addLine(line3_1)
        lineReciever.addLine(line3_2)
        lineReciever.addLine(line3_3)
        self.assertEqual(lineReciever.getLines(), [line1_3, line2_3, line3_3])


    def test_change_white_balance(self):
        lineReciever = main.LineReceiver()
        self.assertEqual(lineReciever.updateWhiteBalance(200, 255, 0.8), 211)
        self.assertEqual(lineReciever.updateWhiteBalance(100, 255, 0.8), 131)
        self.assertEqual(lineReciever.updateWhiteBalance(50, 255, 0.8), 91)
        self.assertEqual(lineReciever.updateWhiteBalance(200, 255, 0.5), 228)

    def test_update_visibility(self):
        lineReciever = main.LineReceiver()
        lineReciever.drawnLinesData = [{"lineNo" : 0.14659992255522303, "strokeStyle" : {"r": 200, "g": 100, "b": 50, "a": 1}, "lineWidth" : 5, 'positions' : [5,6,600,344]}, {"lineNo" : 0.14659992255522303, "strokeStyle" : {"r": 50, "g": 200, "b": 100, "a": 1}, "lineWidth" : 5, 'positions' : [5,6,600,344]}]
        lineReciever.updateVisibility()
        self.assertEqual(lineReciever.drawnLinesData[0]["strokeStyle"]["r"], 201)
        self.assertEqual(lineReciever.drawnLinesData[0]["strokeStyle"]["g"], 104)
        self.assertEqual(lineReciever.drawnLinesData[0]["strokeStyle"]["b"], 55)






if __name__ == '__main__':
    unittest.main()