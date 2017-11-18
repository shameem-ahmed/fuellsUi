"use strict";

var selIdJC = '';

var showJCList = true;

//CALLED FROM _LAYOUT2
function doJobCard(crPage) {
    $("#btnGenerateJC").hide();
    $("#divJcSections").hide();
    $("#lblJcSelAll").hide();
    $("#btnPrintAll").hide();
    $("#btnPrintSel").hide();
    $("#btnPrint").hide();

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
    $("#selPOColor").change(change_selPOColor);
    $("#selPOSize").change(change_selPOSize);
    $("#chkJcSelAll").change(change_chkJcSelAll);

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
    $("#toggleJCList").click(click_toggleJCList);
    $("#btnPrintAll").click(click_btnPrintAll);
    $("#btnPrintSel").click(click_btnPrintSel);
    $("#btnPrint").click(click_btnPrint);


}

function click_btnPrintAll() {
    printJCs(3);
}

function click_btnPrintSel() {
    printJCs(2);
}

function click_btnPrint() {
    printJCs(1);
}

function printJCs(type) {
    //type: 1-single, 2-selected, 3-all

    if (type == 1) {


    }
    else if (type == 2) {

        var aJCs = [];

        $("#divJC").find("a").each(function (index, item) {

            var chk = $(item).find(".chkJc");

            if ($(chk).prop("checked") == true) {
                //console.log($(chk).val());
                aJCs.push($(chk).val());
            }
        });

        var oJC = {
            aJC: aJCs
        };

        fuLib.jc.getMulti(oJC).success(function (data, status, xhr) {
            //console.log(data);
            var temJC = $("#printJCTemplate").html();

            var contentJC = "";

            $(data).each(function (index, item) {
                var thisJC = temJC;

                thisJC = thisJC.replace("{fieldJCNo}", item.jobCardNo);
                thisJC = thisJC.replace("{fieldStartDate}", item.dateStart);
                thisJC = thisJC.replace("{fieldEndtDate}", item.dateEnd);
                thisJC = thisJC.replace("{fieldJCColor}", "TODO: Color");
                thisJC = thisJC.replace("{fieldJCSize}", item.purchaseOrderSize.styleSize.title);
                thisJC = thisJC.replace("{fieldJCStyle}", item.purchaseOrderStyle.style.title);

                thisJC = thisJC.replace("{fieldOrderType}", $("#h4PoOrderType").text());
                thisJC = thisJC.replace("{fieldCustomer}", $("#h4PoCustomer").text());
                thisJC = thisJC.replace("{fieldInvoiceNo}", $("#h4PoInvoiceNo").text());
                thisJC = thisJC.replace("{fieldPoQty}", $("#h4PoQty").text());
                thisJC = thisJC.replace("{fieldDateOrder}", $("#h4PoDateOrder").text());
                thisJC = thisJC.replace("{fieldDateDelivery}", $("#h4PoDateDelivery").text());
                thisJC = thisJC.replace("{fieldDateTarget}", $("#h4PoDateTarget").text());

                thisJC = thisJC.replace("{fieldInternalDetails}", "TODO: Internal Details");

                thisJC = thisJC.replace("{fieldPackingRemarks}", item.packingRemarks);
                thisJC = thisJC.replace("{fieldPackingDate}", formatDate(item.packingDate));
                if (item.packingBy !== null) {
                    thisJC = thisJC.replace("{fieldPackingBy}", item.packingBy.fullName);
                }
                else
                {
                    thisJC = thisJC.replace("{fieldPackingBy}", "");
                }
                thisJC = thisJC.replace("{fieldPackingStatus}", item.packingStatus);

                thisJC = thisJC.replace("{fieldInspectionRemarks}", item.inspectionRemarks);
                thisJC = thisJC.replace("{fieldInspectionDate}", formatDate(item.inspectionDate));
                if (item.inspectionQcBy !== null) {
                    thisJC = thisJC.replace("{fieldInspectionQc}", item.inspectionQcBy.fullName);
                }
                else {
                    thisJC = thisJC.replace("{fieldInspectionQc}", "");
                }

                thisJC = thisJC.replace("{fieldInspectionStatus}", item.inspectionStatus);

                thisJC = thisJC.replace("{fieldTailoringRemarks}", item.tailoringRemarks);
                thisJC = thisJC.replace("{fieldTailoringDate}", formatDate(item.tailoringDate));
                if (item.tailoringTailor !== null) {
                    thisJC = thisJC.replace("{fieldTailoringTailor}", item.tailoringTailor.fullName);
                }
                else {
                    thisJC = thisJC.replace("{fieldTailoringTailor}", "");
                }
                if (item.tailoringLineQc !== null) {
                    thisJC = thisJC.replace("{fieldTailoringQc}", item.tailoringLineQc.fullName);
                }
                else {
                    thisJC = thisJC.replace("{fieldTailoringQc}", "");
                }
                thisJC = thisJC.replace("{fieldTailoringStatus}", item.tailoringStatus);

                thisJC = thisJC.replace("{fieldStoreRemarks}", item.storeRemarks);
                thisJC = thisJC.replace("{fieldStoreDate}", formatDate(item.storeDate));
                if (item.storeIssuedBy !== null) {
                    thisJC = thisJC.replace("{fieldStoreIssuedBy}", item.storeIssuedBy.fullName);
                }
                else {
                    thisJC = thisJC.replace("{fieldStoreIssuedBy}", "");
                }
                if (item.storeReceivedBy !== null) {
                    thisJC = thisJC.replace("{fieldStoreReceivedBy}", item.storeReceivedBy.fullName);
                }
                else {
                    thisJC = thisJC.replace("{fieldStoreReceivedBy}", "");
                }

                thisJC = thisJC.replace("{fieldLiningRemarks}", item.liningRemarks);
                thisJC = thisJC.replace("{fieldLiningDate}", formatDate(item.liningDate));
                if (item.liningCutter !== null) {
                    thisJC = thisJC.replace("{fieldLiningCutter}", item.liningCutter.fullName);
                }
                else {
                    thisJC = thisJC.replace("{fieldLiningCutter}", "");
                }

                thisJC = thisJC.replace("{fieldCuttingRemarks}", item.cuttingRemarks);
                thisJC = thisJC.replace("{fieldCuttingDate}", formatDate(item.cuttingDate));
                if (item.cuttingMatcher !== null) {
                    thisJC = thisJC.replace("{fieldCuttingMatcher}", item.cuttingMatcher.fullName);
                }
                else {
                    thisJC = thisJC.replace("{fieldCuttingMatcher}", "");
                }
                if (item.cuttingCutter !== null) {
                    thisJC = thisJC.replace("{fieldCuttingCutter}", item.cuttingCutter.fullName);
                }
                else {
                    thisJC = thisJC.replace("{fieldCuttingCutter}", "");
                }
                if (item.cuttingFuser !== null) {
                    thisJC = thisJC.replace("{fieldCuttingFuser}", item.cuttingFuser.fullName);
                }
                else {
                    thisJC = thisJC.replace("{fieldCuttingFuser}", "");

                }

                contentJC += thisJC;
            });
           
            $("#printJC").html(contentJC);

            window.print();

        });

    }
    else if (type == 3) {


    }



}

