# localStorage.keyDB.js

***

## Examples
Simple localStorage
```js
ls = new Storage();

if (!ls.test()) {
	alert('Your browser seems to be in Private Mode. Please disable it if you\'d like your settings saved for your next visit.');
}

ls.get('key');
ls.get('key', {}); // set passed in param if get is null
ls.set('key', {});
ls.remove('key');
ls.clear();

// sessionStorage
ss = new Storage('sessionStorage');
```

Creating a keyDB
```js
ls.key_name = new keyStorage(
	"name",// prefix for all keys
	{ // default object (optional)
		"key":"",
		"value":"",
		"timestamp":Date.now()
	}
);
```


```js
ls.key_name.get('key');
ls.key_name.getAllArray('key', []);
ls.key_name.getAllArray('key', function() {return [];});
ls.key_name.set('key', {});
ls.key_name.remove('key');
ls.key_name.clear();

var list = ls.key_name.keys;	// get list of keys
var obj = ls.key_name.obj;	// get default obj
```

## Important Notes
- JSON.parse() and JSON.stringify() are built-in for when objects or arrays are passed in.
- "keys" is a reserved key name for keyStorage objects.
