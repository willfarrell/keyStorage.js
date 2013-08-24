require('smoosh').config({
    "JAVASCRIPT": {
      "DIST_DIR": "./"
    , "keyStorage": ['./keyStorage.js']
    , "angular.keyStorage": ['./angular.keyStorage.js']
  }
  , "JSHINT_OPTS": {
      "boss": true
    , "forin": false
    , "curly": false
    , "debug": false
    , "devel": false
    , "evil": false
    , "regexp": false
    , "undef": false
    , "sub": true
    , "white": false
    , "indent": 2
    , "asi": true
    , "laxbreak": true
    , "laxcomma": true
    , "eqeqeq": false
    , "eqnull": true
  }
}).run().build().analyze()