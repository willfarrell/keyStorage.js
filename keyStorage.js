/*
 * will Farrell
 */

// localStorage db wrapper
function Storage(type) {
  
  // localStorage short name - obfusification
  /*switch (type) { 
  case 'localStorage':
    this.storage = localStorage;
    break;
  case 'sessionStorage':
    this.storage = sessionStorage;
    break;
  default:
    this.storage = localStorage;
    break;
  }*/
  if (type == 'sessionStorage') {
    this.storage = sessionStorage;
  } else {
    this.storage = localStorage;
  }

  /**
   * set 'on' bool for those that want to
   * test if localStorage is enabled
   *
   * call from below
   *
   * @this {Object}
   */
  this.on = false; // bool - if localStorage is enabled in browser
  this.test = function() {
    try {
      var uid = +new Date()
      result = this.get(uid, uid) === uid;
      this.remove(uid);
      this.on = result;
    } catch( e ) {}
    return this.on;
  };

  // Main Functions //

  /**
   * @this {Object}
   */
  this.get = function(key, default_obj) {
    //console.log('get(', key, default_obj, ')');
    //console.log(this.ls.getItem(key));
    var result = this.storage.getItem(key);
    
    if (result === null) {
      if ( typeof default_obj !== 'undefined') {
        this.set(key, default_obj);
      }
      return default_obj;
    }
    
    
    /*if ( result === 'undefined' ) {
      return result;
    }*/
    if (result && result.match(/^[{\["]/)) { // catch JSON
      result = JSON.parse(result);
    } else if (result === 'true') { // catch bools
      result = true;
    } else if (result === 'false') {
      result = false;
    } else if (Number(result)) { // catch numbers
      result = parseFloat(result);
    }
    return result;
  };

  /**
   * @this {Object}
   */
  this.set = function(key, obj) {
    //console.log('set(', key, obj, ')');
    if (obj == null) { obj = ''; }
    if (key !== null) {
      try {
        this.storage.setItem(key, (typeof(obj) === 'object') ? JSON.stringify(obj) : obj);
      } catch(e) {
        console.warn('Error: Failed to execute \'setItem\' on \'Storage\': Setting the value of\''+key+'\'');
      }
      
    }
    return obj;
  };

  /**
   * @this {Object}
   */
  this.remove = function(key) {
    this.storage.removeItem(key);
  };

  // clears ALL localStorage - only call if you're sure
  /**
   * @this {Object}
   */
  this.clear = function() {
    this.storage.clear();
  };
  
  return this;
}

// Keyed DB Class
// keyDB("id", {})
// "keys" is a reserved keyname
/**
 * @this {Object}
 */
function keyStorage(id, default_obj) {
  this.id = id ? id+'_' : '_'; // prefix for all keys, end with _
  this.keys = db.get(this.id+'keys', []);
  this.obj = default_obj || {}; // default object being stored
}


keyStorage.prototype.get = function(key, default_obj) {
  //console.log("keyDB.get("+key+")");
  var obj = {};
  if (typeof(default_obj) === 'function') { obj = default_obj(); }
  else { obj = default_obj; }

  return db.get(this.id+key, obj);
};

keyStorage.prototype.set = function(key, obj) {
  if (obj === 'undefined' || key === 'undefined') { return; }  // don't set undefined
  //console.log("keyDB.set("+key+", ");
  db.set(this.id+key, obj);
  // save key in keychain if not already there
  var index = this.keys.indexOf(key);
  if ( index === -1 ) { // if not in keys
    this.keys.push(key);
    db.set(this.id+'keys', this.keys);
  }
};

keyStorage.prototype.remove = function(key) {
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
keyStorage.prototype.getAllArray = function(key, list_default) {
  var obj = [], list = [];
  if (typeof(list_default) === 'function') { obj = list_default(); }
  else { obj = list_default; }

  for (var i = 0, l = this.keys.length; i < l; i++) {
    list.push(this.get(this.keys[i]));
  }
  if (!list.length && key && obj) {
    this.setAllArray(key, obj);
    list = obj;
  }
  return list;
};

/**
 * list = {} - default container
 */
keyStorage.prototype.getAllObject = function(list_default) {
  var obj = {}, list = {};
  if (typeof(list_default) === 'function') { obj = list_default(); }
  else { obj = list_default; }

  for (var i = 0, l = this.keys.length; i < l; i++) {
    list[this.keys[i]] = this.get(this.keys[i]);
  }
  if (!list.length && obj) {
    this.setAllObject(obj);
    list = obj;
  }
  return list;
};

/**
 * key = string key name
 * list = [] - default container
 */
keyStorage.prototype.setArray = function(key, list) {
  if (!key) { return; }  // return if no key

  for (var i = 0, l = list.length; i < l; i++) {
    //console.log(list[i]);
    this.set(list[i][key], list[i]);
  }
};

/**
 * list = key:{key:key, ...} - default container
 */
keyStorage.prototype.setObject = function(list) {
  for (var i in list) {
    if (list.hasOwnProperty(i)) {
      this.set(i, list[i]);
    }
  }
};


/**
 * list = [] or {} - default container
 * key = string key name if list is array
 */
/*keyStorage.prototype.setAll= function(list, key) {
  this.clear();
  if (typeof(list) === 'object') {
    this.setObject(list);
  } else if (key && typeof(list) === 'array') {
    this.setArray(key, list);
  }
};*/

/**
 * key = string key name
 * list = [] - default container
 */
keyStorage.prototype.setAllArray = function(key, list) {
  if (!key) { return; }  // return if no key
  this.clear();

  this.setArray(key, list);
};

/**
 * list = key:{key:key, ...} - default container
 */
keyStorage.prototype.setAllObject = function(list) {
  this.clear();
  this.setObject(list);
};

/**
 * remove all keys from ls
 */
keyStorage.prototype.clear = function() {
  //this.ls.clear();
  for (var i = 0, l = this.keys.length; i < l; i++) {
    db.remove(this.id+this.keys[i]);
  }
  db.remove(this.id+'keys');
};
