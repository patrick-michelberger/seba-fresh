'use strict';

(function () {

  /**
   * The Dialog service
   */
  function DialogService($mdDialog) {
    var Dialog = {
      showAlert(title, content, actionLabel) {
        $mdDialog.show(
          $mdDialog.alert()
          .parent(angular.element(document.querySelector('#sf-popup-container')))
          .clickOutsideToClose(true)
          .title(title)
          .textContent(content)
          .ariaLabel(title)
          .ok(actionLabel)
        );
      }
    };
    return Dialog;
  }

  angular.module('sebaFreshApp')
    .factory('DialogService', DialogService);

})();
