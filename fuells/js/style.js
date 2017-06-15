"use strict";

var userToggleRow = true;

//CALLED FROM _LAYOUT2
function doStyle(crPage) {

    var crTab = 0;
    var modeUpdate = 'newStyle';
    var selStyleId = '';
    var selMaterialId = '';
    var selLeatherId = '';
    var selColorId = '';
    var selSizeId = '';

    $("#divUpdate").hide();

    $("#divTable").removeClass("col-md-8").addClass("col-md-12");

    configStyleTable();
    configMaterialTable();
    configLeatherTable();
    configColorTable();
    configSizeTable();

    //fill MATERIALS FOR STYLE
    fuLib.style.getAllMaterial().success(function (data, status, xhr) {
        fillCombo('#selStyleMaterial', data);


    }).error(function (xhr, status, error) {
        //style.getAllMaterial failed
        handleError('style.getAllMaterial', xhr, status, error);
    });

    //fill LEATHERS FOR STYLE
    fuLib.style.getAllLeather().success(function (data, status, xhr) {
        fillCombo('#selStyleLeather', data);


    }).error(function (xhr, status, error) {
        //style.getAllLeather failed
        handleError('style.getAllLeather', xhr, status, error);
    });

    //fill COLORS FOR STYLE
    fuLib.style.getAllColor().success(function (data, status, xhr) {
        fillCombo('#selStyleColor', data);


    }).error(function (xhr, status, error) {
        //style.getAllColor failed
        handleError('style.getAllColor', xhr, status, error);
    });

    //fill SIZES FOR STYLE
    fuLib.style.getAllSize().success(function (data, status, xhr) {
        fillCombo('#selStyleSize', data);


    }).error(function (xhr, status, error) {
        //style.getAllSize failed
        handleError('style.getAllSize', xhr, status, error);
    });

    //BTN NEW STYLE click event
    $("#btnNewStyle").click(function () {

        modeUpdate = 'newStyle';

        clearEditPanel('style');

        $("#divEditStyle").show();
        $("#divEditMaterial").hide();
        $("#divEditLeather").hide();
        $("#divEditColor").hide();
        $("#divEditSize").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

        $("#txtStyleTitle").focus();
    });

    //BTN NEW MATERIAL click event
    $("#btnNewMaterial").click(function () {
        modeUpdate = 'newMaterial';

        clearEditPanel('material');

        $("#divEditMaterial").show();
        $("#divEditStyle").hide();
        $("#divEditLeather").hide();
        $("#divEditColor").hide();
        $("#divEditSize").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

        $("#txtMaterialTitle").focus();
    });

    //BTN NEW LEATHER click event
    $("#btnNewLeather").click(function () {
        modeUpdate = 'newLeather';

        clearEditPanel('leather');

        $("#divEditLeather").show();
        $("#divEditMaterial").hide();
        $("#divEditStyle").hide();
        $("#divEditColor").hide();
        $("#divEditSize").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

        $("#txtLeatherTitle").focus();
    });

    //BTN NEW COLOR click event
    $("#btnNewColor").click(function () {
        modeUpdate = 'newColor';

        clearEditPanel('color');

        $("#divEditColor").show();
        $("#divEditMaterial").hide();
        $("#divEditLeather").hide();
        $("#divEditStyle").hide();
        $("#divEditSize").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

        $("#txtColorTitle").focus();
    });

    //BTN NEW SIZE click event
    $("#btnNewSize").click(function () {
        modeUpdate = 'newSize';

        clearEditPanel('size');

        $("#divEditSize").show();
        $("#divEditMaterial").hide();
        $("#divEditLeather").hide();
        $("#divEditColor").hide();
        $("#divEditStyle").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

        $("#txtSizeTitle").focus();
    });

    //STYLE SAVE click event
    $("#btnSaveStyle").click(function () {

        var isEmptyStyle = false;

        var oStyle = {
            title: $("#txtStyleTitle").val(),
            isActive: true,
            flag: 0,
            materials: [],
            leathers: [],
            colors: [],
            sizes: []
        };

        $("#lstStyleMaterial").find("a").each(function () {
            //var oMaterial = {
            //    id: ''
            //};
            //oMaterial.id = $(this).find("p").text();

            var mat1 = $(this).find("p").text();
            oStyle.materials.push(mat1);
        });

        $("#lstStyleLeather").find("a").each(function () {
            //var oLeather = {
            //    id: ''
            //};
            //oLeather.id = $(this).find("p").text();

            var lea1 = $(this).find("p").text();
            oStyle.leathers.push(lea1);
        });

        $("#lstStyleColor").find("a").each(function () {
            //var oColor = {
            //    id: ''
            //};
            //oColor.id = $(this).find("p").text();

            var col1 = $(this).find("p").text();
            oStyle.colors.push(col1);
        });

        $("#lstStyleSize").find("a").each(function () {
            //var oSize = {
            //    id: ''
            //};
            //oSize.id = $(this).find("p").text();

            var siz1 = $(this).find("p").text();
            oStyle.sizes.push(siz1);
        });

        console.log(oStyle);

        //check if oStyle is empty
        if (oStyle.title.trim().length == 0 ||
            oStyle.materials.length == 0 ||
            oStyle.leathers.length == 0 ||
            oStyle.colors.length == 0 ||
            oStyle.sizes.length == 0
            ) {
            isEmptyStyle = true;
        }

        if (modeUpdate == 'newStyle') {

            if (isEmptyStyle == true) {
                noty({ text: "Please type style details with atleast one Material/Leather/Color/Size", layout: 'topCenter', type: 'error', timeout: 2000 });
                return false;
            }
            else {
                //save STYLE details
                fuLib.style.add(oStyle).success(function (data, status, xhr) {
                    noty({ text: 'Style added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });
                    var table = $("#tblStyle").DataTable();
                    table.ajax.reload();

                }).error(function (xhr, status, error) {
                    //style.add failed
                    handleError('style.add', xhr, status, error);
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

    //STYLE CANCEL click event
    $("#btnCancelStyle").click(function () {

        $("#divUpdate").hide();
        $("#divTable").removeClass("col-md-8").addClass("col-md-12");
        return false;
    });

    //MATERIAL SAVE click event
    $("#btnSaveMaterial").click(function () {

        var isEmptyMaterial = false;

        var oMaterial = {
            title: $("#txtMaterialTitle").val(),
            isActive: true,
            flag: 0
        };

        //check if oMaterial is empty
        if (oMaterial.title.trim().length == 0) {
            isEmptyMaterial = true;
        }


        if (modeUpdate == 'newMaterial') {

            if (isEmptyMaterial == true) {
                noty({ text: "Please type material details", layout: 'topRight', type: 'error', timeout: 2000 });
                return false;
            }
            else {
                //save MATERIAL details
                fuLib.style.addMaterial(oMaterial).success(function (data, status, xhr) {
                    noty({ text: 'Material added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });
                    var table = $("#tblMaterial").DataTable();
                    table.ajax.reload();

                }).error(function (xhr, status, error) {
                    //style.addMaterial failed
                    handleError('style.addMaterial', xhr, status, error);
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

    //MATERIAL CANCEL click event
    $("#btnCancelMaterial").click(function () {

        $("#divUpdate").hide();
        $("#divTable").removeClass("col-md-8").addClass("col-md-12");
        return false;
    });

    //LEATHER SAVE click event
    $("#btnSaveLeather").click(function () {

        var isEmptyLeather = false;

        var oLeather = {
            title: $("#txtLeatherTitle").val(),
            isActive: true,
            flag: 0
        };

        //check if oLeather is empty
        if (oLeather.title.trim().length == 0) {
            isEmptyLeather = true;
        }


        if (modeUpdate == 'newLeather') {

            if (isEmptyLeather == true) {
                noty({ text: "Please type leather details", layout: 'topRight', type: 'error', timeout: 2000 });
                return false;
            }
            else {

                //save LEATHER details

                fuLib.style.addLeather(oLeather).success(function (data, status, xhr) {

                    console.log(data);

                    noty({ text: 'Leather added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                    var table = $("#tblLeather").DataTable();
                    table.ajax.reload();

                }).error(function (xhr, status, error) {
                    //style.addLeather failed
                    handleError('style.addLeather', xhr, status, error);
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

    //LEATHER CANCEL click event
    $("#btnCancelLeather").click(function () {

        $("#divUpdate").hide();
        $("#divTable").removeClass("col-md-8").addClass("col-md-12");
        return false;

    });

    //COLOR SAVE click event
    $("#btnSaveColor").click(function () {

        var isEmptyColor = false;

        var oColor = {
            title: $("#txtColorTitle").val(),
            isActive: true,
            flag: 0
        };

        //check if oColor is empty
        if (oColor.title.trim().length == 0) {
            isEmptyColor = true;
        }


        if (modeUpdate == 'newColor') {

            if (isEmptyColor == true) {
                noty({ text: "Please type color details", layout: 'topRight', type: 'error', timeout: 2000 });
                return false;
            }
            else {

                //save COLOR details

                fuLib.style.addColor(oColor).success(function (data, status, xhr) {

                    console.log(data);

                    noty({ text: 'Color added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                    var table = $("#tblColor").DataTable();
                    table.ajax.reload();

                }).error(function (xhr, status, error) {
                    //style.addLeather failed
                    handleError('style.addColor', xhr, status, error);
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

    //LEATHER CANCEL click event
    $("#btnCancelColor").click(function () {

        $("#divUpdate").hide();
        $("#divTable").removeClass("col-md-8").addClass("col-md-12");
        return false;

    });

    //SIZE SAVE click event
    $("#btnSaveSize").click(function () {

        var isEmptySize = false;

        var oSize = {
            title: $("#txtSizeTitle").val(),
            isActive: true,
            flag: 0
        };

        //check if oLeather is empty
        if (oSize.title.trim().length == 0) {
            isEmptySize = true;
        }


        if (modeUpdate == 'newSize') {

            if (isEmptySize == true) {
                noty({ text: "Please type size details", layout: 'topRight', type: 'error', timeout: 2000 });
                return false;
            }
            else {

                //save SIZE details

                fuLib.style.addSize(oSize).success(function (data, status, xhr) {

                    console.log(data);

                    noty({ text: 'Size added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                    var table = $("#tblSize").DataTable();
                    table.ajax.reload();

                }).error(function (xhr, status, error) {
                    //style.addLeather failed
                    handleError('style.addSize', xhr, status, error);
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

    //SIZE CANCEL click event
    $("#btnCancelSize").click(function () {

        $("#divUpdate").hide();
        $("#divTable").removeClass("col-md-8").addClass("col-md-12");
        return false;
    });
}

function configStyleTable() {
    $("#tblStyle").on('xhr.dt', function (e, settings, data, xhr) {
        //DataTable AJAX load complete event

        //data will be null is AJAX error
        if (data) {
            $('#tblStyle').on('draw.dt', function () {
                //DataTable draw complete event
                var table = $("#tblStyle").DataTable();
                //select first row by default
                table.rows(':eq(0)', { page: 'current' }).select();
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
            "url": apiUrl + "style/getall",
            "dataSrc": "",
            "headers": {
                "Authorization": "Bearer " + token
            }
        },
        "columns": [
            {
                "render": function (data, type, row) {
                    return '<input type="hidden" value="' + row._id + '"/>' + row.title;
                }
            },
            { "data": "isActive", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "flag", "defaultContent": "<span class='text-muted'>Not set</span>" },
            {
                "render": function (data, type, row) {
                    var sMats = '';
                    for(let mat of row.materials) {
                        sMats += '<span class="label label-primary">' + mat.title + '</span>&nbsp;';
                    }
                    return '<h3><span>' + sMats + '</span></h3>';
                }
            },
            {
                "render": function (data, type, row) {
                    var sLeas = '';
                    for(let lea of row.leathers) {
                        sLeas += '<span class="label label-success">' + lea.title + '</span>&nbsp;';
                    }
                    return '<h3><span>' + sLeas + '</span></h3>';
                }
            },
            {
                "render": function (data, type, row) {
                    var sCols = '';
                    for(let col of row.colors) {
                        sCols += '<span class="label label-warning">' + col.title + '</span>&nbsp;';
                    }
                    return '<h3><span>' + sCols + '</span></h3>';
                }
            },
            {
                "render": function (data, type, row) {
                    var sSizs = '';
                    for(let siz of row.sizes) {
                        sSizs += '<span class="label label-danger">' + siz.title + '</span>&nbsp;';
                    }
                    return '<h3><span>' + sSizs + '</span></h3>';
                }
            },

        ],
    });

    //STYLE TABLE ROW click event
    $("#tblStyle tbody").on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            var table = $('#tblStyle').DataTable();
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            selStyleId = $(this).find('input[type=hidden]').eq(0).val();
        }
    });

    $('#tblStyle').on('draw.dt', function () {
        onresize();
    });
}

function configMaterialTable() {
    $("#tblMaterial").on('xhr.dt', function (e, settings, data, xhr) {
        //DataTable AJAX load complete event

        //data will be null is AJAX error
        if (data) {
            $('#tblMaterial').on('draw.dt', function () {
                //DataTable draw complete event
                var table = $("#tblMaterial").DataTable();
                //select first row by default
                table.rows(':eq(0)', { page: 'current' }).select();
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
            "url": apiUrl + "style/material/getall",
            "dataSrc": "",
            "headers": {
                "Authorization": "Bearer " + token
            }
        },
        "columns": [
            {
                "render": function (data, type, row) {
                    return '<input type="hidden" value="' + row._id + '"/>' + row.title;
                }
            },
            { "data": "isActive", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "flag", "defaultContent": "<span class='text-muted'>Not set</span>" }
        ],
    });

    //MATERIAL TABLE ROW click event
    $("#tblMaterial tbody").on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            var table = $('#tblMaterial').DataTable();
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            selMaterialId = $(this).find('input[type=hidden]').eq(0).val();
        }
    });

    $('#tblMaterial').on('draw.dt', function () {
        onresize();
    });
}

function configLeatherTable() {
    $("#tblLeather").on('xhr.dt', function (e, settings, data, xhr) {
        //DataTable AJAX load complete event

        //data will be null is AJAX error
        if (data) {
            $('#tblLeather').on('draw.dt', function () {
                //DataTable draw complete event
                var table = $("#tblLeather").DataTable();
                //select first row by default
                table.rows(':eq(0)', { page: 'current' }).select();
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
            "url": apiUrl + "style/leather/getall",
            "dataSrc": "",
            "headers": {
                "Authorization": "Bearer " + token
            }
        },
        "columns": [
            {
                "render": function (data, type, row) {
                    return '<input type="hidden" value="' + row._id + '"/>' + row.title;
                }
            },
            { "data": "isActive", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "flag", "defaultContent": "<span class='text-muted'>Not set</span>" }
        ],
    });

    //MATERIAL TABLE ROW click event
    $("#tblLeather tbody").on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            var table = $('#tblLeather').DataTable();
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            selLeatherId = $(this).find('input[type=hidden]').eq(0).val();
        }
    });

    $('#tblLeather').on('draw.dt', function () {
        onresize();
    });
}

function configColorTable() {
    $("#tblColor").on('xhr.dt', function (e, settings, data, xhr) {
        //DataTable AJAX load complete event

        //data will be null is AJAX error
        if (data) {
            $('#tblColor').on('draw.dt', function () {
                //DataTable draw complete event
                var table = $("#tblColor").DataTable();
                //select first row by default
                table.rows(':eq(0)', { page: 'current' }).select();
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
            "url": apiUrl + "style/color/getall",
            "dataSrc": "",
            "headers": {
                "Authorization": "Bearer " + token
            }
        },
        "columns": [
            {
                "render": function (data, type, row) {
                    return '<input type="hidden" value="' + row._id + '"/>' + row.title;
                }
            },
            { "data": "isActive", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "flag", "defaultContent": "<span class='text-muted'>Not set</span>" }
        ],
    });

    //COLOR TABLE ROW click event
    $("#tblColor tbody").on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            var table = $('#tblColor').DataTable();
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            selColorId = $(this).find('input[type=hidden]').eq(0).val();
        }
    });

    $('#tblColor').on('draw.dt', function () {
        onresize();
    });
}

function configSizeTable() {
    $("#tblSize").on('xhr.dt', function (e, settings, data, xhr) {
        //DataTable AJAX load complete event

        //data will be null is AJAX error
        if (data) {
            $('#tblSize').on('draw.dt', function () {
                //DataTable draw complete event
                var table = $("#tblSize").DataTable();
                //select first row by default
                table.rows(':eq(0)', { page: 'current' }).select();
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
            "url": apiUrl + "style/size/getall",
            "dataSrc": "",
            "headers": {
                "Authorization": "Bearer " + token
            }
        },
        "columns": [
            {
                "render": function (data, type, row) {
                    return '<input type="hidden" value="' + row._id + '"/>' + row.title;
                }
            },
            { "data": "isActive", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "flag", "defaultContent": "<span class='text-muted'>Not set</span>" }
        ],
    });

    //COLOR TABLE ROW click event
    $("#tblSize tbody").on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            var table = $('#tblSize').DataTable();
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            selColorId = $(this).find('input[type=hidden]').eq(0).val();
        }
    });

    $('#tblSize').on('draw.dt', function () {
        onresize();
    });
}

function addStyleMaterial() {
    var sMaterial = $('#selStyleMaterial option:selected').text();
    var sMatVal = $('#selStyleMaterial option:selected').val();

    if (sMatVal == '0') {
        noty({ text: 'Please select a material.', layout: 'topCenter', type: 'warning', timeout: 2000 });
        return false;
    }

    var l1 = $('#lstStyleMaterial').find('a[id="sm' + sMatVal + '"]');

    if (l1.length > 0 ) {
        noty({ text: 'Material already added.', layout: 'topCenter', type: 'warning', timeout: 2000 });
        return false;
    }

    var item = '<a href="#" id="sm' + sMatVal + '" class="list-group-item">';
    item += '<div class="list-group-status status-online"></div>';
    item += '<span class="contacts-title">' + sMaterial + '</span>';
    item += '<p>' + sMatVal + '</p>';
    item += '<div class="list-group-controls">';
    item += '<button class="btn btn-danger" onclick="deleteStyleMaterial(\'sm' + sMatVal + '\');"><span class="fa fa-trash-o"></span></button>';
    item += '</div></a>';

    $('#lstStyleMaterial').append(item);

    onresize();

}

function deleteStyleMaterial(id) {
    $('#' + id).hide("slide", {}, 500, function () {
        $('#' + id).remove();
    });
}

function addStyleLeather() {
    var sLeather = $('#selStyleLeather option:selected').text();
    var sLthVal = $('#selStyleLeather option:selected').val();

    if (sLthVal == '0') {
        noty({ text: 'Please select a leather.', layout: 'topCenter', type: 'warning', timeout: 2000 });
        return false;
    }

    var l1 = $('#lstStyleLeather').find('a[id="sl' + sLthVal + '"]');

    if (l1.length > 0) {
        noty({ text: 'Leather already added.', layout: 'topCenter', type: 'warning', timeout: 2000 });
        return false;
    }

    var item = '<a href="#" id="sl' + sLthVal + '" class="list-group-item">';
    item += '<div class="list-group-status status-online"></div>';
    item += '<span class="contacts-title">' + sLeather + '</span>';
    item += '<p>' + sLthVal + '</p>';
    item += '<div class="list-group-controls">';
    item += '<button class="btn btn-danger" onclick="deleteStyleLeather(\'sl' + sLthVal + '\');"><span class="fa fa-trash-o"></span></button>';
    item += '</div></a>';

    $('#lstStyleLeather').append(item);

    onresize();
}

function deleteStyleLeather(id) {
    $('#' + id).hide("slide", {}, 500, function () {
        $('#' + id).remove();
    });
}

function addStyleColor() {
    var sColor = $('#selStyleColor option:selected').text();
    var sClrVal = $('#selStyleColor option:selected').val();

    if (sClrVal == '0') {
        noty({ text: 'Please select a color.', layout: 'topCenter', type: 'warning', timeout: 2000 });
        return false;
    }

    var l1 = $('#lstStyleColor').find('a[id="sc' + sClrVal + '"]');

    if (l1.length > 0) {
        noty({ text: 'Color already added.', layout: 'topCenter', type: 'warning', timeout: 2000 });
        return false;
    }

    var item = '<a href="#" id="sc' + sClrVal + '" class="list-group-item">';
    item += '<div class="list-group-status status-online"></div>';
    item += '<span class="contacts-title">' + sColor + '</span>';
    item += '<p>' + sClrVal + '</p>';
    item += '<div class="list-group-controls">';
    item += '<button class="btn btn-danger" onclick="deleteStyleColor(\'sc' + sClrVal + '\');"><span class="fa fa-trash-o"></span></button>';
    item += '</div></a>';

    $('#lstStyleColor').append(item);

    onresize();
}

function deleteStyleColor(id) {
    $('#' + id).hide("slide", {}, 500, function () {
        $('#' + id).remove();
    });
}

function addStyleSize() {
    var sSize = $('#selStyleSize option:selected').text();
    var sSizVal = $('#selStyleSize option:selected').val();

    if (sSizVal == '0') {
        noty({ text: 'Please select a size.', layout: 'topCenter', type: 'warning', timeout: 2000 });
        return false;
    }

    var l1 = $('#lstStyleSize').find('a[id="ss' + sSizVal + '"]');

    if (l1.length > 0) {
        noty({ text: 'Size already added.', layout: 'topCenter', type: 'warning', timeout: 2000 });
        return false;
    }

    var item = '<a href="#" id="ss' + sSizVal + '" class="list-group-item">';
    item += '<div class="list-group-status status-online"></div>';
    item += '<span class="contacts-title">' + sSize + '</span>';
    item += '<p>' + sSizVal + '</p>';
    item += '<div class="list-group-controls">';
    item += '<button class="btn btn-danger" onclick="deleteStyleSize(\'ss' + sSizVal + '\');"><span class="fa fa-trash-o"></span></button>';
    item += '</div></a>';

    $('#lstStyleSize').append(item);

    onresize();
}

function deleteStyleSize(id) {
    $('#' + id).hide("slide", {}, 500, function () {
        $('#' + id).remove();
    });
}

function clearEditPanel(panel) {

    if (panel == 'style') {

        $("#txtStyleTitle").val('');

        $('#lstStyleMaterial').html('');
        $('#lstStyleLeather').html('');
        $('#lstStyleColor').html('');
        $('#lstStyleSize').html('');

    }
    else if (panel == 'material') {

        $("#txtMaterialTitle").val('');

    }
    else if (panel == 'leather') {

        $("#txtLeatherTitle").val('');

    }
    else if (panel == 'color') {

        $("#txtColorTitle").val('');

    }
    else if (panel == 'size') {

        $("#txtSizeTitle").val('');

    }
}
