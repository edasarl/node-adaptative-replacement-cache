var fdll = require('fdll');
module.exports = ARC;

function ARC(c, makeRes) {
	this.c = c;
	this.p = 0;
	this.t1 = new fdll();
	this.t2 = new fdll();
	this.b1 = new fdll();
	this.b2 = new fdll();
	this.makeRes = makeRes;
}
ARC.prototype.replace = function(key) {
	var t1Length = this.t1.length();
	var lru;
	if (t1Length && (t1Length > this.p || (this.b2.get(key) && t1Length == this.p))) {
		lru = this.t1.shift();
		lru.data = null;
		this.b1.push(lru);
	} else {
		lru = this.t2.shift();
		lru.data = null;
		this.b2.push(lru);
	}
};

ARC.prototype.req = function(key) {
	var keyData;
	var delta;
	//case I
	keyData = this.t1.get(key);
	if (keyData) {
		this.t2.push(this.t1.remove(key));
		return keyData.data;
	}
	keyData =this.t2.get(key);
	if (keyData) {
		this.t2.push(this.t2.remove(key));
		return keyData.data;
	}
	//case II
	keyData =this.b1.get(key);
	if (keyData) {
		var b1Length = this.b1.length();
		var b2Length = this.b2.length();
		delta = (b1Length >= b2Length) ? 1 : Math.floor(b2Length / b1Length);
		this.p = Math.min(this.p + delta, this.c);
		this.replace(key);
		var keyData = this.b1.remove(key);
		var res = this.makeRes(key);
		keyData.data = res;
		this.t2.push(keyData);
		return res;
	}
	//case III
	keyData =this.b2.get(key);
	if (keyData) {
		var b1Length = this.b1.length();
		var b2Length = this.b2.length();
		delta = (b2Length >= b1Length) ? 1 : Math.floor(b1Length / b2Length);
		this.p = Math.max(this.p - delta, 0);
		this.replace(key);
		var keyData = this.b2.remove(key);
		var res = this.makeRes(key);
		keyData.data = res;
		this.t2.push(keyData);
		return res;
	}
	//case IV
	var b1Length = this.b1.length();
	var t1Length = this.t1.length();
	var b2Length = this.b2.length();
	var t2Length = this.t2.length();
	if (b1Length + t1Length == this.c) {//case A
		if (t1Length < this.c) {
			this.b1.shift();
			this.replace(key);
		} else {
			this.t1.shift();
		}
	} else {//case B
		var totalLength = b1Length + t1Length + b2Length + t2Length;
		if (totalLength >= this.c) {
			if (totalLength == 2 * this.c) this.b2.shift();
			this.replace(key);
		}
	}
	var res = this.makeRes(key);
	this.t1.push({
		key: key,
		data: res
	});
	return res;
}