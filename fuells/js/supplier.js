"use strict";

var supCrTab = 0;
var supModeUpdate = 'new';

var selIdSupplier = '0';
var selIdSupplierOffice = '0';
var selIdSupplierOfficePerson = '0';

var isSupplier = false;
var isSupplierOffice = false;
var isSupplierOfficePerson = false;

var tableSupplier;
var tableSupplierOffice;
var tableSupplierOfficePeople;

//CALLED FROM _LAYOUT2
function doSupplier(crPage) {

    $("#divUpdate").hide();

    $("#divTable").removeClass("col-md-8").addClass("col-md-12");

    configSupplierTables();

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
    //SUPPLIER Events
    //

    //BTN-SUPPLIER-NEW click event
    $("#btnSuppNew").click(function () {
        supModeUpdate = 'new';

        supplierClearEditPanel();

        $("#divEditSupplier").show();
        $("#divEditOffice").hide();
        $("#divEditPerson").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //BTN-SUPPLIER-DELETE click event
    $("#btnSuppDelete").click(function () {

        var confirm1 = confirm("Sure to delete this supplier?");

        if (confirm1 == true) {

            fuLib.supplier.delete(selIdSupplier).success(function (data, status, xhr) {

                noty({ text: 'Supplier deleted successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                var table = $("#tblSupplier").DataTable();
                table.ajax.reload();

            }).error(function (xhr, status, error) {
                //supplier.delete failed
                handleError('supplier.delete', xhr, status, error);
            });
        }
    });

    //NEW-SUPPLIER-SAVE CHANGES click event
    $("#btnSuppUpdateSave").click(function () {

        var isEmptySupplier = false;

        var oSupplier = {
            code: $("#txtCode").val(),
            name: $("#txtName").val(),
            urlWeb: $("#txtWebsite").val(),
            email: $("#txtEmail").val(),
            phone: $("#txtPhone").val(),
            fax: $("#txtFax").val(),
            logo: '',
            lovGovtNo: $("#ulSuppGovtNoId").val(),
            govtNo: $("#txtSuppGovtNo").val(),
            isActive: true,
            flag: 0
        };

        //check if oSupplier is empty
        if (oSupplier.code.trim().length == 0 &&
            oSupplier.name.trim().length == 0
            ) {
            isEmptySupplier = true;
        }

        if (supModeUpdate == 'new') {

            if (isEmptySupplier == true) {
                noty({ text: "Please type supplier details", layout: 'topRight', type: 'error', timeout: 2000 });
                return false;
            }
            else {

                fuLib.supplier.add(oSupplier).success(function (data, status, xhr) {

                    console.log(data);

                    noty({ text: 'Supplier added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                    var table = $("#tblSupplier").DataTable();
                    table.ajax.reload();

                }).error(function (xhr, status, error) {
                    //supplier.add failed
                    handleError('supplier.add', xhr, status, error);
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

    //NEW-SUPPLIER-CANCEL click event
    $("#btnSuppUpdateCancel").click(function () {

        $("#divUpdate").hide();
        $("#divTable").removeClass("col-md-8").addClass("col-md-12");
        return false;

    });

    //
    //SUPPLIER-OFFICE Events
    //

    //BTN-OFFICE-NEW click event
    $("#btnOffNew").click(function () {

        if (isSupplier == false) {

            noty({ text: 'Please select a supplier first.', layout: 'topRight', type: 'error', timeout: 2000 });

            return false;
        }

        supModeUpdate = 'new';

        supplierClearEditPanel();

        $("#divEditSupplier").hide();
        $("#divEditOffice").show();
        $("#divEditPerson").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //BTN-SUPPLIER-OFFICE-DELETE click event
    $("#btnOffDelete").click(function () {

        var confirm1 = confirm("Sure to delete this supplier office?");

        if (confirm1 == true) {

            fuLib.supplier.deleteOffice(selIdSupplierOffice).success(function (data, status, xhr) {

                noty({ text: 'Supplier office deleted successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                var table = $("#tblOffice").DataTable();
                table.ajax.reload();

            }).error(function (xhr, status, error) {
                //supplier.deleteOffice failed
                handleError('supplier.deleteOffice', xhr, status, error);
            });
        }
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
            supplier: selIdSupplier,
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

                fuLib.supplier.addOffice(oOffice).success(function (data, status, xhr) {

                    console.log(data);

                    noty({ text: 'Supplier Office added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                    tableSupplierOffice = $("#tblOffice").DataTable();
                    tableSupplierOffice.ajax.reload();

                }).error(function (xhr, status, error) {
                    //supplier.addOffice failed
                    handleError('supplier.addOffice', xhr, status, error);
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
    //SUPPLIER-OFFICE-PERSON Events
    //

    //BTN-SUPPLIER-OFFICE-PERSON-NEW click event
    $("#btnPersonNew").click(function () {

        if (isSupplierOffice == false) {

            noty({ text: 'Please select a supplier office first.', layout: 'topRight', type: 'error', timeout: 2000 });

            return false;
        }

        supModeUpdate = 'new';

        supplierClearEditPanel();

        $("#divEditSupplier").hide();
        $("#divEditOffice").hide();
        $("#divEditPerson").show();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

        onresize();

    });

    //BTN-SUPPLIER-OFFICE-PERSON-DELETE click event
    $("#btnPersonDelete").click(function () {

        var confirm1 = confirm("Sure to delete this supplier office person?");

        if (confirm1 == true) {

            fuLib.supplier.deletePerson(selIdSupplierOfficePerson).success(function (data, status, xhr) {

                noty({ text: 'Supplier office person deleted successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                var table = $("#tblPerson").DataTable();
                table.ajax.reload();

            }).error(function (xhr, status, error) {
                //supplier.deletePerson failed
                handleError('supplier.deletePerson', xhr, status, error);
            });
        }
    });

    //NEW-SUPPLIER-OFFICE-PERSON-SAVE click event
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
                        supplierOffice: selIdSupplierOffice,
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

                    fuLib.supplier.addPerson(oOfficePerson).success(function (data, status, xhr) {

                        noty({ text: 'Person added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                        tableSupplierOfficePeople = $("#tblPerson").DataTable();
                        tableSupplierOfficePeople.ajax.reload();

                    }).error(function (xhr, status, error) {
                        //supplier.addPerson failed
                        handleError('supplier.addPerson', xhr, status, error);
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

function fillSupplierOffice(suppId) {

    console.log('fillSupplierOffice / ' + suppId);

    if (suppId == undefined) {
        //return false;
        suppId = "0";
    }

    if ($.fn.dataTable.isDataTable("#tblOffice")) {

        tableSupplierOffice.ajax.url(apiUrl + "supplier/office/getall/" + suppId).load();
    }
}

function fillSupplierOfficePerson(offId) {

    console.log('fillSupplierOfficePerson / ' + offId);

    if (offId == undefined) {
        //return false;
        offId = "0";
    }

    if ($.fn.dataTable.isDataTable("#tblPerson")) {

        if (tableSupplierOfficePeople !== undefined) {
            tableSupplierOfficePeople.ajax.url(apiUrl + "supplier/person/getall/" + offId).load();
        }
    }
}

function supplierClearEditPanel() {

    //supplier
    $("#txtName").val('');
    $("#txtCode").val('');
    $("#txtWebsite").val('');
    $("#txtEmail").val('');
    $("#txtPhone").val('');
    $("#txtFax").val('');

    //supplier office
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

    //supplier office person
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

function configSupplierTables() {
    //"option strict";

    //Configures SUPPLIER DataTable
    //
    $("#tblSupplier").DataTable({
        "autoWidth": false,
        "select": {
            style: 'single'
        },
        deferRender: true,
        rowId: "_id",
        "ajax": {
            "url": apiUrl + "supplier/getall",
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

    //SUPPLIER table LoadComplete event
    $("#tblSupplier").on('xhr.dt', function (e, settings, data, xhr) {
        //data will be null is AJAX error
        if (data) {
            //SUPPLIER table DrawComplete event
            $('#tblSupplier').on('draw.dt', function () {
                //DataTable draw complete event
                tableSupplier = $("#tblSupplier").DataTable();

                //select first row by default
                tableSupplier.rows(':eq(0)', { page: 'current' }).select();
                selIdSupplier = tableSupplier.rows(':eq(0)', { page: 'current' }).ids()[0];
                console.log('selIdSupplier / ' + selIdSupplier);

                if (selIdSupplier == undefined) {
                    selIdSupplier = "99a9b999999f9c9c99999999";
                    isSupplier = false;
                }
                else {
                    isSupplier = true;
                }

                //Configures SUPPLIER OFFICE DataTable
                //
                if ($.fn.dataTable.isDataTable("#tblPerson")) {

                    tableSupplierOffice.ajax.url(apiUrl + "supplier/office/getall/" + selIdSupplier).load();
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
                            "url": apiUrl + "supplier/office/getall/" + selIdSupplier,
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

    //SUPPLIER table RowClick event
    $("#tblSupplier tbody").on('click', 'tr', function () {

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            tableSupplier = $('#tblSupplier').DataTable();
            tableSupplier.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            selIdSupplier = $(this).attr("id");

            fillSupplierOffice(selIdSupplier);

            $("#divUpdate").hide();
            $("#divTable").removeClass("col-md-8").addClass("col-md-12");
        }
    });

    //SUPPLIER table ReDraw event
    $('#tblSupplier').on('draw.dt', function () {
        onresize();
    });

    //SUPPLIER-OFFICE table AJAX LoadComplete event
    $("#tblOffice").on('xhr.dt', function (e, settings, data, xhr) {
        //data will be null is AJAX error
        if (data) {
            $('#tblOffice').on('draw.dt', function () {
                //DataTable draw complete event
                tableSupplierOffice = $("#tblOffice").DataTable();

                //select first row by default
                tableSupplierOffice.rows(':eq(0)', { page: 'current' }).select();
                selIdSupplierOffice = tableSupplierOffice.rows(':eq(0)', { page: 'current' }).ids()[0];
                console.log('selIdSupplierOffice / ' + selIdSupplierOffice);

                if (selIdSupplierOffice == undefined) {
                    selIdSupplierOffice = "99a9b999999f9c9c99999999";
                    isSupplierOffice = false;
                }
                else {
                    isSupplierOffice = true;
                }

                //Configures SUPPLIER OFFICE PERSON DataTable
                //
                if ($.fn.dataTable.isDataTable("#tblPerson")) {

                    tableSupplierOfficePeople.ajax.url(apiUrl + "supplier/person/getall/" + selIdSupplierOffice).load();
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
                            "url": apiUrl + "supplier/person/getall/" + selIdSupplierOffice,
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

    //SUPPLIER-OFFICE table RowClick event
    $("#tblOffice tbody").on('click', 'tr', function () {

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            tableSupplierOffice = $('#tblOffice').DataTable();
            tableSupplierOffice.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            selIdSupplierOffice = $(this).attr('id');

            fillSupplierOfficePerson(selIdSupplierOffice);

            $("#divUpdate").hide();
            $("#divTable").removeClass("col-md-8").addClass("col-md-12");

        }
    });

    //SUPPLIER-OFFICE table ReDraw event
    $('#tblOffice').on('draw.dt', function () {
        onresize();
    });

    //SUPPLIER-OFFICE-PERSON table AJAX LoadComplete event
    $("#tblPerson").on('xhr.dt', function (e, settings, data, xhr) {
        //data will be null is AJAX error
        if (data) {
            $('#tblPerson').on('draw.dt', function () {
                //DataTable draw complete event
                tableSupplierOfficePeople = $("#tblPerson").DataTable();

                //select first row by default
                tableSupplierOfficePeople.rows(':eq(0)', { page: 'current' }).select();
                selIdSupplierOfficePerson = tableSupplierOfficePeople.rows(':eq(0)', { page: 'current' }).ids()[0];

                console.log('selIdSupplierOfficePerson / ' + selIdSupplierOfficePerson);

            });
        }
    });

    //SUPPLIER-OFFICE-PERSON table RowClick event
    $("#tblPerson tbody").on('click', 'tr', function () {

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            tableSupplierOfficePeople = $('#tblPerson').DataTable();
            tableSupplierOfficePeople.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            selIdSupplierOfficePerson = $(this).attr('id');

            $("#divUpdate").hide();
            $("#divTable").removeClass("col-md-8").addClass("col-md-12");

        }
    });

    //SUPPLIER-OFFICE-PERSON table ReDraw event
    $('#tblPerson').on('draw.dt', function () {
        onresize();
    });
}