
let lastDate='';
let globalArray = [];


$(function(){
    $('#btnSendMessage').click(() => {

        sendNewMessage({ "author": $('#author').val(), "message": $('#textMessage').val()})
            .then(responce =>{
                fillArray([responce]);
            });
    });

    getMessages()
        .then((responce) =>{
            fillArray(responce);
        });

    setInterval(()=>{
        getMessages('datetime='+lastDate)
            .then((responce) =>{
                fillArray(responce);
            });
    },2000);
});


let fillArray = (data) =>{

    console.log(data);
    if(data.length) {
        for (let i = 0; i < data.length; i++) {

            if (globalArray.length >= 30) {
                globalArray.push.apply(globalArray, globalArray.splice(0,1));
                globalArray[globalArray.length-1] = data[i];
            } else {
                globalArray.push(data[i]);
            }
        }
        lastDate = globalArray[globalArray.length-1].datetime;
    }

    printMessage(globalArray);

};

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

    $('#msgList').empty();
    $('#msgList').html(list);
};

let getMessages =(data = '') =>{
    return $.ajax(
        {
            headers: {
                "Content-Type":"application/json",
                "Accept":"application/json"
            },
            url: '/messages/',
            type: "GET",
            data: data,
            dataType: 'json',
            error: function (err) {
                $('#errorMsg').html(err.responseJSON.error);
            }
        }
    );
};


let sendNewMessage=(data)=> {
    $('#errorMsg').empty();
    return $.ajax(
        {
            headers: {
                "Content-Type":"application/json",
                "Accept":"application/json"
            },
            url: '/messages',
            type: "POST",
            data: JSON.stringify(data),
            dataType: 'json',

            error: function(err) {
                $('#errorMsg').html(err.responseJSON.error);
            }
        }
    );
};