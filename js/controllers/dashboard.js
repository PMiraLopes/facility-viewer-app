
angular.module('FacilityManager.dashboard', ['ui.router', 'chart.js', 'ngMaterial'])

.controller('DashboardCtrl', ['$scope', '$timeout', '$rootScope', '$mdSidenav', '$http', function ($scope, $timeout, $rootScope, $mdSidenav, $http) {

  $scope.data = null;

  $scope.date = new Date();

  $scope.currentYear = $scope.date.getFullYear();
  $scope.currentMonth = $scope.date.getMonth();

  $scope.minDate = new Date(
    $scope.currentYear - 1,
    $scope.currentMonth - 8,
    $scope.date.getDate()
  );

  $scope.maxDate = new Date(
    $scope.currentYear,
    $scope.currentMonth,
    $scope.date.getDate()
  );

  $scope.dates = {};
  $scope.dates.startYearDate = $scope.minDate;
  $scope.dates.endYearDate = $scope.maxDate;

  $scope.price = 1.357;
  $scope.colors = [ '#00ADF9', '#803690' ,'#46BFBD', '#FDB45C', '#DCDCDC', '#949FB1', '#4D5360'];


  $scope.months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  $scope.consumptionsSeries = ['Consumption (kWh)'];
  $scope.costsSeries = ['Costs (€)'];

  /////////////// YEARS /////////////////////

  $scope.yearBarLabels = [2015, 2016];
  $scope.yearBarConsumptionOptions = {
    title: {
      text: "Years overall electric consumptions (kWh)",
      display: true,
      padding: 10
    }
  }
  $scope.yearBarCostsOptions = {
    title: {
      text: "Years overall electric costs (€)",
      display: true,
      padding: 10
    }
  }

  $scope.yearResults = null;
  $scope.yearCosts = null;

////////////////////////// MONTHS ////////////////////////////////////

  $scope.monthlyConsumptionLineData = [[]];
  $scope.monthlyCostsLineData = [[]]
  $scope.monthlyConsumptionLineOptions = {
    title: {
      text: "Monthly consumption (kWh)",
      display: true,
      padding: 10
    }
  }
  $scope.monthlyCostsLineOptions = {
    title: {
      text: "Monthly costs (€)",
      display: true,
      padding: 10
    }
  }

  $scope.monthsCompareConsumptionLine = [[],[]];
  $scope.monthsCompareCostsLine = [[],[]];
  $scope.monthsCompareCostsLineOptions = {
    title: {
      text: "Monthly comparition of costs (€)",
      display: true,
      padding: 10
    }
  }
  $scope.monthsCompareConsumptionLineOptions = {
    title: {
      text: "Monthly comparition of consumption (kWh)",
      display: true,
      padding: 10
    }
  }


  $scope.applyYears = function () {
    var startYearData = $scope.getTotalDataFromYear($scope.dates.startYearDate.getFullYear());
    var endYearData = $scope.getTotalDataFromYear($scope.dates.endYearDate.getFullYear());

    $scope.yearBarConsumption = [ startYearData, endYearData];
    $scope.yearBarCosts = [
      startYearData * $scope.price,
      endYearData * $scope.price
    ];

    $scope.yearResults = Math.round(((endYearData - startYearData) * 100)/ startYearData);
    $scope.yearCosts = Math.round((endYearData - startYearData) * $scope.price);

    for(var i = 0; i < $scope.currentMonth; i++){
        $scope.monthlyConsumptionLineData[0].push($scope.data.years[1].data[i].total);
        $scope.monthlyCostsLineData[0].push($scope.data.years[1].data[i].total * $scope.price);
    }

    $scope.monthlyConsumptionResults = endYearData/($scope.currentMonth + 1);
    $scope.monthlyCostsResults = (endYearData * $scope.price)/($scope.currentMonth + 1);

  }


  $http.get('http://localhost:3000/consumption')
    .success(function(data) {
      $scope.data = data;
      console.log("Data loaded");

      var startYearData = data.years[0].total
      var endYearData = data.years[1].total;

      $scope.yearBarConsumption = [ startYearData, endYearData];
      $scope.yearBarCosts = [
        startYearData * $scope.price,
        endYearData * $scope.price
      ];

      $scope.yearResults = Math.round(((endYearData - startYearData) * 100)/ startYearData);
      $scope.yearCosts = Math.round((endYearData - startYearData) * $scope.price);

      for(var i = 0; i < 12; i++){
        if(i < $scope.currentMonth) {
          $scope.monthlyConsumptionLineData[0].push($scope.data.years[1].data[i].total);
          $scope.monthlyCostsLineData[0].push($scope.data.years[1].data[i].total * $scope.price);
          $scope.monthsCompareConsumptionLine[0].push($scope.data.years[1].data[i].total);
          $scope.monthsCompareCostsLine[0].push($scope.data.years[1].data[i].total * $scope.price);
        }

        $scope.monthsCompareConsumptionLine[1].push($scope.data.years[0].data[i].total);
        $scope.monthsCompareCostsLine[1].push($scope.data.years[0].data[i].total * $scope.price);
      }

      $scope.monthlyConsumptionResults = endYearData/($scope.currentMonth + 1);
      $scope.monthlyCostsResults = (endYearData * $scope.price)/($scope.currentMonth + 1);

    /*  for (var i = 0; i < data.years.length; i++){
        $scope.barLabels.push(data.years[i].year);
        $scope.barData[0].push(data.years[i].total);
        var yearData = [];

        for (var k = 0; k < data.years[i].data.length; k++){
          yearData.push(data.years[i].data[k].total);
        }

        if(i < 1){
        //  $scope.chartData.push(yearData);
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
      }*/
    })
    .error(function(data){
      console.log('Error: ' + data);
    });

  $scope.getMonth = function (month) {
    return $scope.months[month];
  }

  $scope.getDataFromYear = function(year){
    for(var i = 0; $scope.data.years.length; i++){
      if($scope.data.years[i].year === year ){
        return $scope.data.years[i].yearData;
      }
    }
    return [];
  };

  $scope.getTotalDataFromYear = function(year){
    if($scope.data != null){
      for(var i = 0; $scope.data.years.length; i++){
        if($scope.data.years[i].year === year ){
          return $scope.data.years[i].total;
        }
      }
    }
    return 0;
  };

/*

  /*$scope.barLabels = [2015, 2016];
  $scope.barData = [$scope.getTotalDataFromYear($scope.defaultMinYear), $scope.getTotalDataFromYear($scope.defaultMaxYear)];
  $scope.barSeries = ['Consumption (kWh)'];
  $scope.barOptions = {
    title: {
      text: "Years overall electric consumptions",
      display: true,
      padding: 10
    }
  }

  $scope.chartLabels = $scope.months;
  $scope.chartData = [];
  $scope.chartSeries = ['Consumption (kWh)'];
  $scope.chartOptions = {
    title: {
      text: "Monthly electric consumption",
      display: true,
      padding: 10
    }
  }

  $scope.yearsChartData = [$scope.defaultMinYear, $scope.defaultMaxYear];
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

  $scope.priceChartLabels = $scope.months;
  $scope.priceChartData = [[]];
  $scope.priceChartSeries = ['Costs (€)'];
  $scope.priceChartOptions = {
    title: {
      text: "Monthly costs of electric consumption",
      display: true,
      padding: 10
    }
  }

  ///////// SIDEBAR /////////
  $scope.toggleLeft = buildToggler('left');
  $scope.toggleRight = buildToggler('right');

  function buildToggler(componentId) {
    return function() {
      $mdSidenav(componentId).toggle();
    }
  }*/

}]);
