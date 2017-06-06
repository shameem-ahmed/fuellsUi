//CALLED FROM _LAYOUT2
function doCustomer(crPage) {
    
    var crTab = 0;
    var modeUpdate = 'new';
    var selId = '';
    var selAdmin = false;
   
    $("#divAccess").hide();
    $("#divUpdate").hide();

    $("#divTable").removeClass("col-md-8").addClass("col-md-12");

    //Configure DataTable
    $("#tblCustomer").DataTable({
        "autoWidth": false,
        "ajax": {
            "url": apiUrl + "customer/getall",
            "dataSrc": "",
            "headers": {
                "Authorization": "Bearer " + token
            }
        },
        "columns": [
            { "data": "name", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "code", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "urlWeb", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "email", "defaultContent": "<span class='text-muted'>Not set</span>" },
            { "data": "phone", "defaultContent": "<span class='text-muted'>Not set</span>" }
        ]
    });

    //fill COUNTRIES
    fuLib.gloc.getCountries().success(function (data, status, xhr) {
        fillGeoLoc('#selCountry', data);

    }).error(function (xhr, status, error) {
        //gloc.getCountries failed
        handleError('gloc.getCountries', xhr, status, error);
    });

    //fill PERSON GOVT CODES
    fuLib.lov.getLovPersonGovtCodes().success(function (data, status, xhr) {
        fillLov('#selGovtCode', data);

    }).error(function (xhr, status, error) {
        //lov.getLovPersonGovtCodes failed
        handleError('lov.getLovPersonGovtCodes', xhr, status, error);
    });

    //ADDRESS COUNTRY dropdown change event
    $('#selCountry').change(function (e) {
        var parent = $('#selCountry').val();

        clearCombo($("#selState"));
        clearCombo($("#selCity"));
        clearCombo($("#selArea"));

        if (parent != '0') {
            fuLib.gloc.getStates(parent).success(function (data, status, xhr) {
                //fill STATES
                fillGeoLoc('#selState', data);

            }).error(function (xhr, status, error) {
                //gloc.getStates failed
                handleError('gloc.getStates', xhr, status, error);
            });
        }
    });

    //ADDRESS STATE dropdown change event
    $('#selState').change(function (e) {
        var parent = $('#selState').val();

        clearCombo($("#selCity"));
        clearCombo($("#selArea"));

        if (parent != '0') {
            fuLib.gloc.getCities(parent).success(function (data, status, xhr) {
                //fill CITIES
                fillGeoLoc('#selCity', data);

            }).error(function (xhr, status, error) {
                //gloc.getCities failed
                handleError('gloc.getCities', xhr, status, error);
            });
        }
    });

    //ADDRESS CITY dropdown change event
    $('#selCity').change(function (e) {
        var parent = $('#selCity').val();

        clearCombo($("#selArea"));

        if (parent != '0') {
            fuLib.gloc.getAreas(parent).success(function (data, status, xhr) {
                //fill AREAS
                fillGeoLoc('#selArea', data);

            }).error(function (xhr, status, error) {
                //gloc.getAreas failed
                handleError('gloc.getAreas', xhr, status, error);
            });
        }
    });

    $('#tblCustomer').on('draw.dt', function () {
        onresize();
    });

    //TABLE ROW click event
    $("#tblCustomer tbody").on('click', 'tr', function () {

        //console.log($(this));

        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            var table = $('#tblCustomer').DataTable();
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');

            selId = $(this).find('input[type=hidden]').eq(0).val();
            selAdmin = $(this).find('input[type=hidden]').eq(1).val();

            $("#btnCustomerAccess").prop('disabled', selAdmin == "true");


        }
    });

    //chkAdmin check event
    $('#chkAdmin').on('ifChecked', function (event) {
        $('#chkAdminText').text("Yes");
    });

    //chkAdmin un-check event
    $('#chkAdmin').on('ifUnchecked', function (event) {
        $('#chkAdminText').text("No");
    });

    //BTN Customer NEW click event
    $("#btnCustNew").click(function () {
        modeUpdate = 'new';

        clearEditPanel();

        $("#divEditCustomer").show();
        $("#divEditCode").hide();
        $("#divEditOffice").hide();
        $("#divEditPerson").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //BTN CODE NEW click event
    $("#btnCodeNew").click(function () {
        modeUpdate = 'new';

        clearEditPanel();

        $("#divEditCustomer").hide();
        $("#divEditCode").show();
        $("#divEditOffice").hide();
        $("#divEditPerson").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //BTN OFFICE NEW click event
    $("#btnOffNew").click(function () {
        modeUpdate = 'new';

        clearEditPanel();

        $("#divEditCustomer").hide();
        $("#divEditCode").hide();
        $("#divEditOffice").show();
        $("#divEditPerson").hide();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //BTN PERSON NEW click event
    $("#btnPersonNew").click(function () {
        modeUpdate = 'new';

        clearEditPanel();

        $("#divEditCustomer").hide();
        $("#divEditCode").hide();
        $("#divEditOffice").hide();
        $("#divEditPerson").show();

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //BTN Customer EDIT click event
    $("#btnCustomerEdit").click(function () {
        modeUpdate = 'edit';

        clearEditPanel();

        //load Customer details
        fuLib.Customer.getOne(selId).success(function (Customer, status, xhr) {

            console.log(Customer);

            $("#txtLogin").val(Customer.name);
            $("#txtPwd1").val('');
            $("#txtPwd2").val('');

            if (Customer.isAdmin == true) {
                $("#chkAdmin").iCheck('check');
            }
            else {
                $("#chkAdmin").iCheck('uncheck');
            }

            if (Customer.person != null) {

                $("#txtName").val(Customer.person.name);
                $("#txtEmail").val(Customer.person.email);
                $("#txtPhone").val(Customer.person.phone);
                $("#txtFacebook").val(Customer.person.facebook);
                $("#txtTwitter").val(Customer.person.twitter);
                $("#txtSkype").val(Customer.person.skype);

                $("#selGovtCode option[value='" + Customer.person.lovGovtNo + "']").prop("selected", true);
                $("#selGovtCode").selectpicker('refresh');


                $("#txtGovtCode").val(Customer.person.govtNo);
                $("#txtDateBirth").val('');
                $("#txtDateAnniversary").val('');
                $("input[name=iradioMStatus]:checked", "#frmPerson").val('0');
                $("input[name=iradioGender]:checked", "#frmPerson").val('0');

                if (Customer.person.address != null) {
                    $("#txtAddress1").val(Customer.person.address.address1);
                    $("#txtAddress2").val(Customer.person.address.address2);

                    alert(Customer.person.address.geoLoc);

                    fuLib.gloc.getLoc(Customer.person.address.geoLoc).success(function (data, status, xhr) {

                        if (data.type == 0) {
                            //if loc is country
                            //==================
                            //fill COUNTRIES
                            fuLib.gloc.getCountries().success(function (data2, status, xhr) {

                                //debugger
                                console.log(data2);

                                alert(Customer.person.address.geoLoc);

                                fillGeoLoc('#selCountry', data2);

                                $("#selCountry").val(Customer.person.address.geoLoc);
                                $($("#selCountry")).selectpicker('refresh');

                            }).error(function (xhr, status, error) {
                                //gloc.getCountries failed
                                handleError('gloc.getCountries', xhr, status, error);
                            });

                        }
                        else if (data.type == 1) {
                            //if loc is state
                            //==================
                            //fill COUNTRIES
                            fuLib.gloc.getCountries().success(function (data3, status, xhr) {
                                fillGeoLoc('#selCountry', data3);

                                $("#selCountry").val(data.parent);
                                $($("#selCountry")).selectpicker('refresh');

                                //fill STATES
                                fuLib.gloc.getStates(data.parent).success(function (data4, status, xhr) {
                                    fillGeoLoc('#selState', data4);

                                    $("#selState").val(Customer.person.address.geoLoc);
                                    $($("#selState")).selectpicker('refresh');

                                }).error(function (xhr, status, error) {
                                    //gloc.getStates failed
                                    handleError('gloc.getStates', xhr, status, error);
                                });

                            }).error(function (xhr, status, error) {
                                //gloc.getCountries failed
                                handleError('gloc.getCountries', xhr, status, error);
                            });

                        }
                        else if (data.type == 2) {
                            //if loc is city
                            //==================
                            //fill CITIES
                            fuLib.gloc.getCities(data.parent).success(function (data5, status, xhr) {
                                fillGeoLoc('#selCity', data5);

                                $("#selCity").val(Customer.person.address.geoLoc);
                                $($("#selCity")).selectpicker('refresh');

                                //find STATE loc
                                fuLib.gloc.getLoc(data.parent).success(function (data6, status, xhr) {

                                    //fill STATES
                                    fuLib.gloc.getStates(data6.parent).success(function (data7, status, xhr) {
                                        fillGeoLoc('#selState', data7);

                                        $("#selState").val(data6._id);
                                        $($("#selState")).selectpicker('refresh');

                                        //fill COUNTRIES
                                        fuLib.gloc.getCountries().success(function (data2, status, xhr) {
                                            fillGeoLoc('#selCountry', data2);

                                            $("#selCountry").val(data6.parent);
                                            $($("#selCountry")).selectpicker('refresh');

                                        }).error(function (xhr, status, error) {
                                            //gloc.getCountries failed
                                            handleError('gloc.getCountries', xhr, status, error);
                                        });

                                    }).error(function (xhr, status, error) {
                                        //gloc.getStates failed
                                        handleError('gloc.getStates', xhr, status, error);
                                    });

                                });

                            }).error(function (xhr, status, error) {
                                //gloc.getStates failed
                                handleError('gloc.getStates', xhr, status, error);
                            });
                        }
                        else if (data.type == 3) {
                            //if loc is area
                            //==================
                            //fill AREAS
                            fuLib.gloc.getAreas(data.parent).success(function (data8, status, xhr) {
                                fillGeoLoc('#selArea', data8);

                                $("#selArea").val(Customer.person.address.geoLoc);
                                $($("#selArea")).selectpicker('refresh');

                                //find CITY loc
                                fuLib.gloc.getLoc(data.parent).success(function (data9, status, xhr) {

                                    //fill CITIES
                                    fuLib.gloc.getCities(data9.parent).success(function (data10, status, xhr) {
                                        fillGeoLoc('#selCity', data10);

                                        $("#selCity").val(data9._id);
                                        $($("#selCity")).selectpicker('refresh');

                                        //find STATE loc
                                        fuLib.gloc.getLoc(data9.parent).success(function (data11, status, xhr) {

                                            //fill STATES
                                            fuLib.gloc.getStates(data11.parent).success(function (data12, status, xhr) {
                                                fillGeoLoc('#selState', data12);

                                                $("#selState").val(data11._id);
                                                $($("#selState")).selectpicker('refresh');

                                                //fill COUNTRIES
                                                fuLib.gloc.getCountries().success(function (data13, status, xhr) {
                                                    fillGeoLoc('#selCountry', data13);

                                                    $("#selCountry").val(data11.parent);
                                                    $($("#selCountry")).selectpicker('refresh');

                                                }).error(function (xhr, status, error) {
                                                    //gloc.getCountries failed
                                                    handleError('gloc.getCountries', xhr, status, error);
                                                });

                                            }).error(function (xhr, status, error) {
                                                //gloc.getStates failed
                                                handleError('gloc.getStates', xhr, status, error);
                                            });
                                        });
                                    }).error(function (xhr, status, error) {
                                        //gloc.getStates failed
                                        handleError('gloc.getStates', xhr, status, error);
                                    });
                                });
                            }).error(function (xhr, status, error) {
                                //gloc.getStates failed
                                handleError('gloc.getStates', xhr, status, error);
                            });
                        }
                    }).error(function (xhr, status, error) {
                        //gloc.getLoc failed
                        handleError('gloc.getLoc', xhr, status, error);
                    });
                }
            }

        }).error(function (xhr, status, error) {
            //Customer.getOne failed
            handleError('Customer.getOne', xhr, status, error);
        });

        $("#divTable").removeClass("col-md-12").addClass("col-md-8");
        $("#divUpdate").show();

    });

    //BTN Customer ACCESS click event
    $("#btnCustomerAccess").click(function () {
        showAccess(selId);
    });

    //NEW Customer-SAVE CHANGES click event
    $("#btnCustomerUpdateSave").click(function () {

        var isEmptyCustomer = false;
        var isEmptyPerson = false;
        var isEmptyAddress = false;

        var oCustomer = {
            name: $("#txtLogin").val(),
            pwd: $("#txtPwd1").val(),
            person: null,
            dateExpiry: '31-Dec-2050',
            isActive: true,
            flag: 0,
            isAdmin: $("#chkAdmin").prop('checked'),
        };

        var oPerson = {
            name: $("#txtName").val(),
            email: $("#txtEmail").val(),
            phone: $("#txtPhone").val(),
            facebook: $("#txtFacebook").val(),
            twitter: $("#txtTwitter").val(),
            skype: $("#txtSkype").val(),
            address: null,
            lovGovtNo: $("#selGovtCode").val(),
            govtNo: $("#txtGovtCode").val(),
            photo: '',
            dateBirth: $("#txtDateBirth").val(),
            dateAnniversary: $("#txtDateAnniversary").val(),
            maritalStatus: $("input[name=iradioMStatus]:checked", "#frmPerson").val(),
            gender: $("input[name=iradioGender]:checked", "#frmPerson").val(),
            isActive: true,
            flag: 0
        };

        var oAddress = {
            address1: $("#txtAddress1").val(),
            address2: $("#txtAddress2").val(),
            geoLoc: null,
            isActive: true,
            flag: 0
        };

        if ($("#selArea").val() == '0' || $("#selArea").val() == null) {

            if ($("#selCity").val() == '0' || $("#selCity").val() == null) {

                if ($("#selState").val() == '0' || $("#selState").val() == null) {

                    if ($("#selCountry").val() == '0' || $("#selCountry").val() == null) {

                    }
                    else {
                        oAddress.geoLoc = $("#selCountry").val();
                    }
                }
                else {
                    oAddress.geoLoc = $("#selState").val();
                }
            }
            else {
                oAddress.geoLoc = $("#selCity").val();
            }
        }
        else {
            oAddress.geoLoc = $("#selArea").val();
        }

        //console.log(oCustomer);
        //console.log(oPerson);
        //console.log(oAddress);

        //return false;

        //check if oCustomer is empty
        if (oCustomer.name.trim().length == 0 &&
            oCustomer.pwd.trim().length == 0
            ) {
            isEmptyCustomer = true;
        }

        //check if oPerson is empty
        if (oPerson.name.trim().length == 0 &&
            oPerson.email.trim().length == 0 &&
            oPerson.phone.trim().length == 0 &&
            oPerson.facebook.trim().length == 0 &&
            oPerson.twitter.trim().length == 0 &&
            oPerson.skype.trim().length == 0 &&
            oPerson.govtNo.trim().length == 0 &&
            oPerson.dateBirth.trim().length == 0 &&
            oPerson.dateAnniversary.trim().length == 0
            ) {
            isEmptyPerson = true;
        }

        //check if oAddress is empty
        if (oAddress.address1.trim().length == 0 &&
            oAddress.address2.trim().length == 0 &&
            (oAddress.country == '0' || oAddress.country == null) &&
            (oAddress.state == '0' || oAddress.state == null) &&
            (oAddress.city == '0' || oAddress.city == null) &&
            (oAddress.area == '0' || oAddress.area == null) 
            ) {
            isEmptyAddress = true;
        }

        console.log(isEmptyCustomer);
        console.log(isEmptyPerson);
        console.log(isEmptyAddress);

        //return false;

        if (modeUpdate == 'new') {

            if (isEmptyCustomer == true) {
                    noty({ text: "Please type Customer details", layout: 'topRight', type: 'error', timeout: 2000 });
                    return false;
            }
            else {
                if (isEmptyPerson == true) {
                    //save Customer details

                    fuLib.Customer.add(oCustomer).success(function (data, status, xhr) {

                        console.log(data);

                        noty({ text: 'Customer added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                        var table = $("#tblCustomer").DataTable();
                        table.ajax.reload();

                    }).error(function (xhr, status, error) {
                        //Customer.add failed
                        handleError('Customer.add', xhr, status, error);
                    });
                }
                else {
                    if (isEmptyAddress == true) {
                        //save Customer-PERSON details

                        //check if govtNo is blank
                        if (oPerson.govtNo.trim().length == 0) {
                            oPerson.lovGovtNo = null;
                        }
                        else {
                            if (oPerson.lovGovtNo == '0') {
                                noty({ text: "Please select type of govt code", layout: 'topRight', type: 'error', timeout: 2000 });
                                return false;
                            }
                        }

                        //add PERSON
                        fuLib.person.add(oPerson).success(function (data, status, xhr) {

                            noty({ text: 'Person added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                            oCustomer.person = data.person._id;

                            //add Customer
                            fuLib.Customer.add(oCustomer).success(function (data, status, xhr) {

                                noty({ text: 'Customer added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                                var table = $("#tblCustomer").DataTable();
                                table.ajax.reload();

                            }).error(function (xhr, status, error) {
                                //Customer.add failed
                                handleError('Customer.add', xhr, status, error);
                            });

                        }).error(function (xhr, status, error) {
                            //person.add failed
                            handleError('person.add', xhr, status, error);
                        });
                    }
                    else {
                        //save Customer-PERSON-ADDRESS details

                        //add ADDRESS
                        fuLib.address.add(oAddress).success(function (data, status, xhr) {

                            noty({ text: 'Address added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                            oPerson.address = data.address._id;

                            //add PERSON
                            fuLib.person.add(oPerson).success(function (data, status, xhr) {

                                noty({ text: 'Person added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                                oCustomer.person = data.person._id;

                                //add Customer
                                fuLib.Customer.add(oCustomer).success(function (data, status, xhr) {

                                    noty({ text: 'Customer added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                                    var table = $("#tblCustomer").DataTable();
                                    table.ajax.reload();

                                }).error(function (xhr, status, error) {
                                    //address.add failed
                                    handleError('address.add', xhr, status, error);
                                });

                            }).error(function (xhr, status, error) {
                                //person.add failed
                                handleError('person.add', xhr, status, error);
                            });

                        }).error(function (xhr, status, error) {
                            //Customer.add failed
                            handleError('Customer.add', xhr, status, error);
                        });
                    }
                }
            }

            $("#divUpdate").hide();
            $("#divTable").removeClass("col-md-8").addClass("col-md-12");

            return false;

        }
        else if (modeUpdate == 'edit') {

        }
       
        return false;

    });

    //NEW Customer-Cancel click event
    $("#btnCustomerUpdateCancel").click(function () {
     
        $("#divUpdate").hide();
        $("#divTable").removeClass("col-md-8").addClass("col-md-12");
        return false;

    });

    //BTN ACCESS SAVE click event
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

            aAccess.push({ id: acsCode, accessCode: acsAccess });

        });

        console.log(aAccess);

        fuLib.access.updateMulti(aAccess).success(function (data, status, xhr) {

            console.log(data);

            noty({ text: data.message, layout: 'topRight', type: 'success', timeout: 2000 });


        }).error(function (xhr, status, error) {
            //access.updateMulti failed
            handleError('access.updateMulti', xhr, status, error);
        });

        $("#divAccess").hide(500);
        $("#divList").show(500);
    });

    //BTN ACCESS CANCEL click event
    $("#btnAccessCancel").click(function () {
        $("#divAccess").hide(500);
        $("#divList").show(500);
    });

    //BTN ACCESS RESET click event
    $("#btnAccessReset").click(function () {
        showAccess($("#hidSelCustomer").val());
    });

    //Customer TAB click event
    $("#tabCustomer").click(function () {
        crTab = 0;
    });

    //PERSON TAB click event
    $("#tabPerson").click(function () {
        crTab = 1;
    });

    //ADDRESS TAB click event
    $("#tabAddress").click(function () {
        crTab = 2;
    });

}
