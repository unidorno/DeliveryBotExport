function PointsKeyboard(points_keyboard, userPoints, userCity, fb, bot, chat, change_city_text, choosepoint_text, message_id){
    let keyboard_buttons = 0
/*     category_keyboard = []
    userCategories = []
    categories_count = 0
    //categories_count = []
    //userCategories = []
    userCategories = []
    //category_keyboard = []
    category_keyboard = [] */
    let points_data = fb.database().ref('Basement/cities/'+ userCity +'/points/')
    points_data.get().then((snapshot) => {
        let points_array = Object.keys(snapshot.val())
        let userPointsNames = []
        console.log('categories_count: ' + chat + ' ' + points_array.length)     
        if (snapshot.exists()){
            for(let i = 0; i < points_array.length; i++){
                let point_name_data = fb.database().ref('Basement/cities/'+ userCity +'/points/' + points_array[i] + '/point_name')
                point_name_data.get().then((snapshot) => {
                    userPoints[i] = points_array[i]
                    userPointsNames[i] = snapshot.val()
                    console.log('point #' + i + ' = ' + userPoints[i])
                    if (i === points_array.length-1){
                        points_keyboard = []
                        let minuser = 0
                        console.log('point last = #' + i + ' = ' + userPointsNames[i])
                        // points_array.length++
                        points_keyboard[0] = [{
                            text: change_city_text,
                            callback_data: change_city_text
                        }]
                        for (let i = 1; i < points_array.length + 1; i=i+2){
                            console.log('catr: ' + i)
                            if (i === points_array.length){
                                console.log('Ряд #: ' + (i-minuser) + ' (1 кнопка ПОСЛЕДНЯЯ): ' + userPoints[i-1])
                                points_keyboard[i-minuser] = [{
                                    text: userPointsNames[i-1],
                                    callback_data: userPoints[i-1]
                                }]
                                keyboard_buttons++
                                console.log('keyboard_buttons: ' + keyboard_buttons)
                                if (keyboard_buttons === points_array.length){
                                    console.log('last element of categories has be written, so lets send this keyboard')
                                    bot.deleteMessage(chat, message_id).catch(err => {console.log('here: ' + err)})
                                        .then(() => {
                                            bot.sendMessage(chat, choosepoint_text,
                                                {
                                                    parse_mode: 'HTML',
                                                    reply_markup:{
                                                        inline_keyboard:points_keyboard
                                                    }
                                                })
                                        })

                                }
                            }
                            else if (keyboard_buttons === points_array.length){
                                console.log('last element of categories has be written, so lets send this keyboard')
                                bot.deleteMessage(chat, message_id).catch(err => {console.log('here: ' + err)})
                                .then(() => {
                                    bot.sendMessage(chat, choosepoint_text,
                                        {
                                            parse_mode: 'HTML',
                                            reply_markup:{
                                                inline_keyboard:points_keyboard
                                            }
                                        })
                                })
                            }
                            else {
                                console.log('Ряд #: ' + (i-minuser) + ' (2 кнопки). Первая кнопка: ' + userPoints[i-1] + '. Вторая кнопка: ' + userPoints[i])
                                points_keyboard[i - minuser] = [{
                                    text: userPointsNames[i-1],
                                    callback_data: userPoints[i-1]
                                },
                                    {
                                        text: userPointsNames[i],
                                        callback_data: userPoints[i]
                                    }]
                                keyboard_buttons = keyboard_buttons + 2
                                minuser++
                                console.log('keyboard_buttons: ' + keyboard_buttons)
                                if (keyboard_buttons === points_array.length){
                                    console.log('last element of categories has be written, so lets send this keyboard')
                                    bot.deleteMessage(chat, message_id).catch(err => {console.log('here: ' + err)})
                                    .then(() => {
                                        bot.sendMessage(chat, choosepoint_text,
                                            {
                                                parse_mode: 'HTML',
                                                reply_markup:{
                                                    inline_keyboard:points_keyboard
                                                }
                                            })
                                    })
                                }
                            }
                        }
                    }
                })
            }
        }
    })
}

bot.onText(/\/start/, msg => {
    const chatId = msg.chat.id
    current_chat = chatId
    console.log(msg)
    userstatus[chatId] = 'registered'
    if (chatId !== operators_chat[chatId]){  
        if (userstatus[chatId] === 'registered'){
            for (let i=0; i<100; i++){
                bot.deleteMessage(chatId, msg.message_id - i).catch(err => {
                    //console.log(err)
                })
            }
            bot.sendSticker(chatId, sticker_hello[Math.floor(Math.random() * sticker_hello.length)], {
                reply_markup:{
                    keyboard:registered_keyboard[0],
                    resize_keyboard: true
                }
            })
            .then(() => {
                anotherpoint_multiple[chatId] = 2
                bot.sendMessage(chatId, hellomessage_text, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: keyboards.main_menu_keyboard
                    }
                })
                .then(() => {
                    let userdata = fb.database().ref('Fitness/')
                    userdata.get().then((result) => 
                    {
                        let clubs = Object.keys(result.val())
                        for (let i = 0; i < clubs.length; i++){
                            if (msg.text === '/start ' + clubs[i] + '_start'){
                                let temp = (msg.text).split(' ')
                                temp[1] = (msg.text).split('_')
                                club_name[chatId] = temp[1][0]
                                console.log(club_name[chatId])
                                if (temp[1][1] === 'start'){
                                    StartTraining(msg.chat.id, msg.message_id)
                                }
                            }
                        }
                    })
                    
                })
            })
        }
        else {
            Reset(current_chat)
            for (let i=0; i<100; i++){
                bot.deleteMessage(chatId, msg.message_id - i).catch(err => {
                    //console.log(err)
                })
            }
            bot.sendSticker(chatId, sticker_hello[Math.floor(Math.random() * sticker_hello.length)]).then(() => {
                anotherpoint_multiple[chatId] = 2
                bot.sendMessage(chatId, hellomessage_text, {
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: keyboards.main_menu_keyboard
                    }
                })
            })
        }
        
        
    }
    if (chatId === operators_chat[chatId]){
        bot.sendMessage(chatId, 'Привет! Я буду скидывать сюда заказы. Чтобы начать выполнять заказ, нажмите на кнопку "✅ Принять", под заказом. Так клиент поймет, что его заказ принят.')
    }
})