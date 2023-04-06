import React from 'react';

import { loadingSpinnerIcon } from './assets';

export const LoadingWidget = (
  {
  }: {
  },
) => {

  return <div
    style={{
      width: `100%`,
      height: `100%`,

      display: `flex`,
      justifyContent: `center`,
      alignItems: `center`,
      flexDirection: `column`,
    }}>
    <img
      style={{
        width: `40px`,
        height: `auto`,
      }}
      src={loadingSpinnerIcon}
    />
  </div>;
};
