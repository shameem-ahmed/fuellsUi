"use strict";

var lovModeUpdate = 'new';

var selIdLov = '';
var selIdLovGrp = '0';

var tableLov;

//CALLED FROM _LAYOUT2
function doLov(crPage) {

    $("#divUpdate").hide();

    $("#divTable").removeClass("col-md-8").addClass("col-md-12");

    configLovTable();

    //BTN LOV NEW click event
    $("#btnLovNew").click(function () {
        lovModeUpdate = 'new';

        lovClearEditPanel();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //NEW LOV-SAVE CHANGES click event
    $("#btnLovUpdateSave").click(function () {

        var isEmptyLov = false;

        var oLov = {
            title: $("#txtTitle").val(),
            type: selIdLovGrp,
            flag: 0
        };

        //check if oLov is empty
        if (oLov.title.trim().length == 0) {
            isEmptyLov = true;
        }

        if (lovModeUpdate == 'new') {

            if (isEmptyLov == true) {
                noty({ text: "Please type item details", layout: 'topRight', type: 'error', timeout: 2000 });
                return false;
            }
            else {

                fuLib.lov.add(oLov).success(function (data, status, xhr) {

                    noty({ text: 'Lov item added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                    var table = $("#tblLov").DataTable();
                    table.ajax.reload();

                }).error(function (xhr, status, error) {
                    //lov.add failed
                    handleError('lov.add', xhr, status, error);
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
    $("#btnLovUpdateCancel").click(function () {

        $("#divUpdate").hide();
        $("#divTable").removeClass("col-md-8").addClass("col-md-12");
        return false;

    });
}

function changeLovData(grp) {

    $("#divLovGrp a").removeClass("active");

    $("#divLovGrp a").eq(grp).addClass("list-group-item active");

    selIdLovGrp = grp;

    var table = $("#tblLov").DataTable();
    table.ajax.url(apiUrl + "lov/getlov/" + selIdLovGrp).load();
}


function lovClearEditPanel() {

    $("#txtTitle").val('');

}

function configLovTable() {
    //"option strict";

    //DATATABLE AJAX LOAD COMPLETE EVENT
    $("#tblLov").on('xhr.dt', function (e, settings, data, xhr) {

        //data will be null is AJAX error
        if (data) {
            //DATATABLE DRAW COMPLETE EVENT
            $('#tblLov').on('draw.dt', function () {

                tableLov = $("#tblLov").DataTable();
                //select first row by default

                tableLov.rows(':eq(0)', { page: 'current' }).select();
                selIdLov = tableLov.rows(':eq(0)', { page: 'current' }).ids()[0];
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
            "url": apiUrl + "lov/getlov/" + selIdLovGrp,
            "dataSrc": "",
            "headers": {
                "Authorization": "Bearer " + token
            }
        },
        "columns": [
            { "data": "title", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "flag", "defaultContent": "<span class='text-muted'>Not set</span>" }
        ],
    });

    //TABLE ROW CLICK EVENT
    $("#tblLov tbody").on('click', 'tr', function () {

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            tableLov = $('#tblSupplier').DataTable();
            tableLov.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            selIdLov = $(this).attr("id");
        }
    });

    //TABLE REDRAW EVENT
    $('#tblLov').on('draw.dt', function () {
        onresize();
    });
}