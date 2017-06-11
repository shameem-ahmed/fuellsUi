var userToggleRow = true;

//CALLED FROM _LAYOUT2
function doStyle(crPage) {

    var crTab = 0;
    var modeUpdate = 'newStyle';
    var selStyleId = '';
    var selMaterialId = '';
    var selLeatherId = '';
    var selColorId = '';
    var selSizeId = '';

    $("#divUpdate").hide();

    $("#divTable").removeClass("col-md-9").addClass("col-md-12");

    //MATERIAL TABLE CONFIG
    //
    $("#tblMaterial").on('xhr.dt', function (e, settings, data, xhr) {
        //DataTable AJAX load complete event

        //data will be null is AJAX error
        if (data) {
            $('#tblMaterial').on('draw.dt', function () {
                //DataTable draw complete event
                var table = $("#tblMaterial").DataTable();
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
            "url": apiUrl + "style/material/getall",
            "dataSrc": "",
            "headers": {
                "Authorization": "Bearer " + token
            }
        },
        "columns": [
            {
                "render": function (data, type, row) {
                    return '<input type="hidden" value="' + row._id + '"/>' + row.title;
                }
            },
            { "data": "isActive", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "flag", "defaultContent": "<span class='text-muted'>Not set</span>" }
        ],
    });

    //MATERIAL TABLE ROW click event
    $("#tblMaterial tbody").on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            var table = $('#tblMaterial').DataTable();
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            selMaterialId = $(this).find('input[type=hidden]').eq(0).val();
        }
    });

    $('#tblMaterial').on('draw.dt', function () {
        onresize();
    });

    //LEATHER TABLE CONFIG
    //
    $("#tblLeather").on('xhr.dt', function (e, settings, data, xhr) {
        //DataTable AJAX load complete event

        //data will be null is AJAX error
        if (data) {
            $('#tblLeather').on('draw.dt', function () {
                //DataTable draw complete event
                var table = $("#tblLeather").DataTable();
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
            "url": apiUrl + "style/leather/getall",
            "dataSrc": "",
            "headers": {
                "Authorization": "Bearer " + token
            }
        },
        "columns": [
            {
                "render": function (data, type, row) {
                    return '<input type="hidden" value="' + row._id + '"/>' + row.title;
                }
            },
            { "data": "isActive", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "flag", "defaultContent": "<span class='text-muted'>Not set</span>" }
        ],
    });

    //MATERIAL TABLE ROW click event
    $("#tblLeather tbody").on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            var table = $('#tblLeather').DataTable();
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            selLeatherId = $(this).find('input[type=hidden]').eq(0).val();
        }
    });

    $('#tblLeather').on('draw.dt', function () {
        onresize();
    });

    //COLOR TABLE CONFIG
    //
    $("#tblColor").on('xhr.dt', function (e, settings, data, xhr) {
        //DataTable AJAX load complete event

        //data will be null is AJAX error
        if (data) {
            $('#tblColor').on('draw.dt', function () {
                //DataTable draw complete event
                var table = $("#tblColor").DataTable();
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
            "url": apiUrl + "style/color/getall",
            "dataSrc": "",
            "headers": {
                "Authorization": "Bearer " + token
            }
        },
        "columns": [
            {
                "render": function (data, type, row) {
                    return '<input type="hidden" value="' + row._id + '"/>' + row.title;
                }
            },
            { "data": "isActive", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "flag", "defaultContent": "<span class='text-muted'>Not set</span>" }
        ],
    });

    //COLOR TABLE ROW click event
    $("#tblColor tbody").on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            var table = $('#tblColor').DataTable();
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            selColorId = $(this).find('input[type=hidden]').eq(0).val();
        }
    });

    $('#tblColor').on('draw.dt', function () {
        onresize();
    });


    //SIZE TABLE CONFIG
    //
    $("#tblSize").on('xhr.dt', function (e, settings, data, xhr) {
        //DataTable AJAX load complete event

        //data will be null is AJAX error
        if (data) {
            $('#tblSize').on('draw.dt', function () {
                //DataTable draw complete event
                var table = $("#tblSize").DataTable();
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
            "url": apiUrl + "style/size/getall",
            "dataSrc": "",
            "headers": {
                "Authorization": "Bearer " + token
            }
        },
        "columns": [
            {
                "render": function (data, type, row) {
                    return '<input type="hidden" value="' + row._id + '"/>' + row.title;
                }
            },
            { "data": "isActive", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "flag", "defaultContent": "<span class='text-muted'>Not set</span>" }
        ],
    });

    //COLOR TABLE ROW click event
    $("#tblSize tbody").on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            var table = $('#tblSize').DataTable();
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            selColorId = $(this).find('input[type=hidden]').eq(0).val();
        }
    });

    $('#tblSize').on('draw.dt', function () {
        onresize();
    });

    //BTN NEW STYLE click event
    $("#btnNewStyle").click(function () {

        modeUpdate = 'newStyle';

        clearEditPanel('style');

        $("#divEditStyle").show();
        $("#divEditMaterial").hide();
        $("#divEditLeather").hide();
        $("#divEditColor").hide();
        $("#divEditSize").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-9");
        $("#divUpdate").show();

    });

    //BTN NEW MATERIAL click event
    $("#btnNewMaterial").click(function () {
        modeUpdate = 'newMaterial';

        clearEditPanel('material');

        $("#divEditMaterial").show();
        $("#divEditStyle").hide();
        $("#divEditLeather").hide();
        $("#divEditColor").hide();
        $("#divEditSize").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-9");
        $("#divUpdate").show();

    });

    //BTN NEW LEATHER click event
    $("#btnNewLeather").click(function () {
        modeUpdate = 'newLeather';

        clearEditPanel('leather');

        $("#divEditLeather").show();
        $("#divEditMaterial").hide();
        $("#divEditStyle").hide();
        $("#divEditColor").hide();
        $("#divEditSize").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-9");
        $("#divUpdate").show();

    });

    //BTN NEW COLOR click event
    $("#btnNewColor").click(function () {
        modeUpdate = 'newColor';

        clearEditPanel('color');

        $("#divEditColor").show();
        $("#divEditMaterial").hide();
        $("#divEditLeather").hide();
        $("#divEditStyle").hide();
        $("#divEditSize").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-9");
        $("#divUpdate").show();

    });

    //BTN NEW SIZE click event
    $("#btnNewSize").click(function () {
        modeUpdate = 'newSize';

        clearEditPanel('size');

        $("#divEditSize").show();
        $("#divEditMaterial").hide();
        $("#divEditLeather").hide();
        $("#divEditColor").hide();
        $("#divEditStyle").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-9");
        $("#divUpdate").show();

    });

    //STYLE SAVE click event
    $("#btnSaveStyle").click(function () {

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
            lovGovtNo: $("#ulGovtCodeId").val(),
            govtNo: $("#txtGovtCode").val(),
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
            $("#divTable").removeClass("col-md-9").addClass("col-md-12");

            return false;

        }
        else if (modeUpdate == 'edit') {

        }

        return false;

    });

    //STYLE CANCEL click event
    $("#btnCancelStyle").click(function () {

        $("#divUpdate").hide();
        $("#divTable").removeClass("col-md-9").addClass("col-md-12");
        return false;

    });

    //MATERIAL SAVE click event
    $("#btnSaveMaterial").click(function () {

        var isEmptyMaterial = false;

        var oMaterial = {
            title: $("#txtMaterialTitle").val(),
            isActive: true,
            flag: 0
        };

        //check if oMaterial is empty
        if (oMaterial.title.trim().length == 0) {
            isEmptyMaterial = true;
        }


        if (modeUpdate == 'newMaterial') {

            if (isEmptyMaterial == true) {
                noty({ text: "Please type material details", layout: 'topRight', type: 'error', timeout: 2000 });
                return false;
            }
            else {

                //save MATERIAL details

                fuLib.style.addMaterial(oMaterial).success(function (data, status, xhr) {

                    console.log(data);

                    noty({ text: 'Material added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                    var table = $("#tblMaterial").DataTable();
                    table.ajax.reload();

                }).error(function (xhr, status, error) {
                    //style.addMaterial failed
                    handleError('style.addMaterial', xhr, status, error);
                });
            }

            $("#divUpdate").hide();
            $("#divTable").removeClass("col-md-9").addClass("col-md-12");

            return false;

        }
        else if (modeUpdate == 'edit') {

        }

        return false;

    });

    //MATERIAL CANCEL click event
    $("#btnCancelMaterial").click(function () {

        $("#divUpdate").hide();
        $("#divTable").removeClass("col-md-9").addClass("col-md-12");
        return false;
    });

    //LEATHER SAVE click event
    $("#btnSaveLeather").click(function () {

        var isEmptyLeather = false;

        var oLeather = {
            title: $("#txtLeatherTitle").val(),
            isActive: true,
            flag: 0
        };

        //check if oLeather is empty
        if (oLeather.title.trim().length == 0) {
            isEmptyLeather = true;
        }


        if (modeUpdate == 'newLeather') {

            if (isEmptyLeather == true) {
                noty({ text: "Please type leather details", layout: 'topRight', type: 'error', timeout: 2000 });
                return false;
            }
            else {

                //save LEATHER details

                fuLib.style.addLeather(oLeather).success(function (data, status, xhr) {

                    console.log(data);

                    noty({ text: 'Leather added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                    var table = $("#tblLeather").DataTable();
                    table.ajax.reload();

                }).error(function (xhr, status, error) {
                    //style.addLeather failed
                    handleError('style.addLeather', xhr, status, error);
                });
            }

            $("#divUpdate").hide();
            $("#divTable").removeClass("col-md-9").addClass("col-md-12");

            return false;

        }
        else if (modeUpdate == 'edit') {

        }

        return false;

    });


    //LEATHER CANCEL click event
    $("#btnCancelLeather").click(function () {

        $("#divUpdate").hide();
        $("#divTable").removeClass("col-md-9").addClass("col-md-12");
        return false;

    });



    //COLOR SAVE click event
    $("#btnSaveColor").click(function () {

        var isEmptyColor = false;

        var oColor = {
            title: $("#txtColorTitle").val(),
            isActive: true,
            flag: 0
        };

        //check if oColor is empty
        if (oColor.title.trim().length == 0) {
            isEmptyColor = true;
        }


        if (modeUpdate == 'newColor') {

            if (isEmptyColor == true) {
                noty({ text: "Please type color details", layout: 'topRight', type: 'error', timeout: 2000 });
                return false;
            }
            else {

                //save COLOR details

                fuLib.style.addColor(oColor).success(function (data, status, xhr) {

                    console.log(data);

                    noty({ text: 'Color added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                    var table = $("#tblColor").DataTable();
                    table.ajax.reload();

                }).error(function (xhr, status, error) {
                    //style.addLeather failed
                    handleError('style.addColor', xhr, status, error);
                });
            }

            $("#divUpdate").hide();
            $("#divTable").removeClass("col-md-9").addClass("col-md-12");

            return false;

        }
        else if (modeUpdate == 'edit') {

        }

        return false;

    });


    //LEATHER CANCEL click event
    $("#btnCancelColor").click(function () {

        $("#divUpdate").hide();
        $("#divTable").removeClass("col-md-9").addClass("col-md-12");
        return false;

    });



    //SIZE SAVE click event
    $("#btnSaveSize").click(function () {

        var isEmptySize = false;

        var oSize = {
            title: $("#txtSizeTitle").val(),
            isActive: true,
            flag: 0
        };

        //check if oLeather is empty
        if (oSize.title.trim().length == 0) {
            isEmptySize = true;
        }


        if (modeUpdate == 'newSize') {

            if (isEmptySize == true) {
                noty({ text: "Please type size details", layout: 'topRight', type: 'error', timeout: 2000 });
                return false;
            }
            else {

                //save SIZE details

                fuLib.style.addSize(oSize).success(function (data, status, xhr) {

                    console.log(data);

                    noty({ text: 'Size added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                    var table = $("#tblSize").DataTable();
                    table.ajax.reload();

                }).error(function (xhr, status, error) {
                    //style.addLeather failed
                    handleError('style.addSize', xhr, status, error);
                });
            }

            $("#divUpdate").hide();
            $("#divTable").removeClass("col-md-9").addClass("col-md-12");

            return false;

        }
        else if (modeUpdate == 'edit') {

        }

        return false;

    });

    //SIZE CANCEL click event
    $("#btnCancelSize").click(function () {

        $("#divUpdate").hide();
        $("#divTable").removeClass("col-md-9").addClass("col-md-12");
        return false;

    });

}

function clearEditPanel(panel) {

    if (panel == 'style') {

        $("#txtStyleTitle").val('');

        $('#lstStyleMaterial').html('');
        $('#lstStyleLeather').html('');
        $('#lstStyleSize').html('');
    }
    else if (panel == 'material') {

        $("#txtMaterialTitle").val('');

    }
    else if (panel == 'leather') {

        $("#txtLeatherTitle").val('');
        $('#lstLeatherColor').html('');

    }
    else if (panel == 'color') {

        $("#txtColorTitle").val('');

    }
    else if (panel == 'size') {

        $("#txtSizeTitle").val('');

    }
}
