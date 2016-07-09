var spaces;

var Module = {
    TOTAL_MEMORY: 268435456,
    errorhandler: null, // arguments: err, url, line. This function must return 'true' if the error is handled, otherwise 'false'
    compatibilitycheck: null,
    dataUrl: "Release/webgl.data",
    codeUrl: "Release/webgl.js",
    memUrl: "Release/webgl.mem",
};


//Functions to be called form the unity plugin
function updateFloors(param) {
    var scope = angular.element($("#controller")).scope();
    scope.setFloors(param);
}

function updateSpaces(param) {
    var scope = angular.element($("#controller")).scope();
    scope.setSpaces(param);
}

angular.module("FacilityManager", ['ui.router'])

.config(function ($stateProvider, $urlRouterProvider) {
    //
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/home");
    //
    // Now set up the states
    $stateProvider
        .state('home', {
            url: "/home",
            templateUrl: "partials/viewer.html",
            controller: "FacilityManagerController"
        });
})

/*.factory('facilityManagerService', function contentManagerService() {
    var sidebarName = "";

    var exports = {
        getName: function() {
            return sidebarName;
        }, 
        setName: function(name){
            console.log("Rui Chamado")
            sidebarName = name;
            console.log(sidebarName);
        }
    }
    return exports;
})*/


.controller("FacilityManagerController", ['$scope', '$timeout', '$rootScope', function ($scope, $timeout, $rootScope) {
    $scope.floors = [];
    $scope.spaces = [];
    $rootScope.name = "None";
    $scope.open = false;
    
    //For initializing the tooltips of bootstrap
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })

    $scope.setFloors = function (floors) {
        $scope.floors = floors;
    }
    $scope.setSpaces = function (rooms) {
        $scope.spaces = rooms;
    }

    $scope.getFacilityInformation = function () {
        SendMessage("ObjectManager", "getSpaces", "");
        SendMessage("ObjectManager", "getFloors", "");
    }

    $scope.selectLevel = function (level) {
        SendMessage("ObjectManager", "toggleLevel", level);
    }

    $scope.selectRoom = function (room) {
        $("#sidebar-right").addClass("active");
        $scope.open = true;
        $rootScope.name = room;
    }


    $scope.isSidebarOpen = function () {
        return open;
    }

    $scope.closeSidebar = function () {
        $('#sidebar-right').removeClass('active');
        $scope.open = false;

    }

    $scope.setOrbitMode = function () {
        console.log("Nvaigation mode: orbit");
        SendMessage("ObjectManager", "orbitMode", "");
    }

    $scope.setNormalMode = function () {
        console.log("Navigation mode: normal");
        SendMessage("ObjectManager", "normalMode", "");
    }

    $timeout(function () {
        $scope.getFacilityInformation();
    }, 30000)

}]);