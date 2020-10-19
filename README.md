For the current version to work you need vue 3. 

Currently, I develop without node and build chain. All is in the browser. Maybe I change this later but so far it is really quick and lightweight and I do not need to worry about node version, dependencies and whatnot.

To install the few dependencies (vue3 as well as mocha and chai for the tests) just run the `downloadDependencies.sh` (or take a look at the 4 lines of curl and download them yourself, if you do not want to run said bash script).

Run any http server (e.g. `python -m http.server` ). The code uses ES6 modules, which need a server.

