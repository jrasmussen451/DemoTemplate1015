'use strict';

$451.app.controller('NavCtrl', function ($rootScope, $scope ) {
    console.log("loading top nav ctrl");
    $scope.Logout = function(){
        $451.clear();
        $rootScope.$broadcast('LogoutEvent');
    }
    //$rootScope.$broadcast('LogoutEvent');

});