# node-adaptative-replacement-cache
Implementation of the ARC algorithm for Node.js

Description of the algorithm can be found in:
http://citeseer.ist.psu.edu/viewdoc/download?doi=10.1.1.13.5210&rep=rep1&type=pdf
or
https://www.ipvs.uni-stuttgart.de/export/sites/default/ipvs/abteilungen/as/lehre/lehrveranstaltungen/vorlesungen/WS1415/material/ARC.pdf

var cache = new ARC(3, function(key) {<<build response>>});
create a cache of size 3 with given function that create the value to store from key value.

cache.req(key) either create the value from the key, store it in the cache and return it or retrieve the value from the cache and return it (while updating cache internal state).