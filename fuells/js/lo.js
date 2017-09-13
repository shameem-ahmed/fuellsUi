function doLeatherOrder(crPage) {

    $("#divUpdate").hide();


    //Fill suppliers
    fuLib.supplier.getAll().success(function (data, status, xhr) {
        fillComboName('#selSupplier', data);
    }).error(function (xhr, status, error) {
        handleError('supplier.getAll', xhr, status, error);
    });
    //Fill PurchaseOrder
    fuLib.supplier.getAll().success(function (data, status, xhr) {
        fillComboName('#selPurchaseOrder', data);
    }).error(function (xhr, status, error) {
        handleError('supplier.getAll', xhr, status, error);
    });

    //BTN PO NEW click event
    $("#btnLONew").click(function () {

        poModeUpdate = 'new';

        $(".x-navigation-minimize").trigger("click");

        poClearEditPanel();

        $("#divList").hide();

        $("#divUpdate").show();

    });

    //NEW PO-SAVE CHANGES click event
    $("#btnLONewSave, #btnPONewSave2").click(function () {

        var isEmptyPO = false;

        var oPO = {
            customer: $("#selCustomer").val(),
            invoiceNo: $("#txtInvoiceNo").val(),
            qty: $("#txtQty").val(),
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

        $("#tblPoStyle").find("tr").each(function () {

            var nCols = $(this).find("td");

            console.log(nCols.length);


            //var oPoStyle = {
            //    style: oStyle,
            //    qty: nQty
            //};

        });

        return false;


        //check if oSupplier is empty
        if (oSupplier.code.trim().length == 0 &&
            oSupplier.name.trim().length == 0
            ) {
            isEmptySupplier = true;
        }

        if (supModeUpdate == 'new') {

            if (isEmptySupplier == true) {
                noty({ text: "Please type supplier details", layout: 'topRight', type: 'error', timeout: 2000 });
                return false;
            }
            else {

                fuLib.supplier.add(oSupplier).success(function (data, status, xhr) {

                    console.log(data);

                    noty({ text: 'Supplier added successfully.', layout: 'topRight', type: 'success', timeout: 2000 });

                    var table = $("#tblSupplier").DataTable();
                    table.ajax.reload();

                }).error(function (xhr, status, error) {
                    //supplier.add failed
                    handleError('supplier.add', xhr, status, error);
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

    //NEW PO-Cancel click event
    $("#btnLONewCancel, #btnLONewCancel2").click(function () {

        $("#divUpdate").hide();

        $("#divList").show();

        $("#divTable").removeClass("col-md-8").addClass("col-md-12");

        $(".x-navigation-minimize").trigger("click");

    });
}