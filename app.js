const express = require('express')
const multer = require('multer')
const ejs = require('ejs')

const path = require('path')

//creamos el storage engine
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)) 
        /**
         * Con file.fieldname al momento de cargar el archivo colola el nombre original del archivo
         * con Date.now() agregamos el timestamps de la carga para que tenga un nombre diferente y evitar que se sobre escriba el archivo 
         * path.extname(file.originalname) agregamos la extension del archivo
         */
    }
})

// inicializamos upload
const upload = multer ({
    storage: storage,
    limits: {fileSize: 1250000}, // Limitamos el tamaño del archivo dado en bytes
    fileFilter: function(req, file, cb){
        checkFileType(file, cb)
    }
}).single('myImage')

// Checamos el tipo del archivo
function checkFileType(file, cb){
    // Creacion de lista de archivos permitidos
    // le decimos que tipo de archivo seran aceptados
    const filetypes = /jpeg|jpg|png|gif/ 

    // Verificar la extension del archivo
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

    // Verificamos el minetype
    const mimetype = filetypes.test(file.mimetype)

    if (mimetype && extname) {
        cb(null, true)
    } else {
        cb('Error: Solo se permiten subir imagenes')
    }
}

// Iinicalizamos la app
const app = express()

//EJS
app.set('view engine', 'ejs')

// Carpeta publica
app.use(express.static('./public'))

app.get('/', (req, res) => res.render('index'))

app.post('/upload', (req, res) => {
    //res.send('test')
    upload(req, res, (err) => {
        if(err){
            res.render('index', {
                msg: err
            })
        } else {
            //console.log(req.file)
            //res.send('test')
            if(req.file === undefined){
                res.render('index', {
                    msg: 'Error: no selecionaste un archivo'
                })
            } else {
                res.render('index',{
                    msg: 'Archivo subido correctamente',
                    file: `uploads/${req.file.filename}`
                })
            }
        }
    })
})

const port = 3000
app.listen(port, ()=> console.log(`Servidor ejecutandose en el puerto ${port}`))
