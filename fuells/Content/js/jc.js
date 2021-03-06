﻿"use strict";

var selIdJC = '';

//CALLED FROM _LAYOUT2
function doJobCard(crPage) {

    $("#btnGenerateJC").hide();

    //fill PO
    fuLib.po.getAll().success(function (data, status, xhr) {

        var items = '<option value="0">--select--</option>';

        for (var i = 0; i < data.length; i++) {
            items += '<option value="' + data[i]._id + '">' + data[i].invoiceNo + '</option>';
        }

        $('#selPO').html(items);
        $('#selPO').selectpicker('refresh');

    }).error(function (xhr, status, error) {
        handleError('po.getAll', xhr, status, error);
    });

    //fill cutting users
    fuLib.user.getAllCutting().success(function (data, status, xhr) {

        var items = '<option value="0">--select--</option>';

        for (var i = 0; i < data.length; i++) {
            items += '<option value="' + data[i]._id + '">' + data[i].fullName + '</option>';
        }

        $('#selCuttingFuser').html(items);
        $('#selCuttingFuser').selectpicker('refresh');

        $('#selCuttingCutter').html(items);
        $('#selCuttingCutter').selectpicker('refresh');

        $('#selCuttingMatcher').html(items);
        $('#selCuttingMatcher').selectpicker('refresh');

    }).error(function (xhr, status, error) {
        handleError('po.getAllCutting', xhr, status, error);
    });

    //fill lining users
    fuLib.user.getAllLining().success(function (data, status, xhr) {

        var items = '<option value="0">--select--</option>';

        for (var i = 0; i < data.length; i++) {
            items += '<option value="' + data[i]._id + '">' + data[i].fullName + '</option>';
        }

        $('#selLiningCutter').html(items);
        $('#selLiningCutter').selectpicker('refresh');

    }).error(function (xhr, status, error) {
        handleError('po.getAllLining', xhr, status, error);
    });

    //fill store users
    fuLib.user.getAllStore().success(function (data, status, xhr) {

        var items = '<option value="0">--select--</option>';

        for (var i = 0; i < data.length; i++) {
            items += '<option value="' + data[i]._id + '">' + data[i].fullName + '</option>';
        }

        $('#selStoreReceivedBy').html(items);
        $('#selStoreReceivedBy').selectpicker('refresh');

        $('#selStoreIssuedBy').html(items);
        $('#selStoreIssuedBy').selectpicker('refresh');

    }).error(function (xhr, status, error) {
        handleError('po.getAllStore', xhr, status, error);
    });

    //fill tailoring users
    fuLib.user.getAllTailoring().success(function (data, status, xhr) {

        var items = '<option value="0">--select--</option>';

        for (var i = 0; i < data.length; i++) {
            items += '<option value="' + data[i]._id + '">' + data[i].fullName + '</option>';
        }

        $('#selTailoringQc').html(items);
        $('#selTailoringQc').selectpicker('refresh');

        $('#selTailoringTailor').html(items);
        $('#selTailoringTailor').selectpicker('refresh');

    }).error(function (xhr, status, error) {
        handleError('po.getAllTailoring', xhr, status, error);
    });

    //fill inspection users
    fuLib.user.getAllInspection().success(function (data, status, xhr) {

        var items = '<option value="0">--select--</option>';

        for (var i = 0; i < data.length; i++) {
            items += '<option value="' + data[i]._id + '">' + data[i].fullName + '</option>';
        }

        $('#selInspectionQc').html(items);
        $('#selInspectionQc').selectpicker('refresh');

    }).error(function (xhr, status, error) {
        handleError('po.getAllInspection', xhr, status, error);
    });

    //fill packing users
    fuLib.user.getAllPacking().success(function (data, status, xhr) {

        var items = '<option value="0">--select--</option>';

        for (var i = 0; i < data.length; i++) {
            items += '<option value="' + data[i]._id + '">' + data[i].fullName + '</option>';
        }

        $('#selPackingPackedBy').html(items);
        $('#selPackingPackedBy').selectpicker('refresh');

    }).error(function (xhr, status, error) {
        handleError('po.getAllInspection', xhr, status, error);
    });


    //WIRE EVENTS
    //
    $("#selPO").change(change_selPO);
    $("#selPOStyle").change(change_selPOStyle);
    $("#selPOSize").change(change_selPOSize);

    $("#btnCuttingNotDone").click(click_btnCuttingNotDone);
    $("#btnCuttingDone").click(click_btnCuttingDone);
    $("#btnLiningNotDone").click(click_btnLiningNotDone);
    $("#btnLiningDone").click(click_btnLiningDone);
    $("#btnStoreNotDone").click(click_btnStoreNotDone);
    $("#btnStoreDone").click(click_btnStoreDone);
    $("#btnTailoringNotDone").click(click_btnTailoringNotDone);
    $("#btnTailoringDone").click(click_btnTailoringDone);
    $("#btnInspectionNotDone").click(click_btnInspectionNotDone);
    $("#btnInspectionDone").click(click_btnInspectionDone);
    $("#btnPackingNotDone").click(click_btnPackingNotDone);
    $("#btnPackingDone").click(click_btnPackingDone);
}

