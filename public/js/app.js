
//Js


const close_room = (room) => {
    $(".active_room").addClass("fadeOutLeft animated")
    setTimeout(() => {
        $(".active_room *").addClass("hide")
        $(".active_room").removeClass("active_room")
        $("."+room).removeClass("hide");
        $("."+room+" *").removeClass("hide");
        $("."+room).addClass("fadeInRight animated active_room")
    }, 500)
    
    
}

const open_room = (room) => {
    close_room(room)
}

$(document).ready(() => {    
    //Chamada para entrar na sala de chat
    $("#message").click(()=>open_room("chat_page"))
    //Chamada para entrar na sala de video
    $("#video_call").click(()=>open_room("video_page"))
    
});

