# localStorage.keyDB.js

***

## Examples
Simple localstorage
```js
db.get('key');
db.set('key', {});
db.remove('key');
db.clear();
```

Creating a keyDB
```js
db.keyDB_name = keyDB(
	"name",// DB prefix for all keys
	{						// default object (optinal)
		"key":"",
		"value":"",
		"timestamp":Date.now()
	}
);
```


```js
db.keyDB_name.get('key');
db.keyDB_name.getAllArray('key', []);
db.keyDB_name.getAllArray('key', function() {reutrn [];});
db.keyDB_name.set('key', {});
db.keyDB_name.remove('key');
db.keyDB_name.clear();

var list = db.keyDB_name.keys;	// get list of keys
var obj = db.keyDB_name.obj;	// get default obj
```

Fallback Catch
```js
var test = {}
if (storage) {
	test = db.get('test', test);
} else {
	alert('Your browser seems to be in Private Mode. Please disable it if you\'d like your settings saved for your next visit.');
}
```

## Important Notes
-JSON.parse() and JSON.stringify() are built-in
-"keys" is a reserved key name for keyDB objects

## To Do
-add update fucntions