function click_btnCuttingNotDone() {

    updateCutting(false);
}

function click_btnCuttingDone() {

    updateCutting(true);
}

function updateCutting(done) {

    var oJC = {
        id: selIdJC,
        cuttingDone: done,
        cuttingDate: $("#txtCuttingDate").val(),
        cuttingMatcher: $('#selCuttingMatcher').val(),
        cuttingCutter: $('#selCuttingCutter').val(),
        cuttingFuser: $('#selCuttingFuser').val(),
        cuttingRemarks: $('#txtCuttingNotes').val()
    };

    fuLib.jc.updateCutting(oJC).success(function (data, status, xhr) {

        noty({ text: 'JC Cutting updated successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

        if (done == true) {
            $("#divCutting").css("background-color", "#95b75d");
        }
        else {
            $("#divCutting").css("background-color", "red");
        }

    }).error(function (xhr, status, error) {
        //jc.updateCutting failed
        handleError('jc.updateCutting', xhr, status, error);
    });
}

function click_btnLiningNotDone() {
    alert('click_btnLiningNotDone');
}

function click_btnLiningDone() {
    alert('click_btnLiningDone');
}

function click_btnStoreNotDone() {
    alert('click_btnStoreNotDone');
}

function click_btnStoreDone() {
    alert('click_btnStoreDone');
}

function click_btnTailoringNotDone() {
    alert('click_btnTailoringNotDone');
}

function click_btnTailoringDone() {
    alert('click_btnTailoringDone');
}

function click_btnInspectionNotDone() {
    alert('click_btnInspectionNotDone');
}

function click_btnInspectionDone() {
    alert('click_btnInspectionDone');
}

function click_btnPackingNotDone() {
    alert('click_btnPackingNotDone');
}

function click_btnPackingDone() {
    alert('click_btnPackingDone');
}

function change_selPO() {

    var poId = $("#selPO").val();

    if (poId !== "0") {
        //fill PO STYLES
        fuLib.po.getStyles(poId).success(function (data, status, xhr) {

            var items = '<option value="0">--select--</option>';

            for (var i = 0; i < data.length; i++) {
                items += '<option value="' + data[i]._id + '">' + data[i].style.title + '</option>';
            }

            $('#selPOStyle').html(items);
            $('#selPOStyle').selectpicker('refresh');

            $('#selPOSize').html("");
            $('#selPOSize').selectpicker('refresh');

        }).error(function (xhr, status, error) {
            handleError('po.getStyles', xhr, status, error);
        });

        //fill PO JCs
        fuLib.jc.getAll(poId).success(function (data, status, xhr) {

            fillJCs('#divJC', data);

        }).error(function (xhr, status, error) {
            handleError('po.getStyles', xhr, status, error);
        });

        fillPO(poId);
    }
}

function change_selPOStyle() {

    var styleId = $("#selPOStyle").val();


    if (styleId !== "0") {
        //fill PO STYLE SIZES
        fuLib.po.getStyleSizes(styleId).success(function (data, status, xhr) {

            var items = '<option value="0">--select--</option>';

            for (var i = 0; i < data.length; i++) {
                items += '<option value="' + data[i]._id + '">' + data[i].styleSize.title + '</option>';
            }

            $('#selPOSize').html(items);
            $('#selPOSize').selectpicker('refresh');

        }).error(function (xhr, status, error) {
            handleError('po.getStyleSizes', xhr, status, error);
        });

        //fill PO STYLE JCs
        fuLib.jc.getPOStyle(styleId).success(function (data, status, xhr) {

            fillJCs('#divJC', data);

        }).error(function (xhr, status, error) {
            handleError('po.getStyles', xhr, status, error);
        });
    }
}

function change_selPOSize() {

    var sizeId = $("#selPOSize").val();


    if (sizeId !== "0") {

        //fill PO SIZE JCs
        fuLib.jc.getPOSize(sizeId).success(function (data, status, xhr) {

            fillJCs('#divJC', data);

        }).error(function (xhr, status, error) {
            handleError('po.getStyles', xhr, status, error);
        });
    }
}

function fillJCs(combo, data) {
    if (data.length == 0) {

        $("#btnGenerateJC").show();
        return false;

    }

    var items = '';

    for (var i = 0; i < data.length; i++) {

        items += '<a href="javascript:loadJC(\'' + data[i]._id + '\', ' + i + ');" class="list-group-item list-group-item-warning">' + data[i].jobCardNo + '</a>';
    }

    $(combo).html(items);

    onresize();
}

function loadJC(id, index) {

    selIdJC = id;

    $("#divJC a").removeClass("active");

    $("#divJC a").eq(index).addClass("list-group-item list-group-item-primary active");

    fuLib.jc.getOne(id).success(function (data, status, xhr) {

        //console.log(data[0]);

        $("#h3JCNo").text(data[0].jobCardNo);
        $("#txtDateStart").val(data[0].dateStart);
        $("#txtDateEnd").val(data[0].dateEnd);
        $("#h3JCStyle").text(data[0].purchaseOrderStyle.style.title);
        $("#h3JCSize").text(data[0].purchaseOrderSize.styleSize.title);

        //cutting
        //
        if (data[0].cuttingDone == true) {
            $("#divCutting").css("background-color", "#95b75d");
        }
        else {
            $("#divCutting").css("background-color", "red");
        }

        $("#txtCuttingDate").val(data[0].cuttingDate);

        $('#selCuttingMatcher').val(data[0].cuttingMatcher);
        $('#selCuttingMatcher').selectpicker('refresh');

        $('#selCuttingCutter').val(data[0].cuttingCutter);
        $('#selCuttingCutter').selectpicker('refresh');

        $('#selCuttingFuser').val(data[0].cuttingFuser);
        $('#selCuttingFuser').selectpicker('refresh');

        $('#txtCuttingNotes').val(data[0].cuttingRemarks);

        //lining
        //
        if (data[0].liningDone == true) {
            $("#divLining").css("background-color", "#95b75d");
        }
        else {
            $("#divLining").css("background-color", "red");
        }

        $("#txtLiningDate").val(data[0].liningDate);

        $('#selLiningCutter').val(data[0].liningCutter);
        $('#selLiningCutter').selectpicker('refresh');

        $('#txtLiningNotes').val(data[0].liningRemarks);

        //store
        //
        if (data[0].storeDone == true) {
            $("#divStore").css("background-color", "#95b75d");
        }
        else {
            $("#divStore").css("background-color", "red");
        }

        $("#txtStoreDate").val(data[0].storeDate);

        $('#selStoreIssuedBy').val(data[0].storeIssuedBy);
        $('#selStoreIssuedBy').selectpicker('refresh');

        $('#selStoreReceivedBy').val(data[0].storeReceivedBy);
        $('#selStoreReceivedBy').selectpicker('refresh');

        $('#txtStoreNotes').val(data[0].storeRemarks);

        //tailoring
        //
        if (data[0].tailoringDone == true) {
            $("#divTailoring").css("background-color", "#95b75d");
        }
        else {
            $("#divTailoring").css("background-color", "red");
        }

        $("#txtTailoringDate").val(data[0].tailoringDate);

        $('#selTailoringTailor').val(data[0].tailoringTailor);
        $('#selTailoringTailor').selectpicker('refresh');

        $('#selTailoringQc').val(data[0].tailoringLineQc);
        $('#selTailoringQc').selectpicker('refresh');

        $('#selTailoringStatus').val(data[0].tailoringStatus);
        $('#selTailoringStatus').selectpicker('refresh');

        $('#txtTailoringeNotes').val(data[0].tailoringRemarks);

        //inspection
        //
        if (data[0].inspectionDone == true) {
            $("#divInspection").css("background-color", "#95b75d");
        }
        else {
            $("#divInspection").css("background-color", "red");
        }

        $("#txtInspectionDate").val(data[0].inspectionDate);

        $('#selInspectionQc').val(data[0].inspectionQcBy);
        $('#selInspectionQc').selectpicker('refresh');

        $('#selInspectionStatus').val(data[0].inspectionStatus);
        $('#selInspectionStatus').selectpicker('refresh');

        $('#txtInspectionNotes').val(data[0].inspectionRemarks);

        //packing
        //
        if (data[0].packingDone == true) {
            $("#divPacking").css("background-color", "#95b75d");
        }
        else {
            $("#divPacking").css("background-color", "red");
        }

        $("#txtPackingDate").val(data[0].packingDate);

        $('#selPackingPackedBy').val(data[0].packingBy);
        $('#selPackingPackedBy').selectpicker('refresh');

        $('#selPackingStatus').val(data[0].packingStatus);
        $('#selPackingStatus').selectpicker('refresh');

        $('#txtPackingNotes').val(data[0].packingRemarks);

    });

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

        $("#h4PoOrderType").text(data[0].LovType.title);

        fuLib.po.getInternals(poId).success(function (data, status, xhr) {

            $("#tblPoInternal2").html("");

            data.forEach(function (int, index) {

                var row = '<tr class="active">';

                row += '<td><strong>' + int.LovDetailType.title + '</strong></br>' + int.notes + '</td>';

                var priority = "---";

                if (int.priority == 0) {
                    priority = "Low";
                }
                else if (int.priority == 1) {
                    priority = "Medium";
                }
                else if (int.priority == 2) {
                    priority = "High";
                }

                row += '<td>' + priority + '</td>';

                row += '</tr>';

                $("#tblPoInternal2").append(row);

            });
        });
    });

}

