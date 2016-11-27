'use strict';

class SettingsController {
  constructor() {
    this.errors = {};
    this.submitted = false;
  }

  changePassword(form) {
    this.submitted = true;

    if (form.$valid) {
      /* TODO Write with firebase auth
      this.Auth.changePassword(this.user.oldPassword, this.user.newPassword)
        .then(() => {
          this.message = 'Password successfully changed.';
        })
        .catch(() => {
          form.password.$setValidity('mongoose', false);
          this.errors.other = 'Incorrect password';
          this.message = '';
        });
        */
    }
  }
}

angular.module('sebaFreshApp')
  .controller('SettingsController', SettingsController);
