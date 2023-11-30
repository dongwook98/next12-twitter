const express = require('express');

const { Post, Comment, Image, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

// POST /post
router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      // 라우터에 접근하면 deserializeUser가 실행되서 사용자 정보를 복구해서 req.user에 넣어준다.
      UserId: req.user.id,
    });
    // 응답으로 게시글 데이터 보낼때 데이터 추가
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
              model: User,
              attributes: ['id', 'nickname'],
            },
          ],
        },
        {
          model: User,
          attributes: ['id', 'nickname'],
        },
      ],
    });
    res.status(201).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST /post/1/comment
// :postId와 같이 주소 부분에서 동적으로 바뀌는 부분을 파라미터라고 부른다.
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
      PostId: parseInt(req.params.postId, 10),
      UserId: req.user.id,
    });
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

// DELETE /post
router.delete('/', (req, res) => {
  res.json({ id: 1 });
});

module.exports = router;
