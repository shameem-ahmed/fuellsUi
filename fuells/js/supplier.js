//CALLED FROM _LAYOUT2
function doSupplier(crPage) {

    var crTab = 0;
    var modeUpdate = 'new';
    var selId = '';

    var tableSupplier;
    var tableCode;
    var tableOffice;
    var tablePerson;
   
    $("#divUpdate").hide();

    $("#divTable").removeClass("col-md-8").addClass("col-md-12");

    //Configures SUPPLIER DataTable
    //
    //DATATABLE AJAX LOAD COMPLETE EVENT
    $("#tblSupplier").on('xhr.dt', function (e, settings, data, xhr) {

        //data will be null is AJAX error
        if (data) {
            //DATATABLE DRAW COMPLETE EVENT
            $('#tblSupplier').on('draw.dt', function () {

                tableSupplier = $("#tblSupplier").DataTable();
                //select first row by default
                tableSupplier.rows(':eq(0)', { page: 'current' }).select();
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
    $("#tblSupplier tbody").on('click', 'tr', function () {

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            tableSupplier = $('#tblUser').DataTable();
            tableSupplier.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            selId = $(this).find('input[type=hidden]').eq(0).val();
            selAdmin = $(this).find('input[type=hidden]').eq(1).val();

            $("#btnUserAccess").prop('disabled', selAdmin == "true");

            fillCode(selId);
            fillOffice(selId);

        }
    });

    //TABLE REDRAW EVENT
    $('#tblSupplier').on('draw.dt', function () {
        onresize();
    });

    //fill COUNTRIES
    fuLib.gloc.getCountries().success(function (data, status, xhr) {
        fillCombo('#selCountry', data);

    }).error(function (xhr, status, error) {
        //gloc.getCountries failed
        handleError('gloc.getCountries', xhr, status, error);
    });

    //fill PERSON GOVT CODES
    fuLib.lov.getLovCompanyGovtCodes().success(function (data, status, xhr) {
        fillCombo('#selLovGCode', data);

    }).error(function (xhr, status, error) {
        //lov.getLovCompanyGovtCodes failed
        handleError('lov.getLovCompanyGovtCodes', xhr, status, error);
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
        modeUpdate = 'new';

        supplierClearEditPanel();

        $("#divEditSupplier").show();
        $("#divEditCode").hide();
        $("#divEditOffice").hide();
        $("#divEditPerson").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //BTN CODE NEW click event
    $("#btnCodeNew").click(function () {
        modeUpdate = 'new';

        supplierClearEditPanel();

        $("#divEditSupplier").hide();
        $("#divEditCode").show();
        $("#divEditOffice").hide();
        $("#divEditPerson").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //BTN OFFICE NEW click event
    $("#btnOffNew").click(function () {
        modeUpdate = 'new';

        supplierClearEditPanel();

        $("#divEditSupplier").hide();
        $("#divEditCode").hide();
        $("#divEditOffice").show();
        $("#divEditPerson").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //BTN PERSON NEW click event
    $("#btnPersonNew").click(function () {
        modeUpdate = 'new';

        supplierClearEditPanel();

        $("#divEditSupplier").hide();
        $("#divEditCode").hide();
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
            isActive: true,
            flag: 0
        };

        //check if oSupplier is empty
        if (oSupplier.code.trim().length == 0 &&
            oSupplier.name.trim().length == 0
            ) {
            isEmptySupplier = true;
        }

        if (modeUpdate == 'new') {

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
        else if (modeUpdate == 'edit') {

        }
       
        return false;

    });

    //NEW SUPPLIER-Cancel click event
    $("#btnSupplierUpdateCancel").click(function () {
     
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
            supplier: selId,
            isActive: true,
            flag: 0
        };

        //check if oSupplier is empty
        if (oCode.value.trim().length == 0) {
            isEmptyCode = true;
        }

        if (modeUpdate == 'new') {

            if (isEmptyCode == true) {
                noty({ text: "Please type govt code details", layout: 'topRight', type: 'error', timeout: 2000 });
                return false;
            }
            else {

                fuLib.supplier.addCode(oCode).success(function (data, status, xhr) {

                    console.log(data);

                    noty({ text: 'Govt code added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                    tableCode = $("#tblCode").DataTable();
                    tableCode.ajax.reload();

                }).error(function (xhr, status, error) {
                    //supplier.addCode failed
                    handleError('supplier.addCode', xhr, status, error);
                });
            }

            $("#divUpdate").hide();
            $("#divTable").removeClass("col-md-8").addClass("col-md-12");

            return false;

        }
        else if (modeUpdate == 'edit') {

        }

        return false;

    });

    //NEW CODE-Cancel click event
    $("#btnCodeUpdateCancel").click(function () {

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
            email: $("#txtEmail").val(),
            phone: $("#txtPhone").val(),
            fax: $("#txtFax").val(),
            supplier: selId,
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

        if (modeUpdate == 'new') {

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
        else if (modeUpdate == 'edit') {

        }

        return false;

    });

    //NEW OFFICE-Cancel click event
    $("#btnOfficeUpdateCancel").click(function () {

        $("#divUpdate").hide();
        $("#divTable").removeClass("col-md-8").addClass("col-md-12");
        return false;

    });

}

function fillCode(suppId) {

    if ($.fn.dataTable.isDataTable("#tblCode")) {

        tableCode.ajax.url(apiUrl + "supplier/code/getall/" + suppId).load();
    }
    else {
        //Configures GOVT CODE DataTable
        $("#tblCode").on('xhr.dt', function (e, settings, data, xhr) {
            //DataTable AJAX load complete event

            //data will be null is AJAX error
            if (data) {
                $('#tblCode').on('draw.dt', function () {
                    //DataTable draw complete event

                    tableCode = $("#tblCode").DataTable();
                    //select first row by default
                    tableCode.rows(':eq(0)', { page: 'current' }).select();
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
                "url": apiUrl + "supplier/code/getall/" + suppId,
                "dataSrc": "",
                "headers": {
                    "Authorization": "Bearer " + token
                }
            },
            "columns": [
                { "data": "value", "defaultContent": "<span class='text-muted'>Not set</span>" },
                { "data": "LovType.title", "defaultContent": "<span class='text-muted'>Not set</span>" }
            ],
        });
    }
}

function fillOffice(suppId) {
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
                { "data": "phone", "defaultContent": "<span class='text-muted'>Not set</span>" }
            ],
        });
    }
}

function fillPerson(offId) {

}

function supplierClearEditPanel() {

    //supplier
    $("#txtName").val('');
    $("#txtCode").val('');
    $("#txtWebsite").val('');
    $("#txtEmail").val('');
    $("#txtPhone").val('');
    $("#txtFax").val('');
  

    //supplier govt code
    $("#selLovGCode option[value='0']").prop("selected", true);
    $("#selLovGCode").selectpicker('refresh');
    $("#txtGCode").val('');

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
    $("#selGovtCode option[value='0']").prop("selected", true);
    $("#selGovtCode").selectpicker('refresh');
    $("#txtGovtCode").val('');
    $("#txtDateBirth").val('');
    $("#txtDateAnniversary").val('');
    $("input[name=iradioMStatus]:checked", "#frmPerson").val('0');
    $("input[name=iradioGender]:checked", "#frmPerson").val('0');

}
