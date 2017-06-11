
// FILL COMBOBOX
function fillCombo(combo, data) {

    var items = '<option value="0">--select--</option>';

    for (var i = 0; i < data.length; i++) {
        items += '<option value="' + data[i]._id + '">' + data[i].title + '</option>';
    }

    $(combo).html(items);
    $(combo).selectpicker('refresh');
}

// FILL COMBOBOX
function fillUl(ul, data) {

    var items = '';

    for (var i = 0; i < data.length; i++) {
        items += '<li><a href="javascript:changeUlTitle(\'' + ul + '\', \'' + data[i]._id + '\', \'' + data[i].title + '\');">' + data[i].title + '</a></li>';
    }

    $(ul).html(items);

    if (data.length > 0) {
        changeUlTitle(ul, data[0]._id, data[0].title);
    }
}

// CLEAR A COMBOBOX 
function clearCombo(combo) {

    var items = '<option value="0">--select--</option>';
    $(combo).html(items);
    $(combo).selectpicker('refresh');

}

function changeUlTitle(ul, lovId, lovTitle) {
    $(ul + 'Span').text(lovTitle + ' ');
    $(ul + 'Id').val(lovId);
}