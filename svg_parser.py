import xml.etree.ElementTree as ET
import sys

def parse(svgFilename):
  svgTree = ET.parse(svgFilename)
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
  for i in range(2,len(svgRoot[0])):
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
  floors = list(reversed(floors))
  for i in range(len(floors)):
    print(floors[i], ",")
if __name__ == "__main__":
    parse(sys.argv[1])


