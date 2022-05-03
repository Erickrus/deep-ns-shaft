# DEEP-NS-SHAFT
This is an imitation of the [NS-SHAFT](https://en.wikipedia.org/wiki/NS-Shaft) game, which also named as "是男人就下一百层" or "小朋友下楼梯". 

It is slightly **modified**, and it is able to import a tfjs neural network using [tfjs_model_visualizer](https://github.com/Erickrus/tfjs_model_visualizer). In this way, the game will be able to generate floors based on the layers in the neural network definition.

You can download the repo and play it, have fun!

![deep-ns-shaft icon](https://github.com/Erickrus/deep-ns-shaft/blob/master/icon.png?raw=true)


## Screenshot
[![deep-ns-shaft screenshot](https://github.com/Erickrus/deep-ns-shaft/blob/master/facemesh.png?raw=true)](https://twitter.com/hyinghao_t/status/1521182965359083521 "Demo Video")


## Generate Deep Floors
* **Dependencies** 
  - Assume: `node`, `graphviz` and `python3` have already been installed, and you also need download this repo [tfjs_model_visualizer](https://github.com/Erickrus/tfjs_model_visualizer) where you can get `model_visualizer.ts`. 
 
* **Command** 
  - Type following line in console. Note, model.json could only take relative path (e.g. facemesh/model.json ), dont try to put any absolute path.
  - ```shell
    node model_visualizer.ts model.json | dot -Tsvg | python3 svg_parser.py > deep_floor.js
    ```


* **Copy** 
  - Then, copy/move `deep_floor.js` (newly generated) into deep-ns-shaft folder (replace the previous one), and now you're ready. 
  - There're some generated deep_floor.js files in the `floors` folder, you can pick and replace with the current `deep_floor.js`.

## How to play
* **go left**: press the left half of the screen (for touch screen device), or press the <kbd>&larr;</kbd> key (for keyboard or joystick)

* **go right**: press the right half of the screen, or press the <kbd>&rarr;</kbd> key

* **start/resume game**: press the <kbd>play again</kbd> / <kbd>continue</kbd> button on screen, or press the <kbd>Space</kbd> / <kbd>Ok</kbd> key

* **life**: hitting spikes on the top or on a floor reduces the player's life, landing on a floor (without spikes) increases the player's life

* **game over**: falling off the bottom or running out of life

* **finished**: landing on the final `Identity` layer(s) or floor(s)
