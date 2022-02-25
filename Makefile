start:
	npm start

develop:
	npx webpack serve

install:
	npm install

build:
	npm run build

lint:
	npx eslint .

test:
	npm run test

test-coverage:
	npm test -- --coverage
