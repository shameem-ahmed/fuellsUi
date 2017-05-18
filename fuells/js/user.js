function doUser(crPage) {
    if (crPage == 'liPageUser') {

        $("#divAccess").hide();

        $("#tblUser").DataTable({
            "ajax": {
                "url": apiUrl + "user/getall",
                "dataSrc": "",
                "headers": {
                    "Authorization": "Bearer " + token
                }
            },
            "columns": [
                {
                    "data": "person.photo",
                    "orderSequence": [],
                    "render": function (data, type, row) {
                        if (data == undefined) {
                            return ('<img class="imgSmall" src="../assets/images/users/no-image.jpg"/>');
                        }
                        else {
                            return ('<img class="imgSmall" id="profileImg1" src="../assets/images/users/' + data + '"/>');
                        }
                    }
                },
                {
                    "data": "flag",
                    "orderSequence": [],
                    "render": function (data, type, row) {
                        if (data == 0) {
                            return '<i style="color:silver;" class="fa fa-flag-o"></i>';
                        }
                        else if (data == 1) {
                            return '<i style="color:red;" class="fa fa-flag"></i> ';
                        }
                        else if (data == 2) {
                            return '<i style="color:blue;" class="fa fa-flag"></i> ';
                        }
                        else if (data == 3) {
                            return '<i style="color:green;" class="fa fa-flag"></i> ';
                        }
                        else {
                            return '<i style="color:silver;" class="fa fa-flag-o"></i>';
                        }
                    }
                },
                { "data": "name" },
                { "data": "person.name", "defaultContent": "<span class='text-muted'>Not set</span>" },
                { "data": "person.email", "defaultContent": "<span class='text-muted'>Not set</span>" },
                { "data": "person.phone", "defaultContent": "<span class='text-muted'>Not set</span>" },
                {
                    "data": "isAdmin",
                    "orderSequence": [],
                    "render": function (data, type, row) {
                        if (isAdmin) {
                            //if login user is admin
                            if (data == false) {
                                //if the row user is NOT admin
                                return '<button type="button" onclick="showAccess(\'' + row._id + '\');" class="btn btn-info btn-xs">Change</button>';
                            }
                            else {
                                return '';
                            }
                        }
                        else {
                            return '';
                        }
                    }
                }
            ]
        });

        $("#btnAccessSave").click(function () {

            var rows = $("tr", $("#tbodyAccess"));

            var aAccess = [];

            $(rows).each(function () {

                var acsCode = $(this).find("input[type=hidden]").eq(1).val();

                var acsAccess = "";

                $(this).find("input[type=checkbox]").each(function () {

                    if ($(this).prop("checked") == true) {
                        acsAccess = acsAccess + '1';
                    }
                    else {
                        acsAccess = acsAccess + '0';
                    }
                });

                aAccess.push({ id: acsCode, accessCode: acsAccess  });

            });

            console.log(aAccess);

            fuLib.access.updateMulti(aAccess).success(function (data, status, xhr) {

                console.log(data);

                noty({ text: data, layout: 'topRight', type: 'error' });


            }).error(function (xhr, status, error) {
                //access.updateMulti failed
                handleError(xhr, status, error);
            });

            $("#divAccess").hide(500);
            $("#divList").show(500);
        });

        $("#btnAccessCancel").click(function () {


            $("#divAccess").hide(500);
            $("#divList").show(500);
        });

        $("#btnAccessReset").click(function () {

            showAccess($("#hidSelUser").val());

            //$("#divAccess").hide(500);
            //$("#divList").show(500);
        });
    }
}

