import React from 'react';

export const HoverableHtmlDivWidget = (
  props: Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
    createChildren: ({ }: { isHovered: boolean; }) => React.ReactNode;
    isHoveredWhenMounted?: boolean;
    hoveredExpireMs?: number;
    persistHoveredAfterMouseLeave?: boolean;
  },
) => {

  const {
    createChildren,
    isHoveredWhenMounted,
    hoveredExpireMs,
    persistHoveredAfterMouseLeave,
  } = props;

  const [isHovered, setIsHovered] = React.useState<boolean>(false);
  const [hoverExpireTimeout, setHoverExpireTimeout] =
    React.useState<NodeJS.Timeout | undefined>(undefined);
  const [isMounted, setIsMounted] = React.useState<boolean>(false);

  const setNotHovered = () => {

    if (hoverExpireTimeout !== undefined) {

      clearTimeout(hoverExpireTimeout);
    }

    setIsHovered(false);
  };

  const setHovered = () => {

    if (hoverExpireTimeout !== undefined) {

      clearTimeout(hoverExpireTimeout);
    }

    if (hoveredExpireMs !== undefined) {

      setHoverExpireTimeout(
        setTimeout(
          () => setNotHovered(),
          hoveredExpireMs,
        ),
      );
    }

    setIsHovered(true);
  };

  React.useEffect(
    () => {

      if (isMounted) {

        return;
      }

      if (isHoveredWhenMounted !== undefined && isHoveredWhenMounted) {

        setHovered();
      }

      setIsMounted(true);
    },
    [isMounted],
  );

  React.useEffect(
    () => {

      return () => {

        if (hoverExpireTimeout !== undefined) {

          clearTimeout(hoverExpireTimeout);
        }
      };
    },
  );

  const htmlDivWidgetProps = {
    ...props,
    createChildren: undefined,
    isHoveredWhenMounted: undefined,
    hoveredExpireMs: undefined,
    persistHoveredAfterMouseLeave: undefined,
  };

  delete htmlDivWidgetProps.createChildren;
  delete htmlDivWidgetProps.isHoveredWhenMounted;
  delete htmlDivWidgetProps.hoveredExpireMs;
  delete htmlDivWidgetProps.persistHoveredAfterMouseLeave;

  return React.createElement(`div`, {
    ...htmlDivWidgetProps,
    children: createChildren({ isHovered }),
    onMouseEnter: (e: any) => {

      setHovered();

      if (props.onMouseEnter !== undefined) {

        props.onMouseEnter(e);
      }
    },
    onMouseMove: (e: any) => {

      setHovered();

      if (props.onMouseMove !== undefined) {

        props.onMouseMove(e);
      }
    },
    onMouseLeave: (e: any) => {

      if (persistHoveredAfterMouseLeave === undefined || !persistHoveredAfterMouseLeave) {

        setNotHovered();
      }

      if (props.onMouseLeave !== undefined) {

        props.onMouseLeave(e);
      }
    },
  });
};
