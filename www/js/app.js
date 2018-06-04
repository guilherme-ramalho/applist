var app = {
    loadBar: function () {
        $('#navbar').load('./views/navbar.html');
    },

    loadItemList: function () {
        let itemList = localStorage.itemList;
        let content = $('#content');

        content.empty();

        //Creates the list item element if It is defined
        if (typeof itemList != 'undefined') {
            let str = '';
            let strTable = '';
            itemList = JSON.parse(itemList);

            content.html('<ul id="itemList" class="collection"></ul>');

            $.each(itemList, function (key, item) {
                if (item.transmitido == 0) {
                    console.log(item);
                    str +=
                        '<li id="item' + key + '" class="collection-item">\
                        <p>\
                            <div class="sol s12">\
                                <b class="medium-text">Tipo:</b>\
                                <span class="medium-text">'+ item.tipo + '</span>\
                                <div class="right">\
                                    <b class="medium-text">Criado:</b>\
                                    <span class="medium-text">'+ item.criado + '</span>\
                                </div>\
                                <table>\
                                    <thead>\
                                        <tr>\
                                            <th>Patrimônio</th>\
                                            <th>Marca</th>\
                                            <th>Modelo</th>\
                                            <th>Serial</th>\
                                            <th>Serial/HD</th>\
                                        </tr>\
                                        </thead>\
                                        <tbody>\
                                        <tr>\
                                            <td>'+ (item.patrimonio != "" ? item.patrimonio : "---") + '</td>\
                                            <td>'+ (item.marca != "" ? item.marca : "---") + '</td>\
                                            <td>'+ (item.modeloPn != "" ? item.modeloPn : "---") + '</td>\
                                            <td>'+ (item.serial != "" ? item.serial : "---") + '</td>\
                                            <td>'+ (item.serialHd != "" ? item.serialHd : "---") + '</td>\
                                        </tr>\
                                    </tbody>\
                                </table>\
                            </div>\
                        </p>\
                    </li>';
                }
            });

            $('#itemList').html(str);
        } else {
            content.html('<p>Nenhum item cadastrado. Clique no botão "+" para cadastrar um novo item.</p>');
        }
    },

    openModal: function () {
        $('#itemForm').trigger('reset');

        $('#addItemModal').modal();
        $('#addItemModal').modal('open');
    },

    closeModal: function () {
        $('#itemForm').trigger('reset');

        $('#addItemModal').modal();
        $('#addItemModal').modal('close');
    },

    saveItem: function () {
        let item = $('#itemForm').serializeArray();
        item = this.objectfyForm(item);

        this.storeItem(item);
    },

    deleteItem: function (key = null) {
        this.toast('Selecione, pelo menos, um item para excluir.');
    },

    shareItem: function (key = null) {
        this.toast('Selecione, pelo menos, um item para compartilhar.');
    },

    storeItem: function (item) {
        if(!this.validateForm()) {
            this.toast('Ops! Algo deu errado. Por favor, verifique os campos e tente novamente.');
            return false;
        }

        let itemList = localStorage.itemList;
        let currentDateTime = moment().locale('pt-br').format('DD/MM/YYYY H:mm');

        item.criado = currentDateTime
        item.transmitido = 0;

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

        $('#fab').removeClass('active');
        this.closeModal();
        this.loadItemList();
    },

    validateForm: function () {
        let inputs = $('#itemForm>div.row>div.input-field>input');
        let isValid = true;

        inputs.each(function () {
            let element = $(this);

            //Se o elemento é requerido e não tem valor
            if(typeof element.attr('required') != typeof undefined && element.val() == '') {
                element.addClass('invalid');
                isValid = false;
            }
        });

        return isValid;
    },

    selectListener: function () {
        $('#tipo').change(function () {
            let tipo = $('#tipo').val();

            let inputs = $('#itemForm>div.row>div.input-field');

            inputs.each(function () {
                $(this).show();
                $(this).find('input').attr('required');
            });

            switch (tipo) {
                //Impressora, A. Telefônico, Monitor
                case 'Monitor':
                case 'Impressora':
                case 'Aparelho telefônico':
                    $('#serialHd').closest('div').hide();
                    $('#serialHd').removeAttr('required');
                    break;
                //Teclado, Leitor Cód. Barras
                case 'Teclado':
                case 'Leitor Cód. de Barras':
                    $('#serialHd').closest('div').hide();
                    $('#modeloPn').closest('div').hide();
                    $('#serialHd').removeAttr('required');
                    $('#modeloPn').removeAttr('required');
                    break;
                //Mouse
                case 'Mouse':
                    $('#serialHd').closest('div').hide();
                    $('#modeloPn').closest('div').hide();
                    $('#serial').closest('div').hide();
                    $('#serialHd').removeAttr('required');
                    $('#modeloPn').removeAttr('required');
                    $('#serial').removeAttr('required');
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
}