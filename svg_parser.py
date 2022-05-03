# -*- coding: utf-8 -*-

import json
import sys
import xml.etree.ElementTree as ET

def parse(xmlString):
  svgTree = ET.ElementTree(ET.fromstring(xmlString))
  svgRoot = svgTree.getroot()

  width = float(svgRoot.attrib['width'].replace('pt',''))
  height = float(svgRoot.attrib['height'].replace('pt',''))

  namedColors = {
    "peru": "#cd853f",
    "papayawhip": "#ffefd5",
    "snow2": "#eee9e9",
    "seagreen1": "#54ff9f",
    "lightcyan2": "#d1eeee",
    "lightskyblue1": "#b0e2ff",
    "lightskyblue2": "#a4d3ee",
  }

  floors = []
  for i in range(2, len(svgRoot[0])): # skip the first 2 nodes
    node = svgRoot[0][i]
    if node.attrib['class'] == 'node':
        polygonElm = node[1]
        textElm = node[2]
        rect = polygonElm.attrib['points'].split(' ')[0:3]
        del rect[1]
        rect = ",".join(rect).split(',')
        rect = [float(r) for r in rect]
        rect[1] += height
        rect[3] += height
        rect = [round(r / width * 360.,0) for r in rect]
        text = textElm.text
        color = polygonElm.attrib['fill']
        if color in namedColors:
            color = namedColors[color]
        
        floors.append({"rect":rect, "text":text, "color":color})

  # as in the application use pop() to retrieve the data
  # reverse the order here
  floors = list(reversed(floors))

  # generate and output deep_floor.js
  result = "var deepFloors = \n"+json.dumps(floors, indent=2)+";\n"
  result += "\nvar currDeepFloors = [];\n"
  print(result)


if __name__ == "__main__":
    # take stdin or take svg filename from command line
    # directly output result to stdout
    lines = ""
    if len(sys.argv) == 1:
        for line in sys.stdin:
            lines += line + "\n"
    else:
        with open(sys.argv[1], "r") as f:
            lines = f.read()
    parse(lines)


