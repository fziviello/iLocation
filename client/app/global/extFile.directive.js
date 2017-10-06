angular.module('iLocation')
.directive('file', function() {
    return {
        require:"ngModel",
        restrict: 'A',
        link: function($scope, el, attrs, ngModel){
            el.bind('change', function(changeEvent){
                var files = changeEvent.target.files;
                var file = files[0];
                ngModel.$setViewValue(file);
                $scope.$apply();
            });
        },
    };
});