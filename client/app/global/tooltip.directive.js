angular.module('iLocation')
.directive("toggle", function () {
    return {
        link: function(scope, element, attrs){
          if (attrs.toggle=="tooltip"){
            $(element).tooltip();
          }
          if (attrs.toggle=="popover"){
            $(element).popover();
          }
        }
      };
});