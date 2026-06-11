const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const allowedFormats = ['png', 'jpg', 'jpeg']
    const ext = file.originalname.split('.').pop().toLowerCase()

    if (!allowedFormats.includes(ext)) {
      throw new Error('Só são permitidos ficheiros PNG, JPG e JPEG')
    }

    return {
      folder: 'covers',
      allowed_formats: allowedFormats,
      resource_type: 'image',
      public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    }
  },
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Só são permitidos ficheiros PNG, JPG e JPEG'))
  }
}

const upload = multer({
  storage,
  fileFilter,
})

module.exports = upload