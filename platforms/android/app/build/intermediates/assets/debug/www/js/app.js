var app = {

    loadBar: function () {
        $('#navbar').load('./views/navbar.html');
    },

    loadItemList: function () {
        let itemList = localStorage.itemList;

        if (typeof itemList != 'undefined') {
            let str = '';
            itemList = JSON.parse(itemList);

            $.each(itemList, function (key, item) {
                console.log(item);
                str +=
                '<li id="aposta236015" class="collection-item">\
                    <p>\
                        <div class="sol s12">\
                            <b class="medium-text">Tipo:</b>\
                            <span class="medium-text">'+item.tipo+'</span>\
                            <div class="right">\
                                <b class="medium-text">Valor:</b>\
                                <span class="medium-text">...</span>\
                            </div>\
                        </div>\
                    </p>\
                </li>';
            });

            $('#itemList').removeAttr('hidden').html(str);
        } else {
            $('#content').html('<p>Nenhum item cadastrado. Clique no botão "+" para cadastrar um novo item.</p>');
        }
    },

    openModal: function () {
        $('#itemForm').trigger('reset');

        $('#addItemModal').modal();
        $('#addItemModal').modal('open');
    },

    closeModal: function () {
        $('#addItemModal').modal();
        $('#addItemModal').modal('close');
    },

    saveItem: function () {
        if ($('#nome').val() == '') {
            this.toast('Por favor, informe o nome para salvar o item.');

            return false;
        }

        let item = $('#itemForm').serializeArray();
        item = this.objectfyForm(item);

        this.storeItem(item);
    },

    toast: function (msg) {
        Materialize.toast(msg, 4000)
    },

    objectfyForm: function (formArray) {
        let returnArray = {};

        for (let i = 0; i < formArray.length; i++) {
            returnArray[formArray[i]['name']] = formArray[i]['value'];
        }

        return returnArray;
    },

    storeItem: function (item) {
        let itemList = localStorage.itemList;

        if (typeof itemList == 'undefined') {
            let itemObj = [item];

            localStorage.setItem('itemList', JSON.stringify(itemObj));
        } else {
            itemList = JSON.parse(itemList);
            console.log(itemList);
            itemList.push(item);
            itemList = JSON.stringify(itemList);
            localStorage.itemList = itemList;
        }

        location.reload();
    }
}