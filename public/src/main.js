const socket = io.connect();

//------------------------------------------------------------------------------------

const frmNewItem = document.getElementById('frmNewItem')
frmNewItem.addEventListener('submit', e => {
    e.preventDefault()
    
    const producto = {
        title: frmNewItem[0].value,
        price: frmNewItem[1].value,
        thumb: frmNewItem[2].value
    }

    socket.emit('newItem', producto);
    
    frmNewItem.reset()
})


socket.on('productos', productos => {   
    productsShow(productos).then(html => {
        document.getElementById('listItems').innerHTML = html
    })
});

function productsShow(productos) {    
    return fetch('views/datos.hbs')
        .then(respuesta => respuesta.text())
        .then(lista => {
            const template = Handlebars.compile(lista);
            const html = template({ productos })
            return html
        })
}
 
//-------------------------------------------------------------------------------------

const inputUsername = document.getElementById('inputUsername')
const inputMensaje = document.getElementById('inputMensaje')
const btnEnviar = document.getElementById('btnEnviar')

const formPublicarMensaje = document.getElementById('formPublicarMensaje')
formPublicarMensaje.addEventListener('submit', e => {
    e.preventDefault()

    const mensaje = { autor: inputUsername.value, texto: inputMensaje.value}
    socket.emit('newMessage', mensaje);
    formPublicarMensaje.reset()
    inputMensaje.focus()
})

socket.on('users', usuarios => {
    usuarios = [...new Set(usuarios.map(item => item.autor))]; // [ 'A', 'B']
    
    const html = usersShow(usuarios)
    document.getElementById('usuarios').innerHTML = html;
})

function usersShow(usuarios) {
    console.log(usuarios);
    return usuarios.map(usuario => {
        
        let color = 'black'

        let contentText = 'flex-start'
        let backColor = 'gainsboro'
         

        return (`
            <div  style="display: flex; justify-content: ${contentText}">
                <b style="color:${color};">${usuario}</b> 
            </div>
        `)
    }).join("<br/>");
}

socket.on('messages', mensajes => {
    const html = messagesShow(mensajes)
    document.getElementById('mensajes').innerHTML = html;
})

function messagesShow(mensajes) {
    return mensajes.map(mensaje => {
        
        let color = 'black'

        let contentText = 'flex-start'
        let backColor = '#ffffff'
        if (mensaje.socketId == socket.id) {            
            contentText = 'flex-end'
            backColor = '#dafdd3'
        }

        return (`
            <div  style="background-color: ${backColor}; display: flex; justify-content: ${contentText}">
                <b style="color:${color};">${mensaje.autor}</b>
                [<span style="color:black;">${mensaje.fyh}</span>] :
                <i style="color:black;">${mensaje.texto}</i>
            </div>
        `)
    }).join("<br/>");
}

inputUsername.addEventListener('input', () => {
    const hayEmail = inputUsername.value.length
    const hayTexto = inputMensaje.value.length
    inputMensaje.disabled = !hayEmail
    btnEnviar.disabled = !hayEmail || !hayTexto
})

inputMensaje.addEventListener('input', () => {
    const hayTexto = inputMensaje.value.length
    btnEnviar.disabled = !hayTexto
})
