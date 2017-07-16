"use strict";

var supCrTab = 0;
var supModeUpdate = 'new';

var selIdSupplier = '';
var selIdOffice = '';
var selIdPerson = '';

var tableSupplier;
var tableOffice;
var tablePeople;

//CALLED FROM _LAYOUT2
function doSupplier(crPage) {

    $("#divUpdate").hide();

    $("#divTable").removeClass("col-md-8").addClass("col-md-12");

    configSupplierTable();

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

    //fill SUPPLIER GOVT CODES
    fuLib.lov.getCompanyGovtNos().success(function (data, status, xhr) {
        fillUl('#ulSuppGovtNo', data);

    }).error(function (xhr, status, error) {
        //lov.getCompanyGovtNos failed
        handleError('lov.getCompanyGovtNos', xhr, status, error);
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

    //BTN SUPPLIER NEW click event
    $("#btnSuppNew").click(function () {
        supModeUpdate = 'new';

        supplierClearEditPanel();

        $("#divEditSupplier").show();
        $("#divEditOffice").hide();
        $("#divEditPerson").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //BTN OFFICE NEW click event
    $("#btnOffNew").click(function () {
        supModeUpdate = 'new';

        supplierClearEditPanel();

        $("#divEditSupplier").hide();
        $("#divEditOffice").show();
        $("#divEditPerson").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //BTN PERSON NEW click event
    $("#btnPersonNew").click(function () {
        supModeUpdate = 'new';

        supplierClearEditPanel();

        $("#divEditSupplier").hide();
        $("#divEditOffice").hide();
        $("#divEditPerson").show();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //NEW SUPPLIER-SAVE CHANGES click event
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

    //NEW SUPPLIER-Cancel click event
    $("#btnSuppUpdateCancel").click(function () {

        $("#divUpdate").hide();
        $("#divTable").removeClass("col-md-8").addClass("col-md-12");
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

                    tableOffice = $("#tblOffice").DataTable();
                    tableOffice.ajax.reload();

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

    //NEW PERSON-SAVE CHANGES click event
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
                        supplierOffice: selIdOffice,
                        person: data.person._id,
                        isPrimary: $("#chkPrimary").prop('checked'),
                        isManager: $("#chkManager").prop('checked'),
                        LovDesignation: $('#selDesignation').val(),
                        LovDepartment: $('#selDepartment').val(),
                        isActive: true,
                        flag: 0
                    };

                    fuLib.supplier.addPerson(oOfficePerson).success(function (data, status, xhr) {

                        noty({ text: 'Person added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                    }).error(function (xhr, status, error) {
                        //supplier.addPerson failed
                        handleError('supplier.addPerson', xhr, status, error);
                    });

                }).error(function (xhr, status, error) {
                    //person.add failed
                    handleError('person.add', xhr, status, error);
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

function fillSupplierOffice(suppId) {

    if ($.fn.dataTable.isDataTable("#tblOffice")) {

        tableOffice.ajax.url(apiUrl + "supplier/office/getall/" + suppId).load();
    }
    else {
        //Configures OFFICE DataTable
        $("#tblOffice").on('xhr.dt', function (e, settings, data, xhr) {
            //DataTable AJAX load complete event

            //data will be null is AJAX error
            if (data) {
                $('#tblOffice').on('draw.dt', function () {
                    //DataTable draw complete event

                    tableOffice = $("#tblOffice").DataTable();
                    //select first row by default
                    tableOffice.rows(':eq(0)', { page: 'current' }).select();

                    selIdOffice = tableOffice.rows(':eq(0)', { page: 'current' }).ids()[0];
                    fillOfficePerson(selIdOffice);
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
                "url": apiUrl + "supplier/office/getall/" + suppId,
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


        //TABLE ROW CLICK EVENT
        $("#tblOffice tbody").on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                tableOffice = $('#tblOffice').DataTable();
                tableOffice.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');

                selIdOffice = $(this).attr('id');

                fillOfficePerson(selIdOffice);

            }
        });

        //TABLE REDRAW EVENT
        $('#tblOffice').on('draw.dt', function () {
            onresize();
        });


    }
}

function fillOfficePerson(offId) {

    if ($.fn.dataTable.isDataTable("#tblPerson")) {

        tablePeople.ajax.url(apiUrl + "supplier/person/getall/" + offId).load();
    }
    else {
        //Configures PERSON DataTable
        $("#tblPerson").on('xhr.dt', function (e, settings, data, xhr) {
            //DataTable AJAX load complete event

            //data will be null is AJAX error
            if (data) {
                $('#tblPerson').on('draw.dt', function () {
                    //DataTable draw complete event

                    tablePeople = $("#tblPerson").DataTable();
                    //select first row by default
                    tablePeople.rows(':eq(0)', { page: 'current' }).select();
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
                "url": apiUrl + "supplier/person/getall/" + offId,
                "dataSrc": "",
                "headers": {
                    "Authorization": "Bearer " + token
                }
            },
            "columns": [
                { "data": "person.name", "defaultContent": "<span class='text-muted'>Not set</span>" },
                { "data": "isManager", "defaultContent": "<span class='text-muted'>Not set</span>" },
                { "data": "LovDesignation.title", "defaultContent": "<span class='text-muted'>Not set</span>" },
            ],
        });


        //TABLE ROW CLICK EVENT
        $("#tblPerson tbody").on('click', 'tr', function () {

            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                tablePeople = $('#tblPerson').DataTable();
                tablePeople.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');

                selIdPerson = $(this).attr('id');

            }
        });

        //TABLE REDRAW EVENT
        $('#tblPerson').on('draw.dt', function () {
            onresize();
        });
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

function configSupplierTable() {
    //"option strict";

    //DATATABLE AJAX LOAD COMPLETE EVENT
    $("#tblSupplier").on('xhr.dt', function (e, settings, data, xhr) {

        //data will be null is AJAX error
        if (data) {
            //DATATABLE DRAW COMPLETE EVENT
            $('#tblSupplier').on('draw.dt', function () {

                tableSupplier = $("#tblSupplier").DataTable();
                //select first row by default

                tableSupplier.rows(':eq(0)', { page: 'current' }).select();
                selIdSupplier = tableSupplier.rows(':eq(0)', { page: 'current' }).ids()[0];

                console.log(selIdSupplier);

                fillSupplierOffice(selIdSupplier);



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

    //TABLE ROW CLICK EVENT
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
        }
    });

    //TABLE REDRAW EVENT
    $('#tblSupplier').on('draw.dt', function () {
        onresize();
    });
}