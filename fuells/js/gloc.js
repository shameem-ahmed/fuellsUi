"use strict";

var locModeUpdate = 'new';

var selIdLoc = '';
var selIdLocGrp = '0';

var tableLoc;

//CALLED FROM _LAYOUT2
function doGloc(crPage) {

    $("#divUpdate").hide();

    $("#divTable").removeClass("col-md-8").addClass("col-md-12");

    //$("#treeGeoLoc").treeview({ data: getGeoLoc() });
    //$("#h1Sha").greenify();

    //fill COUNTRIES

    var sHtml = '';

    fuLib.gloc.getCountries().success(function (data, status, xhr) {

        addGeoData(data, 0, 0, 'X');

    }).error(function (xhr, status, error) {
        //gloc.getCountries failed
        handleError('gloc.getCountries', xhr, status, error);
    });


    //BTN LOC NEW click event
    $("#btnLocNew").click(function () {
        locModeUpdate = 'new';

        locClearEditPanel();

        var level = parseInt($("input[name='radioGeoSelected']:checked").parent().parent().find("input[class=treeLevel]").val());

        var selText = $("input[name='radioGeoSelected']:checked").parent().parent().find("label").text();

        var parent = $("input[name='radioGeoSelected']:checked").parent().parent().find("input[class=treeParent]").val();
        var key = $("input[name='radioGeoSelected']:checked").parent().parent().find("input[class=treeKey]").val();
        var id = $("input[name='radioGeoSelected']:checked").parent().parent().parent().attr("id");
        var index = $("input[name='radioGeoSelected']:checked").parent().parent().parent().index();

        $("#hidId").val(id);
        $("#hidParent").val(parent);
        $("#hidIndex").val(index);
        $("#hidKey").val(key);

        if (level == undefined) {
            //nothing selected

            $("#trGeoLabelCountry").show();
            $("#trGeoLabelChilds").hide();
            $("#trGeoLabelPincode").hide();


            $("#btnLocUpdateSaveChild").hide();

            $("#geoLabelSibling").text("Country");
            $("#geoLabelSibling2").text("Country");

        }
        else {

            $("#trGeoLabelChilds").show();
            $("#trGeoLabelCountry").hide();
            $("#trGeoLabelPincode").hide();

            $("#btnLocUpdateSaveChild").show();

            var geoChild = "";
            var geoSibling = "";

            if (level == 0) {
                geoChild = "State";
                geoSibling = "Country";
            }
            else if (level == 1) {
                geoChild = "City";
                geoSibling = "State";
            }
            else if (level == 2) {
                geoChild = "Area";
                geoSibling = "City";
            }
            else if (level == 3) {
                geoChild = "Pincode";
                geoSibling = "Area";
            }
            else if (level == 4) {
                $("#trGeoLabelPincode").show();
                $("#trGeoLabelChilds").hide();
                $("#trGeoLabelCountry").hide();

                $("#btnLocUpdateSaveChild").hide();

                geoChild = "Pincode";
                geoSibling = "Pincode";
            }


            $("#geoLabelChild").text(geoChild);
            $("#geoLabelSibling").text(geoSibling);

            $("#geoLabelChild2").text(geoChild);
            $("#geoLabelSibling2").text(geoSibling);


            $("#geoLabelSelected").text(selText);
        
        }

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //NEW LOC-SAVE GEO CHILD click event
    $("#btnLocUpdateSaveChild").click(function () {

        var isEmptyLoc = false;

        var type = $("#btnLocUpdateSaveChild").text();

        type = type.replace("Save ", "").toLowerCase();

        saveGeoLoc(type, 0);

        return false;

    });

    //NEW LOC-SAVE GEO SIBLING click event
    $("#btnLocUpdateSaveSibling").click(function () {


        var type = $("#btnLocUpdateSaveSibling").text();

        type = type.replace("Save ", "").toLowerCase();

        saveGeoLoc(type, 1);

        return false;

    });

    //NEW SUPPLIER-Cancel click event
    $("#btnLocUpdateCancel").click(function () {

        $("#divUpdate").hide();
        $("#divTable").removeClass("col-md-8").addClass("col-md-12");
        return false;

    });
}

function saveGeoLoc(type, parentType) {

    var parent = '';
    var index = $("#hidIndex").val();
    var key = $("#hidKey").val();

    if (parentType == 0) {
        //child
        parent = $("#hidId").val();

    }
    else {
        //sibling
        parent = $("#hidParent").val();

    }

    var isEmptyLoc = false;

    var level = 0;

    type = type.trim();

    if (type == "country") {
        level = 0;
    }
    else if (type == "state") {
        level = 1;
    }
    else if (type == "city") {
        level = 2;
    }
    else if (type == "area") {
        level = 3;
    }
    else if (type == "pincode") {
        level = 4;
    }

    if (parent == 'null') {
        parent = null;
    }

    var oLoc = {
        parent: parent,
        title: $("#txtTitle").val(),
        type: level,
        geoData: '',
        flag: 0
    };

    //check if oLoc is empty
    if (oLoc.title.trim().length == 0) {
        isEmptyLoc = true;
    }

    if (locModeUpdate == 'new') {

        if (isEmptyLoc == true) {
            noty({ text: "Please type location details", layout: 'topRight', type: 'error', timeout: 2000 });
            return false;
        }
        else {

            fuLib.gloc.add(oLoc).success(function (data, status, xhr) {

                var gloc = data.gloc;

                noty({ text: 'Location added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                if (parentType == 1) {
                    //if save as Sibling
                    //$("#tbodyCountry > tr").eq(index).find("td span").eq(0).trigger("click");

                    //$("#" + parentId).find("td span").eq(0).prop("class", "fa fa-minus-square-o " + geoClass);
                    

                }

                var sHtml = '';

                var geoClass = '';

                if (gloc.type == 0) {
                    geoClass = 'geoCountry';
                }
                else if (gloc.type == 1) {
                    geoClass = 'geoState';
                }
                else if (gloc.type == 2) {
                    geoClass = 'geoCity';
                }
                else if (gloc.type == 3) {
                    geoClass = 'geoArea';
                }
                else if (gloc.type == 4) {
                    geoClass = 'geoZip';
                }

                sHtml += '<tr id="' + gloc._id + '">';
                sHtml += '  <td>';
                sHtml += '    <span class="fa fa-plus-square-o ' + geoClass + '" onClick="javascript:doGeoOpen(`' + gloc._id + '`);"></span>';
                sHtml += '    <label><input type="radio" name="radioGeoSelected" id="radioGeoSelected" />&nbsp;' + gloc.title + '</label>';
                sHtml += '    <input type="hidden" class="treeExpanded" value="0" />';
                sHtml += '    <input type="hidden" class="treeLoaded" value="0" />';
                sHtml += '    <input type="hidden" class="treeLevel" value="' + gloc.type + '" />';
                sHtml += '    <input type="hidden" class="treeParent" value="' + gloc.parent + '" />';
                sHtml += '    <input type="hidden" class="treeKey" value="' + gloc.parent + '" />';
                sHtml += '    <span class="glyphicon glyphicon-trash" aria-hidden="true" style="display:none;"></span>';
                sHtml += '  </td>';
                sHtml += '</tr>';

                //if (gloc.type == 0) {
                //    //if country, add it on the top
                //    $("#tbodyCountry > tr").eq(0).before(sHtml);
                //}
                //else {
                //    $("#tbodyCountry > tr").eq(index).after(sHtml);
                //}


                var endless = true;

                var nodeId2 = parent;

                while (endless == true) {

                    var key2 = $("#" + nodeId2).next().find("input[class=treeKey]").val();

                    if (key2 == undefined) {

                        $("#" + nodeId2).after(sHtml);

                        endless = false;

                    }
                    else {

                        if (key2.split('.').length == key.split('.').length) {

                            $("#" + nodeId2).after(sHtml);

                            endless = false;

                        }

                        nodeId2 = $("#" + nodeId2).next("tr").attr('id');

                    }
                }



                
            }).error(function (xhr, status, error) {
                //loc.add failed
                handleError('gloc.add', xhr, status, error);
            });
        }

        $("#divUpdate").hide();
        $("#divTable").removeClass("col-md-8").addClass("col-md-12");

        return false;

    }
    else if (supModeUpdate == 'edit') {

    }

}

function addGeoData(data, parentId, level, key) {

    var geoClass = '';

    if (level == 0) {
        geoClass = 'geoCountry';
    }
    else if (level == 1) {
        geoClass = 'geoState';
    }
    else if (level == 2) {
        geoClass = 'geoCity';
    }
    else if (level == 3) {
        geoClass = 'geoArea';
    }
    else if (level == 4) {
        geoClass = 'geoZip';
    }

    var sHtml = '';

    for (var i = 0; i < data.length; i++) {

        sHtml += '<tr id="' + data[i]._id + '">';
        sHtml += '  <td>';
        if (level == 4) {
            sHtml += '    <span class="geoZip"></span>';
        }
        else {
            sHtml += '    <span class="fa fa-plus-square-o ' + geoClass + '" onClick="javascript:doGeoOpen(`' + data[i]._id + '`);"></span>';
        }
        sHtml += '    <label><input type="radio" name="radioGeoSelected" id="radioGeoSelected" />&nbsp;' + data[i].title + '</label>';
        sHtml += '    <input type="hidden" class="treeExpanded" value="0" />';
        sHtml += '    <input type="hidden" class="treeLoaded" value="0" />';
        sHtml += '    <input type="hidden" class="treeLevel" value="' + level + '" />';
        sHtml += '    <input type="hidden" class="treeParent" value="' + data[i].parent + '" />';

        if (key == 'X') {
            sHtml += '    <input type="hidden" class="treeKey" value="' + (i + 1) + '" />';
        }
        else {
            sHtml += '    <input type="hidden" class="treeKey" value="' + key + '.' + (i + 1) + '" />';
        }

        sHtml += '    <span class="glyphicon glyphicon-trash     aria-hidden="true" style="display:none;"></span>';
        sHtml += '  </td>';
        sHtml += '</tr>';

    }

    if (level == 0) {
        //if country
        $("#tbodyCountry").html(sHtml);

    }
    else {
      
        if (level == 0) {
            geoClass = 'geoCountry';
        }
        else if (level == 1) {
            geoClass = 'geoCountry';
        }
        else if (level == 2) {
            geoClass = 'geoState';
        }
        else if (level == 3) {
            geoClass = 'geoCity';
        }
        else if (level == 4) {
            geoClass = 'geoArea';
        }

        if (sHtml.trim().length > 0) {
            $("#" + parentId).after(sHtml);
            $("#" + parentId).find("td span").eq(0).prop("class", "fa fa-minus-square-o " + geoClass);

            //var endless = true;

            //var nodeId2 = parentId;

            //while (endless == true) {

            //    var key2 = $("#" + nodeId2).next().find("input[class=treeKey]").val();

            //    if (key2 == undefined) {

            //        $("#" + nodeId2).after(sHtml);

            //        endless = false;

            //    }
            //    else {

            //        if (key2.split('.').length == key.split('.').length) {

            //            $("#" + nodeId2).next().after(sHtml);

            //            endless = false;

            //        }

            //        nodeId2 = $("#" + nodeId2).next("tr").attr('id');

            //    }
            //}
        }
    }

    $("#tbodyCountry").find("tr").each(function () {

        $(this).mouseenter(function (e) {

            $(this).find("td span").eq(1).show();

        });

        $(this).mouseleave(function (e) {

            $(this).find("td span").eq(1).hide();

        });

    });
}

function doGeoOpen(nodeId) {

    var expanded = parseInt($("#" + nodeId).find("input[class=treeExpanded]").val());
    var loaded = parseInt($("#" + nodeId).find("input[class=treeLoaded]").val());
    var level = parseInt($("#" + nodeId).find("input[class=treeLevel]").val());
    var key = $("#" + nodeId).find("input[class=treeKey]").val();

    if (loaded == 0) {
        //child nodes are not loaded

        addGeoChilds(nodeId, level, key);
        $("#" + nodeId).find("input[class=treeLoaded]").val("1");

    }
    else {
        //child nodes already loaded

        if (expanded == 0) {
            //expand node

            $("#" + nodeId).next("tr").show();

            $("#" + nodeId).find("input[class=treeExpanded]").val("1");
        }
        else {
            //collapse node

            var endless = true;

            var nodeId2 = nodeId;

            while (endless == true) {

                var level2 = parseInt($("#" + nodeId2).next("tr").find("input[class=treeLevel]").val());

                if (level2 > level) {
                    $("#" + nodeId2).next("tr").find("input[class=treeExpanded]").val("0");
                    $("#" + nodeId2).next("tr").hide();
                }
                else {
                    endless = false;
                }

                nodeId2 = $("#" + nodeId2).next("tr").attr('id');

            }

            $("#" + nodeId).find("input[class=treeExpanded]").val("0");

        }
    }



}

function addGeoChilds(parentId, level, key) {

    if (level == 0) {
        //1-State

        fuLib.gloc.getStates(parentId).success(function (data, status, xhr) {

            addGeoData(data, parentId, 1, key);

        }).error(function (xhr, status, error) {
            //gloc.getCountries failed
            handleError('gloc.getCountries', xhr, status, error);
        });
    }

    if (level == 1) {
        //2-City

        fuLib.gloc.getCities(parentId).success(function (data, status, xhr) {

            addGeoData(data, parentId, 2, key);

        }).error(function (xhr, status, error) {
            //gloc.getCities failed
            handleError('gloc.getCities', xhr, status, error);
        });
    }

    if (level == 2) {
        //3-Area

        fuLib.gloc.getAreas(parentId).success(function (data, status, xhr) {

            addGeoData(data, parentId, 3, key);

        }).error(function (xhr, status, error) {
            //gloc.Areas failed
            handleError('gloc.Areas', xhr, status, error);
        });
    }

    if (level == 3) {
        //3-Zip

        fuLib.gloc.getZips(parentId).success(function (data, status, xhr) {

            addGeoData(data, parentId, 4, key);

        }).error(function (xhr, status, error) {
            //gloc.getZips failed
            handleError('gloc.getZips', xhr, status, error);
        });
    }

    

}

function getGeoLoc() {

    alert('getGeoLoc');

    var data = [
        {
            id: "1",
            text: "India",
            nodes: [
                {
                    id: "11",
                    text: "Tamilnadu",
                    nodes: [
                        {
                            id: "111",
                            text: "Chennai",
                            nodes: [
                                {
                                    id: "1111",
                                    text: "T Nagar",
                                    nodes: [
                                        {
                                            id: "11111",
                                            text: "600017"
                                        },
                                        {
                                            id: "11112",
                                            text: "600018"
                                        }
                                    ]
                                },
                                {
                                    id: "1112",
                                    text: "Broadway",
                                    nodes: [
                                        {
                                            id: "11121",
                                            text: "600001"
                                        },
                                        {
                                            id: "11122",
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

function changeLocData(grp) {

    $("#divLocGrp a").removeClass("active");

    $("#divLocGrp a").eq(grp).addClass("list-group-item active");

    selIdLocGrp = grp;

    var table = $("#tblLoc").DataTable();
    table.ajax.url(apiUrl + "loc/getloc/" + selIdLocGrp).load();
}


function locClearEditPanel() {

    $("#txtTitle").val('');

}

function configLocTable() {
    //"option strict";

    //DATATABLE AJAX LOAD COMPLETE EVENT
    $("#tblLoc").on('xhr.dt', function (e, settings, data, xhr) {

        //data will be null is AJAX error
        if (data) {
            //DATATABLE DRAW COMPLETE EVENT
            $('#tblLoc').on('draw.dt', function () {

                tableLoc = $("#tblLoc").DataTable();
                //select first row by default

                tableLoc.rows(':eq(0)', { page: 'current' }).select();
                selIdLoc = tableLoc.rows(':eq(0)', { page: 'current' }).ids()[0];
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
            "url": apiUrl + "loc/getloc/" + selIdLocGrp,
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
    $("#tblLoc tbody").on('click', 'tr', function () {

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            tableLoc = $('#tblSupplier').DataTable();
            tableLoc.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            selIdLoc = $(this).attr("id");
        }
    });

    //TABLE REDRAW EVENT
    $('#tblLoc').on('draw.dt', function () {
        onresize();
    });
}