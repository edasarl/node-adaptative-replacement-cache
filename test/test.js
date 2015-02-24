//todo: improve testing suite.
var ARC = require('..');
var cache = new ARC(2);
cache.on('eviction', function(key, val) {
	console.log(key, val, 'evicted');
});
console.log(cache);
var data;
data = cache.get('key1');
if (data) console.log(data);
else if (typeof(data) == 'object') console.log('key1 manually deleted from cache');
else console.log('key1 not in cache');

cache.set('key1', 'val1');

data = cache.get('key1');
if (data) console.log(data);
else if (typeof(data) == 'object') console.log('key1 manually deleted from cache');
else console.log('key1 not in cache');

cache.del('key1');
data = cache.get('key1');
if (data) console.log(data);
else if (typeof(data) == 'object') console.log('key1 manually deleted from cache');
else console.log('key1 not in cache');

cache.set('key2', 'val2');
cache.set('key3', 'val3');

console.log(cache);
// cache.set('key1', 'val1');
// console.log(cache);
// cache.set('key2', 'val2');
// console.log(cache);
// cache.set('key3', 'val3');
// console.log(cache);
// console.log(cache);
// console.log(cache.req('key1'));
// console.log(cache);
// console.log(cache.req('key2'));
// console.log(cache);
// console.log(cache.req('key3'));
// console.log(cache);
// console.log(cache.req('key2'));
// console.log(cache);
// console.log(cache.req('key1'));
// console.log(cache);
// console.log(cache.req('key4'));
// console.log(cache);
// console.log(cache.req('key5'));
// console.log(cache);
// console.log(cache.req('key2'));
// console.log(cache);
// console.log(cache.req('key2'));
// console.log(cache);
// console.log(cache.req('key4'));
// console.log(cache);