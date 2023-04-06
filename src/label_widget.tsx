import React from 'react';

export const LabelWidget = (
  {
    htmlStyle,
    text,
  }: {
    htmlStyle?: React.CSSProperties;
    text: string;
  },
) => {

  return <div
    style={htmlStyle}
  >
    {text}
  </div>;
};
