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

    //$("#divUpdate").hide();

    $("#panelPOEdit").hide();

    //$("#treeShipGeoLoc").treeview({ data: getGeoLoc() });

    //$("#uploadFormInput").fileinput();
    $("#uploadFormInput").fileinput({ 'showUpload': false, 'previewFileType': 'any' });

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
    $("#btnGenerateJCs").click(click_btnGenerateJCs);

}

function click_btnGenerateJCs() {

    fuLib.jc.generate(selIdPO).success(function (data, status, xhr) {

        console.log(data);

        $("#tblJCs").html("");

        data.forEach(function (jc, index) {

            var row = '<tr><td><div class="btn-toolbar" role="toolbar" aria-label="..." style="margin:5px;">';
            row += '       <button type="button" class="btn btn-default">' + jc.jobCardNo + '</button>';
            row += '       <button type="button" class="btn btn-default">' + jc.purchaseOrderStyle.style.title + '</button>';
            row += '       <button type="button" class="btn btn-default">' + jc.purchaseOrderSize.styleSize.title + '</button>';
            row += '       <button type="button" class="btn btn-danger">' + jc.cuttingDone + '</button>';
            row += '       <button type="button" class="btn btn-danger">' + jc.inspectionDone + '</button>';
            row += '       <button type="button" class="btn btn-danger">' + jc.liningDone + '</button>';
            row += '       <button type="button" class="btn btn-danger">' + jc.packingDone + '</button>';
            row += '       <button type="button" class="btn btn-danger">' + jc.storeDone + '</button>';
            row += '       <button type="button" class="btn btn-danger">' + jc.tailoringDone + '</button>';
            row += '  </div></td></tr>';

            $("#tblJCs").append(row);

        });

        onresize();

    }).error(function (xhr, status, error) {
        handleError('jc.generate', xhr, status, error);
    });

}

function click_btnPONewCancel () {

    $("#panelPOView").show();
    $("#panelPOEdit").hide();

    //$("#divTable").removeClass("col-md-8").addClass("col-md-12");
    //$(".x-navigation-minimize").trigger("click");

}

