"use strict";

var poModeUpdate = 'new';

var selIdPO = '';
var selIdPOStyle = '';
var selIdPOStyleSize = '';
var selIdPOInternal = '';
var selIdPOMaterial = '';

var tablePO;
var tablePOStyle;
var tablePOStyleSize;
var tablePOInternal;
var tablePOMaterial;

//CALLED FROM _LAYOUT2
function doPurchaseOrder(crPage) {

    $("#divUpdate").hide();

    //treeShipGeoLoc

    $("#treeShipGeoLoc").treeview({ data: getGeoLoc() });

    configPOTable();

    //BTN PO NEW click event
    $("#btnPONew").click(function () {

        poModeUpdate = 'new';

        $(".x-navigation-minimize").trigger("click");

        poClearEditPanel();

        $("#divList").hide();

        $("#divUpdate").show();

    });

    //NEW PO-SAVE CHANGES click event
    $("#btnPOUpdateSave").click(function () {

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

    //NEW PO-Cancel click event
    $("#btnPONewCancel").click(function () {

        $("#divUpdate").hide();

        $("#divList").show();

        $("#divTable").removeClass("col-md-8").addClass("col-md-12");

        $(".x-navigation-minimize").trigger("click");

    });
}

function getGeoLoc() {

    var data = [
        {
            text: "India",
            nodes: [
                {
                    text: "Tamilnadu",
                    nodes: [
                        {
                            text: "Chennai",
                            nodes: [
                                {
                                    text: "T Nagar",
                                    nodes: [
                                        {
                                            text: "600017"
                                        },
                                        {
                                            text: "600018"
                                        }
                                    ]
                                },
                                {
                                    text: "Broadway",
                                    nodes: [
                                        {
                                            text: "600001"
                                        },
                                        {
                                            text: "600002"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ];

    return data;
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
                { "data": "address1", "defaultContent": "<span class='text-muted'>Not set</span>"},
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
                { "data": "LovDesignation", "defaultContent": "<span class='text-muted'>Not set</span>" },
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
                alert(selIdPerson);
            }
        });

        //TABLE REDRAW EVENT
        $('#tblPerson').on('draw.dt', function () {
            onresize();
        });
    }
}

function poClearEditPanel() {

    //po
    $("#txtName").val('');
    $("#txtCode").val('');
    $("#txtWebsite").val('');
    $("#txtEmail").val('');
    $("#txtPhone").val('');
    $("#txtFax").val('');

}

function configPOTable() {
    //"option strict";

    //DATATABLE AJAX LOAD COMPLETE EVENT
    $("#tblPO").on('xhr.dt', function (e, settings, data, xhr) {

        //data will be null is AJAX error
        if (data) {
            //DATATABLE DRAW COMPLETE EVENT
            $('#tblPO').on('draw.dt', function () {

                tablePO = $("#tblPO").DataTable();
                //select first row by default

                tablePO.rows(':eq(0)', { page: 'current' }).select();
                selIdPO = tablePO.rows(':eq(0)', { page: 'current' }).ids()[0];

                fillPOStyle(selIdPO);
                //fillPOStyleSize(selIdPO);
                fillPOStyleMaterial(selIdPO);
                fillPOStyleInternal(selIdPO);
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
            "url": apiUrl + "po/getall",
            "dataSrc": "",
            "headers": {
                "Authorization": "Bearer " + token
            }
        },
        "columns": [
            { "data": "LovStatus", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "invoiceNo", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "customer", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "dateOrder", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "dateDelivery", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "LovType", "defaultContent": "<span class='text-muted'>Not set</span>" }

        ],
    });

    //TABLE ROW CLICK EVENT
    $("#tblPO tbody").on('click', 'tr', function () {

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            tablePO = $('#tblPO').DataTable();
            tablePO.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            selIdPO = $(this).attr("id");

            fillPOStyle(selIdPO);
            //fillPOStyleSize(selIdPO);
            fillPOStyleMaterial(selIdPO);
            fillPOStyleInternal(selIdPO);
        }
    });

    //TABLE REDRAW EVENT
    $('#tblPO').on('draw.dt', function () {
        onresize();
    });
}