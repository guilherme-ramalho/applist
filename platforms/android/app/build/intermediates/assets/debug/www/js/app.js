var app = {
    loadBar: function () {
        $('#navbar').load('./views/navbar.html');
    },

    loadItemList: function () {
        let itemList = localStorage.itemList;
        let content = $('#content');

        content.empty();

        //Creates the list item element if It is undefined
        if (typeof itemList != 'undefined') {
            let str = '';
            let strTable = '';
            itemList = JSON.parse(itemList);
            itemList = this.sortArrayByKey(itemList, 'transmitido');

            content.html('<ul id="itemList" class="collection"></ul>');

            $.each(itemList, function (key, item) {
                let status = item.transmitido == 1 ? 'green' : 'grey darken-4';
                let statusMessage = item.transmitido == 1 ? 'Transmitido' : 'Aguardando';

                str +=
                    '<li onclick="app.expandItemModal(event)" data-item="' + encodeURI(JSON.stringify(item)) + '" id="item' + key + '" class="collection-item">\
                        <p>\
                            <div class="sol s12">\
                                <b class="medium-text">Tipo:</b>\
                                <span class="medium-text">'+ item.tipo + '</span>\
                                <div class="right">\
                                    <b class="medium-text">Marca:</b>\
                                    <span class="medium-text">'+ item.marca + '</span>\<br/>\
                                </div>\
                            </div>\
                        </p>\
                        <p>\
                            <div class="sol s12">\
                                <b class="medium-text">Patrimônio:</b>\
                                <span class="medium-text">'+ item.patrimonio + '</span>\
                                <div class="right">\
                                    <b class="medium-text">Status:</b>\
                                    <span class="'+ status + ' badge medium-text white-text">' + statusMessage + '</span>\
                                </div>\
                            </div>\
                        </p>\
                    </li>';
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

        $('#tipo').prop('selectedIndex', 0);
    },

    closeModal: function () {
        $('#itemForm').trigger('reset');

        $('#addItemModal').modal();
        $('#addItemModal').modal('close');
    },

    expandItemModal: function (event) {
        let item = $(event.target).closest('li').data('item');
        item = decodeURI(item);
        item = JSON.parse(item);

        $('#itemModalTitle').text('Item de Patrimônio ' + item.patrimonio);

        $('#itemModalBody').empty();

        $.each(item, function(key, val) {
            if(val != '' && key != 'transmitido') {
                $('#itemModalBody').append(
                    '<div class="input-field col s6">\
                        <input id="'+ key +'" name="'+ key +'" value="'+ val +'" type="text">\
                        <label for="'+ key +'" class="active">'+ key +'</label>\
                    </div>'
                );
            }
        });

        $('#itemModal').modal();
        $('#itemModal').modal('open');
    },

    saveItem: function () {
        let item = $('#itemForm').serializeArray();
        item = this.objectfyForm(item);

        this.storeItem(item);
    },

    clearItems: function () {
        if (typeof localStorage.itemList != 'undefined') {
            localStorage.clear();
            this.loadItemList();
            this.toast('Os ítens cadastrados foram removidos com sucesso.');
        } else {
            this.toast('Não há nenhum ítem cadastrado.');
        }
    },

    syncItems: function () {
        let itemList = JSON.parse(localStorage.itemList);

        $.each(itemList, function (key, item) {
            let itemObj = app.objectToApiJSon(item);

            let request = app.ajaxRequest('POST', 'Inserir', itemObj);

            request.done(function (response) {
                if(response.Result == true) {
                    itemList[key].transmitido = 1;

                    //Saves the new list on the local storage
                    localStorage.itemList = JSON.stringify(itemList);
                    app.loadItemList();
                } else {
                    app.toast('Ocorreu algum problema ao transmitir o item de patrimônio ' + item.patrimonio);
                }
            });
        });

        this.toast('Itens sendo transmitidos...');
    },

    objectToApiJSon: function (item) {
        return {
            Item: {
                DataHora: item.criado,
                Marca: item.marca,
                Modelo: item.modeloPn,
                Patrimonio: item.patrimonio,
                Serial: item.serial,
                SerialHd: item.serialHd,
                Tipo: item.tipo
            }
        };
    },

    storeItem: function (item) {
        if (!this.validateForm()) {//Checks if the form is valid
            this.toast('Ops! Algo deu errado. Por favor, verifique os campos.');
            return false;
        }

        if (!this.validatePatrimony(item.patrimonio)) {//Checks if the patrimony is already stored
            this.toast('O patrimônio informado já está cadastrado.');
            return false;
        }

        let itemList = localStorage.itemList;
        let currentDateTime = moment().locale('pt-br').format('DD/MM/YYYY H:mm');

        item.criado = currentDateTime;
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
        this.closeModal();
        this.loadItemList();
    },

    validatePatrimony: function (patrimony) {
        let isValid = true;

        if (typeof localStorage.itemList != 'undefined') {
            let itemList = JSON.parse(localStorage.itemList);

            $.each(itemList, function (key, item) {
                if (patrimony == item.patrimonio) {
                    isValid = false;
                }
            });
        }

        return isValid;
    },

    validateForm: function () {
        let inputs = $('#itemForm>div.row>div.input-field>input');
        let isValid = true;

        inputs.each(function () {
            let element = $(this);

            //If the input is required and has no value
            if (typeof element.attr('required') != typeof undefined && element.val() == '') {
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

    sortArrayByKey: function (array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    },

    ajaxRequest: function (verb, endpoint, body = null, async = true) {
        try {
            return $.ajax({
                ContentType: 'application/json',
                url: 'http://inventario.atlanteti.com/AtlanteInventarioService/AtlanteInventarioService.svc/' + endpoint,
                type: verb,
                dataType: 'json',
                async: async,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(body),
                error: function (error) {
                    console.log(error);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
}