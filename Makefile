start:
	webpack serve --open

develop:
	npx webpack serve

install:
	npm install

build:
	rm -rf dist
	NODE_ENV=production npx webpack

lint:
	npx eslint .
