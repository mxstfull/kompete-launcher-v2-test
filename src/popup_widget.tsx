import React from 'react';

import { closeWindowIcon } from './assets';
import { ButtonWidget } from './button_widget';

export const PopupWidget = (
  {
    title,
    close,
    createWindowContentWidget,
  }: {
    title: string;
    close: () => void;
    createWindowContentWidget: () => React.ReactNode;
  },
) => {

  return <div
    style={{
      width: `100%`,
      height: `100%`,
      pointerEvents: `initial`,

      ...{
        WebkitAppRegion: `no-drag`,
      },

      display: `flex`,
      justifyContent: `center`,
      alignItems: `center`,

      backgroundColor: `#00000090`,
    }}
  >
    <div
      style={{
        position: `absolute`,
        width: `100%`,
        height: `100%`,
      }}
      onClick={close}
    />
    <div
      style={{
        width: `450px`,
        height: `250px`,

        backgroundColor: `#303030`,
      }}
    >
      <div
        style={{
          width: `100%`,
          height: `100%`,

          display: `flex`,
          flexDirection: `column`,
          justifyContent: `flex-start`,
        }}
      >
        <div
          style={{
            width: `100%`,
            height: `35px`,
            flexGrow: 0,
            flexShrink: 0,

            backgroundColor: `transparent`,
          }}
        >
          <div
            style={{
              width: `100%`,
              height: `100%`,

              display: `flex`,
              justifyContent: `space-between`,
              alignItems: `center`,
            }}
          >
            <div
              style={{
                marginLeft: `20px`,

                fontFamily: `Roboto`,
                fontWeight: 600,
                fontSize: `14px`,
                color: `#ffffff`,
              }}
              children={title}
            />
            <ButtonWidget
              htmlStyle={{
                cursor: `pointer`,
              }}
              onClicked={close}
              createChildWidget={({ isHovered }) => <img
                style={{
                  width: `14px`,
                  height: `14px`,
                  padding: `10.5px`,

                  backgroundColor: isHovered
                    ? `#ff0000`
                    : `transparent`,
                }}
                src={closeWindowIcon}
              />}
            />
          </div>
        </div>
        <div
          style={{
            width: `100%`,
            flexBasis: 0,
            flexGrow: 1,
            flexShrink: 0,
          }}
        >
          {createWindowContentWidget()}
        </div>
      </div>
    </div>
  </div>;
};
