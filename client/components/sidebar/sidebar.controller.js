'use strict';

const isParent = (currentCategoryId, categoryId) => {

  console.log("currentCategoryId: ", currentCategoryId);
  console.log("categoryId: ", categoryId);

  const regex = new RegExp(categoryId, "g");
  const str = `976759_976783_1006979`;

  const result = regex.exec(currentCategoryId);


  console.log("result: ", (result !== null));

  return (result !== null);
};

class SidebarController {
  constructor($state, $stateParams, FirebaseUser, CategoryService, $mdSidenav) {
    const self = this;
    this.$mdSidenav = $mdSidenav;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.currentUser = FirebaseUser.getCurrentUser();
    CategoryService.query({}, function(data) {
      self.categories = data;
    });
  }

  /**
   * Close sidebar
   */
  close() {
    var self = this;
    this.$mdSidenav('left').close()
      .then(function() {});
  }

  selectCategory(categoryId, categoryName, ev) {
    this.$state.go('categories.single', {
      categoryId: categoryId,
      categoryName: categoryName
    });
    this.close();
  }

  isCategorySelected(currentCategoryId, categoryId) {
    return isParent(currentCategoryId, categoryId);
  };

}

angular.module('sebaFreshApp')
  .controller('SidebarController', SidebarController);
