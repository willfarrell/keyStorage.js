//(function (angular) {
angular.module('app.factories')
.factory('$localStorage', [function() {
	return new Storage('localStorage');
}]);

/*angular.module('app.services', ['$provide', function($provide) {
	$provide.factory('$keyStorage', ['', function() {
		return new keyStorage();
	}]);
}]);*/

angular.module('app.factories')
.factory('$sessionStorage', [function() {
	return new Storage('sessionStorage');
}]);
//})(angular);