// replaces ls = LocalStorage

// set globe storage bool
var storage = (function() {
  var uid = new Date,
      storage,
      result;
  try {
    (storage = window.localStorage).setItem(uid, uid);
    result = storage.getItem(uid) == uid;
    storage.removeItem(uid);
    return result && storage;
  } catch(e) {}
}());

// localStorage db wrapper
var db = {
	ls: localStorage, //localStorage short name
	
	// Main Functions //
	
	get: function(key) {
		return JSON.parse(this.ls.getItem(key));
	},
	
	set: function(key, obj) {
		this.ls.setItem(key, JSON.stringify(obj));
	},
	
	remove: function(key) {
		this.ls.removeItem(key);
	},
	
	// clears ALL localStorage
	clear: function() {
		this.ls.clear();	
	},
	
	// Custom Functions //
	
	// Sets a key to it's default object if not already set
	default: function(key, obj) {
		this.get(key) || this.ls.setItem(key, JSON.stringify(obj));
	}
};

// custom sub db objects
db.whois = keyDB(
	"whois", {
		"key":"",
		"domain":"",
		"sld":"",
		"tld":"",
		//"whois":"", 
		//"state":"",
		//"expires":"", // future
		"timestamp":Date.now(),
	});

// Keyed DB Class
// keyDB("id", {})
function keyDB(id, obj) {
	this.id = id+"_"; // prefix for all keys, end with _
	this.keys = [];
	this.obj = obj || {}; // default object being stored w/ required included
}

keyDB.prototype.get = function(key) {
	return db.get(key);
};
	
keyDB.prototype.set = function(key, obj) {
	db.set(this.id+key, obj);
	// save key in keychain if not already there
	var index = this.keys.indexOf(key);
	if(index === -1) { // if not in keys
		this.keys.push(key);
		db.set(this.id+'keys', JSON.stringify(this.keys));
	}
};
	
keyDB.prototype.remove = function(key) {
	db.remove(this.id+key);
	// remove key in keychain
	var index = this.keys.indexOf(key);
	if(index !== -1) { // if in keys
		this.keys.splice(index, 1);
		db.set(this.id+'keys', JSON.stringify(this.keys));
	}
};

keyDB.prototype.clear = function() {
	//this.ls.clear();
	for (var i = 0, l = this.keys.length; i < l; i++) {
		db.remove(this.id+this.keys[i]);
	}
	db.remove(this.id+key);
};