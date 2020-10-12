# Chatapp_Server
## Demo Live
* Live App tại [Surge](http://chat-app-client.surge.sh/)
* Live Api tại [Heroku](https://chap-app-server.herokuapp.com/)
## Link Client
[ChatAppClient](https://github.com/duongvanthien2209/Chatapp_Client)
## Các chức năng chính
### Auth
***
* Đăng ký tài khoản (Bằng email)
* Đăng nhập
### Thông tin người dùng
***
* Thay đổi thông tin người dùng
* Thay đổi mật khẩu
* Thay đổi ảnh đại diện
* Thay đổi email
### Quảng lý phòng
***
* Tạo phòng
* Tìm kiếm phòng sẵn có
* Tham gia vào phòng
### Chat nhóm
***
* Tham gia phòng chat và chat online với mọi người trong phòng
### Thông báo
***
* Thông báo đăng nhập, thông báo lỗi khi đăng nhập có lỗi
* Thông báo đăng ký, hoặc có lỗi đăng ký
* Thông báo khi cập nhật thông tin thành công, hoặc có lỗi trong quá trình cập nhật
* Thông báo khi tạo phòng thành công
## Cài đặt
### Install server dependencies
***
`npm install`
### Thêm file .env
***
```.env
PORT=5000
MONGO_URL= <your_mongoDB_URI>
CLOUD_NAME= <your_cloud_name>
API_KEY= <your_cloud_api_key>
API_SECRET= <your_cloud_api_secret>
```
### Install client dependencies
***
`npm install`
### Run Express in server
***
`npm run dev`
### Run React in client
***
`npm start`
### Build for production
*** 
`npm run build`
## Thông tin
### Author
***
Van Thien
