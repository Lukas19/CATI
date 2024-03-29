/**
 * Created by lukaszamora on 10/30/16.
 */
(function () {
    var app = angular.module('call', []);

    app.controller('CallController',function($scope, $http, $window, $location){
        $http.get('/getAllEncuestado').success(function (datos) {
            $scope.encuestados = datos;
            if (datos == ""){
                $scope.encuestados = [];
            }
        }).error(function (datos) {
            alert("No hay encuestados");
        })
        $scope.clickEvent = function(enlace, number) {
            enlace = "https://es.surveymonkey.com/r/" + enlace;
            $window.open(enlace, '_blank');
            window.location="skype:+56" + number + "?call";
        };

    });
})();