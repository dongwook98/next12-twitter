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
          src: 'https://cdn.pixabay.com/photo/2023/10/20/13/49/beach-8329531_1280.jpg',
        },
        {
          src: 'https://cdn.pixabay.com/photo/2023/08/06/16/17/snow-8173264_1280.jpg',
        },
        {
          src: 'https://cdn.pixabay.com/photo/2023/11/04/10/03/bear-8364583_1280.png',
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
