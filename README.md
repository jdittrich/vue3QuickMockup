For the current version to work you need vue 3. 


* Either `curl -o vue.esm-browser.js https://unpkg.com/vue@3.0.0/dist/vue.esm-browser.js` or…
* …download the [vue.js 3 repo](https://github.com/vuejs/vue-next), run in the vue 3 repo: `yarn install` and `yarn build` and copy the vue.js runtime (`vue.esm-browser.js`) to this repo. 

Run any http server (e.g. `python -m http.server` ). The code uses ES6 modules, which need a server.

