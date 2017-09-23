"use strict";

var selIdJCPO = '';
var selIdJCStyle = '';
var selIdJCSize = '';

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


    //WIRE EVENTS
    //
    $("#selPO").change(change_selPO);
    $("#selPOStyle").change(change_selPOStyle);
    $("#selPOSize").change(change_selPOSize);

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

            fillJCs('#selJC', data);

        }).error(function (xhr, status, error) {
            handleError('po.getStyles', xhr, status, error);
        });



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

            fillJCs('#selJC', data);

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

            fillJCs('#selJC', data);

        }).error(function (xhr, status, error) {
            handleError('po.getStyles', xhr, status, error);
        });
    }
}

function fillJCs(combo, data) {

    var items = '<option value="0">--select--</option>';

    for (var i = 0; i < data.length; i++) {
        items += '<option value="' + data[i]._id + '">' + data[i].jobCardNo + '</option>';
    }

    $(combo).html(items);
    $(combo).selectpicker('refresh');
}

