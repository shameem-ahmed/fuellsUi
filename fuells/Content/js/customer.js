"use strict";

var supCrTab = 0;
var supModeUpdate = 'new';

var selIdCustomer = '0';
var selIdCustomerOffice = '0';
var selIdCustomerOfficePerson = '0';

var isCustomer = false;
var isCustomerOffice = false;
var isCustomerOfficePerson = false;

var tableCustomer;
var tableCustomerOffice;
var tableCustomerOfficePeople;

//CALLED FROM _LAYOUT2
function doCustomer(crPage) {

    $("#divUpdate").hide();

    $("#divTable").removeClass("col-md-8").addClass("col-md-12");

    configCustomerTables();

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
    //Customer Events
    //

    //BTN-Customer-NEW click event
    $("#btnCusNew").click(function () {
        supModeUpdate = 'new';

        customerClearEditPanel();

        $("#divEditCustomer").show();
        $("#divEditOffice").hide();
        $("#divEditPerson").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //BTN-Customer-DELETE click event
    $("#btnCusDelete").click(function () {

        fuLib.customer.delete(selIdCustomer).success(function (data, status, xhr) {

            noty({ text: 'Customer deleted successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

            var table = $("#tblCustomer").DataTable();
            table.ajax.reload();

        }).error(function (xhr, status, error) {
            //Customer.delete failed
            handleError('Customer.delete', xhr, status, error);
        });

    });

    //NEW-Customer-SAVE CHANGES click event
    $("#btnCusUpdateSave").click(function () {

        var isEmptyCustomer = false;

        var oCustomer = {
            code: $("#txtCode").val(),
            name: $("#txtName").val(),
            urlWeb: $("#txtWebsite").val(),
            email: $("#txtEmail").val(),
            phone: $("#txtPhone").val(),
            fax: $("#txtFax").val(),
            logo: '',
            lovGovtNo: $("#ulCusGovtNoId").val(),
            govtNo: $("#txtCusGovtNo").val(),
            isActive: true,
            flag: 0
        };

        //check if oCustomer is empty
        if (oCustomer.code.trim().length == 0 &&
            oCustomer.name.trim().length == 0
            ) {
            isEmptyCustomer = true;
        }

        if (supModeUpdate == 'new') {

            if (isEmptyCustomer == true) {
                noty({ text: "Please type Customer details", layout: 'topRight', type: 'error', timeout: 2000 });
                return false;
            }
            else {

                fuLib.customer.add(oCustomer).success(function (data, status, xhr) {

                    console.log(data);

                    noty({ text: 'Customer added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                    var table = $("#tblCustomer").DataTable();
                    table.ajax.reload();

                }).error(function (xhr, status, error) {
                    //Customer.add failed
                    handleError('Customer.add', xhr, status, error);
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

    //NEW-Customer-CANCEL click event
    $("#btnCusUpdateCancel").click(function () {

        $("#divUpdate").hide();
        $("#divTable").removeClass("col-md-8").addClass("col-md-12");
        return false;

    });

    //
    //Customer-OFFICE Events
    //

    //BTN-OFFICE-NEW click event
    $("#btnOffNew").click(function () {

        if (isCustomer == false) {

            noty({ text: 'Please select a Customer first.', layout: 'topRight', type: 'error', timeout: 2000 });

            return false;
        }

        supModeUpdate = 'new';

        customerClearEditPanel();

        $("#divEditCustomer").hide();
        $("#divEditOffice").show();
        $("#divEditPerson").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //BTN-Customer-OFFICE-DELETE click event
    $("#btnOffDelete").click(function () {

        fuLib.customer.deleteOffice(selIdCustomerOffice).success(function (data, status, xhr) {

            noty({ text: 'Customer office deleted successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

            var table = $("#tblOffice").DataTable();
            table.ajax.reload();

        }).error(function (xhr, status, error) {
            //Customer.deleteOffice failed
            handleError('Customer.deleteOffice', xhr, status, error);
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
            customer: selIdCustomer,
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

                fuLib.customer.addOffice(oOffice).success(function (data, status, xhr) {

                    console.log(data);

                    noty({ text: 'Customer Office added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                    tableCustomerOffice = $("#tblOffice").DataTable();
                    tableCustomerOffice.ajax.reload();

                }).error(function (xhr, status, error) {
                    //Customer.addOffice failed
                    handleError('Customer.addOffice', xhr, status, error);
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
    //Customer-OFFICE-PERSON Events
    //

    //BTN-Customer-OFFICE-PERSON-NEW click event
    $("#btnPersonNew").click(function () {

        if (isCustomerOffice == false) {

            noty({ text: 'Please select a Customer office first.', layout: 'topRight', type: 'error', timeout: 2000 });

            return false;
        }

        supModeUpdate = 'new';

        customerClearEditPanel();

        $("#divEditCustomer").hide();
        $("#divEditOffice").hide();
        $("#divEditPerson").show();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

        onresize();

    });

    //BTN-Customer-OFFICE-PERSON-DELETE click event
    $("#btnPersonDelete").click(function () {

        fuLib.customer.deletePerson(selIdCustomerOfficePerson).success(function (data, status, xhr) {

            noty({ text: 'Customer office person deleted successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

            var table = $("#tblPerson").DataTable();
            table.ajax.reload();

        }).error(function (xhr, status, error) {
            //Customer.deletePerson failed
            handleError('Customer.deletePerson', xhr, status, error);
        });

    });

    //NEW-Customer-OFFICE-PERSON-SAVE click event
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
                        customerOffice: selIdCustomerOffice,
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

                    fuLib.customer.addPerson(oOfficePerson).success(function (data, status, xhr) {

                        noty({ text: 'Person added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                        tableCustomerOfficePeople = $("#tblPerson").DataTable();
                        tableCustomerOfficePeople.ajax.reload();

                    }).error(function (xhr, status, error) {
                        //Customer.addPerson failed
                        handleError('Customer.addPerson', xhr, status, error);
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

function fillCustomerOffice(suppId) {

    console.log('fillCustomerOffice / ' + suppId);

    if (suppId == undefined) {
        //return false;
        suppId = "0";
    }

    if ($.fn.dataTable.isDataTable("#tblOffice")) {

        tableCustomerOffice.ajax.url(apiUrl + "customer/office/getall/" + suppId).load();
    }
}

function fillCustomerOfficePerson(offId) {

    console.log('fillCustomerOfficePerson / ' + offId);

    if (offId == undefined) {
        //return false;
        offId = "0";
    }

    if ($.fn.dataTable.isDataTable("#tblPerson")) {

        if (tableCustomerOfficePeople !== undefined) {
            tableCustomerOfficePeople.ajax.url(apiUrl + "customer/person/getall/" + offId).load();
        }
    }
}

function customerClearEditPanel() {

    //Customer
    $("#txtName").val('');
    $("#txtCode").val('');
    $("#txtWebsite").val('');
    $("#txtEmail").val('');
    $("#txtPhone").val('');
    $("#txtFax").val('');

    //Customer office
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

    //Customer office person
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

function configCustomerTables() {
    //"option strict";

    //Configures Customer DataTable
    //
    $("#tblCustomer").DataTable({
        "autoWidth": false,
        "select": {
            style: 'single'
        },
        deferRender: true,
        rowId: "_id",
        "ajax": {
            "url": apiUrl + "customer/getall",
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

    //Customer table LoadComplete event
    $("#tblCustomer").on('xhr.dt', function (e, settings, data, xhr) {
        //data will be null is AJAX error
        if (data) {
            //Customer table DrawComplete event
            $('#tblCustomer').on('draw.dt', function () {
                //DataTable draw complete event
                tableCustomer = $("#tblCustomer").DataTable();

                //select first row by default
                tableCustomer.rows(':eq(0)', { page: 'current' }).select();
                selIdCustomer = tableCustomer.rows(':eq(0)', { page: 'current' }).ids()[0];
                console.log('selIdCustomer / ' + selIdCustomer);

                if (selIdCustomer == undefined) {
                    selIdCustomer = "99a9b999999f9c9c99999999";
                    isCustomer = false;
                }
                else {
                    isCustomer = true;
                }

                //Configures Customer OFFICE DataTable
                //
                if ($.fn.dataTable.isDataTable("#tblPerson")) {

                    tableCustomerOffice.ajax.url(apiUrl + "customer/office/getall/" + selIdCustomer).load();
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
                            "url": apiUrl + "customer/office/getall/" + selIdCustomer,
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

    //Customer table RowClick event
    $("#tblCustomer tbody").on('click', 'tr', function () {

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            tableCustomer = $('#tblCustomer').DataTable();
            tableCustomer.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            selIdCustomer = $(this).attr("id");

            fillCustomerOffice(selIdCustomer);

            $("#divUpdate").hide();
            $("#divTable").removeClass("col-md-8").addClass("col-md-12");
        }
    });

    //Customer table ReDraw event
    $('#tblCustomer').on('draw.dt', function () {
        onresize();
    });

    //Customer-OFFICE table AJAX LoadComplete event
    $("#tblOffice").on('xhr.dt', function (e, settings, data, xhr) {
        //data will be null is AJAX error
        if (data) {
            $('#tblOffice').on('draw.dt', function () {
                //DataTable draw complete event
                tableCustomerOffice = $("#tblOffice").DataTable();

                //select first row by default
                tableCustomerOffice.rows(':eq(0)', { page: 'current' }).select();
                selIdCustomerOffice = tableCustomerOffice.rows(':eq(0)', { page: 'current' }).ids()[0];
                console.log('selIdCustomerOffice / ' + selIdCustomerOffice);

                if (selIdCustomerOffice == undefined) {
                    selIdCustomerOffice = "99a9b999999f9c9c99999999";
                    isCustomerOffice = false;
                }
                else {
                    isCustomerOffice = true;
                }

                //Configures Customer OFFICE PERSON DataTable
                //
                if ($.fn.dataTable.isDataTable("#tblPerson")) {

                    tableCustomerOfficePeople.ajax.url(apiUrl + "customer/person/getall/" + selIdCustomerOffice).load();
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
                            "url": apiUrl + "customer/person/getall/" + selIdCustomerOffice,
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

    //Customer-OFFICE table RowClick event
    $("#tblOffice tbody").on('click', 'tr', function () {

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            tableCustomerOffice = $('#tblOffice').DataTable();
            tableCustomerOffice.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            selIdCustomerOffice = $(this).attr('id');

            fillCustomerOfficePerson(selIdCustomerOffice);

            $("#divUpdate").hide();
            $("#divTable").removeClass("col-md-8").addClass("col-md-12");

        }
    });

    //Customer-OFFICE table ReDraw event
    $('#tblOffice').on('draw.dt', function () {
        onresize();
    });

    //Customer-OFFICE-PERSON table AJAX LoadComplete event
    $("#tblPerson").on('xhr.dt', function (e, settings, data, xhr) {
        //data will be null is AJAX error
        if (data) {
            $('#tblPerson').on('draw.dt', function () {
                //DataTable draw complete event
                tableCustomerOfficePeople = $("#tblPerson").DataTable();

                //select first row by default
                tableCustomerOfficePeople.rows(':eq(0)', { page: 'current' }).select();
                selIdCustomerOfficePerson = tableCustomerOfficePeople.rows(':eq(0)', { page: 'current' }).ids()[0];

                console.log('selIdCustomerOfficePerson / ' + selIdCustomerOfficePerson);

            });
        }
    });

    //Customer-OFFICE-PERSON table RowClick event
    $("#tblPerson tbody").on('click', 'tr', function () {

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            tableCustomerOfficePeople = $('#tblPerson').DataTable();
            tableCustomerOfficePeople.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            selIdCustomerOfficePerson = $(this).attr('id');

            $("#divUpdate").hide();
            $("#divTable").removeClass("col-md-8").addClass("col-md-12");

        }
    });

    //Customer-OFFICE-PERSON table ReDraw event
    $('#tblPerson').on('draw.dt', function () {
        onresize();
    });
}