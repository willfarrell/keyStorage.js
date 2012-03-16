/*

Examples:
db.get('key');
db.set('key', {});
db.remove('key');
db.clear();

db.keyDB_name.get('key');
db.keyDB_name.set('key', {});
db.keyDB_name.remove('key');
db.keyDB_name.clear();

init Examples:
var test = {}
if (storage) {
	test = db.get('test', test);
} else {
	alert('Your browser seems to be in Private Mode. Please disable it if you\'d like your settings saved for your next visit.');
}

Creating a keyDB:
db.NAME = new keyDB(
	"unique_name", 				// DB prefix for all keys
	{							// default object (optinal)
		"key":"",
		"value":"",
		"timestamp":Date.now(),
	}
);

*/

function cleanDB() {
	// whois
	var day = 86400000;
	var now = Date.now();
	
	var min_age_taken = now - day*30; // state = 0 - free up space
	var min_age_free =now -  day*1; // state = 1 - keep up accracy
	
	
	var whois = db.whois.keys
		obj;
	for (var i = 0, l = whois.length; i < l; i++) {
		obj = db.whois.get(whois[i], {});
		if (obj.length && obj.timestamp && obj.state) { // valid obj
			// remove all old cache
			if ((obj.state === '0' && obj.timestamp < min_age_taken) ||
				(obj.state === '1' && obj.timestamp < min_age_free)) {
				db.whois.remove(whois[i]);
			}
		}
	}
}

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
	
	// obj is the default you would like a key to be if not already set
	// implemented for cleaner init code - see example
	get: function(key, obj) {
		//log(obj);
		if (!this.ls.getItem(key) && obj !== 'undefined') {
			this.set(key, obj);
		}
		//console.log(this.ls.getItem(key));
		var result = this.ls.getItem(key);
		if ( result === 'undefined' )
			return result;
		else
			return JSON.parse(result);
		// if (typeof(result) === Object)
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
};

// Keyed DB Class
// keyDB("id", {})
// "keys" is a reserved keyname
function keyDB(id, obj) {
	this.id = id ? id+"_" : "_"; // prefix for all keys, end with _
	this.keys = db.get(this.id+'keys', []);
	this.obj = obj || {}; // default object being stored w/ required included
}

keyDB.prototype.get = function(key, obj) {
	//console.log("keyDB.get("+key+")");
	return db.get(this.id+key, obj);
};
	
keyDB.prototype.set = function(key, obj) {
	//console.log("keyDB.set("+key+", ");
	//console.log(obj);
	//console.log(")");
	db.set(this.id+key, obj);
	// save key in keychain if not already there
	//console.log(db.whois);
	var index = this.keys.indexOf(key);
	if (index === -1) { // if not in keys
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

keyDB.prototype.clear = function() {
	//this.ls.clear();
	for (var i = 0, l = this.keys.length; i < l; i++) {
		db.remove(this.id+this.keys[i]);
	}
	db.remove(this.id+'keys');
};
