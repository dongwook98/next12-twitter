import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';

const PostImages = ({ images }) => {
  const [ShowImagesZoom, setShowImagesZoom] = useState(false);
  const onZoom = useCallback(() => {
    setShowImagesZoom(true);
  }, []);
  if (images.length === 1) {
    return (
      <>
        <img role='presentation' src={images[0].src} alt={images[0].src} onClick={onZoom} />
      </>
    );
  }
  if (images.length === 2) {
    return (
      <>
        <img
          role='presentation'
          style={{ width: '50%', display: 'inline-block' }}
          src={images[0].src}
          alt={images[0].src}
          onClick={onZoom}
        />
        <img
          role='presentation'
          style={{ width: '50%', display: 'inline-block' }}
          src={images[1].src}
          alt={images[1].src}
          onClick={onZoom}
        />
      </>
    );
  }
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img role='presentation' style={{ width: '50%' }} src={images[0].src} alt={images[0].src} onClick={onZoom} />
        <div role='presentation' style={{ width: '50%', textAlign: 'center' }} onClick={onZoom}>
          <PlusOutlined />
          <br />
          {images.length - 1}개의 사진 더보기
        </div>
      </div>
    </>
  );
};

PostImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object),
};

export default PostImages;
