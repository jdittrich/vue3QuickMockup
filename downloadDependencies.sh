#!/bin/sh

echo 'This will download vue.esm-browser.js to ./ (this directory)'
echo 'and chai.js mocha.js mocha.css  to ./tests'

curl -o vue.esm-browser.js https://unpkg.com/vue@3.0.0/dist/vue.esm-browser.js
curl -o ./tests/chai.js  https://unpkg.com/chai/chai.js
curl -o ./tests/mocha.js https://unpkg.com/mocha/mocha.js
curl -o ./tests/mocha.css https://unpkg.com/mocha/mocha.css

