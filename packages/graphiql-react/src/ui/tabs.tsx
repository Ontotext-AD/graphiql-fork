import {forwardRef, ReactNode, useContext} from 'react';
import { clsx } from 'clsx';
import { Reorder } from 'framer-motion';
import { CloseIcon } from '../icons';
import { createComponentGroup } from '../utility/component-group';
import { UnStyledButton } from './button';
import { Tooltip } from './tooltip';

import './tabs.css';
import {TranslationContext} from '../translation';

type TabProps = {
  isActive?: boolean;
  value: object;
  className?: string;
  children: ReactNode;
};

const TabRoot = forwardRef<HTMLLIElement, TabProps>(
  ({ isActive, value, children, className, ...props }, ref) => (
    <Reorder.Item
      {...props}
      ref={ref}
      value={value}
      aria-selected={isActive ? 'true' : undefined}
      role="tab"
      className={clsx(
        'graphiql-tab',
        isActive && 'graphiql-tab-active',
        className,
      )}
    >
      {children}
    </Reorder.Item>
  ),
);
TabRoot.displayName = 'Tab';

const TabButton = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements['button']
>((props, ref) => (
  <UnStyledButton
    {...props}
    ref={ref}
    type="button"
    className={clsx('graphiql-tab-button', props.className)}
  >
    {props.children}
  </UnStyledButton>
));
TabButton.displayName = 'Tab.Button';

const TabClose = forwardRef<HTMLButtonElement, JSX.IntrinsicElements['button']>(
  (props, ref) => {
    
    const { currentLanguage, translationService } = useContext(TranslationContext);
    const btnCloseTabeTooltip = translationService.translate('graphiql.tab.btn.close_tab.tooltip', currentLanguage);
    
    return (
    <Tooltip label={btnCloseTabeTooltip}>
      <UnStyledButton
        aria-label={btnCloseTabeTooltip}
        {...props}
        ref={ref}
        type="button"
        className={clsx('graphiql-tab-close', props.className)}
      >
        <CloseIcon />
      </UnStyledButton>
    </Tooltip>
  )},
);
TabClose.displayName = 'Tab.Close';

export const Tab = createComponentGroup(TabRoot, {
  Button: TabButton,
  Close: TabClose,
});

type TabsProps = {
  values: object[];
  onReorder: (newOrder: any[]) => void;
  className?: string;
  children: ReactNode;
};

export const Tabs = forwardRef<HTMLUListElement, TabsProps>(
  ({ values, onReorder, children, className, ...props }, ref) => (
    <Reorder.Group
      {...props}
      ref={ref}
      values={values}
      onReorder={onReorder}
      axis="x"
      role="tablist"
      className={clsx('graphiql-tabs', className)}
    >
      {children}
    </Reorder.Group>
  ),
);
Tabs.displayName = 'Tabs';
