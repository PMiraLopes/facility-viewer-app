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

angular.module('FacilityManager', ['ui.router', 'chart.js', 'ngMaterial'])

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

  $stateProvider
    .state('dashboard', {
        url: "/dashboard",
        templateUrl: "partials/dashboard.html",
        controller: "FacilityMonitor"
    });
})

.controller('FacilityMonitor', ['$scope', '$timeout', '$rootScope', '$mdSidenav', function ($scope, $timeout, $rootScope, $mdSidenav) {
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

  $scope.toggleBoxesView = function () {
    SendMessage("ObjectManager", "toggleBoxesView", "");
  }

  $scope.selectRoom = function (space) {
  //  $("#sidebar-right").addClass("active");
    if(!$scope.open)
      $scope.toggleRight();
    $scope.open = true;
    $rootScope.name = space.spaceName;
    $rootScope.objects = space.objects;
    SendMessage("ObjectManager", "selectSpace", space.spaceName);
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
   });

   /////////////////////LINE CHART//////////////////

   $scope.labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  $scope.series = ['Series A', 'Series B'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          position: 'right'
        }
      ]
    }
  };

  ///////////////////////PIE CHART/////////////////

  $scope.barLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  $scope.barSeries = ['Series A'];

  $scope.barData = [
    [65, 59, 80, 81, 56, 55, 40]
  ];

  ///////// SIDEBAR /////////
  $scope.toggleLeft = buildToggler('left');
  $scope.toggleRight = buildToggler('right');

  function buildToggler(componentId) {
    return function() {
      $mdSidenav(componentId).toggle();
    }
  }

}]);
