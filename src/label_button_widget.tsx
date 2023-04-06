import React from 'react';

import { ButtonWidget } from './button_widget';
import { LabelWidget } from './label_widget';

export const LabelButtonWidget = (
  {
    htmlStyle,
    labelWidget,
    onClicked,
  }: {
    htmlStyle?: React.CSSProperties;
    labelWidget: {
      getHtmlStyle: ({ }: { isHovered: boolean; }) => React.CSSProperties;
      text: string;
    };
    onClicked: () => void;
  },
) => {

  return <ButtonWidget
    htmlStyle={htmlStyle}
    onClicked={onClicked}
    createChildWidget={
      ({ isHovered }) => LabelWidget({
        htmlStyle: labelWidget.getHtmlStyle({ isHovered }),
        text: labelWidget.text,
      })
    }
  />;
};
