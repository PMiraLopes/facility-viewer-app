
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
  $scope.days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
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
      text: "Current year monthly consumption (kWh)",
      display: true,
      padding: 10
    }
  }
  $scope.monthlyCostsLineOptions = {
    title: {
      text: "Current year monthly costs (€)",
      display: true,
      padding: 10
    }
  }

  $scope.monthsCompareConsumptionLine = [[],[]];
  $scope.monthsCompareCostsLine = [[],[]];
  $scope.monthsCompareCostsLineOptions = {
    title: {
      text: "Monthly costs comparition (€)",
      display: true,
      padding: 10
    }
  }
  $scope.monthsCompareConsumptionLineOptions = {
    title: {
      text: "Monthly consumption comparition (kWh)",
      display: true,
      padding: 10
    }
  }
  $scope.monthsCompareConsumptionSeries = ["2016's monthly compsumption (kWh)", "2015's monthly compsumption (kWh)"]


  $scope.pieChartLabels = ['Developers', 'Designers', 'Meeting', 'Wc 1', 'Wc 2', 'Wc 3'];
  $scope.pieYearOptions = {
    title: {
      text: "2016's consumption by room (kWh)",
      display: true,
      padding: 10
    }
  }


//////////// DAYS /////////////////////
  $scope.dailyCostsLineData = [[],[]];
  $scope.dailyCostSeries = ["1st month daily costs", "2nd month daily costs"]
  $scope.dailyCostsOptions = {
    title: {
      text: "Daily costs comparition (€)",
      display: true,
      padding: 10
    }
  }

  $scope.dailyConsumptionLineData = [[],[]];
  $scope.dailyConsumptionSeries = ["1st month daily compsumption", "2nd month daily compsumption"]
  $scope.dailyConsumptionOptions = {
    title: {
      text: "Daily consumption comparition (kWh)",
      display: true,
      padding: 10
    }
  }

  $scope.dailyCurrentConsumptionLineData = [[]];
  $scope.dailyCurrentConsumptionSeries = ["Daily compsumption"]
  $scope.dailyCurrentConsumptionOptions = {
    title: {
      text: "Current month daily consumption",
      display: true,
      padding: 10
    }
  }

  $scope.dailyCurrentCostsLineData = [[]];
  $scope.dailyCurrentCostsSeries = ["Daily costs"]
  $scope.dailyCurrentCostsOptions = {
    title: {
      text: "Current month daily costs",
      display: true,
      padding: 10
    }
  }


  $scope.applyYears = function () {
    var startYearData = $scope.getTotalDataFromYear($scope.dates.startYearDate.getFullYear());
    var endYearData = $scope.getTotalDataFromYear($scope.dates.endYearDate.getFullYear());

    var startMonthData = $scope.getDataFromMonth($scope.dates.startYearDate.getFullYear(), $scope.dates.startYearDate.getMonth());
    var endMonthData = $scope.getDataFromMonth($scope.dates.endYearDate.getFullYear(), $scope.dates.endYearDate.getMonth());

    $scope.pieYearData = [
      Math.round((endYearData * 35) / 100),
      Math.round((endYearData * 30) / 100),
      Math.round((endYearData * 22) / 100),
      Math.round((endYearData * 5) / 100),
      Math.round((endYearData * 5) / 100),
      Math.round((endYearData * 3) / 100)
    ];

    $scope.yearBarConsumption = [ startYearData, endYearData];
    $scope.yearBarCosts = [
      startYearData * $scope.price,
      endYearData * $scope.price
    ];

    $scope.yearResults = Math.round(((endYearData - startYearData) * 100)/ startYearData);
    $scope.yearCosts = Math.round((endYearData - startYearData) * $scope.price);

    $scope.monthlyConsumptionResults = endYearData/($scope.currentMonth + 1);
    $scope.monthlyCostsResults = (endYearData * $scope.price)/($scope.currentMonth + 1);

    $scope.dailyConsumptionLineData[0] = startMonthData.data;
    $scope.dailyConsumptionLineData[1] = endMonthData.data;

    $scope.dailyCostsLineData[0] = startMonthData.data.map(function(x) { return x * $scope.price; });
    $scope.dailyCostsLineData[1] = endMonthData.data.map(function(x) { return x * $scope.price; });

    $scope.averageMonthResults = Math.round(((startMonthData.average - endMonthData.average) * 100)/ startMonthData.average);
    $scope.monthCosts = Math.round((endMonthData.total - startMonthData.total) * $scope.price);

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

      console.log(endYearData);

      $scope.pieYearData = [
        Math.round((endYearData * 35) / 100),
        Math.round((endYearData * 30) / 100),
        Math.round((endYearData * 22) / 100),
        Math.round((endYearData * 5) / 100),
        Math.round((endYearData * 5) / 100),
        Math.round((endYearData * 3) / 100)
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

      var currentMonthData = $scope.getDataFromMonth($scope.currentYear, $scope.currentMonth);

      $scope.dailyCurrentConsumptionLineData[0] = currentMonthData.data;
      $scope.dailyCurrentCostsLineData[0] = currentMonthData.data.map(function(x) { return x * $scope.price; });
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

  $scope.getDataFromMonth = function(year, month){
    console.log(year, month)
    for(var i = 0; $scope.data.years.length; i++){
      if($scope.data.years[i].year === year ){
        return $scope.data.years[i].data[month];
      }
    }
    return [];
  };
}]);
