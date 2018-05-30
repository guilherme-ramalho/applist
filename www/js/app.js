var app = {

    loadBar: function () {
        $('#navbar').load('./views/navbar.html');
    },

    loadItemList: function () {
        let itemList = localStorage.itemList;

        //Creates the list item element if It is defined
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
                                <b class="medium-text">Criado:</b>\
                                <span class="medium-text">'+item.createdAt+'</span>\
                            </div>\
                        </div>\
                    </p>\
                </li>';
            });

            $('#itemList').show().html(str);
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
        let item = $('#itemForm').serializeArray();
        item = this.objectfyForm(item);

        this.storeItem(item);
    },

    selectListener: function () {
        $('#tipo').change(function() {
            let tipo = $('#tipo').val();

            let inputs = $('#itemForm>div.row>div.input-field');

            inputs.each(function() {
                $(this).show();
            });

            switch (tipo) {
                //Impressora, A. Telefônico, Monitor
                case '3':
                case '4':
                case '5':
                    $('#serialHd').closest('div').hide();
                    break;
                //Teclado, Leitor Cód. Barras
                case '6':
                case '8':
                    $('#serialHd').closest('div').hide();
                    $('#modeloPn').closest('div').hide();
                    break;
                //Mouse
                case '7':
                    $('#serialHd').closest('div').hide();
                    $('#modeloPn').closest('div').hide();
                    $('#serial').closest('div').hide();
                    break;
                default:
                    //do somethin'
            }
        });
    },

    toast: function (msg) {
        Materialize.toast(msg, 4000);
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
        let currentDateTime = moment().locale('pt-br').format('DD/MM/YYYY H:mm');

        item.createdAt = currentDateTime

        if (typeof itemList == 'undefined') {//Local storage isn't defined yet
            let itemObj = [item];

            localStorage.setItem('itemList', JSON.stringify(itemObj));
        } else {//Pushes the item into an existing storage list
            itemList = JSON.parse(itemList);
            console.log(itemList);
            itemList.push(item);
            itemList = JSON.stringify(itemList);
            localStorage.itemList = itemList;
        }

        location.reload();
    }
}