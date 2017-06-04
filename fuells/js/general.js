
// FILL COMBOBOX
function fillCombo(combo, data) {

    var items = '<option value="0">--select--</option>';

    for (var i = 0; i < data.length; i++) {
        items += '<option value="' + data[i]._id + '">' + data[i].title + '</option>';
    }

    $(combo).html(items);
    $(combo).selectpicker('refresh');
}

// CLEAR A COMBOBOX 
function clearCombo(combo) {

    var items = '<option value="0">--select--</option>';
    $(combo).html(items);
    $(combo).selectpicker('refresh');

}