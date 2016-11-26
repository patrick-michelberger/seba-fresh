'use strict';

angular.module('sebaFreshApp')
  .directive('recompileOn', ($compile) => {
    return {
      scope: true,
      priority: 5,
      restrict: 'A',
      transclude: false,
      link: (scope, element, attrs) => {
        var removeListener;
        var html = element[0].outerHTML;

        // Internal: Will trigger a recompilation if the event is triggered.
        const recompileOnEvent = (eventName) => {
          scope.$on(eventName, (event) => {

            // Remove the previously added listener, if any.
            if (removeListener) {
              removeListener();
            }

            // Replace the element after the digest loop that triggered the event has ended
            scope.$evalAsync(() => {
              const newElement = $compile(html)(scope.$parent);
              element.replaceWith(newElement);

              // Destroy the old scope, since a new one was created by using compile.
              scope.$destroy();
            });
          });
        };

        removeListener = recompileOnEvent(attrs.recompileOn);

      },
    };
  });
