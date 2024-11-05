import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/images')
    },
    filename: function (req, file, cb) {
      const timestamp = Date.now()
      const mathRandom = Math.round(Math.random() * 1E9)
      const extention = path.extname(file.originalname)
      cb(null, `${timestamp}-${mathRandom}${extention}`)
    }
  })

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null, true)
    } else {
        cb(new Error('Hanya mendukung file dengan ekstensi JPEG/JPG dan PNG'), false)
    }
}

export const upload = multer({storage: storage, limits: {fileSize: 3 * 1024 * 1024 }, fileFilter: fileFilter})


// export const uploads = (req, res) => {
//   upload.fields([{name: 'ktp', maxCount:1}, {name: 'kk', maxCount: 1}, {name: 'foto', maxCount: 1}])(req, res, err => {
//     if (err instanceof multer.MulterError) {
//       if (err.code === 'LIMIT_FILE_SIZE') {
//         return res.status(400).send('File terlalu besar. Maksimal ukuran file adalah 3 MB.');
//       }
//       return res.status(400).send('Multer error occurred: ' + err.message);
//     } else if (err) {
//       return res.status(400).send('An unknown error occurred: ' + err.message);
//     }
//     res.send('File uploaded successfully');
//   })
// }