Các bước thiết lập dự án:
● Cấu hình chung
● Tạo dự án product-management
● Khởi tạo NPM: npm init
● Cài đặt Express: npm i express
● Cài đặt Nodemon: npm i --save-dev nodemon
● Sửa file package.json: "start": "nodemon --inspect index.js"
● Tạo file index.js trong thư mục gốc

● Cài đặt PUG: https://pugjs.org/api/getting-started.html
● Tạo views
● Cấu hình folder routes
● Cấu hình folder controllers
● Cấu hình .env
https://www.npmjs.com/package/env
● Cấu trúc lại folder PUG.
● bootstrap:
● Nhúng file tĩnh
● Sửa layout
● Cấu hình data: + Cài đặt mongoose:
link:https://www.npmjs.com/package/mongoose
Câu lệnh: npm i mongoose + Nhúng vào index: const mongoose = require("mongoose");
●Method-Override: Ghi đè phương thức
install:$ npm install method-override

● Body-parser:lấy ra các thuộc tính trong "req.body propety"

- install:https://www.npmjs.com/package/body-parser

● satckoverflow: Update multi
db.Element.update(
{
\_id:{$in:[''id', 'id', 'id']}
},
{
$set:{visibility: your}
};
{
multi:true
}
)
● Hiển thị thông báo ở express: express-flash
https://www.npmjs.com/package/express-flash

● Create:

- Timestamps:(Mongoose)

● Mongoose-slug-updater:
https://www.npmjs.com/package/mongoose-slug-updater

● Upload ảnh:<multer>
https://www.npmjs.com/package/multer

Hiển thị hình ảnh trước
https://stackoverflow.com/questions/4459379/preview-an-image-before-it-is-uploaded

- Đẩy file tĩnh lên Cloud
  Đăng ký tài khoản tại: https://cloudinary.com/
  ● Link hướng dẫn: npm install cloudinary
  ● Cài đặt: npm install cloudinary
  ● Cài đặt: npm install streamifier

chèn ảnh vào tinymce:
https://www.tiny.cloud/docs/tinymce/latest/file-image-upload/#file_picker_types
enctype="multipart/form-data" xử lý upload hình ảnh

- MD5 npm: để mã hóa một thư viện nào đó<Mã hóa mật khẩu>

  https://expressjs.com/en/5x/api.html#res.cookie
  https://www.npmjs.com/package/moment Giải mã thời gian
  Set thời gian cho cookie:
  https://expressjs.com/en/5x/api.html#res.cookie

Cách thêm, xóa trong đơn hàng:https://stackoverflow.com/questions/16959099/how-to-remove-array-element-in-mongodb
collection.update(
{ \_id: id },
{ $push: { 'contact.phone': { number: '+1786543589455' } } }
);
collection.update(
{ \_id: id },
{ $pull: { 'contact.phone': { number: '+1786543589455' } } }
);

- Gửi mã xác nhận qua email:npm nodemailer
  https://www.npmjs.com/package/nodemailer

  hướng dẫn:
  https://nodemailer.com/usage/
  const nodemailer = require('nodemailer');

// Tạo transporter sử dụng Gmail
let transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
user: 'youremail@gmail.com',
pass: 'your_app_password', // mật khẩu ứng dụng (App Password)
}
});

// Cấu hình email
let mailOptions = {
from: '"Your Name" <youremail@gmail.com>',
to: 'recipient@example.com',
subject: 'Test Nodemailer với Gmail',
text: 'Đây là email test gửi từ Nodemailer!'
};

// Gửi mail
transporter.sendMail(mailOptions)
.then(info => console.log('Email sent: ' + info.response))
.catch(err => console.error('Error:', err));

// SocketIO
SOCKETIO: https://socket.io/get-started/chat
npm i socket.io
Nhúng http
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

connect:
io.on('connection', (socket) => {
console.log('a user connected');
});
Sau khi connect, app sẽ đc gọi trong server

- emoji-picker-element
  https://github.com/nolanlawson/emoji-picker-element/blob/master/package.json