function click_toggleJCList() {

    if (showJCList == true)
        showJCList = false;
    else
        showJCList = true;

    if (showJCList == true) {
        $("#spanShowJCList").removeClass("fa-indent").addClass("fa-dedent");
        $("#divJCList").show();
        $("#divJCMain").removeClass("col-md-12").addClass("col-md-9");
    }
    else {
        $("#spanShowJCList").removeClass("fa-dedent").addClass("fa-indent");
        $("#divJCList").hide();
        $("#divJCMain").removeClass("col-md-9").addClass("col-md-12");
    }
}


function click_btnCuttingNotDone() {
    updateCutting(false);
}

function click_btnCuttingDone() {
    updateCutting(true);
}


function click_btnLiningNotDone() {
    updateLining(false);
}

function click_btnLiningDone() {
    updateLining(true);
}

function click_btnStoreNotDone() {
    updateStore(false);
}

function click_btnStoreDone() {
    updateStore(true);
}

function click_btnTailoringNotDone() {
    updateTailoring(false);
}

function click_btnTailoringDone() {
    updateTailoring(true);
}

function click_btnInspectionNotDone() {
    updateInspection(false);
}

function click_btnInspectionDone() {
    updateInspection(true);
}

function click_btnPackingNotDone() {
    updatePacking(false);
}

