module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User', // MY SQL에는 Users 테이블 생성
    {
      // My SQL에서 id를 자동으로 넣어준다.
      // id가 기본적으로 들어있다.
      /**
       * email, nickname, password를 컬럼이라고 부른다.
       * 실제 데이터는 로우라고 부른다.
       */
      email: {
        /**
         * 데이터 제한
         *
         * 1) STRING, TEXT, BOOLEAN, INTEGER, FLOAT, DATETIME
         * 2) allowNull : 그 데이터가 필수인지 아닌지
         * 3) unique : 그 데이터가 고유해야하는지
         */
        type: DataTypes.STRING(30),
        allowNull: false, // 필수
        unique: true, // 고유한 값
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100), // 암호화 해야되서 넉넉하게 둠
        allowNull: false,
      },
    },
    {
      // My SQL에 한글 넣으면 에러 나기 때문에 utf8
      charset: 'utf8',
      collate: 'utf8_general_ci', //한글 저장
    }
  );
  /**
   * 시퀄라이즈 관계 설정하기
   *
   * 1) hasOne, belongsTo : 일대일 관계, 예시) 유저와 유저인포 테이블
   *
   * 2) hasMany, belongsTo : 일대다 관계, 예시) 유저와 게시글
   * belongsTo는 컬럼을 만들어준다. 예시) db.Comment.belongsTo(db.User) -> Comment 테이블에 UserId라는 컬럼 만들어줌
   *
   * 3) belongsToMany, belongsToMany : 다대다 관계, 예시) 게시글과 해시태그
   * 다대다 관계는 중간 테이블 생성한다. 이 때 중간 테이블에 두 테이블의 id를 컬럼으로 가진다.
   * 그리고 두번째 인수 객체 through 속성으로 중간 테이블의 이름을 설정 할 수 있다.
   * as 속성으로 나중에 as에 따라서 getLikers처럼 게시글 좋아요 누른 사람을 가져올 수 있다.
   *
   * 4) 단, 다대다 관계에서는 같은 테이블 2개끼리 다대다 관계를 가질수도 있다. 예시) 유저와 유저 테이블 팔로잉, 팔로우 관계
   * 이 때 같은 테이블 2개이므로 중간 테이블에 두 테이블의 id를 컬럼으로 가져오면 컬럼 둘 다 UserId가 된다.
   * 그래서 컬럼명을 바꾸기 위해 foreignKey를 부여한다. foreignKey에는 먼저 찾아야 하는 컬럼을 적어줘야 한다.
   * getFollowers를 하려면 FollowingId를 먼저 찾아야 되기 때문에 foreignKey에 FollowingId를 적어준다.
   * 이 때 규칙이 보이는데 as의 값과 foreignKey의 값은 반대가 된다.
   */
  User.associate = (db) => {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    /**
     * through는 belongsToMany 관계에서 중간 테이블을 직접 지정할 때 사용됩니다.
     * as는 모델 간의 관계를 지정할 때, 해당 관계에 사용될 별칭을 설정할 때 사용됩니다.
     * foreignKey는 외래 키의 이름을 설정할 때 사용됩니다.
     */
    // getLiked -> 내가 좋아요를 누른 게시글 가져오기
    db.User.belongsToMany(db.Post, { through: 'Like', as: 'Liked' });
    // getFollowers -> 나의 팔로워들 가져오기, 이 때 테이블에서 팔로잉을 먼저 찾아야하므로 foreignKey는 FollowingId가 된다.
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'FollowingId' });
    db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'FollowerId' });
  };
  return User;
};
