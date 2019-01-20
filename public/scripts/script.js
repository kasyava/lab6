
let lastDate='';        //тут будет лежать дата последнего сообщения
let globalArray = [];   //а тут будут лежать сообщения

let msgList;
let errorMsg;

// jquery on document ready то есть когда документ загружен
$(function(){

    msgList = $('#msgList');
    errorMsg = $('#errorMsg');

    //при нажатии на кнопку отправляем постом данные на сервер
    $('#btnSendMessage').click(() => {
        sendAjax("POST",{ "author": $('#author').val(), "message": $('#textMessage').val()})
            .then(responce =>{
                errorMsg.empty(); //очищаем вывод ошибки у пользователя
                //fillArray([responce]); //закоментировал чтобы показать, что работает setInterval
            });
    });

    //получаем последние 30 сообщений
    sendAjax().then((responce) =>{
            fillArray(responce); //заполняем массив с сообщениями
        });

    // каждые 2 секунды запрашиваем с сервера сообщения новее нашего последнего
    setInterval(()=>{
        sendAjax("GET",'datetime='+lastDate).then((responce) =>{
                fillArray(responce);
            });
    },2000);
});

//функция заполнения маасива сообщениями
let fillArray = (data) =>{
    if(data.length) {
        for (let i = 0; i < data.length; i++) {

            if (globalArray.length >= 30) {                                     //если наш маасив имеет длинну в 30 сообщений
                globalArray.push.apply(globalArray, globalArray.splice(0,1));   //сдвигаем все элементы на 1 влево
                globalArray[globalArray.length-1] = data[i];                    //и в последний элемент сохраняем новые данные
            } else {                                                            //если размер массива меньше 30
                globalArray.push(data[i]);                                      //то просто добавляем в него новый элемент
            }
        }
        lastDate = globalArray[globalArray.length-1].datetime;                  //тут будет лежать дата последнего сообщения
    }
    printMessage(globalArray);                                                  //выводим наш массив на страницу
};

//функция вывода массива на экран пользователю
let printMessage = (data) =>{
    let list = '<ul class="border">';
    data.forEach((element) => {
        list += '<ul>';
        //lastDate = element.datetime;
        let myDate = element.datetime.split('T')[0];
        let myTime = element.datetime.split('T')[1].split('.')[0];
        list += '<li style="color:red">' + "Author:" + element.author + " " + "&nbsp;Date: " + myDate + "&nbsp;Time: "+ myTime + '</li>';
        list += '<li style="color:green">' + element.message + '</li>';
        list += '</ul>';

    });
    list += '</ul>';

    msgList.empty();      //очищаем наш div с сообщениями
    msgList.html(list);   //и выводим новые сообщения
};

let sendAjax=(type='GET', data='')=> {
    if(type==='POST') data = JSON.stringify(data);
    return $.ajax(
        {
            headers: {
                "Content-Type":"application/json",
                "Accept":"application/json"
            },
            url: '/messages',
            type: type,
            data: data,
            dataType: 'json',

            error: function(err) {
                errorMsg.html(err.responseJSON.error);
            }
        }
    );
};

