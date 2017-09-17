"use strict";

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
        load: function (crPage) {
            //alert('in load navigation');

            return (
                //get login user details
                fuLib.user.getLogin().success(function (user, status, xhr) {

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

                        fuLib.user.getAccess().success(function (access, status, xhr) {
                            access = access.sort(function (a, b) {
                                return a.pageIndex - b.pageIndex;
                            });

                            $(access).each(function (index) {

                                $("#ulNav").append('<li id="' + this.pageId + '"><a href="' + this.pageFile + '"><span class="' + this.pageIcon + '"></span><span class="xn-text">' + this.pageTitle + '</span></a></li>');

                            });

                            if (crPage) {
                                //$("[id^=liPage]").removeClass("active");
                                $('#' + crPage).addClass("active");
                            }

                        }).error(function (xhr, status, error) {
                            //user.getAccess failed
                            handleError('user.getAccess', xhr, status, error);
                        });

                    }

                }).error(function (xhr, status, error) {
                    //user.getLogin failed
                    handleError('user.getLogin', xhr, status, error);
                })
            );
        }
    },

    user: {

        jwtToken: token,

        getAll: function () {
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

        getOne: function (id) {
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

        getLogin: function () {
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

        getAccess: function () {
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

        login: function (name, pwd) {
            return (
                $.ajax({
                    url: apiUrl + "user/login",
                    data: JSON.stringify({ name: name, pwd: pwd }),
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

        getAll: function () {
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

        getLov: function (type) {
            return (
                $.ajax({
                    url: apiUrl + "lov/getlov/" + type,
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
                    url: apiUrl + "lov/getone/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        add: function (lov) {
            return (
                $.ajax({
                    url: apiUrl + "lov/add",
                    data: JSON.stringify(lov),
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getDesignations: function () {
            return (
                $.ajax({
                    url: apiUrl + "lov/getlov/0",
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getDepartments: function () {
            return (
                $.ajax({
                    url: apiUrl + "lov/getlov/1",
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getOfficeTypes: function () {
            return (
                $.ajax({
                    url: apiUrl + "lov/getlov/2",
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getCompanyGovtNos: function () {
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

        getUserTypes: function () {
            return (
                $.ajax({
                    url: apiUrl + "lov/getlov/4",
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getOrderTypes: function () {
            return (
                $.ajax({
                    url: apiUrl + "lov/getlov/5",
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getOrderStatuses: function () {
            return (
                $.ajax({
                    url: apiUrl + "lov/getlov/6",
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getPOInternalDetailTypes: function () {
            return (
                $.ajax({
                    url: apiUrl + "lov/getlov/7",
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getJobCardStatuses: function () {
            return (
                $.ajax({
                    url: apiUrl + "lov/getlov/8",
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getContractTypes: function () {
            return (
                $.ajax({
                    url: apiUrl + "lov/getlov/9",
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getPersonGovtNos: function () {
            return (
                $.ajax({
                    url: apiUrl + "lov/getlov/10",
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        }
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

        add: function (loc) {
            return (
                $.ajax({
                    url: apiUrl + "gloc/add",
                    data: JSON.stringify(loc),
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
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
        },

        getZips: function (parent) {
            return (
                $.ajax({
                    url: apiUrl + "gloc/getzips/" + parent,
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

        addPerson: function (code) {
            return (
                $.ajax({
                    url: apiUrl + "supplier/person/add",
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

        delete: function (id) {
            return (
                $.ajax({
                    url: apiUrl + "supplier/delete/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        deleteOffice: function (id) {
            return (
                $.ajax({
                    url: apiUrl + "supplier/office/delete/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        deletePerson: function (id) {
            return (
                $.ajax({
                    url: apiUrl + "supplier/person/delete/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

    },

    customer: {

        getAll: function () {
            return (
                $.ajax({
                    url: apiUrl + "customer/getall",
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
                    url: apiUrl + "customer/office/getall/" + suppId,
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
                    url: apiUrl + "customer/person/getall/" + offId,
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
                    url: apiUrl + "customer/getone/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        add: function (customer) {
            return (
                $.ajax({
                    url: apiUrl + "customer/add",
                    data: JSON.stringify(customer),
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
                    url: apiUrl + "customer/office/add",
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

        addPerson: function (code) {
            return (
                $.ajax({
                    url: apiUrl + "customer/person/add",
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
        delete: function (id) {
            return (
                $.ajax({
                    url: apiUrl + "customer/delete/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        deleteOffice: function (id) {
            return (
                $.ajax({
                    url: apiUrl + "customer/office/delete/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        deletePerson: function (id) {
            return (
                $.ajax({
                    url: apiUrl + "customer/person/delete/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        }
    },

    company: {

        getAll: function () {
            return (
                $.ajax({
                    url: apiUrl + "company/getall",
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getAllOffice: function (compId) {
            return (
                $.ajax({
                    url: apiUrl + "company/office/getall/" + compId,
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
                    url: apiUrl + "company/person/getall/" + offId,
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
                    url: apiUrl + "company/getone/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        add: function (company) {
            return (
                $.ajax({
                    url: apiUrl + "company/add",
                    data: JSON.stringify(company),
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
                    url: apiUrl + "company/office/add",
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

        addPerson: function (code) {
            return (
                $.ajax({
                    url: apiUrl + "company/person/add",
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
          delete: function (id) {
            return (
                $.ajax({
                    url: apiUrl + "company/delete/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        deleteOffice: function (id) {
            return (
                $.ajax({
                    url: apiUrl + "company/office/delete/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        deletePerson: function (id) {
            return (
                $.ajax({
                    url: apiUrl + "company/person/delete/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },
    },

    style: {

        getAll: function () {
            return (
                $.ajax({
                    url: apiUrl + "style/getall",
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
                    url: apiUrl + "style/getone/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        add: function (style) {
            return (
                $.ajax({
                    url: apiUrl + "style/add",
                    data: JSON.stringify(style),
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getAllMaterial: function () {
            return (
                $.ajax({
                    url: apiUrl + "style/material/getall",
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getOneMaterial: function (id) {
            return (
                $.ajax({
                    url: apiUrl + "style/maetrial/getone/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        addMaterial: function (material) {
            return (
                $.ajax({
                    url: apiUrl + "style/material/add",
                    data: JSON.stringify(material),
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getAllLeather: function () {
            return (
                $.ajax({
                    url: apiUrl + "style/leather/getall",
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getOneLeather: function (id) {
            return (
                $.ajax({
                    url: apiUrl + "style/leather/getone/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        addLeather: function (leather) {
            return (
                $.ajax({
                    url: apiUrl + "style/leather/add",
                    data: JSON.stringify(leather),
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getAllColor: function () {
            return (
                $.ajax({
                    url: apiUrl + "style/color/getall",
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getOneColor: function (id) {
            return (
                $.ajax({
                    url: apiUrl + "style/color/getone/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        addColor: function (color) {
            return (
                $.ajax({
                    url: apiUrl + "style/color/add",
                    data: JSON.stringify(color),
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getAllSize: function () {
            return (
                $.ajax({
                    url: apiUrl + "style/size/getall",
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getOneSize: function (id) {
            return (
                $.ajax({
                    url: apiUrl + "style/size/getone/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        addSize: function (size) {
            return (
                $.ajax({
                    url: apiUrl + "style/size/add",
                    data: JSON.stringify(size),
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

    po: {

        getAll: function () {
            return (
                $.ajax({
                    url: apiUrl + "po/getall",
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
                    url: apiUrl + "po/getone/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        add: function (po) {
            return (
                $.ajax({
                    url: apiUrl + "po/add",
                    data: JSON.stringify(po),
                    type: "POST",
                    contentType: "application/json",
                    dataType: "json",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getStyles: function (id) {
            return (
                $.ajax({
                    url: apiUrl + "po/style/getall/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getStyleSizes: function (id) {
            return (
                $.ajax({
                    url: apiUrl + "po/size/getall/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getMaterials: function (id) {
            return (
                $.ajax({
                    url: apiUrl + "po/material/getall/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        getInternals: function (id) {
            return (
                $.ajax({
                    url: apiUrl + "po/internal/getall/" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        },

        PdfExists: function (id) {
            return (
                $.ajax({
                    url: "/Home/POFileExists?id=" + id,
                    type: "GET",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                })
            );
        }

    }
}



