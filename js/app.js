var spaces;

var Module = {
  TOTAL_MEMORY: 268435456,
  errorhandler: null, // arguments: err, url, line. This function must return 'true' if the error is handled, otherwise 'false'
  compatibilitycheck: null,
  dataUrl: "Release/webgl.data",
  codeUrl: "Release/webgl.js",
  memUrl: "Release/webgl.mem",
};

function spacesList(params){
  var scope = angular.element($("#controller")).scope();
  scope.setSpaces(params);
}

function floorsList(params) {
  var scope = angular.element($("#controller")).scope();
   scope.setFloors(params);
}

angular.module('FacilityManager', ['ui.router'])

.config(function ($stateProvider, $urlRouterProvider) {
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/home");
  // Now set up the states
  $stateProvider
    .state('home', {
        url: "/home",
        templateUrl: "partials/viewer.html",
        controller: "FacilityMonitor"
    });
})

.controller('FacilityMonitor', ['$scope', '$timeout', '$rootScope', function ($scope, $timeout, $rootScope) {
  $scope.spaces = [];
  $scope.floors = [];

  $scope.setSpaces = function(spaces) {
    var list = []

    for(var i=0 ; i < spaces.length; i++){
      list.push(JSON.parse(spaces[i]));
    }

    $scope.spaces = list;
  }

  $scope.setFloors = function (floors) {
    $scope.floors = floors;
  }

  $scope.selectLevel = function (level) {
    SendMessage("ObjectManager", "toggleLevel", level);
  }

  $scope.selectRoom = function (space) {
    $("#sidebar-right").addClass("active");
    $scope.open = true;
    $rootScope.name = space.spaceName;
    $rootScope.objects = space.objects;
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
    SendMessage("ObjectManager", "availableFloors", "");
    SendMessage("ObjectManager", "availableSpaces", "");
  }, 20000)

  //For initializing the tooltips of bootstrap
  $(function () {
     $('[data-toggle="tooltip"]').tooltip()
 })
}]);
