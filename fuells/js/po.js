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

    //$("#treeShipGeoLoc").treeview({ data: getGeoLoc() });

    configPOTable();

    //fill CUSTOMER
    fuLib.customer.getAll().success(function (data, status, xhr) {
        fillComboName('#selCustomer', data);

    }).error(function (xhr, status, error) {
        handleError('customer.getAll', xhr, status, error);
    });

    //fill ORDER-TYPE
    fuLib.lov.getLov(5).success(function (data, status, xhr) {
        fillCombo('#selOrderType', data);

    }).error(function (xhr, status, error) {
        handleError('lov.getLov', xhr, status, error);
    });

    //fill STYLE
    fuLib.style.getAll().success(function (data, status, xhr) {
        fillCombo('#selStyle', data);

    }).error(function (xhr, status, error) {
        handleError('style.getAll', xhr, status, error);
    });

    //fill INTERNAL-TYPE
    fuLib.lov.getLov(7).success(function (data, status, xhr) {
        fillCombo('#selInternalType', data);

    }).error(function (xhr, status, error) {
        handleError('lov.getLov', xhr, status, error);
    });

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

function addPoStyle() {

    var styleId = $('#selStyle').val();


    if (styleId == '0') {
        
        noty({ text: 'Please select a STYLE.', layout: 'topCenter', type: 'warning', timeout: 2000 });

        return false;

    }

    //check if STYLE is already added
    var s1 = $('#tblPoStyle').find('input[value="' + styleId + '"]');

    if (s1.length > 0) {
        noty({ text: 'Style already added.', layout: 'topCenter', type: 'warning', timeout: 2000 });
        return false;
    }


    fuLib.style.getOne(styleId).success(function (data, status, xhr) {

        //add STYLE and SIZES
        var sizeCount = data.sizes.length + 1;

        var row = '<tr>';
        row += '<td rowspan="' + sizeCount + '">' + data.title + '<input type="hidden" value="' + data._id + '" /></td>';
        row += '<td rowspan="' + sizeCount + '"><input type="number" class="form-control" value="0" /></td>';
        row += '</tr>';

        $("#tblPoStyle").append(row);

        data.sizes.forEach(function (size, index) {

            row = '<tr>';
            row += '<td>' + size.title + '</td>';
            row += '<td><input type="number" class="form-control" value="0" /></td>';
            row += '</tr>';

            $("#tblPoStyle").append(row);

        });

        //add STYLE and MATERIALS
        var matCount = data.materials.length + 1;

        var row = '<tr>';
        row += '<td rowspan="' + matCount + '">' + data.title + '<input type="hidden" value="' + data._id + '" /></td>';
        row += '</tr>';

        $("#tblPoMaterial").append(row);

        data.materials.forEach(function (mat, index) {

            row = '<tr>';
            row += '<td>' + mat.title + '</td>';
            row += '<td><input type="text" class="form-control" placeholder="Notes" /></td>';
            row += '<td><input type="number" class="form-control" value="0" /></td>';
            row += '</tr>';

            $("#tblPoMaterial").append(row);

        });



    }).error(function (xhr, status, error) {
        handleError('style.getOne', xhr, status, error);
    });



}

function addPoInternal() {

    var internalId = $('#selInternalType').val();

    if (internalId == '0') {
        noty({ text: 'Please select an INTERNAL-DETAIL.', layout: 'topCenter', type: 'warning', timeout: 2000 });
        return false;
    }

    var txtInternal = $('#selInternalType').find('option[value="' + internalId + '"]').text();
    var txtNotes = $('#txtInternalNotes').val();
    var txtPriority = $('#selInternalPriority').val();

    //check if INTERNAL-DETAIL is already added
    var s1 = $('#tblPoInternal').find('input[value="' + internalId + '"]');

    if (s1.length > 0) {
        noty({ text: 'Internal detail already added.', layout: 'topCenter', type: 'warning', timeout: 2000 });
        return false;
    }

    var row = '<tr>';
    row += '<td>' + txtInternal + '<input type="hidden" value="' + internalId + '" /></td>';
    row += '<td>' + txtNotes + '</td>';
    row += '<td>' + txtPriority + '</td>';

    row += '</tr>';

    $("#tblPoInternal").append(row);




}