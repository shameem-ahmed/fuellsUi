var apiUrl = "http://localhost:5000/";

var token = localStorage.getItem("fuelUser");

var isAdmin = false;

//if (token) {
//    $.ajaxSetup({
//        headers: {
//            'x-access-token': token
//        }
//    });
//}

var fuLib = {

    navigation: {
        load: function(crPage) {
            //alert('in load navigation');

            return (
                //get login user details
                fuLib.user.getLogin().success(function(user, status, xhr) {

                    if (user) {

                        isAdmin = user.isAdmin;

                        $("#profileName").text(user.name);
                        $("#profileRole").text(user.isAdmin ? "Administrator" : "Not Admin");

                        if (user.person === null) {
                            $("#profileImg1").attr("src", "../assets/images/users/no-image.jpg");
                            $("#profileImg2").attr("src", "../assets/images/users/no-image.jpg");
                        }
                        else {

                            $("#profileImg1").attr("src", "../assets/images/users/" + user.person.photo);
                            $("#profileImg2").attr("src", "../assets/images/users/" + user.person.photo);

                            $("#profileName").text(user.person.name);

                        }

                        fuLib.user.getAccess().success(function(access, status, xhr) {
                            access = access.sort(function(a, b){
                                return a.pageIndex - b.pageIndex;
                            });

                            $(access).each(function(index) {

                                $("#ulNav").append('<li id="' + this.pageId + '"><a href="' + this.pageFile + '"><span class="' + this.pageIcon + '"></span><span class="xn-text">' + this.pageTitle + '</span></a></li>');

                            });

                            if (crPage) {
                                //$("[id^=liPage]").removeClass("active");
                                $('#' + crPage).addClass("active");
                            }

                        }).error(function(xhr, status, error) {
                            //user.getAccess failed
                            handleError('user.getAccess', xhr, status, error);
                        });

                    }

                }).error(function(xhr, status, error) {
                    //user.getLogin failed
                    handleError('user.getLogin', xhr, status, error);
                })
            );
        }
    },

    user: {

        jwtToken: token,

        getAll: function() {
            return (
                $.ajax({
                    url: apiUrl + "user/getall",
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getOne: function(id) {
            return (
                $.ajax({
                    url: apiUrl + "user/getone/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getLogin: function() {
            return (
                $.ajax({
                    url: apiUrl + "user/getlogin",
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getAccess: function() {
            return (
                $.ajax({
                    url: apiUrl + "user/getaccess",
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        login: function(name, pwd) {
            return (
                $.ajax({
                    url: apiUrl + "user/login",
                    data: JSON.stringify({ name:name, pwd:pwd }),
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json"
                })
            );
        },

        add: function (user) {
            return (
                $.ajax({
                    url: apiUrl + "user/add",
                    data: JSON.stringify(user),
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },
    },

    person: {

        getAll: function () {
            return (
                $.ajax({
                    url: apiUrl + "person/getall",
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getOne: function (id) {
            return (
                $.ajax({
                    url: apiUrl + "person/getone/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        add: function (person) {
            return (
                $.ajax({
                    url: apiUrl + "person/add",
                    data: JSON.stringify(person),
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },
    },

    address: {

        getAll: function () {
            return (
                $.ajax({
                    url: apiUrl + "address/getall",
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getOne: function (id) {
            return (
                $.ajax({
                    url: apiUrl + "address/getone/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        add: function (address) {
            return (
                $.ajax({
                    url: apiUrl + "address/add",
                    data: JSON.stringify(address),
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },
    },

    access: {

        getAccess: function (userId) {
            return (
                $.ajax({
                    url: apiUrl + "access/getaccess/" + userId,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        updateMulti: function (aAccess) {
            return (
                $.ajax({
                    url: apiUrl + "access/updatemulti",
                    data: JSON.stringify({ accessCode: aAccess }),
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        }
    },

    lov: {

        getAll: function() {
            return (
                $.ajax({
                    url: apiUrl + "lov/getall",
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getOne: function(id) {
            return (
                $.ajax({
                    url: apiUrl + "lov/getone/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getLovPersonGovtCodes: function () {
            return (
                $.ajax({
                    url: apiUrl + "lov/getlov/10",
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getLovCompanyGovtCodes: function () {
            return (
                $.ajax({
                    url: apiUrl + "lov/getlov/3",
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

    },

    gloc: {

        getLoc: function (id) {
            return (
                $.ajax({
                    url: apiUrl + "gloc/getone/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getCountries: function () {
            return (
                $.ajax({
                    url: apiUrl + "gloc/getcountries",
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getStates: function (parent) {
            return (
                $.ajax({
                    url: apiUrl + "gloc/getstates/" + parent,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getCities: function (parent) {
            return (
                $.ajax({
                    url: apiUrl + "gloc/getcities/" + parent,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getAreas: function (parent) {
            return (
                $.ajax({
                    url: apiUrl + "gloc/getareas/" + parent,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        }
    },

    supplier: {

        getAll: function () {
            return (
                $.ajax({
                    url: apiUrl + "supplier/getall",
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getAllCode: function (suppId) {
            return (
                $.ajax({
                    url: apiUrl + "supplier/code/getall/" + suppId,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getAllOffice: function (suppId) {
            return (
                $.ajax({
                    url: apiUrl + "supplier/office/getall/" + suppId,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getAllPerson: function (offId) {
            return (
                $.ajax({
                    url: apiUrl + "supplier/person/getall/" + offId,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getOne: function (id) {
            return (
                $.ajax({
                    url: apiUrl + "supplier/getone/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        add: function (supplier) {
            return (
                $.ajax({
                    url: apiUrl + "supplier/add",
                    data: JSON.stringify(supplier),
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        addCode: function (code) {
            return (
                $.ajax({
                    url: apiUrl + "supplier/code/add",
                    data: JSON.stringify(code),
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        addOffice: function (code) {
            return (
                $.ajax({
                    url: apiUrl + "supplier/office/add",
                    data: JSON.stringify(code),
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },
    }

}



