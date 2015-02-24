# node-adaptative-replacement-cache
Implementation of the ARC algorithm for Node.js

Description of the algorithm can be found in:
http://citeseer.ist.psu.edu/viewdoc/download?doi=10.1.1.13.5210&rep=rep1&type=pdf
or
https://www.ipvs.uni-stuttgart.de/export/sites/default/ipvs/abteilungen/as/lehre/lehrveranstaltungen/vorlesungen/WS1415/material/ARC.pdf

var cache = new ARC(3); //creates a cache of size 3.
cache.on('eviction', function(key, val) {...}); //the cache emit an 'eviction' event when an element leaves the cache.

#API

* cache.get(key) returns undefined if the key is not in cache else returns its value; the cache internal state is updated if and only if the value is not null.

* cache.peek(key) silently retrieves the value associated to key if key is in cache, else returns undefined.

* cache.update(key, val) silently updates the value associated to a key that MUST be in the cache.

* cache.del(key) is the same as cache.update(key, null)
* cache.set(key, val) adds a new entry in the cache and update cache internal state. Key MUST NOT be in the cache.

