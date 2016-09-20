var spaces;

var Module = {
  TOTAL_MEMORY: 268435456,
  errorhandler: null, // arguments: err, url, line. This function must return 'true' if the error is handled, otherwise 'false'
  compatibilitycheck: null,
  dataUrl: "Release/webgl.data",
  codeUrl: "Release/webgl.js",
  memUrl: "Release/webgl.mem",
};

function spacesList(params) {
  var scope = angular.element($("#controller")).scope();
  scope.setSpaces(params);
}

function floorsList(params) {
  var scope = angular.element($("#controller")).scope();
   scope.setFloors(params);
}

function overallViewSelectedSpace(params) {
  console.log(params);
}

angular.module('FacilityManager.viewer', ['ui.router', 'chart.js', 'ngMaterial'])

.controller('ViewerCtrl', ['$scope', '$timeout', '$rootScope', '$mdSidenav', function ($scope, $timeout, $rootScope, $mdSidenav) {
  $scope.spaces = [];
  $scope.floors = [];
  $scope.camera = 'orbit';
  $scope.boxesView = false;
  $scope.objectsView = false;
  $scope.activeSpace = null;

  $rootScope.values = {};

  $rootScope.values.ocupation = 4;
  $rootScope.values.temperature = 22;
  $rootScope.values.humidity = 12;
  $rootScope.values.consumption = 17.5;

  $scope.setSpaces = function(spaces) {
    var list = []

    for(var i=0 ; i < spaces.length; i++){
      list.push(JSON.parse(spaces[i]));
    }

    $scope.spaces = list;
    console.log($scope.spaces);
  }

  $scope.setFloors = function (floors) {
    $scope.floors = floors;
  }

  $scope.selectLevel = function (level) {
    SendMessage("ObjectManager", "toggleLevel", level);
  }

  $scope.toggleBoxesView = function () {
    $scope.boxesView = !$scope.boxesView;
    SendMessage("ObjectManager", "toggleBoxesView", "");
  }

  $scope.selectRoom = function (space) {

    if(!$mdSidenav('right').isOpen()){
      $scope.openSidenav();
    }

    $rootScope.name = space.spaceName;
    $rootScope.objects = space.facilityObjects;

    if(space.spaceName === 'Developers Room'){
      $rootScope.values.ocupation = 4;
      $rootScope.values.consumption = 17.5;
    }

    if(space.spaceName === 'Designers Room'){
      $rootScope.values.ocupation = 2;
      $rootScope.values.consumption = 12.5;
    }

    if(space.spaceName === 'WC 1' || space.spaceName === 'WC 2' || space.spaceName === 'WC 3'){
      $rootScope.values.ocupation = 0;
      $rootScope.values.consumption = 0;
    }

    if(space.spaceName === 'Meeting Room'){
      $rootScope.values.ocupation = 1;
      $rootScope.values.consumption = 8;
    }

    if(space.spaceName === 'Balcony'){
      $rootScope.values.ocupation = 0;
      $rootScope.values.consumption = 0;
    }

    SendMessage("ObjectManager", "selectSpace", space.spaceName);
  }

  $scope.setOrbitMode = function () {
    $scope.camera = 'orbit';
    SendMessage("ObjectManager", "orbitMode", "");
  }

  $scope.setNormalMode = function () {
    $scope.camera = 'normal';
    SendMessage("ObjectManager", "normalMode", "");
  }

  $scope.setOrthographic = function () {
    $scope.camera = 'orthographic';
    SendMessage("ObjectManager", "setOrthographic", "");
  }

  $scope.highlightObjects = function() {
    $scope.objectsView = !$scope.objectsView;
    SendMessage("ObjectManager", "highlightObjects", "");
  }

  $timeout(function () {
    SendMessage("ObjectManager", "availableFloors", "");
    SendMessage("ObjectManager", "availableSpaces", "");
  }, 20000)

  //For initializing the tooltips of bootstrap
  $(function () {
     $('[data-toggle="tooltip"]').tooltip()
   });

   function round(value, decimals) {
      return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    }

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
  $scope.openSidenav = function () {
    $mdSidenav('right').open();
  };

  $scope.closeSidenav = function () {
    $mdSidenav('right').close();
  }

}]);