function showAccess(userId) {

    $("#hidSelUser").val(userId);

    fuLib.user.getOne(userId).success(function (data, status, xhr) {

        if (data.person) {
            $("#acsUserImage").attr("src", "../assets/images/users/" + data.person.photo);
            $("#acsUserName").text(data.person.name);
            $("#acsUserPhone").text(data.person.phone);
            $("#acsUserEmail").text(data.person.email);
        }
        else {
            $("#acsUserImage").attr("src", "../assets/images/users/no-image.jpg");
            $("#acsUserName").text(data.name);
            $("#acsUserPhone").html("<span class='text-muted'>No Phone</span>");
            $("#acsUserEmail").html("<span class='text-muted'>No Email</span>");
        }

        fuLib.access.getAccess(userId).success(function (data, status, xhr) {

            data = data.sort(function (a, b) {
                return a.pageIndex - b.pageIndex;
            });

            $("#tbodyAccess > tr").remove();

            $(data).each(function (i, item) {

                var sRow = '<tr><td><span onclick="selectAllOptions(' + i + ');">{0}</span><input type="hidden" value="' + item.pageCode + '" /><input type="hidden" value="' + item.id + '" /></td>';
                sRow += '<td><label class="switch switch-small"><input type="checkbox" {1} value="{2}" /><span></span></label></td>';
                sRow += '<td><label class="switch switch-small"><input type="checkbox" {3} value="{4}" /><span></span></label></td>';
                sRow += '<td><label class="switch switch-small"><input type="checkbox" {5} value="{6}" /><span></span></label></td>';
                sRow += '<td><label class="switch switch-small"><input type="checkbox" {7} value="{8}" /><span></span></label></td>';
                sRow += '<td><label class="switch switch-small"><input type="checkbox" {9} value="{10}" /><span></span></label></td>';
                sRow += '<td><label class="switch switch-small"><input type="checkbox" {11} value="{12}" /><span></span></label></td>';
                sRow += '<td><label class="switch switch-small"><input type="checkbox" {13} value="{14}" /><span></span></label></td>';
                sRow += '<td><label class="switch switch-small"><input type="checkbox" {15} value="{16}" /><span></span></label></td>';
                sRow += '<td><label class="switch switch-small"><input type="checkbox" {17} value="{18}" /><span></span></label></td></tr>';

                sRow = sRow.replace("{0}", item.pageTitle);
                sRow = sRow.replace("{1}", (item.isView ? 'checked' : ''));
                sRow = sRow.replace("{2}", (item.isView ? '1' : '0'));
                sRow = sRow.replace("{3}", (item.isPrint ? 'checked' : ''));
                sRow = sRow.replace("{4}", (item.isPrint ? '1' : '0'));
                sRow = sRow.replace("{5}", (item.isFilter ? 'checked' : ''));
                sRow = sRow.replace("{6}", (item.isFilter ? '1' : '0'));
                sRow = sRow.replace("{7}", (item.isAdd ? 'checked' : ''));
                sRow = sRow.replace("{8}", (item.isAdd ? '1' : '0'));
                sRow = sRow.replace("{9}", (item.isEdit ? 'checked' : ''));
                sRow = sRow.replace("{10}", (item.isEdit ? '1' : '0'));
                sRow = sRow.replace("{11}", (item.isDelete ? 'checked' : ''));
                sRow = sRow.replace("{12}", (item.isDelete ? '1' : '0'));
                sRow = sRow.replace("{13}", (item.isCompare ? 'checked' : ''));
                sRow = sRow.replace("{14}", (item.isCompare ? '1' : '0'));
                sRow = sRow.replace("{15}", (item.isReset ? 'checked' : ''));
                sRow = sRow.replace("{16}", (item.isReset ? '1' : '0'));
                sRow = sRow.replace("{17}", (item.isSubmit ? 'checked' : ''));
                sRow = sRow.replace("{18}", (item.isSubmit ? '1' : '0'));

                $("#tbodyAccess").append(sRow);

            });

        }).error(function (xhr, status, error) {
            //access.getAccess failed
            handleError(xhr, status, error);
        });

    }).error(function (xhr, status, error) {
        //user.getSingle failed
        handleError(xhr, status, error);
    });

    $("#divAccess").show(500);
    $("#divList").hide(500);
}

var toggleRow = true;

function selectAllOptions(index) {

    var rows = $("tr", $("#tbodyAccess"));

    rows.eq(index).find("input[type=checkbox]").each(function () {
        $(this).prop("checked", toggleRow);
    });

    toggleRow = !toggleRow;
}