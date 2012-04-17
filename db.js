/*

//== Important Notes ==//
-JSON.parse() and JSON.stringify() are built-in
-"keys" is a reserved key name for keyDB objects

//== Examples ==//

//= General Examples =//
db.get('key');
db.set('key', {});
db.remove('key');
db.clear();

db.keyDB_name.get('key');
db.keyDB_name.set('key', {});
db.keyDB_name.remove('key');
db.keyDB_name.clear();

var list = db.keyDB_name.keys; 	// get list of keys
var obj = db.keyDB_name.obj;	// get default obj

//= init Examples =//
var test = {}
if (storage) {
	test = db.get('test', test);
} else {
	alert('Your browser seems to be in Private Mode. Please disable it if you\'d like your settings saved for your next visit.');
}

//= Creating a keyDB =//
db.name = new keyDB(
	"name", 				// DB prefix for all keys
	{						// default object (optinal)
		"key":"",
		"value":"",
		"timestamp":Date.now(),
	}
);


*/

// localStorage db wrapper
var db = {
	on: false,			// bool - if localStorage is enabled in browser
	ls: localStorage, 	// localStorage short name - obfusification
	
	/**
	 * set 'on' bool for those that want to 
	 * test if localStorage is enabled
     * @this {Object}
     */
	init: function() {
		var uid = Date.now(),
			result;
		try {
			result = this.get(uid, uid) == uid;
			this.remove(uid);
			this.on = result;
		} catch( e ) {}
	},
	
	// Main Functions //
	
	/**
     * @this {Object}
     */
	get: function(key, default_obj) {
		//log(obj);
		if ( default_obj !== 'undefined' && !this.ls.getItem(key)) {
			this.set(key, default_obj);
		}
		//console.log(this.ls.getItem(key));
		var result = this.ls.getItem(key);
		
		if ( result === 'undefined' ) {
			return result;
		} else {
			return JSON.parse(result);
		}
		// if (typeof(result) === Object)
	},
	
	/**
     * @this {Object}
     */
	set: function(key, default_obj) {
		this.ls.setItem(key, JSON.stringify(default_obj));
	},
	
	/**
     * @this {Object}
     */
	remove: function(key) {
		this.ls.removeItem(key);
	},
	
	// clears ALL localStorage - only call if you're sure
	/**
     * @this {Object}
     */
	clear: function() {
		this.ls.clear();	
	}
};

db.init();

// Keyed DB Class
// keyDB("id", {})
// "keys" is a reserved keyname
/**
 * @this {Object}
 */
function keyDB(id, default_obj) {
	this.id = id ? id+"_" : "_"; // prefix for all keys, end with _
	this.keys = db.get(this.id+'keys', []);
	this.obj = default_obj || {}; // default object being stored
}


keyDB.prototype.get = function(key, default_obj) {
	//console.log("keyDB.get("+key+")");
	return db.get(this.id+key, default_obj);
};

keyDB.prototype.set = function(key, obj) {
	if (obj == 'undefined' || key == 'undefined') return;	// don't set undefined
	//console.log("keyDB.set("+key+", ");
	//console.log(obj);
	//console.log(")");
	db.set(this.id+key, obj);
	// save key in keychain if not already there
	//console.log(db.whois);
	var index = this.keys.indexOf(key);
	if ( index === -1 ) { // if not in keys
		this.keys.push(key);
		db.set(this.id+'keys', this.keys);
	}
};

keyDB.prototype.remove = function(key) {
	db.remove(this.id+key);
	// remove key in keychain
	var index = this.keys.indexOf(key);
	if (index !== -1) { // if in keys
		this.keys.splice(index, 1);
		db.set(this.id+'keys', this.keys);
	}
};

/**
 * list = [] - default container
 */
keyDB.prototype.getAllArray = function() {
	var list = [];
	for (var i = 0, l = this.keys.length; i < l; i++) {
		list.push(db.get(this.id+this.keys[i]));
	}
	//if (!list.length) this.setAllArray(key, list_default);
	return list;
};

/**
 * list = {} - default container
 */
keyDB.prototype.getAllObject = function() {
	var list = {};
	for (var i = 0, l = this.keys.length; i < l; i++) {
		list[this.keys[i]] = db.get(this.id+this.keys[i]);
	}
	return list;
};

keyDB.prototype.setAllArray = function(key, list) {
	if (!key) return;	// return if no key
	this.clear();
	
	for (var i = 0, l = list.length; i < l; i++) {
		log(list[i]);
		this.set(list[i][key], list[i]);
	}
};

keyDB.prototype.setAllObject = function(list) {
	this.clear();
	
	for (var i in list) {
		this.set(i, list[i]);
	}
};


keyDB.prototype.clear = function() {
	//this.ls.clear();
	for (var i = 0, l = this.keys.length; i < l; i++) {
		db.remove(this.id+this.keys[i]);
	}
	db.remove(this.id+'keys');
};
