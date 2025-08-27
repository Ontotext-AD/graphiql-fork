import type { FC } from 'react';
import { MarkdownContent, TranslateText } from '@graphiql/react';
import './deprecation-reason.css';

type DeprecationReasonProps = {
  /**
   * The deprecation reason as Markdown string.
   */
  children?: string | null;
  preview?: boolean;
};

export const DeprecationReason: FC<DeprecationReasonProps> = props => {
  return props.children ? (
    <div className="graphiql-doc-explorer-deprecation">
      <div className="graphiql-doc-explorer-deprecation-label">
        <TranslateText translationKey="plugin.documentation_explorer.deprecation_reason.deprecated"/>
      </div>
      <MarkdownContent
        type="deprecation"
        onlyShowFirstChild={props.preview ?? true}
      >
        {props.children}
      </MarkdownContent>
    </div>
  ) : null;
};