function click_btnPackingDone() {
    updatePacking(true);
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

function updateLining(done) {

    var oJC = {
        id: selIdJC,
        liningDone: done,
        liningDate: $("#txtLiningDate").val(),
        liningCutter: $('#selLiningCutter').val(),
        liningRemarks: $('#txtLiningNotes').val()
    };

    fuLib.jc.updateLining(oJC).success(function (data, status, xhr) {

        noty({ text: 'JC Lining updated successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

        if (done == true) {
            $("#divLining").css("background-color", "#95b75d");
        }
        else {
            $("#divLining").css("background-color", "red");
        }

    }).error(function (xhr, status, error) {
        //jc.updateLining failed
        handleError('jc.updateLining', xhr, status, error);
    });
}

function updateStore(done) {

    var oJC = {
        id: selIdJC,
        storeDone: done,
        storeDate: $("#txtStoreDate").val(),
        storeIssuedBy: $('#selStoreIssuedBy').val(),
        storeReceivedBy: $('#selStoreReceivedBy').val(),
        storeRemarks: $('#txtStoreNotes').val()
    };

    fuLib.jc.updateStore(oJC).success(function (data, status, xhr) {

        noty({ text: 'JC Store updated successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

        if (done == true) {
            $("#divStore").css("background-color", "#95b75d");
        }
        else {
            $("#divStore").css("background-color", "red");
        }

    }).error(function (xhr, status, error) {
        //jc.updateStore failed
        handleError('jc.updateStore', xhr, status, error);
    });
}

function updateTailoring(done) {

    var oJC = {
        id: selIdJC,
        tailoringDone: done,
        tailoringDate: $("#txtTailoringDate").val(),
        tailoringTailor: $('#selTailoringTailor').val(),
        tailoringQc: $('#selTailoringQc').val(),
        tailoringStatus: $('#selTailoringStatus').val(),
        tailoringRemarks: $('#txtTailoringNotes').val()
    };

    fuLib.jc.updateTailoring(oJC).success(function (data, status, xhr) {

        noty({ text: 'JC Tailoring updated successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

        if (done == true) {
            $("#divTailoring").css("background-color", "#95b75d");
        }
        else {
            $("#divTailoring").css("background-color", "red");
        }

    }).error(function (xhr, status, error) {
        //jc.updateTailoring failed
        handleError('jc.updateTailoring', xhr, status, error);
    });
}

function updateInspection(done) {

    var oJC = {
        id: selIdJC,
        inspectionDone: done,
        inspectionDate: $("#txtInspectionDate").val(),
        inspectionQc: $('#selInspectionQc').val(),
        inspectionStatus: $('#selInspectionStatus').val(),
        inspectionRemarks: $('#txtInspectionNotes').val()
    };

    fuLib.jc.updateInspection(oJC).success(function (data, status, xhr) {

        noty({ text: 'JC Inspection updated successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

        if (done == true) {
            $("#divInspection").css("background-color", "#95b75d");
        }
        else {
            $("#divInspection").css("background-color", "red");
        }

    }).error(function (xhr, status, error) {
        //jc.updateInspection failed
        handleError('jc.updateInspection', xhr, status, error);
    });
}

function updatePacking(done) {

    var oJC = {
        id: selIdJC,
        packingDone: done,
        packingDate: $("#txtPackingDate").val(),
        packingBy: $('#selPackingPackedBy').val(),
        packingStatus: $('#selPackingStatus').val(),
        packingRemarks: $('#txtPackingNotes').val()
    };

    fuLib.jc.updatePacking(oJC).success(function (data, status, xhr) {

        noty({ text: 'JC Packing updated successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

        if (done == true) {
            $("#divPacking").css("background-color", "#95b75d");
        }
        else {
            $("#divPacking").css("background-color", "red");
        }

    }).error(function (xhr, status, error) {
        //jc.updatePacking failed
        handleError('jc.updatePacking', xhr, status, error);
    });
}

function change_chkJcSelAll() {
    var chk = $("#chkJcSelAll").prop("checked");
    $(".chkJc").prop("checked", chk);
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

            var aUniqueColors = [];

            for (var i = 0; i < data.length; i++) {
                //check if color already exists
                var exist = false;
                for (var j = 0; i < aUniqueColors.length; j++) {
                    if (aUniqueColors[j] == data[i]._id) {
                        exist = true;
                        break;
                    }
                }

                if (exist == false) {
                    aUniqueColors.push(data[i]._id);
                    items += '<option value="' + data[i]._id + '">' + data[i].styleColor.title + '</option>';
                }
            }
            $('#selPOColor').html(items);
            $('#selPOColor').selectpicker('refresh');

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

function change_selPOColor() {

    var styleId = $("#selPOStyle").val();
    var colorId = $("#selPOColor").val();

    if (colorId !== "0") {
        //fill PO STYLE SIZES
        fuLib.po.getStyleSizes(styleId).success(function (data, status, xhr) {

            var items = '<option value="0">--select--</option>';

            for (var i = 0; i < data.length; i++) {

                if (data[i].styleColor._id == colorId) {
                    items += '<option value="' + data[i]._id + '">' + data[i].styleSize.title + '</option>';
                }
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
    $("#lblJcSelAll").show();

    $("#btnPrintAll").show();
    $("#btnPrintSel").show();
    $("#btnPrint").show();

    if (data.length == 0) {
        $("#btnGenerateJC").show();
        return false;
    }
    var items = '';
    for (var i = 0; i < data.length; i++) {
        items += '<a href="javascript:loadJC(\'' + data[i]._id + '\', ' + i + ');" class="list-group-item list-group-item-warning"><label><input type="checkbox" value="'+ data[i]._id +'" class="chkJc" style="margin-right:10px;">' + data[i].jobCardNo + '</label></a>';
    }
    $(combo).html(items);
    onresize();
}

function loadJC(id, index) {

    $("#divJcSections").show();
    selIdJC = id;

    $("#divJC a").removeClass("active");

    $("#divJC a").eq(index).addClass("list-group-item list-group-item-primary active");

    //clear job card
    $("#h3JCNo").text("");
    $("#h3JCNo2").text("");

    $("#txtDateStart").val("");
    $("#spanDateStart").text("");

    $("#txtDateEnd").val("");
    $("#spanDateEnd").text("");

    $("#h3JCStyle").text("");
    $("#h3JCStyle2").text("");

    $("#h3JCSize").text("");
    $("#h3JCSize2").text("");

    $("#divCutting").css("background-color", "red");

    $("#txtCuttingDate").val("");
    $('#selCuttingMatcher').val("");
    $('#selCuttingMatcher').selectpicker('refresh');
    $('#selCuttingCutter').val("");
    $('#selCuttingCutter').selectpicker('refresh');
    $('#selCuttingFuser').val("");
    $('#selCuttingFuser').selectpicker('refresh');
    $('#txtCuttingNotes').val("");

    $("#lblCuttingDate").text("");
    $('#lblCuttingMatcher').text("");
    $('#lblCuttingCutter').text("");
    $('#lblCuttingFuser').text("");
    $('#spanCuttingNotes').text("");

    $("#divLining").css("background-color", "red");

    $("#txtLiningDate").val("");
    $('#selLiningCutter').val("");
    $('#selLiningCutter').selectpicker('refresh');
    $('#txtLiningNotes').val("");

    $("#lblLiningDate").text("");
    $('#lblLiningCutter').text("");
    $('#spanLiningNotes').text("");

    $("#divStore").css("background-color", "red");

    $("#txtStoreDate").val("");
    $('#selStoreIssuedBy').val("");
    $('#selStoreIssuedBy').selectpicker('refresh');
    $('#selStoreReceivedBy').val("");
    $('#selStoreReceivedBy').selectpicker('refresh');
    $('#txtStoreNotes').val("");

    $("#lblStoreDate").text("");
    $('#lblStoreIssuedBy').text("");
    $('#lblStoreReceivedBy').text("");
    $('#spanStoreNotes').text("");

    $("#divTailoring").css("background-color", "red");

    $("#txtTailoringDate").val("");
    $('#selTailoringTailor').val("");
    $('#selTailoringTailor').selectpicker('refresh');
    $('#selTailoringQc').val("");
    $('#selTailoringQc').selectpicker('refresh');
    $('#selTailoringStatus').val("");
    $('#selTailoringStatus').selectpicker('refresh');
    $('#txtTailoringNotes').val("");

    $("#lblTailoringDate").text("");
    $('#lblTailoringTailor').text("");
    $('#lblTailoringQc').text("");
    $('#lblTailoringStatus').text("");
    $('#spanTailoringNotes').text("");

    $("#divInspection").css("background-color", "red");

    $("#txtInspectionDate").val("");
    $('#selInspectionQc').val("");
    $('#selInspectionQc').selectpicker('refresh');
    $('#selInspectionStatus').val("");
    $('#selInspectionStatus').selectpicker('refresh');
    $('#txtInspectionNotes').val("");

    $("#lblInspectionDate").text("");
    $('#lblInspectionQc').text("");
    $('#lblInspectionStatus').text("");
    $('#spanInspectionNotes').text("");

    $("#divPacking").css("background-color", "red");

    $("#txtPackingDate").val("");
    $('#selPackingPackedBy').val("");
    $('#selPackingPackedBy').selectpicker('refresh');
    $('#selPackingStatus').val("");
    $('#selPackingStatus').selectpicker('refresh');
    $('#txtPackingNotes').val("");

    $("#lblPackingDate").text("");
    $('#lblPackingPackedBy').text("");
    $('#lblPackingStatus ').text("");
    $('#spanPackingNotes').text("");

    fuLib.jc.getOne(id).success(function (data, status, xhr) {
        //console.log(data[0]);

        $("#h3JCNo").text(data[0].jobCardNo);
        $("#h3JCNo2").text(data[0].jobCardNo);

        $("#txtDateStart").val(data[0].dateStart);
        $("#spanDateStart").text(data[0].dateStart);

        $("#txtDateEnd").val(data[0].dateEnd);
        $("#spanDateEnd").text(data[0].dateEnd);

        $("#h3JCStyle").text(data[0].purchaseOrderStyle.style.title);
        $("#h3JCStyle2").text(data[0].purchaseOrderStyle.style.title);

        $("#h3JCSize").text(data[0].purchaseOrderSize.styleSize.title);
        $("#h3JCSize2").text(data[0].purchaseOrderSize.styleSize.title);

        var bc0 = data[0].jobCardNo;

        var bc1 = bc0.replace(/0/gi, '');

        JsBarcode("#bcCutting").options({ font: "OCR-B" }).CODE128(bc1 + ".1", { height: 85, fontSize: 16 }).render();
        JsBarcode("#bcLining").options({ font: "OCR-B" }).CODE128(bc1 + ".2", { height: 85, fontSize: 16 }).render();
        JsBarcode("#bcStore").options({ font: "OCR-B" }).CODE128(bc1 + ".3", { height: 85, fontSize: 16 }).render();
        JsBarcode("#bcTailoring").options({ font: "OCR-B" }).CODE128(bc1 + ".4", { height: 85, fontSize: 16 }).render();
        JsBarcode("#bcInspection").options({ font: "OCR-B" }).CODE128(bc1 + ".5", { height: 85, fontSize: 16 }).render();
        JsBarcode("#bcPacking").options({ font: "OCR-B" }).CODE128(bc1 + ".6", { height: 85, fontSize: 16 }).render();

        JsBarcode("#bcCutting2").options({ font: "OCR-B" }).CODE128(bc1 + ".1", { height: 50, fontSize: 16 }).render();
        JsBarcode("#bcLining2").options({ font: "OCR-B" }).CODE128(bc1 + ".2", { height: 50, fontSize: 16 }).render();
        JsBarcode("#bcStore2").options({ font: "OCR-B" }).CODE128(bc1 + ".3", { height: 50, fontSize: 16 }).render();
        JsBarcode("#bcTailoring2").options({ font: "OCR-B" }).CODE128(bc1 + ".4", { height: 50, fontSize: 16 }).render();
        JsBarcode("#bcInspection2").options({ font: "OCR-B" }).CODE128(bc1 + ".5", { height: 50, fontSize: 16 }).render();
        JsBarcode("#bcPacking2").options({ font: "OCR-B" }).CODE128(bc1 + ".6", { height: 50, fontSize: 16 }).render();

        //cutting
        //
        if (data[0].cuttingDone == true) {
            $("#divCutting").css("background-color", "#95b75d");
        }
        else {
            $("#divCutting").css("background-color", "red");
        }
        $("#txtCuttingDate").val(formatDate(data[0].cuttingDate));

        if (data[0].cuttingMatcher !== null) {
            $('#selCuttingMatcher').val(data[0].cuttingMatcher._id);
            $('#selCuttingMatcher').selectpicker('refresh');
            $('#lblCuttingMatcher').text(data[0].cuttingMatcher.fullName);
        }

        if (data[0].cuttingCutter !== null) {
            $('#selCuttingCutter').val(data[0].cuttingCutter._id);
            $('#selCuttingCutter').selectpicker('refresh');
            $('#lblCuttingCutter').text(data[0].cuttingCutter.fullName);
        }
      
        if (data[0].cuttingFuser !== null) {
            $('#selCuttingFuser').val(data[0].cuttingFuser._id);
            $('#selCuttingFuser').selectpicker('refresh');
            $('#lblCuttingFuser').text(data[0].cuttingFuser.fullName);
        }
     
        $('#txtCuttingNotes').val(data[0].cuttingRemarks);
        $("#lblCuttingDate").text(formatDate(data[0].cuttingDate));
        $('#spanCuttingNotes').text(data[0].cuttingRemarks);

        //lining
        //
        if (data[0].liningDone == true) {
            $("#divLining").css("background-color", "#95b75d");
        }
        else {
            $("#divLining").css("background-color", "red");
        }
        $("#txtLiningDate").val(formatDate(data[0].liningDate));

        if (data[0].liningCutter !== null) {
            $('#selLiningCutter').val(data[0].liningCutter._id);
            $('#selLiningCutter').selectpicker('refresh');
            $('#lblLiningCutter').text(data[0].liningCutter.fullName);
        }
      
        $('#txtLiningNotes').val(data[0].liningRemarks);
        $("#lblLiningDate").text(formatDate(data[0].liningDate));
        $('#spanLiningNotes').text(data[0].liningRemarks);

        //store
        //
        if (data[0].storeDone == true) {
            $("#divStore").css("background-color", "#95b75d");
        }
        else {
            $("#divStore").css("background-color", "red");
        }
        $("#txtStoreDate").val(formatDate(data[0].storeDate));

        if (data[0].storeIssuedBy !== null) {
            $('#selStoreIssuedBy').val(data[0].storeIssuedBy._id);
            $('#selStoreIssuedBy').selectpicker('refresh');
            $('#lblStoreIssuedBy').text(data[0].storeIssuedBy.fullName);
        }

        if (data[0].storeReceivedBy !== null) {
            $('#selStoreReceivedBy').val(data[0].storeReceivedBy._id);
            $('#selStoreReceivedBy').selectpicker('refresh');
            $('#lblStoreReceivedBy').text(data[0].storeReceivedBy.fullName);
        }
        $('#txtStoreNotes').val(data[0].storeRemarks);
        $("#lblStoreDate").text(formatDate(data[0].storeDate));
        $('#spanStoreNotes').text(data[0].storeRemarks);

        //tailoring
        //
        if (data[0].tailoringDone == true) {
            $("#divTailoring").css("background-color", "#95b75d");
        }
        else {
            $("#divTailoring").css("background-color", "red");
        }
        $("#txtTailoringDate").val(formatDate(data[0].tailoringDate));
        if (data[0].tailoringTailor !== null) {
            $('#selTailoringTailor').val(data[0].tailoringTailor._id);
            $('#selTailoringTailor').selectpicker('refresh');
            $('#lblTailoringTailor').text(data[0].tailoringTailor.fullName);
        }

        if (data[0].tailoringLineQc !== null) {
            $('#selTailoringQc').val(data[0].tailoringLineQc._id);
            $('#selTailoringQc').selectpicker('refresh');
            $('#lblTailoringQc').text(data[0].tailoringLineQc.fullName);
        }
        $('#selTailoringStatus').val(data[0].tailoringStatus);
        $('#selTailoringStatus').selectpicker('refresh');
        $('#txtTailoringNotes').val(data[0].tailoringRemarks);
        $("#lblTailoringDate").text(formatDate(data[0].tailoringDate));
        $('#lblTailoringStatus').text(data[0].tailoringStatus);
        $('#spanTailoringNotes').text(data[0].tailoringRemarks);

        //inspection
        //
        if (data[0].inspectionDone == true) {
            $("#divInspection").css("background-color", "#95b75d");
        }
        else {
            $("#divInspection").css("background-color", "red");
        }
        $("#txtInspectionDate").val(formatDate(data[0].inspectionDate));

        if (data[0].inspectionQcBy !== null) {
            $('#selInspectionQc').val(data[0].inspectionQcBy._id);
            $('#selInspectionQc').selectpicker('refresh');
            $('#lblInspectionQc').text(data[0].inspectionQcBy.fullName);
        }
        $('#selInspectionStatus').val(data[0].inspectionStatus);
        $('#selInspectionStatus').selectpicker('refresh');
        $('#txtInspectionNotes').val(data[0].inspectionRemarks);
        $("#lblInspectionDate").text(formatDate(data[0].inspectionDate));
        $('#lblInspectionStatus').text(data[0].inspectionStatus);
        $('#spanInspectionNotes').text(data[0].inspectionRemarks);

        //packing
        //
        if (data[0].packingDone == true) {
            $("#divPacking").css("background-color", "#95b75d");
        }
        else {
            $("#divPacking").css("background-color", "red");
        }
        $("#txtPackingDate").val(formatDate(data[0].packingDate));

        if (data[0].packingBy !== null) {
            $('#selPackingPackedBy').val(data[0].packingBy._id);
            $('#selPackingPackedBy').selectpicker('refresh');
            $('#lblPackingPackedBy').text(data[0].packingBy.fullName);
        }

        $('#selPackingStatus').val(data[0].packingStatus);
        $('#selPackingStatus').selectpicker('refresh');
        $('#txtPackingNotes').val(data[0].packingRemarks);
        $("#lblPackingDate").text(formatDate(data[0].packingDate));
        $('#lblPackingStatus ').text(data[0].packingStatus);
        $('#spanPackingNotes').text(data[0].packingRemarks);

    });

}


function fillPO(poId) {

    fuLib.po.getOne(poId).success(function (data, status, xhr) {

        //console.log(data[0]);

        $("#h4PoCustomer").text(data[0].customer.name);
        $("#h4PoCustomer2").text(data[0].customer.name);

        $("#h4PoInvoiceNo").text(data[0].invoiceNo);
        $("#h4PoInvoiceNo2").text(data[0].invoiceNo);

        $("#h4PoQty").text(data[0].qty);
        $("#h4PoQty2").text(data[0].qty);

        $("#h4PoDateOrder").text(formatDate(data[0].dateOrder));
        $("#h4PoDateOrder2").text(formatDate(data[0].dateOrder));

        $("#h4PoDateTarget").text(formatDate(data[0].dateTarget));
        $("#h4PoDateTarget2").text(formatDate(data[0].dateTarget));

        $("#h4PoDateDelivery").text(formatDate(data[0].dateDelivery));
        $("#h4PoDateDelivery2").text(formatDate(data[0].dateDelivery));

        $("#h4PoOrderType").text(data[0].LovType.title);
        $("#h4PoOrderType2").text(data[0].LovType.title);

        fuLib.po.getInternals(poId).success(function (data, status, xhr) {

            $("#tblPoInternal2").html("");
            $("#tblPoInternal3").html("");

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
                $("#tblPoInternal3").append(row);

            });
        });
    });

}

