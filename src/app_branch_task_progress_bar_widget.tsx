import React from 'react';

export const AppBranchTaskProgressBarWidget = (
  {
    fillWidget,
    percentage,
  }: {
    fillWidget: {
      shouldBeAnimatedIfPercentageIsUndefined: boolean;
      htmlStyle: {
        backgroundColor: string;
      };
    };
    percentage?: number;
  },
) => {

  const [undefinedPercentageAnimationValue, setUndefinedPercentageAnimationValue] =
    React.useState<number>(0);

  React.useEffect(
    () => {

      const timeout = setTimeout(
        () => {

          setUndefinedPercentageAnimationValue(
            (undefinedPercentageAnimationValue + 1) % 100,
          );
        },
        15,
      );

      return () => {

        clearInterval(timeout);
      };
    },
    [
      undefinedPercentageAnimationValue,
    ],
  );

  return <div
    style={{
      width: `100%`,
      height: `100%`,
      borderRadius: `2px`,

      backgroundColor: `#ffffff`,
    }}
  >{[
    percentage === undefined && fillWidget.shouldBeAnimatedIfPercentageIsUndefined
      ? <div
        key={`animatedFillWidget`}
        style={{
          position: `absolute`,
          width: `20%`,
          top: `0px`,
          left: `${undefinedPercentageAnimationValue * 1.4 - 20}%`,
          height: `100%`,
          borderRadius: `2px`,

          backgroundColor: fillWidget.htmlStyle.backgroundColor,
        }}
      />
      : <div
        key={`fillWidget`}
        style={{
          position: `absolute`,
          width: `${percentage ?? 0}%`,
          top: `0px`,
          left: `0px`,
          height: `100%`,
          borderRadius: `2px`,

          backgroundColor: fillWidget.htmlStyle.backgroundColor,
        }}
      />,
  ]}</div>;
};
