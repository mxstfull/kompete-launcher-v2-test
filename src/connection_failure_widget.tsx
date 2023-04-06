import React from 'react';
import chroma from 'chroma-js';

import { offlineIcon } from './assets';
import { LabelButtonWidget } from './label_button_widget';

export const ConnectionFailureWidget = (
  {
    refresh,
  }: {
    refresh: () => void;
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
    }}
  >
    <img
      style={{
        width: `40px`,
        height: `auto`,
      }}
      src={offlineIcon}
    />,
    <div
      style={{
        marginTop: `5px`,

        fontFamily: `Roboto`,
        fontWeight: 400,
        fontSize: `12px`,
        color: `#ffffff`,
      }}
    >
      {`CONNECTION ISSUE`}
    </div>,
    <LabelButtonWidget
      htmlStyle={{
        width: `150px`,
        height: `36px`,
        marginTop: `10px`,

        cursor: `pointer`,
      }}
      labelWidget={{
        getHtmlStyle: ({ isHovered }) => ({

          width: `100%`,
          height: `100%`,

          display: `flex`,
          justifyContent: `center`,
          alignItems: `center`,

          backgroundColor: isHovered
            ? chroma(`#2d9cdb`).brighten().hex()
            : `#2d9cdb`,

          fontFamily: `Roboto`,
          fontWeight: 500,
          fontSize: `12px`,
          color: `#ffffff`,
        }),
        text: `REFRESH`,
      }}
      onClicked={refresh}
    />
  </div>;
};
