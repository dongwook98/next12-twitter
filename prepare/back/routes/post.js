const express = require('express');
// multipart/form-data 를 처리하기 위한 multer
const multer = require('multer');
const path = require('path');
// 파일 시스템을 조작할 수 있음
const fs = require('fs');

const { Post, Comment, Image, User, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
  fs.accessSync('uploads');
} catch (error) {
  console.log('uploads 폴더가 없으므로 생성합니다.');
  fs.mkdirSync('uploads');
}

// Multer 미들웨어 설정
const upload = multer({
  // 업로드된 이미지를 저장할 디렉토리 설정
  // 나중에는 클라우드 S3에 저장 -> 스케일링 하기위해
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) {
      // 파일명 중복 막아주기
      // 제로초.png
      const ext = path.extname(file.originalname); // 확장자 추출(png)
      const basename = path.basename(file.originalname, ext); // 제로초
      done(null, basename + '_' + new Date().getTime() + ext); // 제로초_151515151123213.png
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB 제한
});

/**
 * 게시글 작성
 * POST /post
 */
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const post = await Post.create({
      content: req.body.content,
      // 라우터에 접근하면 deserializeUser가 실행되서 사용자 정보를 복구해서 req.user에 넣어주어서 req.user 사용가능
      UserId: req.user.id,
    });
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          Hashtag.findOrCreate({
            where: { name: tag.slice(1).toLowerCase() },
          })
        )
      ); // [노드, true], [리액트, true]
      await post.addHashtags(result.map((v) => v[0]));
    }
    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        // 이미지를 여러 개 올리면 image: [제로초.png, 부기초.png]
        // Promise.all을 사용해 이미지 주소를 한방에 DB에 저장
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
        await post.addImages(images);
      } else {
        // 이미지를 하나만 올리면 image: 제로초.png
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }
    // 응답으로 게시글 데이터 보낼때 필요한 데이터 추가
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User, // 댓글 작성자
              attributes: ['id', 'nickname'],
            },
          ],
        },
        {
          model: User, // 게시글 작성자
          attributes: ['id', 'nickname'],
        },
        {
          model: User, // 좋아요 누른 사람
          as: 'Likers',
          attributes: ['id'],
        },
      ],
    });
    res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/**
 * 이미지 업로드를 처리하는 라우트 설정
 * POST /post/images
 *
 * upload.array('image')은 여러개의 파일을 업로드할 때 사용되는 Multer 미들웨어입니다.
 * image은 클라이언트에서 전송된 폼 필드의 이름을 나타냅니다.
 */
router.post('/images', isLoggedIn, upload.array('image'), async (req, res, next) => {
  console.log(req.files);
  res.json(req.files.map((v) => v.filename));
});

/**
 * 댓글 작성 라우트 설정
 * POST /post/1/comment
 *
 * :postId와 같이 주소 부분에서 동적으로 바뀌는 부분을 파라미터라고 부른다.
 */
router.post('/:postId/comment', isLoggedIn, async (req, res) => {
  try {
    // 존재하지 않는 게시글에 댓글 달수도 있기 때문에 아래와 같이 처리
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    // 프론트에서 받은 데이터 Comment 테이블에 생성
    const comment = await Comment.create({
      content: req.body.content,
      // 파라미터는 문자열이기 때문에 parseInt로 숫자로 변환
      PostId: parseInt(req.params.postId, 10),
      UserId: req.user.id,
    });
    // 프론트로 응답해줄때 댓글 작성자 데이터 추가해서 응답
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ['id', 'nickname'],
        },
      ],
    });
    res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/**
 * 좋아요 api
 * PATCH /post/1/like
 */
router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    /**
     * 관계 메서드
     * 우리가 시퀄라이즈로 관계를 설정해놓은 모델간의 add,remove,get,set 메서드를 제공한다.
     */
    await post.addLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/**
 * 좋아요 취소 api
 * DELETE /post/1/like
 */
router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/**
 * 게시글 제거
 * DELETE /post/1
 */
router.delete('/:postId', isLoggedIn, async (req, res) => {
  try {
    await Post.destroy({
      where: {
        id: req.params.postId,
        UserId: req.user.id, // 실수로 남의 게시글 지우지못하게
      },
    });
    res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
