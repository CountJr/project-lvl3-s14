run:
	npm run babel-node -- ./src/bin/$1

lint:
	npm run eslint -- src __tests__

install:
	install-deps install-flow-typed

install-deps:
	yarn

install-flow-typed:
	npm run flow-typed install

build:
	rm -rf dist
	npm run build

test:
	npm test

check-types:
	npm run flow

publish:
	npm publish

.PHONY: test

bab:
	rm -rf tmp
	mkdir tmp
	babel-node ./src/bin/page-loader.js --output ./tmp/bab http://count.cz/very-big.one.html
