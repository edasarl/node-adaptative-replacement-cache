var fdll = require('fdll');
var events = require('events');
var util = require('util');

module.exports = ARC;

function ARC(c) {
	this.c = c;
	this.p = 0;
	this.t1 = new fdll();
	this.t2 = new fdll();
	this.b1 = new fdll();
	this.b2 = new fdll();
}
util.inherits(ARC, events.EventEmitter);

ARC.prototype._replace = function(key) {
	var t1Length = this.t1.length();
	var lru;
	if (t1Length && (t1Length > this.p || (this.b2.get(key) && t1Length == this.p))) {
		lru = this.t1.shift();
		if (lru.data) this.emit('eviction', lru.key, lru.data);
		lru.data = null;
		this.b1.push(lru);
	} else {
		lru = this.t2.shift();
		if (lru.data) this.emit('eviction', lru.key, lru.data);
		lru.data = null;
		this.b2.push(lru);
	}
};

ARC.prototype.get = function(key) {
	var keyData;
	keyData = this.t1.get(key);
	if (keyData) {
		if (keyData.data == null) return null;
		this.t2.push(this.t1.remove(key));
		return keyData.data;
	}
	keyData = this.t2.get(key);
	if (keyData) {
		if (keyData.data == null) return null;
		this.t2.push(this.t2.remove(key));
		return keyData.data;
	}
	return;
};

ARC.prototype.peek = function(key) {
	var keyData;
	keyData = this.t1.get(key);
	if (keyData) {
		return keyData.data;
	}
	keyData = this.t2.get(key);
	if (keyData) {
		return keyData.data;
	}
	return;
};

ARC.prototype.del = function(key) {
	return this.update(key, null);
};

ARC.prototype.update = function(key, val) {
	var keyData;
	keyData = this.t1.get(key);
	if (keyData) {
		return this.t1.set(key, val);
	}
	keyData = this.t2.get(key);
	if (keyData) {
		return this.t2.set(key, val);
	}
	return new Error('key should be in cache');
};

ARC.prototype.set = function(key, val) {
	var keyData;
	var delta;
	//case I
	if (this.t1.get(key) || this.t2.get(key)) {
		return new Error('key should not be in cache');
	}
	//case II
	keyData = this.b1.get(key);
	if (keyData) {
		var b1Length = this.b1.length();
		var b2Length = this.b2.length();
		delta = (b1Length >= b2Length) ? 1 : Math.floor(b2Length / b1Length);
		this.p = Math.min(this.p + delta, this.c);
		this._replace(key);
		var keyData = this.b1.remove(key);
		keyData.data = val;
		this.t2.push(keyData);
		return;
	}
	//case III
	keyData = this.b2.get(key);
	if (keyData) {
		var b1Length = this.b1.length();
		var b2Length = this.b2.length();
		delta = (b2Length >= b1Length) ? 1 : Math.floor(b1Length / b2Length);
		this.p = Math.max(this.p - delta, 0);
		this._replace(key);
		var keyData = this.b2.remove(key);
		keyData.data = val;
		this.t2.push(keyData);
		return;
	}
	//case IV
	var b1Length = this.b1.length();
	var t1Length = this.t1.length();
	var b2Length = this.b2.length();
	var t2Length = this.t2.length();
	if (b1Length + t1Length == this.c) {//case A
		if (t1Length < this.c) {
			this.b1.shift();
			this._replace(key);
		} else {
			var lru = this.t1.shift();
			if (lru.data) this.emit('eviction', lru.key, lru.data);
		}
	} else {//case B
		var totalLength = b1Length + t1Length + b2Length + t2Length;
		if (totalLength >= this.c) {
			if (totalLength == 2 * this.c) this.b2.shift();
			this._replace(key);
		}
	}
	this.t1.push({
		key: key,
		data: val
	});
	return;
};
