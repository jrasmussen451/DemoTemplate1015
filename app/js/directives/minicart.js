angular.module('OrderCloud-Minicart', []);

angular.module('OrderCloud-Minicart')
    .directive('minicart', minicartDirective)
    .controller('minicartCtrl', minicartController)
;

function minicartDirective() {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'partials/controls/minicart.html',
        controller: 'minicartCtrl'
    };
}

minicartController.$inject = ['$scope', '$location', 'Order', 'OrderConfig', 'User'];
function minicartController($scope, $location, Order, OrderConfig, User) {
    $scope.removeItem = function(item, override) {
        if (override || confirm('Are you sure you wish to remove this item from your cart?') == true) {
            Order.deletelineitem($scope.currentOrder.ID, item.ID,
                function(order) {
                    $scope.currentOrder = order;
                    Order.clearshipping($scope.currentOrder);
                    if (!order) {
                        $scope.user.CurrentOrderID = null;
                        User.save($scope.user, function(){
                            $location.path('catalog');
                        });
                    }
                    $scope.displayLoadingIndicator = false;
                    $scope.actionMessage = 'Your Changes Have Been Saved';
                },
                function (ex) {
                    $scope.errorMessage = ex.Message.replace(/\<<Approval Page>>/g, 'Approval Page');
                    $scope.displayLoadingIndicator = false;
                }
            );
        }
    };

    $scope.cartCheckOut = function() {
        $scope.displayLoadingIndicator = true;
        if (!$scope.isEditforApproval)
            OrderConfig.address($scope.currentOrder, $scope.user);
        Order.save($scope.currentOrder,
            function(data) {
                $scope.currentOrder = data;
                $location.path($scope.isEditforApproval ? 'checkout/' + $routeParams.id : 'checkout');
                $scope.displayLoadingIndicator = false;
            },
            function(ex) {
                $scope.errorMessage = ex.Message;
                $scope.displayLoadingIndicator = false;
            }
        );
    };

    $scope.$on('event:orderUpdate', function(event, order){
        $scope.currentOrder = order ? (order.Status === 'Unsubmitted') ? order : null : null;
    })
};