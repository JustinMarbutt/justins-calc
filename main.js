var app = angular.module("justins-calc", []); 
app.controller("Calc", function($scope) {

    // Bound to the output display
    $scope.output = "0";

    // Used to evaluate whether to start a new number
    // in the display and when to concatenate
    $scope.newNumber = true;

    // variable for the value to manipulate the total
    $scope.pendingValue = null;

    // The token corrisponding to the operation to be performed
    $scope.operationToken = "";

    // The total value that the calculation answers are stored and displayed from
    $scope.runningTotal = null;

    // Indicates if an operation has been selected
    $scope.pendingOperation = false;
    
    // Clear btn text for the user
    $scope.clearBtnDisplay = "AC";

    // Constants
    var ADD_TOKEN = "+";
    var SUBTRACT_TOKEN = "-";
    var MULTIPLY_TOKEN = "*";
    var DIVIDE_TOKEN = "/";

    // Updates the string of output displayed to the user
    $scope.updateOutput = function (btn) {
        if ($scope.output == "0" || $scope.newNumber) {
            $scope.output = btn;
            $scope.newNumber = false;
            if(!$scope.pendingOperation){
                $scope.runningTotal = null;
                $scope.operationToken = "";
            }
        } else {
            $scope.output += String(btn);
        }
        $scope.pendingValue = toNumber($scope.output);
        $scope.clearBtnDisplay = "C";
    };

    // Queues the next operation to take place in the calculator
    $scope.queueOp = function(token){
        if($scope.pendingValue == null){
            $scope.pendingValue = 0;
        }
        if($scope.runningTotal == null){
            $scope.runningTotal = 0;
        }
        if($scope.newNumber){
            $scope.pendingValue = null;
        }
        if ($scope.pendingValue) {
            $scope.runningTotal = $scope.pendingValue;
        }
        $scope.operationToken = token;
        $scope.output = String($scope.runningTotal);
        $scope.newNumber = true;
        //$scope.pendingValue = null;
        $scope.pendingOperation = true;
    }
    
    // Performs the operation that has been queued with the 
    // runningTotal and the pending value
    $scope.calculate = function () {
        if($scope.operationToken != ""){
            if (!$scope.newNumber) {
                $scope.pendingValue = toNumber($scope.output);
                $scope.lastValue = $scope.pendingValue;
            }
            if ($scope.operationToken == ADD_TOKEN) {
                $scope.runningTotal += $scope.pendingValue;
            } else if ($scope.operationToken == SUBTRACT_TOKEN) {
                $scope.runningTotal -= $scope.pendingValue;
            }else if ($scope.operationToken == MULTIPLY_TOKEN) {
                $scope.runningTotal = $scope.runningTotal * $scope.pendingValue;
            }else if ($scope.operationToken == DIVIDE_TOKEN) {
                $scope.runningTotal = $scope.runningTotal / $scope.pendingValue;
            } else {
                $scope.runningTotal = 0;
            }
            $scope.output = String($scope.runningTotal);
            $scope.newNumber = true;
            $scope.pendingOperation = false;
        }
    };

    // Performs the function of percentage on the displayed value
    $scope.percentage = function(){
        if(toNumber($scope.output) == $scope.pendingValue){
            $scope.pendingValue = $scope.pendingValue / 100;
            $scope.output = String($scope.pendingValue);
        } else {
            $scope.runningTotal = $scope.runningTotal / 100;
            $scope.output = String($scope.runningTotal);
        }
    };

    // Changes the sign of the output
    $scope.changeSign = function(){
        if(toNumber($scope.output) == $scope.pendingValue){
            $scope.pendingValue = $scope.pendingValue * -1;
            $scope.output = String($scope.pendingValue);
        } else {
            $scope.runningTotal = $scope.runningTotal * -1;
            $scope.output = String($scope.runningTotal);
        }
    };

    $scope.clear = function(){
        $scope.clearBtnDisplay = "AC";
        if($scope.runningTotal != null && $scope.pendingOperation && $scope.pendingValue == null && $scope.output != "0"){
            $scope.pendingValue = null;
            $scope.output = "0";
        }
        else if($scope.pendingValue != null && !$scope.pendingOperation){
            $scope.pendingOperation = false;
            $scope.operationToken = "";
            $scope.runningTotal = null
            $scope.newNumber = true;
            $scope.output = "0";
        }
        else if($scope.pendingOperation && $scope.pendingValue == null){
            $scope.pendingOperation = false;
            $scope.operationToken = "";
            $scope.runningTotal = null
            $scope.newNumber = true;
            $scope.output = "0";
        }
        else if($scope.runningTotal != null  && $scope.pendingOperation){
            $scope.output = "0";
            $scope.pendingValue = null;
        }
        else{
            $scope.pendingOperation = false;
            $scope.operationToken = "";
            $scope.runningTotal = null
            $scope.newNumber = true;
        }

    }

    
    // Helper function to conver the strings in the display
    // to numbers for calculation
    toNumber = function (numberString) {
        var result = 0;
        if (numberString) {
            result = numberString * 1;
        }
        return result;
    };

});