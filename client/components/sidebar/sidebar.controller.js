'use strict';

const isParent = (currentCategoryId, categoryId) => {
  const regex = new RegExp(categoryId, "g");
  const str = `976759_976783_1006979`;
  const result = regex.exec(currentCategoryId);
  return (result !== null);
};

class SidebarController {
  constructor($state, $stateParams, FirebaseUser, CategoryService, DialogService, $mdSidenav) {
    const self = this;
    this.$mdSidenav = $mdSidenav;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.currentUser = FirebaseUser.getCurrentUser();
    this.DialogService = DialogService;
    CategoryService.query({}, function(data) {
      self.categories = data;
    });
  }

  isLoggedIn() {
    return !!this.currentUser.auth;
  }

  /**
   * Close sidebar
   */
  close() {
    var self = this;
    this.$mdSidenav('left').close()
      .then(function() {});
  }

  changeProvider() {
    this.DialogService.showProviderModal();
    this.close();
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
