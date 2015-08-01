react: DUMMY
	npm install react

jsx: DUMMY
	jsx -x jsx src/ build/
	sed -i "" "s/\"\.\/nodes\.jsx\"/\".\/nodes.js\"/g" build/game.js

build/final_tree.js: DUMMY
	node util/instantiate_tree.js ../src/probability-panic.js > build/final_tree.js

build/main.js: react jsx build/final_tree.js
	browserify build/startup.js -o build/main.js

build: build/main.js

DUMMY:
