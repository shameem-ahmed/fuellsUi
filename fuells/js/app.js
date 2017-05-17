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
        load: function() {
            //alert('in load navigation');

            return (
                //get login user details
                fuLib.user.getLogin().success(function(user, status, xhr) {

                    if (user) {

                        isAdmin = user.isAdmin;

                        $("#profileName").text(user.name);
                        $("#profileRole").text(user.isAdmin ? "Administrator" : "Not Admin");

                        if (user.person === null) {
                            $("#profileImg1").attr("src", "assets/images/users/no-image.jpg");
                            $("#profileImg2").attr("src", "assets/images/users/no-image.jpg");
                        }
                        else {

                            $("#profileImg1").attr("src", "assets/images/users/" + user.person.photo);
                            $("#profileImg2").attr("src", "assets/images/users/" + user.person.photo);

                            $("#profileName").text(user.person.name);

                        }

                        fuLib.user.getAccess().success(function(access, status, xhr) {

                            console.log("access:");
                            console.log(access);

                            access = access.sort(function(a, b){
                                return a.pageIndex - b.pageIndex;
                            });

                            $(access).each(function(index) {

                                $("#ulNav").append('<li><a href="' + this.pageFile + '"><span class="' + this.pageIcon + '"></span><span class="xn-text">' + this.pageTitle + '</span></a></li>');

                            });



                        }).error(function(xhr, status, error) {
                            //user.getAccess failed
                            handleError(xhr, status, error);
                        });

                    }

                }).error(function(xhr, status, error) {
                    //user.getLogin failed
                    handleError(xhr, status, error);
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



