domready(function() {

  sink('localStorage', function(test, ok, before, after) {
    var ls = new Storage('localStorage');
    
    test('test browser compatible', 1, function() {
      ok(ls.test(), 'localStorage enabled');
    })
    
    test('test localStorage.get', 8, function() {
      ls.clear();
      ok(typeof ls.get('key') == 'undefined', 'localStorage get null');
      ls.clear();
      ok(ls.get('key', 'value') === 'value', 'localStorage get string');
      ls.clear();
      ok(typeof ls.get('key', {}) === 'object', 'localStorage get JSON Object');
      ls.clear();
      ok(Array.isArray(ls.get('key', [])), 'localStorage get JSON Array');
      ls.clear();
      ok(ls.get('key', 1) === 1, 'localStorage get number');
      ls.clear();
      ok(ls.get('key', 1.1) === 1.1, 'localStorage get float');
      ls.clear();
      ok(ls.get('key', true) === true, 'localStorage get TRUE');
      ls.clear();
      ok(ls.get('key', false) === false, 'localStorage get FALSE');
      ls.clear();
    })
    
    test('test localStorage.set', 8, function() {
      ls.clear();
      ls.set('key');
      ok(ls.get('key') == '', 'localStorage set null');
      ls.clear();
      ls.set('key', 'value');
      ok(ls.get('key') === 'value', 'localStorage set string');
      ls.clear();
      ls.set('key', {});
      ok(typeof ls.get('key') === 'object', 'localStorage set JSON Object');
      ls.clear();
      ls.set('key', []);
      ok(Array.isArray(ls.get('key')), 'localStorage set JSON Array');
      ls.clear();
      ls.set('key', 1);
      ok(ls.get('key') === 1, 'localStorage set number');
      ls.clear();
      ls.set('key', 1.1);
      ok(ls.get('key') === 1.1, 'localStorage set float');
      ls.clear();
      ls.set('key', true);
      ok(ls.get('key') === true, 'localStorage set TRUE');
      ls.clear();
      ls.set('key', false);
      ok(ls.get('key') === false, 'localStorage set FALSE');
      ls.clear();
    })

    test('test localStorage.remove', 1, function() {
      ls.clear();
      ls.set('key', 'value');
      ls.remove('key');
      ok(typeof ls.get('key') == 'undefined', 'localStorage removed');
      ls.clear();
    })

    test('test localStorage.clear', 1, function() {
      ls.clear();
      ls.set('key', 'value');
      ls.set('key2', 'value');
      ls.clear();
      ok(typeof ls.get('key') == 'undefined' && typeof ls.get('key2') == 'undefined', 'localStorage cleared');
      ls.clear();
    })
    
  });
  sink('sessionStorage', function(test, ok, before, after) {
    var ss = new Storage('sessonStorage');
    
    test('test sessonStorage', 1, function() {
      ok(ss.test(), 'sessionStorage enabled');
    });

  });
  sink('keyStorage', function(test, ok, before, after) {

    /*test('test keyStorage', 1, function() {
    });*/

  });
  start();
})