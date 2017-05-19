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
        }
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
        }
    },
}



