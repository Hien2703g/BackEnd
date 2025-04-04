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
