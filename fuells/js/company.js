"use strict";

var supCrTab = 0;
var supModeUpdate = 'new';

var selIdCompany = '0';
var selIdCompanyOffice = '0';
var selIdCompanyOfficePerson = '0';

var isCompany = false;
var isCompanyOffice = false;
var isCompanyOfficePerson = false;

var tableCompany;
var tableCompanyOffice;
var tableCompanyOfficePeople;

//CALLED FROM _LAYOUT2
function doCompany(crPage) {

    $("#divUpdate").hide();

    $("#divTable").removeClass("col-md-8").addClass("col-md-12");

    configCompanyTables();

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

    //fill Designation 
    fuLib.lov.getDesignations().success(function (data, status, xhr) {
        fillCombo('#selDesignation', data);

    }).error(function (xhr, status, error) {
        //lov.getDesignations failed
        handleError('lov.getDesignations', xhr, status, error);
    });

    //fill Department 
    fuLib.lov.getDepartments().success(function (data, status, xhr) {
        fillCombo('#selDepartment', data);

    }).error(function (xhr, status, error) {
        //lov.getDepartments failed
        handleError('lov.getDepartments', xhr, status, error);
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

    //
    //Company Events
    //

    //BTN-Company-NEW click event
    $("#btnCompNew").click(function () {
        supModeUpdate = 'new';

        companyClearEditPanel();

        $("#divEditCompany").show();
        $("#divEditOffice").hide();
        $("#divEditPerson").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //BTN-Company-DELETE click event
    $("#btnCompDelete").click(function () {

        fuLib.company.delete(selIdCompany).success(function (data, status, xhr) {

            noty({ text: 'Company deleted successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

            var table = $("#tblCompany").DataTable();
            table.ajax.reload();

        }).error(function (xhr, status, error) {
            //Company.delete failed
            handleError('Company.delete', xhr, status, error);
        });

    });

    //NEW-Company-SAVE CHANGES click event
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

        if (supModeUpdate == 'new') {

            if (isEmptyCompany == true) {
                noty({ text: "Please type Company details", layout: 'topRight', type: 'error', timeout: 2000 });
                return false;
            }
            else {

                fuLib.company.add(oCompany).success(function (data, status, xhr) {

                    console.log(data);

                    noty({ text: 'Company added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                    var table = $("#tblCompany").DataTable();
                    table.ajax.reload();

                }).error(function (xhr, status, error) {
                    //Company.add failed
                    handleError('Company.add', xhr, status, error);
                });
            }

            $("#divUpdate").hide();
            $("#divTable").removeClass("col-md-8").addClass("col-md-12");

            return false;

        }
        else if (supModeUpdate == 'edit') {

        }

        return false;

    });

    //NEW-Company-CANCEL click event
    $("#btnCompUpdateCancel").click(function () {

        $("#divUpdate").hide();
        $("#divTable").removeClass("col-md-8").addClass("col-md-12");
        return false;

    });

    //
    //Company-OFFICE Events
    //

    //BTN-OFFICE-NEW click event
    $("#btnOffNew").click(function () {

        if (isCompany == false) {

            noty({ text: 'Please select a Company first.', layout: 'topRight', type: 'error', timeout: 2000 });

            return false;
        }

        supModeUpdate = 'new';

        companyClearEditPanel();

        $("#divEditCompany").hide();
        $("#divEditOffice").show();
        $("#divEditPerson").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //BTN-Company-OFFICE-DELETE click event
    $("#btnOffDelete").click(function () {

        fuLib.company.deleteOffice(selIdCompanyOffice).success(function (data, status, xhr) {

            noty({ text: 'Company office deleted successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

            var table = $("#tblOffice").DataTable();
            table.ajax.reload();

        }).error(function (xhr, status, error) {
            //Company.deleteOffice failed
            handleError('Company.deleteOffice', xhr, status, error);
        });

    });

    //NEW-OFFICE-SAVE click event
    $("#btnOfficeUpdateSave").click(function () {

        var isEmptyOffice = false;

        var oOffice = {
            title: $("#txtTitle").val(),
            address1: $("#txtAddress1").val(),
            address2: $("#txtAddress2").val(),
            geoLoc: null,
            email: $("#txtEmailO").val(),
            phone: $("#txtPhoneO").val(),
            fax: $("#txtFaxO").val(),
            company: selIdCompany,
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

        if (supModeUpdate == 'new') {

            if (isEmptyOffice == true) {
                noty({ text: "Please type office details", layout: 'topRight', type: 'error', timeout: 2000 });
                return false;
            }
            else {

                fuLib.company.addOffice(oOffice).success(function (data, status, xhr) {

                    console.log(data);

                    noty({ text: 'Company Office added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                    tableCompanyOffice = $("#tblOffice").DataTable();
                    tableCompanyOffice.ajax.reload();

                }).error(function (xhr, status, error) {
                    //Company.addOffice failed
                    handleError('Company.addOffice', xhr, status, error);
                });
            }

            $("#divUpdate").hide();
            $("#divTable").removeClass("col-md-8").addClass("col-md-12");

            return false;

        }
        else if (supModeUpdate == 'edit') {

        }

        return false;

    });

    //NEW OFFICE-Cancel click event
    $("#btnOfficeUpdateCancel").click(function () {

        $("#divUpdate").hide();
        $("#divTable").removeClass("col-md-8").addClass("col-md-12");
        return false;

    });

    //
    //Company-OFFICE-PERSON Events
    //

    //BTN-Company-OFFICE-PERSON-NEW click event
    $("#btnPersonNew").click(function () {

        if (isCompanyOffice == false) {

            noty({ text: 'Please select a Company office first.', layout: 'topRight', type: 'error', timeout: 2000 });

            return false;
        }

        supModeUpdate = 'new';

        companyClearEditPanel();

        $("#divEditCompany").hide();
        $("#divEditOffice").hide();
        $("#divEditPerson").show();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

        onresize();

    });

    //BTN-Company-OFFICE-PERSON-DELETE click event
    $("#btnPersonDelete").click(function () {

        fuLib.company.deletePerson(selIdCompanyOfficePerson).success(function (data, status, xhr) {

            noty({ text: 'Company office person deleted successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

            var table = $("#tblPerson").DataTable();
            table.ajax.reload();

        }).error(function (xhr, status, error) {
            //Company.deletePerson failed
            handleError('Company.deletePerson', xhr, status, error);
        });

    });

    //NEW-Company-OFFICE-PERSON-SAVE click event
    $("#btnPersonUpdateSave").click(function () {

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
        if (supModeUpdate == 'new') {
            if (isEmptyPerson == false) {
                //save USER details
                fuLib.person.add(oPerson).success(function (data, status, xhr) {
                    console.log(data);
                    var oOfficePerson = {
                        companyOffice: selIdCompanyOffice,
                        person: data.person._id,
                        isPrimary: $("#chkPrimary").prop('checked'),
                        isManager: $("#chkManager").prop('checked'),
                        LovDesignation: $('#selDesignation').val(),
                        LovDepartment: $('#selDepartment').val(),
                        isActive: true,
                        flag: 0
                    };
                    oOfficePerson.LovDesignation = oOfficePerson.LovDesignation == '0' ? null : oOfficePerson.LovDesignation;
                    oOfficePerson.LovDepartment = oOfficePerson.LovDepartment == '0' ? null : oOfficePerson.LovDepartment;

                    fuLib.company.addPerson(oOfficePerson).success(function (data, status, xhr) {

                        noty({ text: 'Person added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                        tableCompanyOfficePeople = $("#tblPerson").DataTable();
                        tableCompanyOfficePeople.ajax.reload();

                    }).error(function (xhr, status, error) {
                        //Company.addPerson failed
                        handleError('Company.addPerson', xhr, status, error);
                    });

                }).error(function (xhr, status, error) {
                    //person.add failed
                    handleError('person.add', xhr, status, error);
                });
            }
            else if (supModeUpdate == 'edit') {

            }
            $("#divUpdate").hide();
            $("#divTable").removeClass("col-md-8").addClass("col-md-12");

            return false;
        }

        return false;

    });

    //NEW PERSON-Cancel click event
    $("#btnPersonUpdateCancel").click(function () {
        $("#divUpdate").hide();
        $("#divTable").removeClass("col-md-8").addClass("col-md-12");
        return false;
    });
}

function fillCompanyOffice(compId) {

    console.log('fillCompanyOffice / ' + compId);

    if (compId == undefined) {
        //return false;
        compId = "0";
    }

    if ($.fn.dataTable.isDataTable("#tblOffice")) {

        tableCompanyOffice.ajax.url(apiUrl + "company/office/getall/" + compId).load();
    }
}

function fillCompanyOfficePerson(offId) {

    console.log('fillCompanyOfficePerson / ' + offId);

    if (offId == undefined) {
        //return false;
        offId = "0";
    }

    if ($.fn.dataTable.isDataTable("#tblPerson")) {

        if (tableCompanyOfficePeople !== undefined) {
            tableCompanyOfficePeople.ajax.url(apiUrl + "company/person/getall/" + offId).load();
        }
    }
}

function companyClearEditPanel() {

    //Company
    $("#txtName").val('');
    $("#txtCode").val('');
    $("#txtWebsite").val('');
    $("#txtEmail").val('');
    $("#txtPhone").val('');
    $("#txtFax").val('');

    //Company office
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

    //Company office person
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

function configCompanyTables() {
    //"option strict";

    //Configures Company DataTable
    //
    $("#tblCompany").DataTable({
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
            { "data": "name", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "code", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "urlWeb", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "email", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "phone", "defaultContent": "<span class='text-muted'>Not set</span>" }
        ],
    });

    //Company table LoadComplete event
    $("#tblCompany").on('xhr.dt', function (e, settings, data, xhr) {
        //data will be null is AJAX error
        if (data) {
            //Company table DrawComplete event
            $('#tblCompany').on('draw.dt', function () {
                //DataTable draw complete event
                tableCompany = $("#tblCompany").DataTable();

                //select first row by default
                tableCompany.rows(':eq(0)', { page: 'current' }).select();
                selIdCompany = tableCompany.rows(':eq(0)', { page: 'current' }).ids()[0];
                console.log('selIdCompany / ' + selIdCompany);

                if (selIdCompany == undefined) {
                    selIdCompany = "99a9b999999f9c9c99999999";
                    isCompany = false;
                }
                else {
                    isCompany = true;
                }

                //Configures Company OFFICE DataTable
                //
                if ($.fn.dataTable.isDataTable("#tblPerson")) {

                    tableCompanyOffice.ajax.url(apiUrl + "company/office/getall/" + selIdCompany).load();
                }
                else {
                    $("#tblOffice").DataTable({
                        "autoWidth": false,
                        "select": {
                            style: 'single'
                        },
                        deferRender: true,
                        rowId: "_id",
                        "ajax": {
                            "url": apiUrl + "company/office/getall/" + selIdCompany,
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
            });
        }
    });

    //Company table RowClick event
    $("#tblCompany tbody").on('click', 'tr', function () {

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            tableCompany = $('#tblCompany').DataTable();
            tableCompany.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            selIdCompany = $(this).attr("id");

            fillCompanyOffice(selIdCompany);

            $("#divUpdate").hide();
            $("#divTable").removeClass("col-md-8").addClass("col-md-12");
        }
    });

    //Company table ReDraw event
    $('#tblCompany').on('draw.dt', function () {
        onresize();
    });

    //Company-OFFICE table AJAX LoadComplete event
    $("#tblOffice").on('xhr.dt', function (e, settings, data, xhr) {
        //data will be null is AJAX error
        if (data) {
            $('#tblOffice').on('draw.dt', function () {
                //DataTable draw complete event
                tableCompanyOffice = $("#tblOffice").DataTable();

                //select first row by default
                tableCompanyOffice.rows(':eq(0)', { page: 'current' }).select();
                selIdCompanyOffice = tableCompanyOffice.rows(':eq(0)', { page: 'current' }).ids()[0];
                console.log('selIdCompanyOffice / ' + selIdCompanyOffice);

                if (selIdCompanyOffice == undefined) {
                    selIdCompanyOffice = "99a9b999999f9c9c99999999";
                    isCompanyOffice = false;
                }
                else {
                    isCompanyOffice = true;
                }

                //Configures Company OFFICE PERSON DataTable
                //
                if ($.fn.dataTable.isDataTable("#tblPerson")) {

                    tableCompanyOfficePeople.ajax.url(apiUrl + "Company/person/getall/" + selIdCompanyOffice).load();
                }
                else {
                    $("#tblPerson").DataTable({
                        "autoWidth": false,
                        "select": {
                            style: 'single'
                        },
                        deferRender: true,
                        rowId: "_id",
                        "ajax": {
                            "url": apiUrl + "Company/person/getall/" + selIdCompanyOffice,
                            "dataSrc": "",
                            "headers": {
                                "Authorization": "Bearer " + token
                            }
                        },
                        "columns": [
                            { "data": "person.name", "defaultContent": "<span class='text-muted'>Not set</span>" },
                            { "data": "isManager", "defaultContent": "<span class='text-muted'>Not set</span>" },
                            { "data": "LovDesignation.title", "defaultContent": "<span class='text-muted'>Not set</span>" },
                            { "data": "LovDepartment.title", "defaultContent": "<span class='text-muted'>Not set</span>" },

                        ],
                    });
                }
            });
        }
    });

    //Company-OFFICE table RowClick event
    $("#tblOffice tbody").on('click', 'tr', function () {

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            tableCompanyOffice = $('#tblOffice').DataTable();
            tableCompanyOffice.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            selIdCompanyOffice = $(this).attr('id');

            fillCompanyOfficePerson(selIdCompanyOffice);

            $("#divUpdate").hide();
            $("#divTable").removeClass("col-md-8").addClass("col-md-12");

        }
    });

    //Company-OFFICE table ReDraw event
    $('#tblOffice').on('draw.dt', function () {
        onresize();
    });

    //Company-OFFICE-PERSON table AJAX LoadComplete event
    $("#tblPerson").on('xhr.dt', function (e, settings, data, xhr) {
        //data will be null is AJAX error
        if (data) {
            $('#tblPerson').on('draw.dt', function () {
                //DataTable draw complete event
                tableCompanyOfficePeople = $("#tblPerson").DataTable();

                //select first row by default
                tableCompanyOfficePeople.rows(':eq(0)', { page: 'current' }).select();
                selIdCompanyOfficePerson = tableCompanyOfficePeople.rows(':eq(0)', { page: 'current' }).ids()[0];

                console.log('selIdCompanyOfficePerson / ' + selIdCompanyOfficePerson);

            });
        }
    });

    //Company-OFFICE-PERSON table RowClick event
    $("#tblPerson tbody").on('click', 'tr', function () {

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            tableCompanyOfficePeople = $('#tblPerson').DataTable();
            tableCompanyOfficePeople.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            selIdCompanyOfficePerson = $(this).attr('id');

            $("#divUpdate").hide();
            $("#divTable").removeClass("col-md-8").addClass("col-md-12");

        }
    });

    //Company-OFFICE-PERSON table ReDraw event
    $('#tblPerson').on('draw.dt', function () {
        onresize();
    });
}