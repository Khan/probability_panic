build: DUMMY
	jsx src/ build/
	node util/instantiate_tree.js ../src/probability-panic.js > build/final_tree.js
	browserify build/game.js -o build/main.js

DUMMY:
