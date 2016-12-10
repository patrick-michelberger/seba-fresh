'use strict';

angular.module('sebaFreshApp')
  .directive('categories', function(CategoryService, $stateParams, $state, $mdDialog) {
    return {
      templateUrl: 'components/categories/categories.html',
      restrict: 'E',
      link: function(scope, element) {

        scope.state = $stateParams;

        CategoryService.query({}, function(data) {
          scope.categories = data;
        });

        scope.openCategory = (category, ev) => {
          if (category.children.length > 0) {
            ev.$mdOpenMenu();
          } else {
            scope.selectCategory(category.id, category.name, ev);
          }
        };

        scope.selectCategory = function(categoryId, categoryName, ev) {
          $state.go('categories.single', {
            categoryId: categoryId,
            categoryName: categoryName
          });
        };

        element.addClass('categories');
      }
    };
  });