function click_btnPONew () {

    poModeUpdate = 'new';
    //$(".x-navigation-minimize").trigger("click");
    poClearEditPanel();
    $("#panelPOView").hide();
    $("#panelPOEdit").show();

    //$("#tabDetails").trigger("click");
    $("#tabDocument").removeClass("active");
    $("#tabDetails").addClass("active");

    $("#tab-document").removeClass("active");
    $("#tab-details").addClass("active");
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
        internals: [],
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

        if (i1Priority == "Low") {
            i1Priority = 0;
        }
        else if (i1Priority == "Medium") {
            i1Priority = 1;
        }
        else if (i1Priority == "High") {
            i1Priority = 2;
        }

        if (i1 !== undefined) {
            poInternals.push({ internal: i1, notes: i1Note, priority: parseInt(i1Priority) });
        }
    });

    oPO.internals = poInternals;

    //console.log(oPO);

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

                //console.log(data);

                noty({ text: 'PO added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                var table = $("#tblPO").DataTable();
                table.ajax.reload();

                $("#panelPOView").show();
                $("#panelPOEdit").hide();

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

                fillPO(selIdPO);
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
            {
                "render": function (data, type, row) {

                    if (row.LovStatus == 0) {
                        return "New";
                    }
                    else if (row.LovStatus == 1) {
                        return "Production";
                    }
                    else if (row.LovStatus == 2) {
                        return "Complete";
                    }
                    else if (row.LovStatus == 3) {
                        return "Hold";
                    }
                    else if (row.LovStatus == 4) {
                        return "Dispute";
                    }
                    else if (row.LovStatus == 5) {
                        return "Cancel";
                    }

                    var d1 = new Date(row.dateOrder);

                    return '<b>' + d1.getDate() + '-' + (d1.getMonth() + 1) + '-' + d1.getFullYear() + '</b>';

                }
            },
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
    $("#tblPO tbody").on('click', 'tr', tblPO_RowClick);

    //TABLE REDRAW EVENT
    $('#tblPO').on('draw.dt', function () {
        onresize();
    });
}

function tblPO_RowClick() {

    if ($(this).hasClass('selected')) {
        $(this).removeClass('selected');
    }
    else {
        tablePO = $('#tblPO').DataTable();
        tablePO.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');

        selIdPO = $(this).attr("id");

        fillPO(selIdPO);
        
        $("#panelPOView").show();
        $("#panelPOEdit").hide();
    }
}

function fillPO(poId) {

    fuLib.po.getOne(poId).success(function (data, status, xhr) {

        //console.log(data[0]);

        $("#h4PoCustomer").text(data[0].customer.name);
        $("#h4PoInvoiceNo").text(data[0].invoiceNo);
        $("#h4PoQty").text(data[0].qty);

        var d1 = new Date(data[0].dateOrder);
        var d2 = new Date(data[0].dateTarget);
        var d3 = new Date(data[0].dateDelivery);


        var d1a = d1.getDate() + '-' + (d1.getMonth() + 1) + '-' + d1.getFullYear();
        var d2a = d2.getDate() + '-' + (d2.getMonth() + 1) + '-' + d2.getFullYear();
        var d3a = d3.getDate() + '-' + (d3.getMonth() + 1) + '-' + d3.getFullYear();

        $("#h4PoDateOrder").text(d1a);
        $("#h4PoDateTarget").text(d2a);
        $("#h4PoDateDelivery").text(d3a);

        $("#h4PoShippingAddress1").text(data[0].shippingAddress.address1);
        $("#h4PoShippingAddress2").text(data[0].shippingAddress.address2);

        $("#h4PoOrderType").text(data[0].LovType.title);

        fuLib.po.getStyles(poId).success(function (data, status, xhr) {

            //console.log(data);

            $("#tblPoStyle2").html("");

            data.forEach(function (style, index) {

                fuLib.po.getStyleSizes(style._id).success(function (data2, status, xhr) {

                    //console.log(data2);

                    var row = '<tr>';
                    row += '<td rowspan="' + (data2.length + 1) + '">' + style.style.title + '</td>';
                    row += '<td rowspan="' + (data2.length + 1) + '">' + style.qty + '</td>';
                    row += '</tr>';

                    $("#tblPoStyle2").append(row);

                    data2.forEach(function (size, index) {

                        row = '<tr>';

                        row += '<td>' + size.styleSize.title + '</td>';
                        row += '<td>' + size.qty + '</td>';

                        row += '</tr>';

                        $("#tblPoStyle2").append(row);

                    });

                });
            });
        });

        fuLib.po.getMaterials(poId).success(function (data, status, xhr) {

            //console.log(data);

            $("#tblPoMaterial2").html("");

            data.forEach(function (mat, index) {

                var row = '<tr>';

                row += '<td>' + mat.styleMaterial.title + '</td>';
                row += '<td>' + mat.notes + '</td>';
                row += '<td>' + mat.qty + '</td>';

                row += '</tr>';

                $("#tblPoMaterial2").append(row);
            });
        });

        fuLib.po.getInternals(poId).success(function (data, status, xhr) {

            //console.log(data);

            $("#tblPoInternal2").html("");

            data.forEach(function (int, index) {

                var row = '<tr>';

                row += '<td>' + int.LovDetailType.title + '</td>';
                row += '<td>' + int.notes + '</td>';
                row += '<td>' + int.priority + '</td>';

                row += '</tr>';

                $("#tblPoInternal2").append(row);

            });
        });

        //load pdf
        fuLib.po.PdfExists(poId).success(function (data, status, xhr) {

            $("#divPdf").hide();
            $("#divNoPdf").hide();

            if (data == "Y") {
                $("#divPdf").show();
                $("#iframeDoc").prop("src", "/Home/GetPo?id=" + poId);
            }
            else {

                $("#uploadFormInput").fileinput("refresh");

                $("#uploadForm").prop("action", "http://localhost:5000/po/upload/" + poId);

                $("#divNoPdf").show();

            }
        });

        $("#btnGenerateJCs").show();

        //fill job cards
        fuLib.jc.getAll(poId).success(function (data, status, xhr) {

            $("#tblJCs").html("");

            if (data.length > 0) {

                $("#btnGenerateJCs").hide();

                data.forEach(function (jc, index) {

                    var row = '<tr><td>';

                    if (jc.cuttingDone == true && jc.inspectionDone == true && jc.liningDone == true && jc.packingDone == true && jc.storeDone == true && jc.tailoringDone == true) {

                        row += '<table style="background-color: #b9f6ca; border: 1px dashed #00c853; width:100%; margin:5px;">';

                    }
                    else if (jc.cuttingDone == false && jc.inspectionDone == false && jc.liningDone == false && jc.packingDone == false && jc.storeDone == false && jc.tailoringDone == false) {

                        row += '<table style="background-color: #ff8a80; border: 1px dashed #d50000; width:100%; margin:5px;">';

                    }
                    else {
                        row += '<table style="background-color: #ffff8d; border: 1px dashed #ffd600; width:100%; margin:5px;">';

                    }

                    row += '  <tr>';
                    row += '    <td colspan="2">';
                    row += '      <strong>' + jc.jobCardNo + '</strong>';
                    row += '    </td>';

                    if (jc.cuttingDone == true) {
                        row += '<td style="text-align:center; color:green;"><span class="fa fa-check-square-o"></span></td>';
                    }
                    else {
                        row += '<td style="text-align:center; color:#d50000;"><span class="fa fa-square-o"></span></td>';
                    }

                    if (jc.inspectionDone == true) {
                        row += '<td style="text-align:center; color:green;"><span class="fa fa-check-square-o"></span></td>';
                    }
                    else {
                        row += '<td style="text-align:center; color:#d50000;"><span class="fa fa-square-o"></span></td>';
                    }

                    if (jc.liningDone == true) {
                        row += '<td style="text-align:center; color:green;"><span class="fa fa-check-square-o"></span></td>';
                    }
                    else {
                        row += '<td style="text-align:center; color:#d50000;"><span class="fa fa-square-o"></span></td>';
                    }

                    if (jc.packingDone == true) {
                        row += '<td style="text-align:center; color:green;"><span class="fa fa-check-square-o"></span></td>';
                    }
                    else {
                        row += '<td style="text-align:center; color:#d50000;"><span class="fa fa-square-o"></span></td>';
                    }

                    if (jc.storeDone == true) {
                        row += '<td style="text-align:center; color:green;"><span class="fa fa-check-square-o"></span></td>';
                    }
                    else {
                        row += '<td style="text-align:center; color:#d50000;"><span class="fa fa-square-o"></span></td>';
                    }

                    if (jc.tailoringDone == true) {
                        row += '<td style="text-align:center; color:green;"><span class="fa fa-check-square-o"></span></td>';
                    }
                    else {
                        row += '<td style="text-align:center; color:#d50000;"><span class="fa fa-square-o"></span></td>';
                    }

                    row += '</tr>';
                    row += '<tr>';
                    row += '  <td>' + jc.purchaseOrderStyle.style.title + '</td>';
                    row += '  <td>' + jc.purchaseOrderSize.styleSize.title + '</td>';

                    if (jc.cuttingDone == true) {
                        row += '  <td style="text-align:center; color:green;">CUTTING</td>';
                    }
                    else {
                        row += '  <td style="text-align:center; color:#d50000;">CUTTING</td>';
                    }

                    if (jc.inspectionDone == true) {
                        row += '  <td style="text-align:center; color:green;">INSPECTION</td>';
                    }
                    else {
                        row += '  <td style="text-align:center; color:#d50000;">INSPECTION</td>';
                    }

                    if (jc.liningDone == true) {
                        row += '  <td style="text-align:center; color:green;">LINING</td>';
                    }
                    else {
                        row += '  <td style="text-align:center; color:#d50000;">LINING</td>';
                    }

                    if (jc.packingDone == true) {
                        row += '  <td style="text-align:center; color:green;">PACKING</td>';
                    }
                    else {
                        row += '  <td style="text-align:center; color:#d50000;">PACKING</td>';
                    }

                    if (jc.storeDone == true) {
                        row += '  <td style="text-align:center; color:green;">STORE</td>';
                    }
                    else {
                        row += '  <td style="text-align:center; color:#d50000;">STORE</td>';
                    }

                    if (jc.tailoringDone == true) {
                        row += '  <td style="text-align:center; color:green;">TAILORING</td>';
                    }
                    else {
                        row += '  <td style="text-align:center; color:#d50000;">TAILORING</td>';
                    }

                    row += '</tr>';
                    row += '</table>';

                    row += '</td></tr>';

                    $("#tblJCs").append(row);

                });
            }

         

        }).error(function (xhr, status, error) {
            handleError('jc.generate', xhr, status, error);
        });


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
        row += '<td class="styleRow" rowspan="' + sizeCount + '">' + data.title + '<input class="clsPoStyle" type="hidden" value="' + data._id + '" /></td>';
        row += '<td class="styleRow" rowspan="' + sizeCount + '"><input type="number" readonly="readonly" class="form-control clsPoStyleQty" value="0" /></td>';
        row += '</tr>';

        $("#tblPoStyle").append(row);

        data.sizes.forEach(function (size, index) {

            row = '<tr>';
            row += '<td class="sizeRow">' + size.title + '<input class="clsPoStyle2" type="hidden" value="' + data._id + '" /><input class="clsPoSize" type="hidden" value="' + size._id + '" /></td>';
            row += '<td class="sizeRow"><input type="number" class="form-control clsPoSizeQty" value="0" /></td>';
            row += '</tr>';

            $("#tblPoStyle").append(row);


            $(".clsPoSizeQty").off("focusout").focusout(function () {

                //console.log($(this).val());

                var total = 0;

                var txtStyleQty;

                $("#tblPoStyle").find("tr").each(function () {

                    var tdCount = $(this).find("td[class='sizeRow']").length;

                    if (tdCount == 0) {
                        //style row

                        txtStyleQty = $(this).find("input[class='form-control clsPoStyleQty']");
                        total = 0;
                    }
                    else if (tdCount > 0) {
                        //size row
                        var txtSizeQty = $(this).find("input[class='form-control clsPoSizeQty']");
                        var sizeQty = $(txtSizeQty).val();
                        total += parseInt(sizeQty);
                        $(txtStyleQty).val(total);
                    }
                });
            });
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