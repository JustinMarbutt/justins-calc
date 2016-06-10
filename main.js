var app = angular.module("justins-calc", []); 

app.service("Logger", function($http){
    this.options = {
        host: 'http://127.0.0.1:3000',
        path: '/calclogger',
        method: 'POST'
    };

    this.sendStuff = function(stuff){
        var obj = {'answer': stuff}
        $http.post(this.options.host+this.options.path, obj)
        .then(function successCallback(response) {
            // this callback will be called asynchronously
            // when the response is available
            console.log("Success: ", response);
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("Error: ", response);
        });
    };

});

app.service("Calc", function(Logger) {

    // Bound to the output display
    this.output = "0";

    // Used to evaluate whether to start a new number
    // in the display and when to concatenate
    this.newNumber = true;

    // variable for the value to manipulate the total
    this.pendingValue = null;

    // The token corrisponding to the operation to be performed
    this.operationToken = "";

    // The total value that the calculation answers are stored and displayed from
    this.runningTotal = null;

    // Indicates if an operation has been selected
    this.pendingOperation = false;
    
    // Clear btn text for the user
    this.clearBtnDisplay = "AC";

    // Constants
    var ADD_TOKEN = "+";
    var SUBTRACT_TOKEN = "-";
    var MULTIPLY_TOKEN = "*";
    var DIVIDE_TOKEN = "/";

    // Updates the string of output displayed to the user
    this.updateOutput = function (btn) {
        if (this.output == "0" || this.newNumber) {
            this.output = btn;
            this.newNumber = false;
            if(!this.pendingOperation){
                this.runningTotal = null;
                this.operationToken = "";
            }
        } else {
            this.output += String(btn);
        }
        this.pendingValue = toNumber(this.output);
        this.clearBtnDisplay = "C";
    };

    // Queues the next operation to take place in the calculator
    this.queueOp = function(token){
        if(this.pendingValue == null){
            this.pendingValue = 0;
        }
        if(this.runningTotal == null){
            this.runningTotal = 0;
        }
        if(this.newNumber){
            this.pendingValue = null;
        }
        if (this.pendingValue) {
            this.runningTotal = this.pendingValue;
        }
        this.operationToken = token;
        this.output = String(this.runningTotal);
        this.newNumber = true;
        //this.pendingValue = null;
        this.pendingOperation = true;
    }
    
    // Performs the operation that has been queued with the 
    // runningTotal and the pending value
    this.calculate = function () {
        if(this.operationToken != ""){
            if (!this.newNumber) {
                this.pendingValue = toNumber(this.output);
                this.lastValue = this.pendingValue;
            }
            if (this.operationToken == ADD_TOKEN) {
                this.runningTotal += this.pendingValue;
            } else if (this.operationToken == SUBTRACT_TOKEN) {
                this.runningTotal -= this.pendingValue;
            }else if (this.operationToken == MULTIPLY_TOKEN) {
                this.runningTotal = this.runningTotal * this.pendingValue;
            }else if (this.operationToken == DIVIDE_TOKEN) {
                this.runningTotal = this.runningTotal / this.pendingValue;
            } else {
                this.runningTotal = 0;
            }
            this.output = String(this.runningTotal);
            Logger.sendStuff(this.output);
            this.newNumber = true;
            this.pendingOperation = false;
        }
    };

    // Performs the function of percentage on the displayed value
    this.percentage = function(){
        if(toNumber(this.output) == this.pendingValue){
            this.pendingValue = this.pendingValue / 100;
            this.output = String(this.pendingValue);
        } else {
            this.runningTotal = this.runningTotal / 100;
            this.output = String(this.runningTotal);
        }
    };

    // Changes the sign of the output
    this.changeSign = function(){
        if(toNumber(this.output) == this.pendingValue){
            this.pendingValue = this.pendingValue * -1;
            this.output = String(this.pendingValue);
        } else {
            this.runningTotal = this.runningTotal * -1;
            this.output = String(this.runningTotal);
        }
    };

    this.clear = function(){
        this.clearBtnDisplay = "AC";
        if(this.runningTotal != null && this.pendingOperation && this.pendingValue == null && this.output != "0"){
            this.pendingValue = null;
            this.output = "0";
        }
        else if(this.pendingValue != null && !this.pendingOperation){
            this.pendingOperation = false;
            this.operationToken = "";
            this.runningTotal = null
            this.newNumber = true;
            this.output = "0";
        }
        else if(this.pendingOperation && this.pendingValue == null){
            this.pendingOperation = false;
            this.operationToken = "";
            this.runningTotal = null
            this.newNumber = true;
            this.output = "0";
        }
        else if(this.runningTotal != null  && this.pendingOperation){
            this.output = "0";
            this.pendingValue = null;
        }
        else{
            this.pendingOperation = false;
            this.operationToken = "";
            this.runningTotal = null
            this.newNumber = true;
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

    return this;

});

app.controller("Calculator", function($scope, Calc){
    $scope.calc = Calc;
});