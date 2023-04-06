import React from 'react';

import { HoverableHtmlDivWidget } from './hoverable_html_div_widget';

export const ButtonWidget = (
  {
    htmlStyle,
    onClicked,
    createChildWidget,
  }: {
    htmlStyle?: React.CSSProperties;
    onClicked: () => void;
    createChildWidget: ({ }: { isHovered: boolean; }) => React.ReactNode;
  },
) => {

  return <HoverableHtmlDivWidget
    style={htmlStyle}
    onClick={onClicked}
    createChildren={createChildWidget}
  />;
};
