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

    //WIRE EVENTS
    //
    $("#btnPONew").click(click_btnPONew);
    $("#btnPONewSave, #btnPONewSave2").click(click_btnPONewSave);
    $("#btnPONewCancel, #btnPONewCancel2").click(click_btnPONewCancel);

}

function click_btnPONewCancel () {

    $("#divUpdate").hide();
    $("#divList").show();
    $("#divTable").removeClass("col-md-8").addClass("col-md-12");
    $(".x-navigation-minimize").trigger("click");

}

function click_btnPONew () {

    poModeUpdate = 'new';
    $(".x-navigation-minimize").trigger("click");
    poClearEditPanel();
    $("#divList").hide();
    $("#divUpdate").show();

}

function click_btnPONewSave() {

    var isValidPO = true;

    var oPO = {
        customer: $("#selCustomer").val(),
        invoiceNo: $("#txtInvoiceNo").val(),
        qty: parseInt($("#txtQty").val()),
        dateOrder: $("#txtDateOrder").val(),
        dateDelivery: $("#txtDateDelivery").val(),
        dateTarget: $("#txtDateTarget").val(),
        shipAddress1: $("#txtShipAddress1").val(),
        shipAddress2: $("#txtShipAddress2").val(),
        orderType: $("#selOrderType").val(),
        styles: [],
        materials: [],
        internal: [],
        isActive: true,
        flag: 0
    };

    var poStyles = [];
    var poStyleSizes = [];

    $("#tblPoStyle").find("tr").each(function () {

        var s1 = $(this).find("input[class=clsPoStyle]").val();
        var s1Qty = $(this).find("input[class='form-control clsPoStyleQty']").val();

        if (s1 !== undefined) {
            poStyles.push({ style: s1, qty: parseInt(s1Qty), sizes: [] });
        }

        var s2 = $(this).find("input[class=clsPoStyle2]").val();
        var s3 = $(this).find("input[class=clsPoSize]").val();
        var s3Qty = $(this).find("input[class='form-control clsPoSizeQty']").val();

        if (s2 !== undefined) {
            poStyleSizes.push({ style: s2, size: s3, qty: parseInt(s3Qty) });
        }

    });

    poStyles.forEach(function (style, index) {
        poStyleSizes.forEach(function (size, index) {
            if (size.style == style.style) {
                style.sizes.push({ size: size.size, qty: size.qty });
            }
        });
    });

    oPO.styles = poStyles;

    var poMaterials = [];

    $("#tblPoMaterial").find("tr").each(function () {

        var m1 = $(this).find("input[class=clsPoMat]").val();
        var m1Note = $(this).find("input[class='form-control clsPoMatNote']").val();
        var m1Qty = $(this).find("input[class='form-control clsPoMatQty']").val();

        if (m1 !== undefined) {
            poMaterials.push({ material: m1, notes: m1Note, qty: parseInt(m1Qty) });
        }
    });

    oPO.materials = poMaterials;

    var poInternals = [];

    $("#tblPoInternal").find("tr").each(function () {

        var i1 = $(this).find("input[class=clsInternalId]").val();
        var i1Note = $(this).find("td[class=clsInternalNote]").text();
        var i1Priority = $(this).find("td[class='clsInternalPriority']").text();

        if (i1 !== undefined) {
            poInternals.push({ internal: i1, notes: i1Note, priority: i1Priority });
        }
    });

    oPO.internal = poInternals;

    console.log(oPO);

    //check if oPO is empty
    if (oPO.customer == "0" ||
        oPO.invoiceNo.trim().length == 0 ||
        isNaN(oPO.qty) == true ||
        oPO.dateOrder.trim().length == 0 ||
        oPO.dateTarget.trim().length == 0 ||
        oPO.dateDelivery.trim().length == 0 ||
        oPO.shipAddress1.trim().length == 0
        ) {
        isValidPO = false;
    }

    if (isValidPO == true) {

        //check styles
        if (oPO.styles.length > 0) {

            oPO.styles.forEach(function (style, index) {

                if (isNaN(style.qty) == true || style.qty == 0) {
                    noty({ text: "Style quantity should be numeric.", layout: 'topRight', type: 'error', timeout: 2000 });
                    isValidPO = false;
                    return false;
                }

                style.sizes.forEach(function (size, index) {

                    if (isNaN(size.qty) == true || size.qty == 0) {
                        noty({ text: "Size quantity should be numeric.", layout: 'topRight', type: 'error', timeout: 2000 });
                        isValidPO = false;
                        return false;
                    }

                });

            });
        }

        //check materials
        if (oPO.materials.length > 0) {

            oPO.materials.forEach(function (mat, index) {

                if (isNaN(mat.qty) == true || mat.qty == 0) {
                    noty({ text: "Material quantity should be numeric.", layout: 'topRight', type: 'error', timeout: 2000 });
                    isValidPO = false;
                    return false;
                }
            });
        }
    }

    if (poModeUpdate == 'new') {

        if (isValidPO == false) {
            noty({ text: "Please type PO details", layout: 'topRight', type: 'error', timeout: 2000 });
            return false;
        }
        else {

            fuLib.po.add(oPO).success(function (data, status, xhr) {

                console.log(data);

                noty({ text: 'PO added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                var table = $("#tblPO").DataTable();
                table.ajax.reload();

                $(".x-navigation-minimize").trigger("click");
                $("#divList").show();
                $("#divUpdate").hide();

            }).error(function (xhr, status, error) {
                //po.add failed
                handleError('po.add', xhr, status, error);
            });
        }

        return false;

    }
    else if (supModeUpdate == 'edit') {

    }

    return false;
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

                //fillPOStyle(selIdPO);
                //fillPOStyleSize(selIdPO);
                //fillPOStyleMaterial(selIdPO);
                //fillPOStyleInternal(selIdPO);
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
            { "data": "customer.name", "defaultContent": "<span class='text-muted'>Not set</span>" },
            {
                "render": function (data, type, row) {

                    var d1 = new Date(row.dateOrder);

                    return '<b>' + d1.getDate() + '-' + (d1.getMonth() + 1) + '-' + d1.getFullYear() + '</b>';

                }
            },
            {
                "render": function (data, type, row) {

                    var d1 = new Date(row.dateDelivery);

                    return '<b>' + d1.getDate() + '-' + (d1.getMonth() + 1) + '-' + d1.getFullYear() + '</b>';

                }
            },
            { "data": "LovType.title", "defaultContent": "<span class='text-muted'>Not set</span>" }

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
        row += '<td rowspan="' + sizeCount + '">' + data.title + '<input class="clsPoStyle" type="hidden" value="' + data._id + '" /></td>';
        row += '<td rowspan="' + sizeCount + '"><input type="number" class="form-control clsPoStyleQty" value="0" /></td>';
        row += '</tr>';

        $("#tblPoStyle").append(row);

        data.sizes.forEach(function (size, index) {

            row = '<tr>';
            row += '<td>' + size.title + '<input class="clsPoStyle2" type="hidden" value="' + data._id + '" /><input class="clsPoSize" type="hidden" value="' + size._id + '" /></td>';
            row += '<td><input type="number" class="form-control clsPoSizeQty" value="0" /></td>';
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
            row += '<td>' + mat.title + '<input class="clsPoMat" type="hidden" value="' + mat._id + '" /></td>';
            row += '<td><input type="text" class="form-control clsPoMatNote" placeholder="Notes" /></td>';
            row += '<td><input type="number" class="form-control clsPoMatQty" value="0" /></td>';
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

    var internalPriority = $('#selInternalPriority').val();

    if (internalPriority == '0') {
        noty({ text: 'Please select an INTERNAL-DETAIL priority.', layout: 'topCenter', type: 'warning', timeout: 2000 });
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
    row += '<td>' + txtInternal + '<input type="hidden" class="clsInternalId" value="' + internalId + '" /></td>';
    row += '<td class="clsInternalNote">' + txtNotes + '</td>';
    row += '<td class="clsInternalPriority">' + txtPriority + '</td>';

    row += '</tr>';

    $("#tblPoInternal").append(row);




}