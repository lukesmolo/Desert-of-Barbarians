# Desert of Barbarians


Desert of Barbarians is a funny meta-Javascript game set in the [The Tartar Steppe](https://en.wikipedia.org/wiki/The_Tartar_Steppe) world, inspired by the classic [Missile Command](https://en.wikipedia.org/wiki/Missile_Command) game.

You are a young recruit with the goal to defense your castle from Barbarians
attacks. The more you improve your defenses, the more you have chance to
survive.

## Overview
The game presents a board for playing the game and a board for writing your
code. You are welcome to follow suggestions and hints from the chat box on the right.

## Goal
Try to finish all the game for getting your final score. You can try to improve
it as many times as you want!




## Usage
Just go to [Desert of Barbarians](http://annina.cs.unibo.it:8000) and insert
your username for playing.

## Local Usage
For the local usage you just need to install [NodeJs](http://nodejs.org/en/).
Then:

Clone the repository:
```
$ git clone --recursive git@github.com:lukesmolo/Desert-of-Barbarians.git
```

Launch the server from the game directory:
```
$ nodejs server.js
```

Open a browser to [127.0.0.1:8000](http://127.0.0.1:8000) and play the game!

## Contributing
We would be very glad if you want to contribute to improving this project.
Please fork it and submit a pull request! :sunglasses:

In order to add a level, you need to:
* Write the code for the new level
* Write dialogues for the new level
* Update __max\_n\_level__ variable both in _server.js_ and _public/js/index.js_

#### New level code
Write the new level in a __.js__ file and put it inside the _public/levels_
directory, renaming it __levelX.js__ according to its number.

#### New level dialogues
Write dialogues inside _dialogues_ file. The order in which you write dialogues will be the order in which dialogues will be
displayed.

Every dialog has an header:

```
/*character-X
```
where _character_ is one among:
* _colonel_
* _assistant_
* _crazy\_doctor_

and _X_ is the number of the level.

After the header you can write the dialog, in this way:
```
""dialogdialogdialog...
```

If dialog has to appear after user has answered a specific answer, i.e., when user
has chosen among more answers, you have to include the previous number of the
answer before dialog. For example:

```
""2--dialogdialogdialog...
```

This dialog will appear after user will have chosen the previous second answer.

After a dialog, you can write an answer for the user, in this way:
```
--answer...
```

If you want to write more than one answer, you need to include the next dialog referred to, in this way:
```
--1--answer1...
--2--answer2...
--3--answer3...
```
Once you have completed dialogues, just parse them with _parser.py_. It will automatically create dialogues files.
```
$ python2 parser.py dialogues
```


## Credits
Desert of Barbarians is a game by [Alessandro Cocilova](https://github.com/akira002?tab=repositories) and [Luca Sciullo](https://github.com/lukesmolo/).

We would like to thank all authors of these libraries:
* [jQuery MD5 Plugin](https://github.com/placemarker/jQuery-MD5)
* [Intro.js](https://github.com/usablica/intro.js)
* [SandBox.js](https://gist.github.com/line-o/3852813)
* [limitEval.js](https://gist.github.com/westc/b3c887965e1c98087799)
* [qTip2](http://qtip2.com/)
* [grained](https://github.com/sarathsaleem/grained)
* [jquerytypewriter](https://github.com/chadselph/jquery-typewriter)
* [Missile Command](https://github.com/donaldali/odin-js-jquery/tree/master/missile_command)

Icons were [Designed by Madebyoliver and distributed by Flaticon](http://www.flaticon.com/authors/madebyoliver)

## License
Desert of Barbarians is released under the GPLv2 License.

