
angular.module('FacilityManager.dashboard', ['ui.router', 'chart.js', 'ngMaterial'])

.controller('DashboardCtrl', ['$scope', '$timeout', '$rootScope', '$mdSidenav', '$http', function ($scope, $timeout, $rootScope, $mdSidenav, $http) {

  $scope.price = 1.357;

  $scope.colors = [ '#00ADF9', '#803690' ,'#46BFBD', '#FDB45C', '#DCDCDC', '#949FB1', '#4D5360']

  $scope.barLabels = [];
  $scope.barData = [[]];
  $scope.barSeries = ['Consumption (kWh)'];
  $scope.barOptions = {
    title: {
      text: "Years overall electric consumptions",
      display: true,
      padding: 10
    }
  }

  $scope.chartLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  $scope.chartData = [];
  $scope.chartSeries = ['Consumption (kWh)'];
  $scope.chartOptions = {
    title: {
      text: "Monthly electric consumption",
      display: true,
      padding: 10
    }
  }

  $scope.yearsChartData = [];
  $scope.yearsChartSeries = ['2015\'s consumption', '2016\'s consumption'];
  $scope.yearsChartOptions = {
    title: {
      text: "Month compare of electric consumption",
      display: true,
      padding: 10
    }
  }

  $scope.pieChartData = [];
  $scope.pieChartLabels = ['Developers', 'Designers', 'Meeting', 'Wc 1', 'Wc 2', 'Wc 3'];
  $scope.pieChartOptions = {
    title: {
      text: "Monthly room's percentage of electric consumption",
      display: true,
      padding: 10
    }
  }

  $scope.priceChartLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  $scope.priceChartData = [[]];
  $scope.priceChartSeries = ['Costs (€)'];
  $scope.priceChartOptions = {
    title: {
      text: "Monthly costs of electric consumption",
      display: true,
      padding: 10
    }
  }

  $http.get('http://localhost:3000/consumption')
    .success(function(data) {
      $scope.data = data;
      for (var i = 0; i < data.years.length; i++){
        $scope.barLabels.push(data.years[i].year);
        $scope.barData[0].push(data.years[i].total);
        var yearData = [];

        for (var k = 0; k < data.years[i].data.length; k++){
          yearData.push(data.years[i].data[k].total);
        }

        if(i < 1){
          $scope.chartData.push(yearData);
          $scope.pieChartData = [
            data.years[0].data[0].total * (2/6),
            data.years[0].data[0].total * (2/6),
            data.years[0].data[0].total * (1/6),
            data.years[0].data[0].total * (0.4/6),
            data.years[0].data[0].total * (0.3/6),
            data.years[0].data[0].total * (0.3/6)
          ];
        }
        console.log($scope.chartData[0]);
        for( var j = 0; j < $scope.chartData[0].length; j++){
          $scope.priceChartData[0].push($scope.chartData[0][j] * $scope.price);
        }
        console.log($scope.priceChartData);
        $scope.yearsChartData.push(yearData);
      }
    })
    .error(function(data){
      console.log('Error: ' + data);
    });

  ///////// SIDEBAR /////////
  $scope.toggleLeft = buildToggler('left');
  $scope.toggleRight = buildToggler('right');

  function buildToggler(componentId) {
    return function() {
      $mdSidenav(componentId).toggle();
    }
  }

}]);
