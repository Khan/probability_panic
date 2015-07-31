jsx: DUMMY
	jsx src/ build/

build/final_tree.js: src/probability-panic.js
	node util/instantiate_tree.js ../src/probability-panic.js > build/final_tree.js

build/main.js: jsx build/final_tree.js
	browserify build/game.js -o build/main.js

build: build/main.js

DUMMY:
