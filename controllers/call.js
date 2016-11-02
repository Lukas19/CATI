/**
 * Created by lukaszamora on 10/30/16.
 */
(function () {
    var app = angular.module('call', []);

    app.controller('CallController',function($scope, $http){
        $http.get('/getAllEncuestado').success(function (datos) {
            $scope.encuestados = datos;
            if (datos == ""){
                $scope.encuestados = [];
            }
        }).error(function (datos) {
            console.log("No hay encuestados");
        })
    });
})();