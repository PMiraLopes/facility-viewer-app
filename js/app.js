angular.module('FacilityManager', [
  'FacilityManager.viewer',
  'FacilityManager.dashboard',
  'ui.router',
  'chart.js',
  'ngMaterial'
])

.config(function ($stateProvider, $urlRouterProvider) {
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/viewer");

  $stateProvider
    .state('viewer', {
        url: "/viewer",
        templateUrl: "partials/viewer.html",
        controller: "ViewerCtrl"
    });

  $stateProvider
    .state('dashboard', {
        url: "/dashboard",
        templateUrl: "partials/dashboard.html",
        controller: "DashboardCtrl"
    });
});
