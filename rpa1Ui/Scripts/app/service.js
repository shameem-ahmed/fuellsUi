
app.factory("rpa1Service", ['$http', function ($http) {

    var apiUrl = "http://localhost:5100";

    var o = {};

    var token = window.localStorage.getItem("rpa1User");

    //alert(token);

    o.register = function (oRegister) { 
    
        return $http.post(apiUrl + "/user/register", oRegister);

    };

    o.login = function (oLogin) {

        return $http.post(apiUrl + "/user/login", oLogin);

    };

    o.getLogin = function () {

        var req = {
            method: 'GET',
            url: apiUrl + '/user/getlogin',
            headers: {
                "Authorization": "Bearer " + token
            }
        }

        return $http(req);

    };

    o.getRequests = function () {

        var req = {
            method: 'GET',
            url: apiUrl + '/user/getreqs',
            headers: {
                "Authorization": "Bearer " + token
            }
        }

        return $http(req);
    };

    o.getRequest = function (reqId) {
        var req = {
            method: 'GET',
            url: apiUrl + '/user/getreq/' + reqId,
            headers: {
                "Authorization": "Bearer " + token
            }
        }

        return $http(req);
    };

    o.getResponse = function (reqId) {

        var res = {
            method: 'GET',
            url: apiUrl + '/user/getres/' + reqId,
            headers: {
                "Authorization": "Bearer " + token
            }
        }

        return $http(res);
    };

    o.getResponseDetail = function (resId) {

        var res = {
            method: 'GET',
            url: apiUrl + '/user/getresdet/' + resId,
            headers: {
                "Authorization": "Bearer " + token
            }
        }

        return $http(res);
    };

    o.createRequest = function (request) {

        var req = {
            method: 'POST',
            url: apiUrl + '/user/createreq',
            headers: {
                "Authorization": "Bearer " + token
            },
            data: request
        }

        return $http(req);

    };

    return o;

}]);