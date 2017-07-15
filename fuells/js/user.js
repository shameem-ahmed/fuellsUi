"use strict";

var userToggleRow = true;

//CALLED FROM _LAYOUT2
function doUser(crPage) {

    var crTab = 0;
    var modeUpdate = 'new';
    var selId = '';
    var selAdmin = false;

    $("#divAccess").hide();
    $("#divUpdate").hide();

    $("#divTable").removeClass("col-md-8").addClass("col-md-12");

    //Configures DataTable
    $("#tblUser").on('xhr.dt', function (e, settings, data, xhr) {
        //DataTable AJAX load complete event

        //data will be null is AJAX error
        if (data) {
            $('#tblUser').on('draw.dt', function () {
                //DataTable draw complete event
                var table = $("#tblUser").DataTable();
                //select first row by default
                table.rows(':eq(0)', { page: 'current' }).select();
            });
        }
    }).DataTable({
        "autoWidth": false,
        "select": {
            style: 'single'
        },
        deferRender: true,
        rowId: "_id",
        "ajax": {
            "url": apiUrl + "user/getall",
            "dataSrc": "",
            "headers": {
                "Authorization": "Bearer " + token
            }
        },
        "columns": [
            {
                "render": function (data, type, row) {
                    return '<input type="hidden" value="' + row._id + '"/><input type="hidden" value="' + row.isAdmin + '"/>' + row.name;
                }
            },
            { "data": "person.name", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "person.email", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "person.phone", "defaultContent": "<span class='text-muted'>Not set</span>" },
        ],
    });

    //TABLE ROW click event
    $("#tblUser tbody").on('click', 'tr', function () {

        //console.log($(this));

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            var table = $('#tblUser').DataTable();
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            selId = $(this).find('input[type=hidden]').eq(0).val();
            selAdmin = $(this).find('input[type=hidden]').eq(1).val();

            $("#btnUserAccess").prop('disabled', selAdmin == "true");


        }
    });

    $('#tblUser').on('draw.dt', function () {
        onresize();
    });

    //$("#btnTest").click(function () {

    //    var table = $("#tblUser").DataTable();
    //    table.rows(':eq(0)', { page: 'current' }).select();
    //});

    //fill COUNTRIES
    fuLib.gloc.getCountries().success(function (data, status, xhr) {
        fillCombo('#selCountry', data);
        

    }).error(function (xhr, status, error) {
        //gloc.getCountries failed
        handleError('gloc.getCountries', xhr, status, error);
    });

    //fill PERSON GOVT CODES
    fuLib.lov.getPersonGovtNos().success(function (data, status, xhr) {
        fillUl('#ulGovtNo', data);

    }).error(function (xhr, status, error) {
        //lov.getPersonGovtNos failed
        handleError('lov.getPersonGovtNos', xhr, status, error);
    });

    //ADDRESS COUNTRY dropdown change event
    $('#selCountry').change(function (e) {
        var parent = $('#selCountry').val();

        clearCombo($("#selState"));
        clearCombo($("#selCity"));
        clearCombo($("#selArea"));

        if (parent != '0') {
            fuLib.gloc.getStates(parent).success(function (data, status, xhr) {
                //fill STATES
                fillCombo('#selState', data);

            }).error(function (xhr, status, error) {
                //gloc.getStates failed
                handleError('gloc.getStates', xhr, status, error);
            });
        }
    });

    //ADDRESS STATE dropdown change event
    $('#selState').change(function (e) {
        var parent = $('#selState').val();

        clearCombo($("#selCity"));
        clearCombo($("#selArea"));

        if (parent != '0') {
            fuLib.gloc.getCities(parent).success(function (data, status, xhr) {
                //fill CITIES
                fillCombo('#selCity', data);

            }).error(function (xhr, status, error) {
                //gloc.getCities failed
                handleError('gloc.getCities', xhr, status, error);
            });
        }
    });

    //ADDRESS CITY dropdown change event
    $('#selCity').change(function (e) {
        var parent = $('#selCity').val();

        clearCombo($("#selArea"));

        if (parent != '0') {
            fuLib.gloc.getAreas(parent).success(function (data, status, xhr) {
                //fill AREAS
                fillCombo('#selArea', data);

            }).error(function (xhr, status, error) {
                //gloc.getAreas failed
                handleError('gloc.getAreas', xhr, status, error);
            });
        }
    });

    //chkAdmin check event
    //$('#chkAdmin').on('ifChecked', function (event) {
    //    $('#chkAdminText').text("Administrator");
    //});

    //chkAdmin un-check event
    //$('#chkAdmin').on('ifUnchecked', function (event) {
    //    $('#chkAdminText').text("Not Administrator");
    //});

    //BTN USER NEW click event
    $("#btnUserNew").click(function () {
        modeUpdate = 'new';

        userClearEditPanel();

        $("#divEditUser").show();
        $("#divEditCode").hide();
        $("#divEditOffice").hide();
        $("#divEditPerson").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //BTN USER EDIT click event
    $("#btnUserEdit").click(function () {
        modeUpdate = 'edit';

        userClearEditPanel();

        //load user details
        fuLib.user.getOne(selId).success(function (user, status, xhr) {

            console.log(user);

            $("#txtLogin").val(user.name);
            $("#txtPwd1").val('');
            $("#txtPwd2").val('');

            if (user.isAdmin == true) {
                $("#chkAdmin").iCheck('check');
            }
            else {
                $("#chkAdmin").iCheck('uncheck');
            }

            if (user.person != null) {

                $("#txtName").val(user.person.name);
                $("#txtEmail").val(user.person.email);
                $("#txtPhone").val(user.person.phone);
                $("#txtFacebook").val(user.person.facebook);
                $("#txtTwitter").val(user.person.twitter);
                $("#txtSkype").val(user.person.skype);

                //$("#selGovtNo option[value='" + user.person.lovGovtNo + "']").prop("selected", true);
                //$("#selGovtNo").selectpicker('refresh');

                $("#ulGovtNo li").each(function () {

                    var a = $(this).find('a');

                    if ($(a).attr('href').search(new RegExp(user.person.lovGovtNo, "i")) < 0) {
                        $("#ulGovtNoSpan").text($(this).text());
                        return false;
                    }
                });

                $("#ulGovtNoId").val(user.person.lovGovtNo);
                $("#txtGovtNo").val(user.person.govtNo);

                $("#txtDateBirth").val('');
                $("#txtDateAnniversary").val('');
                //$("input[name=iradioMStatus]:checked", "#frmPerson").val('0');
                //$("input[name=iradioGender]:checked", "#frmPerson").val('0');

                $("#selGender option[value='" + user.person.gender + "']").prop("selected", true);
                $("#selGender").selectpicker('refresh');

                $("#selMStatus option[value='" + user.person.maritalStatus + "']").prop("selected", true);
                $("#selMStatus").selectpicker('refresh');

                if (user.person.address != null) {
                    $("#txtAddress1").val(user.person.address.address1);
                    $("#txtAddress2").val(user.person.address.address2);

                    fuLib.gloc.getLoc(user.person.address.geoLoc).success(function (data, status, xhr) {

                        if (data.type == 0) {
                            //if loc is country
                            //==================
                            //fill COUNTRIES
                            fuLib.gloc.getCountries().success(function (data2, status, xhr) {

                                //debugger
                                console.log(data2);

                                fillCombo('#selCountry', data2);

                                $("#selCountry").val(user.person.address.geoLoc);
                                $($("#selCountry")).selectpicker('refresh');

                            }).error(function (xhr, status, error) {
                                //gloc.getCountries failed
                                handleError('gloc.getCountries', xhr, status, error);
                            });

                        }
                        else if (data.type == 1) {
                            //if loc is state
                            //==================
                            //fill COUNTRIES
                            fuLib.gloc.getCountries().success(function (data3, status, xhr) {
                                fillCombo('#selCountry', data3);

                                $("#selCountry").val(data.parent);
                                $($("#selCountry")).selectpicker('refresh');

                                //fill STATES
                                fuLib.gloc.getStates(data.parent).success(function (data4, status, xhr) {
                                    fillCombo('#selState', data4);

                                    $("#selState").val(user.person.address.geoLoc);
                                    $($("#selState")).selectpicker('refresh');

                                }).error(function (xhr, status, error) {
                                    //gloc.getStates failed
                                    handleError('gloc.getStates', xhr, status, error);
                                });

                            }).error(function (xhr, status, error) {
                                //gloc.getCountries failed
                                handleError('gloc.getCountries', xhr, status, error);
                            });

                        }
                        else if (data.type == 2) {
                            //if loc is city
                            //==================
                            //fill CITIES
                            fuLib.gloc.getCities(data.parent).success(function (data5, status, xhr) {
                                fillCombo('#selCity', data5);

                                $("#selCity").val(user.person.address.geoLoc);
                                $($("#selCity")).selectpicker('refresh');

                                //find STATE loc
                                fuLib.gloc.getLoc(data.parent).success(function (data6, status, xhr) {

                                    //fill STATES
                                    fuLib.gloc.getStates(data6.parent).success(function (data7, status, xhr) {
                                        fillCombo('#selState', data7);

                                        $("#selState").val(data6._id);
                                        $($("#selState")).selectpicker('refresh');

                                        //fill COUNTRIES
                                        fuLib.gloc.getCountries().success(function (data2, status, xhr) {
                                            fillCombo('#selCountry', data2);

                                            $("#selCountry").val(data6.parent);
                                            $($("#selCountry")).selectpicker('refresh');

                                        }).error(function (xhr, status, error) {
                                            //gloc.getCountries failed
                                            handleError('gloc.getCountries', xhr, status, error);
                                        });

                                    }).error(function (xhr, status, error) {
                                        //gloc.getStates failed
                                        handleError('gloc.getStates', xhr, status, error);
                                    });

                                });

                            }).error(function (xhr, status, error) {
                                //gloc.getStates failed
                                handleError('gloc.getStates', xhr, status, error);
                            });
                        }
                        else if (data.type == 3) {
                            //if loc is area
                            //==================
                            //fill AREAS
                            fuLib.gloc.getAreas(data.parent).success(function (data8, status, xhr) {
                                fillCombo('#selArea', data8);

                                $("#selArea").val(user.person.address.geoLoc);
                                $($("#selArea")).selectpicker('refresh');

                                //find CITY loc
                                fuLib.gloc.getLoc(data.parent).success(function (data9, status, xhr) {

                                    //fill CITIES
                                    fuLib.gloc.getCities(data9.parent).success(function (data10, status, xhr) {
                                        fillCombo('#selCity', data10);

                                        $("#selCity").val(data9._id);
                                        $($("#selCity")).selectpicker('refresh');

                                        //find STATE loc
                                        fuLib.gloc.getLoc(data9.parent).success(function (data11, status, xhr) {

                                            //fill STATES
                                            fuLib.gloc.getStates(data11.parent).success(function (data12, status, xhr) {
                                                fillCombo('#selState', data12);

                                                $("#selState").val(data11._id);
                                                $($("#selState")).selectpicker('refresh');

                                                //fill COUNTRIES
                                                fuLib.gloc.getCountries().success(function (data13, status, xhr) {
                                                    fillCombo('#selCountry', data13);

                                                    $("#selCountry").val(data11.parent);
                                                    $($("#selCountry")).selectpicker('refresh');

                                                }).error(function (xhr, status, error) {
                                                    //gloc.getCountries failed
                                                    handleError('gloc.getCountries', xhr, status, error);
                                                });

                                            }).error(function (xhr, status, error) {
                                                //gloc.getStates failed
                                                handleError('gloc.getStates', xhr, status, error);
                                            });
                                        });
                                    }).error(function (xhr, status, error) {
                                        //gloc.getStates failed
                                        handleError('gloc.getStates', xhr, status, error);
                                    });
                                });
                            }).error(function (xhr, status, error) {
                                //gloc.getStates failed
                                handleError('gloc.getStates', xhr, status, error);
                            });
                        }
                    }).error(function (xhr, status, error) {
                        //gloc.getLoc failed
                        handleError('gloc.getLoc', xhr, status, error);
                    });
                }
            }

        }).error(function (xhr, status, error) {
            //user.getOne failed
            handleError('user.getOne', xhr, status, error);
        });

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //BTN USER ACCESS click event
    $("#btnUserAccess").click(function () {
        userShowAccess(selId);
    });

    //NEW USER-SAVE CHANGES click event
    $("#btnUserUpdateSave").click(function () {

        var isEmptyUser = false;
        var isEmptyPerson = false;
        var isEmptyAddress = false;

        var oUser = {
            name: $("#txtLogin").val(),
            pwd: $("#txtPwd1").val(),
            person: null,
            dateExpiry: '31-Dec-2050',
            isActive: true,
            flag: 0,
            isAdmin: $("#chkAdmin").prop('checked'),
        };

        var oPerson = {
            name: $("#txtName").val(),
            email: $("#txtEmail").val(),
            phone: $("#txtPhone").val(),
            facebook: $("#txtFacebook").val(),
            twitter: $("#txtTwitter").val(),
            skype: $("#txtSkype").val(),
            address: null,
            lovGovtNo: $("#ulGovtNoId").val(),
            govtNo: $("#txtGovtNo").val(),
            photo: '',
            dateBirth: $("#txtDateBirth").val(),
            dateAnniversary: $("#txtDateAnniversary").val(),
            maritalStatus: $("input[name=iradioMStatus]:checked", "#frmPerson").val(),
            gender: $("input[name=iradioGender]:checked", "#frmPerson").val(),
            maritalStatus: $("#selMStatus").val(),
            gender: $("#selGender").val(),
            isActive: true,
            flag: 0
        };

        var oAddress = {
            address1: $("#txtAddress1").val(),
            address2: $("#txtAddress2").val(),
            geoLoc: null,
            isActive: true,
            flag: 0
        };

        if ($("#selArea").val() == '0' || $("#selArea").val() == null) {

            if ($("#selCity").val() == '0' || $("#selCity").val() == null) {

                if ($("#selState").val() == '0' || $("#selState").val() == null) {

                    if ($("#selCountry").val() == '0' || $("#selCountry").val() == null) {

                    }
                    else {
                        oAddress.geoLoc = $("#selCountry").val();
                    }
                }
                else {
                    oAddress.geoLoc = $("#selState").val();
                }
            }
            else {
                oAddress.geoLoc = $("#selCity").val();
            }
        }
        else {
            oAddress.geoLoc = $("#selArea").val();
        }

        //console.log(oUser);
        //console.log(oPerson);
        //console.log(oAddress);

        //return false;

        //check if oUser is empty
        if (oUser.name.trim().length == 0 &&
            oUser.pwd.trim().length == 0
            ) {
            isEmptyUser = true;
        }

        //check if oPerson is empty
        if (oPerson.name.trim().length == 0 &&
            oPerson.email.trim().length == 0 &&
            oPerson.phone.trim().length == 0 &&
            oPerson.facebook.trim().length == 0 &&
            oPerson.twitter.trim().length == 0 &&
            oPerson.skype.trim().length == 0 &&
            oPerson.govtNo.trim().length == 0 &&
            oPerson.dateBirth.trim().length == 0 &&
            oPerson.dateAnniversary.trim().length == 0
            ) {
            isEmptyPerson = true;
        }

        //check if oAddress is empty
        if (oAddress.address1.trim().length == 0 &&
            oAddress.address2.trim().length == 0 &&
            (oAddress.country == '0' || oAddress.country == null) &&
            (oAddress.state == '0' || oAddress.state == null) &&
            (oAddress.city == '0' || oAddress.city == null) &&
            (oAddress.area == '0' || oAddress.area == null)
            ) {
            isEmptyAddress = true;
        }

        console.log(isEmptyUser);
        console.log(isEmptyPerson);
        console.log(isEmptyAddress);

        //return false;

        if (modeUpdate == 'new') {

            if (isEmptyUser == true) {
                noty({ text: "Please type user details", layout: 'topRight', type: 'error', timeout: 2000 });
                return false;
            }
            else {
                if (isEmptyPerson == true) {
                    //save USER details

                    fuLib.user.add(oUser).success(function (data, status, xhr) {

                        console.log(data);

                        noty({ text: 'User added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                        var table = $("#tblUser").DataTable();
                        table.ajax.reload();

                    }).error(function (xhr, status, error) {
                        //user.add failed
                        handleError('user.add', xhr, status, error);
                    });
                }
                else {
                    if (isEmptyAddress == true) {
                        //save USER-PERSON details

                        //check if govtNo is blank
                        if (oPerson.govtNo.trim().length == 0) {
                            oPerson.lovGovtNo = null;
                        }
                        else {
                            if (oPerson.lovGovtNo == '0') {
                                noty({ text: "Please select type of govt code", layout: 'topRight', type: 'error', timeout: 2000 });
                                return false;
                            }
                        }

                        //add PERSON
                        fuLib.person.add(oPerson).success(function (data, status, xhr) {

                            noty({ text: 'Person added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                            oUser.person = data.person._id;

                            //add USER
                            fuLib.user.add(oUser).success(function (data, status, xhr) {

                                noty({ text: 'User added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                                var table = $("#tblUser").DataTable();
                                table.ajax.reload();

                            }).error(function (xhr, status, error) {
                                //user.add failed
                                handleError('user.add', xhr, status, error);
                            });

                        }).error(function (xhr, status, error) {
                            //person.add failed
                            handleError('person.add', xhr, status, error);
                        });
                    }
                    else {
                        //save USER-PERSON-ADDRESS details

                        //add ADDRESS
                        fuLib.address.add(oAddress).success(function (data, status, xhr) {

                            noty({ text: 'Address added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                            oPerson.address = data.address._id;

                            //add PERSON
                            fuLib.person.add(oPerson).success(function (data, status, xhr) {

                                noty({ text: 'Person added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                                oUser.person = data.person._id;

                                //add USER
                                fuLib.user.add(oUser).success(function (data, status, xhr) {

                                    noty({ text: 'User added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                                    var table = $("#tblUser").DataTable();
                                    table.ajax.reload();

                                }).error(function (xhr, status, error) {
                                    //address.add failed
                                    handleError('address.add', xhr, status, error);
                                });

                            }).error(function (xhr, status, error) {
                                //person.add failed
                                handleError('person.add', xhr, status, error);
                            });

                        }).error(function (xhr, status, error) {
                            //user.add failed
                            handleError('user.add', xhr, status, error);
                        });
                    }
                }
            }

            $("#divUpdate").hide();
            $("#divTable").removeClass("col-md-8").addClass("col-md-12");

            return false;

        }
        else if (modeUpdate == 'edit') {

        }

        return false;

    });

    //NEW USER-Cancel click event
    $("#btnUserUpdateCancel").click(function () {

        $("#divUpdate").hide();
        $("#divTable").removeClass("col-md-8").addClass("col-md-12");
        return false;

    });

    //BTN ACCESS SAVE click event
    $("#btnAccessSave").click(function () {

        var rows = $("tr", $("#tbodyAccess"));

        var aAccess = [];

        $(rows).each(function () {

            var acsCode = $(this).find("input[type=hidden]").eq(1).val();

            var acsAccess = "";

            $(this).find("input[type=checkbox]").each(function () {

                if ($(this).prop("checked") == true) {
                    acsAccess = acsAccess + '1';
                }
                else {
                    acsAccess = acsAccess + '0';
                }
            });

            aAccess.push({ id: acsCode, accessCode: acsAccess });

        });

        console.log(aAccess);

        fuLib.access.updateMulti(aAccess).success(function (data, status, xhr) {

            console.log(data);

            noty({ text: data.message, layout: 'topRight', type: 'success', timeout: 2000 });


        }).error(function (xhr, status, error) {
            //access.updateMulti failed
            handleError('access.updateMulti', xhr, status, error);
        });

        $("#divAccess").hide(500);
        $("#divList").show(500);
    });

    //BTN ACCESS CANCEL click event
    $("#btnAccessCancel").click(function () {
        $("#divAccess").hide(500);
        $("#divList").show(500);
    });

    //BTN ACCESS RESET click event
    $("#btnAccessReset").click(function () {
        userShowAccess($("#hidSelUser").val());
    });

    //USER TAB click event
    $("#tabUser").click(function () {
        crTab = 0;
        onresize();
    });

    //PERSON TAB click event
    $("#tabPerson").click(function () {
        crTab = 1;
        onresize();
    });

    //ADDRESS TAB click event
    $("#tabAddress").click(function () {
        crTab = 2;
        onresize();
    });

}

// PERMISSION/SECURITY/ACCESS PANEL
function userShowAccess(userId) {

    $("#hidSelUser").val(userId);

    fuLib.user.getOne(userId).success(function (data, status, xhr) {

        if (data.person) {
            $("#acsUserImage").attr("src", "../assets/images/users/" + data.person.photo);
            $("#acsUserName").text(data.person.name);
            $("#acsUserPhone").text(data.person.phone);
            $("#acsUserEmail").text(data.person.email);
        }
        else {
            $("#acsUserImage").attr("src", "../assets/images/users/no-image.jpg");
            $("#acsUserName").text(data.name);
            $("#acsUserPhone").html("<span class='text-muted'>No Phone</span>");
            $("#acsUserEmail").html("<span class='text-muted'>No Email</span>");
        }

        fuLib.access.getAccess(userId).success(function (data, status, xhr) {

            data = data.sort(function (a, b) {
                return a.pageIndex - b.pageIndex;
            });

            $("#tbodyAccess > tr").remove();

            $(data).each(function (i, item) {

                var sRow = '<tr><td><span onclick="userSelectAllOptions(' + i + ');">{0}</span><input type="hidden" value="' + item.pageCode + '" /><input type="hidden" value="' + item.id + '" /></td>';
                sRow += '<td><label class="switch switch-small"><input type="checkbox" {1} value="{2}" /><span></span></label></td>';
                sRow += '<td><label class="switch switch-small"><input type="checkbox" {3} value="{4}" /><span></span></label></td>';
                sRow += '<td><label class="switch switch-small"><input type="checkbox" {5} value="{6}" /><span></span></label></td>';
                sRow += '<td><label class="switch switch-small"><input type="checkbox" {7} value="{8}" /><span></span></label></td>';
                sRow += '<td><label class="switch switch-small"><input type="checkbox" {9} value="{10}" /><span></span></label></td>';
                sRow += '<td><label class="switch switch-small"><input type="checkbox" {11} value="{12}" /><span></span></label></td>';
                sRow += '<td><label class="switch switch-small"><input type="checkbox" {13} value="{14}" /><span></span></label></td>';
                sRow += '<td><label class="switch switch-small"><input type="checkbox" {15} value="{16}" /><span></span></label></td>';
                sRow += '<td><label class="switch switch-small"><input type="checkbox" {17} value="{18}" /><span></span></label></td></tr>';

                sRow = sRow.replace("{0}", item.pageTitle);
                sRow = sRow.replace("{1}", (item.isView ? 'checked' : ''));
                sRow = sRow.replace("{2}", (item.isView ? '1' : '0'));
                sRow = sRow.replace("{3}", (item.isPrint ? 'checked' : ''));
                sRow = sRow.replace("{4}", (item.isPrint ? '1' : '0'));
                sRow = sRow.replace("{5}", (item.isFilter ? 'checked' : ''));
                sRow = sRow.replace("{6}", (item.isFilter ? '1' : '0'));
                sRow = sRow.replace("{7}", (item.isAdd ? 'checked' : ''));
                sRow = sRow.replace("{8}", (item.isAdd ? '1' : '0'));
                sRow = sRow.replace("{9}", (item.isEdit ? 'checked' : ''));
                sRow = sRow.replace("{10}", (item.isEdit ? '1' : '0'));
                sRow = sRow.replace("{11}", (item.isDelete ? 'checked' : ''));
                sRow = sRow.replace("{12}", (item.isDelete ? '1' : '0'));
                sRow = sRow.replace("{13}", (item.isCompare ? 'checked' : ''));
                sRow = sRow.replace("{14}", (item.isCompare ? '1' : '0'));
                sRow = sRow.replace("{15}", (item.isReset ? 'checked' : ''));
                sRow = sRow.replace("{16}", (item.isReset ? '1' : '0'));
                sRow = sRow.replace("{17}", (item.isSubmit ? 'checked' : ''));
                sRow = sRow.replace("{18}", (item.isSubmit ? '1' : '0'));

                $("#tbodyAccess").append(sRow);

            });

        }).error(function (xhr, status, error) {
            //access.getAccess failed
            handleError('access.getAccess', xhr, status, error);
        });

    }).error(function (xhr, status, error) {
        //user.getSingle failed
        handleError('user.getSingle', xhr, status, error);
    });

    $("#divAccess").show(500);
    $("#divList").hide(500);
}

//HIDDEN FEATURE, WHEN CLICKED ON ROW TITLE IN USER ACCESS
function userSelectAllOptions(index) {

    var rows = $("tr", $("#tbodyAccess"));

    rows.eq(index).find("input[type=checkbox]").each(function () {
        $(this).prop("checked", userToggleRow);
    });

    userToggleRow = !userToggleRow;
}

function userClearEditPanel() {

    $("#txtLogin").val('');
    $("#txtPwd1").val('');
    $("#txtPwd2").val('');

    $("#chkAdmin").iCheck('uncheck');

    $("#txtName").val('');
    $("#txtEmail").val('');
    $("#txtPhone").val('');
    $("#txtFacebook").val('');
    $("#txtTwitter").val('');
    $("#txtSkype").val('');
    $("#ulGovtNoId").val('');
    $("#txtGovtNo").val('');
    $("#txtDateBirth").val('');
    $("#txtDateAnniversary").val('');
    $("input[name=iradioMStatus]:checked", "#frmPerson").val('0');
    $("input[name=iradioGender]:checked", "#frmPerson").val('0');

    $("#txtAddress1").val('');
    $("#txtAddress2").val('');

    $("#selCountry").val('0');
    $($("#selCountry")).selectpicker('refresh');

    $("#selState").val('0');
    $($("#selState")).selectpicker('refresh');

    $("#selCity").val('0');
    $($("#selCity")).selectpicker('refresh');

    $("#selArea").val('0');
    $($("#selArea")).selectpicker('refresh');

}
