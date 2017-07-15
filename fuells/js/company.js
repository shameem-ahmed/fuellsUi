"use strict";

var comCrTab = 0;
var comModeUpdate = 'new';
var comSelId = '';

var comTableCompany;
var comTableOffice;
var comTablePeople;

//CALLED FROM _LAYOUT2
function doCompany(crPage) {

    $("#divUpdate").hide();

    $("#divTable").removeClass("col-md-8").addClass("col-md-12");

    configCompanyTable();

    configLists();

    //BTN SUPPLIER NEW click event
    $("#btnCompNew").click(function () {
        comModeUpdate = 'new';

        companyClearEditPanel();

        $("#divEditCompany").show();
        $("#divEditOffice").hide();
        $("#divEditPerson").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //BTN OFFICE NEW click event
    $("#btnOffNew").click(function () {
        comModeUpdate = 'new';

        companyClearEditPanel();

        $("#divEditCompany").hide();
        $("#divEditOffice").show();
        $("#divEditPerson").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //BTN PERSON NEW click event
    $("#btnPersonNew").click(function () {
        comModeUpdate = 'new';

        companyClearEditPanel();

        $("#divEditCompany").hide();
        $("#divEditOffice").hide();
        $("#divEditPerson").show();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //NEW SUPPLIER-SAVE CHANGES click event
    $("#btnCompUpdateSave").click(function () {

        var isEmptyCompany = false;

        var oCompany = {
            code: $("#txtCode").val(),
            name: $("#txtName").val(),
            urlWeb: $("#txtWebsite").val(),
            email: $("#txtEmail").val(),
            phone: $("#txtPhone").val(),
            fax: $("#txtFax").val(),
            logo: '',
            lovGovtNo: $("#ulCompGovtNoId").val(),
            govtNo: $("#txtCompGovtNo").val(),
            isActive: true,
            flag: 0
        };

        //check if oCompany is empty
        if (oCompany.code.trim().length == 0 &&
            oCompany.name.trim().length == 0
            ) {
            isEmptyCompany = true;
        }

        if (comModeUpdate == 'new') {

            if (isEmptyCompany == true) {
                noty({ text: "Please type company details", layout: 'topRight', type: 'error', timeout: 2000 });
                return false;
            }
            else {

                fuLib.company.add(oCompany).success(function (data, status, xhr) {

                    console.log(data);

                    noty({ text: 'Company added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                    var table = $("#tblCompany").DataTable();
                    table.ajax.reload();

                }).error(function (xhr, status, error) {
                    //company.add failed
                    handleError('company.add', xhr, status, error);
                });
            }

            $("#divUpdate").hide();
            $("#divTable").removeClass("col-md-8").addClass("col-md-12");

            return false;

        }
        else if (comModeUpdate == 'edit') {

        }

        return false;

    });

    //NEW SUPPLIER-Cancel click event
    $("#btnCompUpdateCancel").click(function () {

        $("#divUpdate").hide();
        $("#divTable").removeClass("col-md-8").addClass("col-md-12");
        return false;

    });

    //NEW CODE-SAVE CHANGES click event
    $("#btnCodeUpdateSave").click(function () {

        var isEmptyCode = false;

        var oCode = {
            value: $("#txtGCode").val(),
            LovType: $("#selLovGCode").val(),
            company: comSelId,
            isActive: true,
            flag: 0
        };

        //check if oCompany is empty
        if (oCode.value.trim().length == 0) {
            isEmptyCode = true;
        }

        if (comModeUpdate == 'new') {

            if (isEmptyCode == true) {
                noty({ text: "Please type govt code details", layout: 'topRight', type: 'error', timeout: 2000 });
                return false;
            }
            else {

                fuLib.company.addCode(oCode).success(function (data, status, xhr) {

                    console.log(data);

                    noty({ text: 'Govt code added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                    tableCode = $("#tblCode").DataTable();
                    tableCode.ajax.reload();

                }).error(function (xhr, status, error) {
                    //company.addCode failed
                    handleError('company.addCode', xhr, status, error);
                });
            }

            $("#divUpdate").hide();
            $("#divTable").removeClass("col-md-8").addClass("col-md-12");

            return false;

        }
        else if (comModeUpdate == 'edit') {

        }

        return false;

    });

    //NEW OFFICE-SAVE CHANGES click event
    $("#btnOfficeUpdateSave").click(function () {

        var isEmptyOffice = false;

        var oOffice = {
            title: $("#txtTitle").val(),
            address1: $("#txtAddress1").val(),
            address2: $("#txtAddress2").val(),
            geoLoc: null,
            email: $("#txtEmail").val(),
            phone: $("#txtPhone").val(),
            fax: $("#txtFax").val(),
            company: comSelId,
            isActive: true,
            flag: 0
        };

        if ($("#selArea").val() == '0' || $("#selArea").val() == null) {

            if ($("#selCity").val() == '0' || $("#selCity").val() == null) {

                if ($("#selState").val() == '0' || $("#selState").val() == null) {

                    if ($("#selCountry").val() == '0' || $("#selCountry").val() == null) {

                    }
                    else {
                        oOffice.geoLoc = $("#selCountry").val();
                    }
                }
                else {
                    oOffice.geoLoc = $("#selState").val();
                }
            }
            else {
                oOffice.geoLoc = $("#selCity").val();
            }
        }
        else {
            oOffice.geoLoc = $("#selArea").val();
        }

        //check if oOffice is empty
        if (oOffice.title.trim().length == 0) {
            isEmptyOffice = true;
        }

        if (comModeUpdate == 'new') {

            if (isEmptyOffice == true) {
                noty({ text: "Please type office details", layout: 'topRight', type: 'error', timeout: 2000 });
                return false;
            }
            else {

                fuLib.company.addOffice(oOffice).success(function (data, status, xhr) {

                    console.log(data);

                    noty({ text: 'Company Office added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                    comTableOffice = $("#tblOffice").DataTable();
                    comTableOffice.ajax.reload();

                }).error(function (xhr, status, error) {
                    //company.addOffice failed
                    handleError('company.addOffice', xhr, status, error);
                });
            }

            $("#divUpdate").hide();
            $("#divTable").removeClass("col-md-8").addClass("col-md-12");

            return false;

        }
        else if (comModeUpdate == 'edit') {

        }

        return false;

    });

    //NEW OFFICE-Cancel click event
    $("#btnOfficeUpdateCancel").click(function () {

        $("#divUpdate").hide();
        $("#divTable").removeClass("col-md-8").addClass("col-md-12");
        return false;

    });

    $("#btnPersonUpdateSave").click(function () {
        debugger;
        var isEmptyPerson = false;
        var oPerson = {
            name: $("#txtNameP").val(),
            email: $("#txtEmailP").val(),
            phone: $("#txtPhoneP").val(),
            facebook: $("#txtFacebook").val(),
            twitter: $("#txtTwitter").val(),
            skype: $("#txtSkype").val(),
            address: null,
            lovGovtNo: $("#selGovtNo").val(),
            govtNo: $("#txtGovtNo").val(),
            photo: '',
            dateBirth: $("#txtDateBirth").val(),
            dateAnniversary: $("#txtDateAnniversary").val(),
            maritalStatus: $("input[name=iradioMStatus]:checked", "#frmPerson").val(),
            gender: $("input[name=iradioGender]:checked", "#frmPerson").val(),
            isActive: true,
            flag: 0
        };

        if (oPerson.name.trim().length == 0 &&
            oPerson.email.trim().length == 0 &&
            oPerson.phone.trim().length == 0 &&
            oPerson.facebook.trim().length == 0 &&
            oPerson.twitter.trim().length == 0 &&
            oPerson.skype.trim().length == 0 &&
            oPerson.govtNo.trim().length == 0 &&
            oPerson.dateBirth.trim().length == 0 &&
            oPerson.dateAnniversary.trim().length == 0) {
            isPersonEmpty = true;
        }
        if (comModeUpdate == 'new') {
            if (isEmptyPerson == false) {
                //save USER details

                fuLib.person.add(oPerson).success(function (data, status, xhr) {

                    console.log(data);

                    noty({ text: 'Person added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                    //var table = $("#tblUser").DataTable();
                    //table.ajax.reload();

                }).error(function (xhr, status, error) {
                    //user.add failed
                    handleError('user.add', xhr, status, error);
                });
            }
        }

    });

    //NEW PERSON-Cancel click event
    $("#btnPersonUpdateCancel").click(function () {
        $("#divUpdate").hide();
        $("#divTable").removeClass("col-md-8").addClass("col-md-12");
        return false;
    });
}

function fillCompanyOffice(compId) {
    if ($.fn.dataTable.isDataTable("#tblOffice")) {

        comTableOffice.ajax.url(apiUrl + "company/office/getall/" + compId).load();
    }
    else {
        //Configures OFFICE DataTable
        $("#tblOffice").on('xhr.dt', function (e, settings, data, xhr) {
            //DataTable AJAX load complete event

            //data will be null is AJAX error
            if (data) {
                $('#tblOffice').on('draw.dt', function () {
                    //DataTable draw complete event

                    comTableOffice = $("#tblOffice").DataTable();
                    //select first row by default
                    comTableOffice.rows(':eq(0)', { page: 'current' }).select();
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
                "url": apiUrl + "company/office/getall/" + compId,
                "dataSrc": "",
                "headers": {
                    "Authorization": "Bearer " + token
                }
            },
            "columns": [
                { "data": "title", "defaultContent": "<span class='text-muted'>Not set</span>" },
                { "data": "address1", "defaultContent": "<span class='text-muted'>Not set</span>" },
                { "data": "email", "defaultContent": "<span class='text-muted'>Not set</span>" },
                { "data": "phone", "defaultContent": "<span class='text-muted'>Not set</span>" }
            ],
        });
    }
}

function fillCompanyOfficePerson(offId) {

}

function companyClearEditPanel() {

    //company
    $("#txtName").val('');
    $("#txtCode").val('');
    $("#txtWebsite").val('');
    $("#txtEmail").val('');
    $("#txtPhone").val('');
    $("#txtFax").val('');

    //company office
    $("#txtTitle").val('');
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
    $("#txtEmailO").val('');
    $("#txtPhoneO").val('');
    $("#txtFaxO").val('');

    //company office person
    $("#txtNameP").val('');
    $("#txtEmailP").val('');
    $("#txtPhoneP").val('');
    $("#txtFacebook").val('');
    $("#txtTwitter").val('');
    $("#txtSkype").val('');
    $("#selGovtNo option[value='0']").prop("selected", true);
    $("#selGovtNo").selectpicker('refresh');
    $("#txtGovtNo").val('');
    $("#txtDateBirth").val('');
    $("#txtDateAnniversary").val('');
    $("input[name=iradioMStatus]:checked", "#frmPerson").val('0');
    $("input[name=iradioGender]:checked", "#frmPerson").val('0');
}

function configLists() {
    //fill COUNTRIES
    fuLib.gloc.getCountries().success(function (data, status, xhr) {
        fillCombo('#selCountry', data);

    }).error(function (xhr, status, error) {
        //gloc.getCountries failed
        handleError('gloc.getCountries', xhr, status, error);
    });

    //fill DESIG
    fuLib.lov.getDesignations().success(function (data, status, xhr) {
        fillCombo('#selDesig', data);

    }).error(function (xhr, status, error) {
        //lov.getDesignations failed
        handleError('lov.getDesignations', xhr, status, error);
    });

    //fill DEPT
    fuLib.lov.getDepartments().success(function (data, status, xhr) {
        fillCombo('#selDept', data);

    }).error(function (xhr, status, error) {
        //lov.getDepartments failed
        handleError('lov.getDepartments', xhr, status, error);
    });

    //fill CONTRACT TYPE
    fuLib.lov.getContractTypes().success(function (data, status, xhr) {
        fillCombo('#selContract', data);

    }).error(function (xhr, status, error) {
        //lov.getContractTypes failed
        handleError('lov.getContractTypes', xhr, status, error);
    });

    //fill USER
    fuLib.user.getAll().success(function (data, status, xhr) {
        fillUser('#selUser', data);

    }).error(function (xhr, status, error) {
        //lov.getContractTypes failed
        handleError('lov.getContractTypes', xhr, status, error);
    });


  
    //fill PERSON GOVT CODES
    fuLib.lov.getPersonGovtNos().success(function (data, status, xhr) {
        fillUl('#ulGovtNo', data);

    }).error(function (xhr, status, error) {
        //lov.getPersonGovtNos failed
        handleError('lov.getPersonGovtNos', xhr, status, error);
    });

    //fill SUPPLIER GOVT CODES
    fuLib.lov.getCompanyGovtNos().success(function (data, status, xhr) {
        fillUl('#ulCompGovtNo', data);

    }).error(function (xhr, status, error) {
        //lov.getCompanyGovtNos failed
        handleError('lov.getCompanyGovtNos', xhr, status, error);
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
}

function configCompanyTable() {
    //"option strict";

    //DATATABLE AJAX LOAD COMPLETE EVENT
    $("#tblCompany").on('xhr.dt', function (e, settings, data, xhr) {

        //data will be null is AJAX error
        if (data) {
            //DATATABLE DRAW COMPLETE EVENT
            $('#tblCompany').on('draw.dt', function () {

                comTableCompany = $("#tblCompany").DataTable();
                //select first row by default
                comTableCompany.rows(':eq(0)', { page: 'current' }).select();
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
            "url": apiUrl + "company/getall",
            "dataSrc": "",
            "headers": {
                "Authorization": "Bearer " + token
            }
        },
        "columns": [
            {
                "render": function (data, type, row) {
                    return '<input type="hidden" value="' + row._id + '"/>' + row.name;
                }
            },
            { "data": "code", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "urlWeb", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "email", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "phone", "defaultContent": "<span class='text-muted'>Not set</span>" }
        ],
    });

    //TABLE ROW CLICK EVENT
    $("#tblCompany tbody").on('click', 'tr', function () {

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            comTableCompany = $('#tblUser').DataTable();
            comTableCompany.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            comSelId = $(this).find('input[type=hidden]').eq(0).val();

            fillCompanyOffice(comSelId);

        }
    });

    //TABLE REDRAW EVENT
    $('#tblCompany').on('draw.dt', function () {
        onresize();
    });
}