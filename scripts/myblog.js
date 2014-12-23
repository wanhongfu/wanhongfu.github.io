(function() {
	var app;
	var converter = new Showdown.converter();

	app = angular.module('blog', ['ngSanitize']).config([
         '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
           $locationProvider.html5Mode(false).hashPrefix('!');
           return $routeProvider.when("", {
             templateUrl: "templates/blog-list.html"
           }).when("/blogs/:postPath", {
             templateUrl: "templates/post.html"
           });
         }
       ]).directive('ngMarkdown', function() {
         return function(scope, element, attrs) {
           return scope.$watch(attrs.ngMarkdown, function(value) {
             var el, html, _i, _len, _ref;
             if (value != null) {
               html = converter.makeHtml(value);
               element.html(html);
             }
           });
         };
       }).factory("indexService", function($http) {
         var indexService;
         indexService = {
           async: function() {
             var promise;
             promise = $http.get('blogs/index.json').then(function(response) {
               return response.data;
             });
             return promise;
           }
         };
         return indexService;
       });
	
	app.controller('IndexListCtrl', function($scope, $routeParams, indexService) {
	    return indexService.async().then(function(data) {	    	
	      $scope.indexList = data;
	      indexService.indexData = data;
	    });
	  });

	  app.controller('PostCtrl', function($scope, $http, $routeParams, indexService) {		  
	    return $http.get("blogs/" + $routeParams.postPath + ".md").success(function(data) {
	      $scope.postContent = data;
	    });
	  });
	
}).call(this);