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
    $("#tblUser").DataTable({
        "autoWidth": false,
        "ajax": {
            "url": apiUrl + "user/getall",
            "dataSrc": "",
            "headers": {
                "Authorization": "Bearer " + token
            }
        },
        "columns": [
            {
                "data": "person.photo",
                "orderSequence": [],
                "render": function (data, type, row) {

                    var sDisable = '';

                    var sFlag = '<i style="color:silver;" class="fa fa-flag-o pull-right"></i>&nbsp;';

                    if (row.flag == 0) {
                        sFlag = '<i style="color:silver;" class="fa fa-flag-o pull-right"></i>&nbsp;';
                    }
                    else if (row.flag == 1) {
                        sFlag = '<i style="color:red;" class="fa fa-flag pull-right"></i>&nbsp;';
                    }
                    else if (row.flag == 2) {
                        sFlag = '<i style="color:blue;" class="fa fa-flag pull-right"></i>&nbsp;';
                    }
                    else if (row.flag == 3) {
                        sFlag = '<i style="color:green;" class="fa fa-flag pull-right"></i>&nbsp;';
                    }

                    //var sRender = '<label class="switch switch-small"><input id="switchUser" type="radio" ' + sDisable + ' name="switch-user" value="1" /><span></span></label> &nbsp;';
                    var sRender = '';

                    
                    if (data == undefined) {
                        sRender += '<img class="imgSmall" src="../assets/images/users/no-image.jpg"/></label>'+ sFlag;
                    }
                    else {
                        sRender += '<img class="imgSmall" id="profileImg1" src="../assets/images/users/' + data + '"/></label>'+ sFlag;
                    }

                    sRender += '<input type="hidden" value="' + row._id + '" />';
                    sRender += '<input type="hidden" value="' + row.isAdmin + '" />';


                    return (sRender);
                }
            },
            { "data": "name" },
            { "data": "person.name", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "person.email", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "person.phone", "defaultContent": "<span class='text-muted'>Not set</span>" }
        ]
    });

    //fill COUNTRIES
    fuLib.gloc.getCountries().success(function (data, status, xhr) {
        fillGeoLoc('#selCountry', data);

    }).error(function (xhr, status, error) {
        //gloc.getCountries failed
        handleError('gloc.getCountries', xhr, status, error);
    });

    //fill PERSON GOVT CODES
    fuLib.lov.getLovPersonGovtCodes().success(function (data, status, xhr) {
        fillLov('#selGovtCode', data);

    }).error(function (xhr, status, error) {
        //lov.getLovPersonGovtCodes failed
        handleError('lov.getLovPersonGovtCodes', xhr, status, error);
    });

    //ADDRESS COUNTRY dropdown change event
    $('#selCountry').change(function (e) {
        var parent = $('#selCountry').val();

        var items = '<option value="0">--select--</option>';
        $("#selState").html(items);
        $("#selState").selectpicker('refresh');
        $("#selCity").html(items);
        $("#selCity").selectpicker('refresh');
        $("#selArea").html(items);
        $("#selArea").selectpicker('refresh');

        if (parent != '0') {
            fuLib.gloc.getStates(parent).success(function (data, status, xhr) {
                //fill STATES
                fillGeoLoc('#selState', data);

            }).error(function (xhr, status, error) {
                //gloc.getStates failed
                handleError('gloc.getStates', xhr, status, error);
            });
        }
    });

    //ADDRESS STATE dropdown change event
    $('#selState').change(function (e) {
        var parent = $('#selState').val();

        var items = '<option value="0">--select--</option>';
        $("#selCity").html(items);
        $("#selCity").selectpicker('refresh');
        $("#selArea").html(items);
        $("#selArea").selectpicker('refresh');

        if (parent != '0') {
            fuLib.gloc.getCities(parent).success(function (data, status, xhr) {
                //fill CITIES
                fillGeoLoc('#selCity', data);

            }).error(function (xhr, status, error) {
                //gloc.getCities failed
                handleError('gloc.getCities', xhr, status, error);
            });
        }
    });

    //ADDRESS CITY dropdown change event
    $('#selCity').change(function (e) {
        var parent = $('#selCity').val();

        var items = '<option value="0">--select--</option>';
        $("#selArea").html(items);
        $("#selArea").selectpicker('refresh');

        if (parent != '0') {
            fuLib.gloc.getAreas(parent).success(function (data, status, xhr) {
                //fill AREAS
                fillGeoLoc('#selArea', data);

            }).error(function (xhr, status, error) {
                //gloc.getAreas failed
                handleError('gloc.getAreas', xhr, status, error);
            });
        }
    });

    $('#tblUser').on('draw.dt', function () {
        onresize();
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

    //BTN USER NEW click event
    $("#btnUserNew").click(function () {
        modeUpdate = 'new';

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //BTN USER EDIT click event
    $("#btnUserEdit").click(function () {
        modeUpdate = 'edit';

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //BTN USER ACCESS click event
    $("#btnUserAccess").click(function () {

        showAccess(selId);
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
            lovGovtNo: $("#selGovtCode").val(),
            govtNo: $("#txtGovtCode").val(),
            photo: '',
            dateBirth: $("#txtDateBirth").val(),
            dateAnniversary: $("#txtDateAnniversary").val(),
            maritalStatus: $("input[name=iradioMStatus]:checked", "#frmPerson").val(),
            gender: $("input[name=iradioGender]:checked", "#frmPerson").val(),
            isActive: true,
            flag: 0
        };

        var oAddress = {
            address1: $("#txtAddress1").val(),
            address2: $("#txtAddress2").val(),
            country: $("#selCountry").val(),
            state: $("#selState").val(),
            city: $("#selCity").val(),
            area: $("#selArea").val(),
            isActive: true,
            flag: 0
        };

        console.log(oUser);
        console.log(oPerson);
        console.log(oAddress);

        return false;

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
            oAddress.country != '0' &&
            oAddress.state != '0' &&
            oAddress.city != '0' &&
            oAddress.area != '0' 
            ) {
            isEmptyAddress = true;
        }

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
        showAccess($("#hidSelUser").val());
    });

    //USER TAB click event
    $("#tabUser").click(function () {
        crTab = 0;
    });

    //PERSON TAB click event
    $("#tabPerson").click(function () {
        crTab = 1;
    });

    //ADDRESS TAB click event
    $("#tabAddress").click(function () {
        crTab = 2;
    });

}

// FILL GEO LOCATIONS
function fillGeoLoc(combo, data) {

    var items = '<option value="0">--select--</option>';

    for (var i = 0; i < data.length; i++) {
        items += '<option value="' + data[i]._id + '">' + data[i].title + '</option>';
    }

    $(combo).html(items);
    $(combo).selectpicker('refresh');
}

// FILL GEO LOCATIONS
function fillLov(combo, data) {

    var items = '<option value="0">--select--</option>';

    for (var i = 0; i < data.length; i++) {
        items += '<option value="' + data[i]._id + '">' + data[i].title + '</option>';
    }

    $(combo).html(items);
    $(combo).selectpicker('refresh');
}

// PERMISSION/SECURITY/ACCESS PANEL
function showAccess(userId) {

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

                var sRow = '<tr><td><span onclick="selectAllOptions(' + i + ');">{0}</span><input type="hidden" value="' + item.pageCode + '" /><input type="hidden" value="' + item.id + '" /></td>';
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

var toggleRow = true;

//HIDDEN FEATURE, WHEN CLICKED ON ROW TITLE IN USER ACCESS
function selectAllOptions(index) {

    var rows = $("tr", $("#tbodyAccess"));

    rows.eq(index).find("input[type=checkbox]").each(function () {
        $(this).prop("checked", toggleRow);
    });

    toggleRow = !toggleRow;
}

