const express = require('express');
const { Op } = require('sequelize');

const { Post, Image, User, Comment } = require('../models');

const router = express.Router();

/**
 * 게시글 불러오기
 * GET /posts
 */
router.get('/', async (req, res, next) => {
  try {
    const where = {};
    // 초기 로딩이 아닐 때
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; // lastId 보다 작은
    } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
    /**
     * findAll : 테이블 데이터 모두 가져오기
     * 조건을 줘서 가져오고 싶은 데이터만 가져올 수 있음
     * where:
     * limit: 게시글 몇개가져올지 지정
     * offset: 몇번째 부터 가져올지
     * limit-offset을 쓰면 단점이 중간에 누군가가 글을 추가하거나 삭제하면 limit과 offset이 꼬여버린다.
     * 그래서 보통 limit-lastId 방식을 많이 쓴다.
     */
    const posts = await Post.findAll({
      where,
      limit: 10,
      // DESC: 내림차순, ASC(기본값): 오름차순
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'],
      ],
      include: [
        // 게시글 작성자 데이터 include, 비밀번호는 제외
        {
          model: User,
          // 비밀번호 빼고 프론트로 전송
          attributes: ['id', 'nickname'],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          // 댓글 작성자 데이터 include, 비밀번호는 제외
          include: [
            {
              model: User,
              attributes: ['id', 'nickname'],
            },
          ],
        },
        {
          model: User, // 좋아요 누른 사람
          as: 'Likers',
          attributes: ['id'],
        },
        {
          model: Post,
          as: 'Retweet',
          include: [
            {
              model: User,
              attributes: ['id', 'nickname'],
            },
            {
              model: Image,
            },
          ],
        },
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
