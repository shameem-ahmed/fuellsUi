
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