import React from 'react';

const Tile = ({ value }) => {
  return <div className={`tile tile-${value}`}>{value}</div>;
};

export default Tile;
