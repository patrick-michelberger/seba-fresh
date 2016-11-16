'use strict';

angular.module('sebaFreshApp')
  .directive('categories', function(CategoryService) {
    return {
      templateUrl: 'components/categories/categories.html',
      restrict: 'E',
      link: function(scope, element) {
        CategoryService.query({}, function(data) {
          console.log("fetched ", data);
          scope.categories = data;
        });
        element.addClass('categories');
      }
    };
  });
