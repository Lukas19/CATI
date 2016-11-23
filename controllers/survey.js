/**
 * Created by lukaszamora on 11/14/16.
 */
(function () {
    var app = angular.module('survey', []);

    app.controller('SurveyController',function($scope, $http){
        $http.get('/getEncuesta').success(function (datos) {
            $scope.surveys = datos;
            if (datos == ""){
                $scope.surveys = [];
            }
            
        }).error(function (datos) {
            console.log("No hay encuestas");
        });

    });
})();