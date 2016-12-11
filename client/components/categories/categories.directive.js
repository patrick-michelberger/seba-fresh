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

        const isParent = (currentCategoryId, categoryId) => {

          const regex = new RegExp(categoryId, "g");
          console.log("regex: ", regex);
          const str = `976759_976783_1006979`;

          const result = regex.exec(currentCategoryId);

          return (result !== null);
        };

        scope.isCategorySelected = (currentCategoryId, categoryId) => {
          return isParent(currentCategoryId, categoryId);
        };

        scope.openCategory = (category, ev) => {
          if (category.children.length > 0) {
            scope.selectCategory(category.id, category.name, ev);
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
