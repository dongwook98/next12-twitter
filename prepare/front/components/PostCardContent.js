import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const PostCardContent = ({ postData }) => (
  // ex) 첫 번째 게시글 #해시태그 #익스프레스
  <div>
    {/* #, 공백기준으로 split() */}
    {postData.split(/(#[^\s#]+)/g).map((v, i) => {
      // 앞에 #붙은애들은 Link 컴포넌트로 감싸주기
      if (v.match(/(#[^\s#]+)/)) {
        return (
          // slice(1)는 앞에 # 없애준 것
          // 사용자가 직접 수정하는거 아니면 postData는 절대 바뀌지않는다. 그럴때는 key를 index로 써도된다.
          <Link key={i} href={`/hashtag/${v.slice(1)}`}>
            <a>{v}</a>
          </Link>
        );
      }
      // 앞에 #안붙은애들은 그냥 return
      return v;
    })}
  </div>
);

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
};

export default PostCardContent;
