
var app = angular.module("rpa1", []);

//REQUEST CONTROLLER
//
app.controller("loginController", function ($scope, $http, rpa1Service) {

    $scope.login = { email: '', password: '', isRemember: false };

    $scope.register = { name: '', email: '', password: '', confirmPassword: "" };

    $scope.doRegister = function () {
        //alert('doRegister');

        if ($scope.register.email.length === 0) {
            alert('Please type email.');
            return;
        }

        if ($scope.register.name.length === 0) {
            alert('Please type name.');
            return;
        }

        if ($scope.register.password.length === 0) {
            alert('Please type password.');
            return;
        }

        if ($scope.register.password !== $scope.register.confirmPassword) {
            alert('Password does not match.');
            return;
        }

        rpa1Service.register($scope.register).then(function (success) {

            alert('Registration successfull.');

            //debugger;

            window.localStorage.setItem("rpa1User", success.data.token);
            window.location.replace("/request");


        }, function (error) {

            alert('Registration failed.' + error.message);


        });

    };

    $scope.doLogin = function () {
        //alert('doLogin');

        if ($scope.login.email.length === 0) {
            alert('Please type email.');
            return;
        }

        if ($scope.login.password.length === 0) {
            alert('Please type password.');
            return;
        }

        rpa1Service.login($scope.login).then(function (success) {

            alert('Login successfull.');

            //debugger;

            window.localStorage.setItem("rpa1User", success.data.token);
            window.location.replace("/request");




        }, function (error) {

            //debugger

            alert('Registration failed. ' + error.data.message);

        });

    };

});

//REQUEST CONTROLLER
//
app.controller("requestController", function ($scope, $http, rpa1Service) {

    $scope.currentUser = {};
    
    $scope.listRequests = [];

    $scope.newRequest = { title: 'aaa', time: "1", type: "1", search1: "sss", search2: "ddd", search3: "fff", country: "1", filter: "ggg" };

    $scope.init = function () {
        
        rpa1Service.getLogin().then(function (success) {

            $scope.currentUser = success.data;

            $scope.fillRequests();

        }, function (error) {

            alert('getLogin failed.' + error.message);

        });
    };

    $scope.fillRequests = function () {

        rpa1Service.getRequests().then(function (success) {

            console.log(success.data);

            $scope.listRequests = success.data;

        }, function (error) {

            alert('GetRequests failed.' + error.message);

        });
    };

    $scope.createRequest = function () {
        //alert('createRequest');

        if ($scope.newRequest.title.length === 0) {
            alert('Please type title.');
            return;
        }

        if ($scope.newRequest.search1.length === 0) {
            alert('Please type atleast 1 search.');
            return;
        }

        rpa1Service.createRequest($scope.newRequest).then(function (success) {

            alert('Request created successfull.');

            $scope.fillRequests();

        }, function (error) {

            alert('Registration failed.' + error.message);
        });
    };
});