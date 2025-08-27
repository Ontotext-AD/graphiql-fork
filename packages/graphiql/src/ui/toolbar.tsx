import { type FC, type ReactElement, type ReactNode, useContext } from 'react';
import {
  CopyIcon,
  KEY_MAP,
  MergeIcon,
  PrettifyIcon,
  ToolbarButton,
  useGraphiQLActions,
  TranslationContext,
} from '@graphiql/react';

const DefaultToolbarRenderProps: FC<{
  prettify: ReactNode;
  copy: ReactNode;
  merge: ReactNode;
}> = ({ prettify, copy, merge }) => (
  <>
    {prettify}
    {merge}
    {copy}
  </>
);

/**
 * Configure the UI by providing this Component as a child of GraphiQL.
 */
export const GraphiQLToolbar: FC<{
  children?: typeof DefaultToolbarRenderProps | ReactNode;
}> = ({ children = DefaultToolbarRenderProps }) => {
  const isRenderProp = typeof children === 'function';
  const { copyQuery, prettifyEditors, mergeQuery } = useGraphiQLActions();
  const { currentLanguage, translationService } =
    useContext(TranslationContext);

  if (!isRenderProp) {
    return children as ReactElement;
  }

  const prettyLabel = translationService.translate(
    'graphiql.toolbar.btn.prettify_query.tooltip',
    currentLanguage,
    {key: `${KEY_MAP.prettify.key}`}
  )
  const prettify = (
    <ToolbarButton
      onClick={prettifyEditors}
      label={prettyLabel}
    >
      <PrettifyIcon className="graphiql-toolbar-icon" aria-hidden="true" />
    </ToolbarButton>
  );

  const mergeLabel = translationService.translate(
    'graphiql.toolbar.btn.merge_fragment.tooltip',
    currentLanguage,
    {key: `${KEY_MAP.mergeFragments.key}`}
  )
  const merge = (
    <ToolbarButton
      onClick={mergeQuery}
      label={mergeLabel}
    >
      <MergeIcon className="graphiql-toolbar-icon" aria-hidden="true" />
    </ToolbarButton>
  );

  const copyLabel = translationService.translate(
    'graphiql.toolbar.btn.copy_query.tooltip',
    currentLanguage,
    {key: `${KEY_MAP.copyQuery.key}`}
  )
  const copy = (
    <ToolbarButton
      onClick={copyQuery}
      label={copyLabel}
    >
      <CopyIcon className="graphiql-toolbar-icon" aria-hidden="true" />
    </ToolbarButton>
  );

  const Render = children as FC<{
    prettify: ReactNode;
    copy: ReactNode;
    merge: ReactNode;
  }>;

  return <Render prettify={prettify} copy={copy} merge={merge} />;
};
