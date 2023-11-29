module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      // id가 기본적으로 들어있다.
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // RetweetId
    },
    {
      // 게시글에는 이모티콘같은것도 들어갈 수 있다. 그래서 utf8mb4
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci', // 이모티콘 저장
    }
  );
  Post.associate = (db) => {
    db.Post.belongsTo(db.User);
    db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
    db.Post.hasMany(db.Comment);
    db.Post.hasMany(db.Image);
    // getLikers -> 게시글에 좋아요를 누른 유저들 가져오기
    db.Post.belongsToMany(db.User, { through: 'Like', as: 'Likers' });
    // 게시글과 게시글의 리트윗 관계는 일대다 관계
    // as로 id명 변경 PostId -> RetweetId
    db.Post.belongsTo(db.Post, { as: 'Retweet' });
  };
  return Post;
};
