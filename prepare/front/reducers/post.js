export const initailState = {
  mainPosts: [
    {
      id: 1,
      User: {
        id: 1,
        nickname: '강동욱',
      },
      content: '첫 번째 게시글 #해시태그 #익스프레스',
      Images: [
        {
          src: 'https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%ED%96%87%EC%82%B4%EC%9D%80-%EA%B8%B8%EC%9D%98-%EB%82%98%EB%AC%B4-%EC%82%AC%EC%9D%B4%EB%A1%9C-%EB%B9%84%EC%B9%9C%EB%8B%A4-8OEzkXufphQ',
        },
        {
          src: 'https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%EB%AA%A8%EB%9E%98-%EC%82%AC%EC%9E%A5-%EC%9C%84%EC%97%90-%EC%84%9C-%EC%9E%88%EB%8A%94-%ED%95%9C-%EB%AC%B4%EB%A6%AC%EC%9D%98-%EC%82%AC%EB%9E%8C%EB%93%A4-qf43ynTzuUk',
        },
        {
          src: 'https://unsplash.com/ko/%EC%82%AC%EC%A7%84/fZ2frS7Vxkc',
        },
      ],
      Comments: [
        {
          User: {
            nickname: 'nero',
          },
          content: '우와 개정판이 나왔군요~',
        },
        {
          User: {
            nickname: '동욱98',
          },
          content: '얼른 사고싶어요~',
        },
      ],
    },
  ],
  imagePaths: [],
  postAdded: false,
};

const ADD_POST = 'ADD_POST';
export const addPost = {
  type: ADD_POST,
};

const dummyPost = {
  id: 2,
  content: '더미데이터입니다.',
  User: {
    id: 1,
    nickname: '제로초',
  },
  Images: [],
  Comments: [],
};

const reducer = (state = initailState, action) => {
  switch (action.type) {
    case ADD_POST:
      return {
        ...state,
        mainPosts: [dummyPost, ...state.mainPosts],
        postAdded: true,
      };
    default:
      return state;
  }
};

export default reducer;
