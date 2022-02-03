//express 불러오기
const express = require('express');
//morgan 불러오기
const morgan = require('morgan');
//dotenv 불러오기
const dotenv = require('dotenv');
dotenv.config();
//fs 불러오기
const fs = require('fs');
//routes폴더의 index.js를 가져왔음. index는 기본이라 생략함.
const indexRouter = require('./routes');
//routes폴더의 user.js를 가져옴. 생략이 안되는 듯. 기본이 아니라.
const userRouter = require('./routes/user');
//multer 불러오기
const multer = require('multer');
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads/');
    },

    //파일 이름 만들기
    filename(req, file, done) {
      //확장자 빼내기
      const ext = path.extname(file.originalname);

      //파일이름과 확장자, 시간을 합쳐서 이름 만들기
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),

  //업로드 파일 제한(5mb)
  limits: { fileSize: 5 * 1024 * 1024 },
});
//path 불러오기
const path = require('path');

//app에 express 넣어주기
const app = express();

try {
  //try에서 dir폴더를 한 번 읽고
  //만약 해당 폴더가 없어서 에러가 발생하면

  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');

  //mkdirSync로 uploads라는 이름의 폴더 생성하기
  fs.mkdirSync('uploads');
}

//app.set을 통해 포트 설정해주기.
app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));

//정적 파일을 제공해야하는 경우 지금처럼 위쪽에서 실행해서 불필요한 미들웨어 호출 없도록.
//그래야 서비스의 효율? 속도? 등에서 유리할것임.
//단, 라우트를 통해야 하는 동적 파일들의 경우에는 여기에서 못찾으니 next를 때릴 것임.
//
app.use('/', express.static(path.join(__dirname, 'public-it0129')));
app.use('/user', userRouter);

//app.get을 통해 구분해주기.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
  console.log(`app.get / 기본 index.html 호출됨.`);
});

//와일드카드 에러 처리?
app.get('*', (req, res) => {
  console.log(`존재하지 않는 주소에 대한 요청.`);
  throw new Error();
});

//error 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err);
  res.status(200).send(`Error 발생`);
});
app.listen(app.get('port'), () => {
  console.log(app.get('port'), 'Express Server 가동중...');
});
