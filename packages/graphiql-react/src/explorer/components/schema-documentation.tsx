import type { GraphQLSchema } from 'graphql';

import { MarkdownContent } from '../../ui';
import { ExplorerSection } from './section';
import { TypeLink } from './type-link';

import './schema-documentation.css';
import {TranslateText} from '../../translation';

type SchemaDocumentationProps = {
  /**
   * The schema that should be rendered.
   */
  schema: GraphQLSchema;
};

export function SchemaDocumentation(props: SchemaDocumentationProps) {
  const queryType = props.schema.getQueryType();
  const mutationType = props.schema.getMutationType?.();
  const subscriptionType = props.schema.getSubscriptionType?.();
  const typeMap = props.schema.getTypeMap();
  const ignoreTypesInAllSchema = [
    queryType?.name,
    mutationType?.name,
    subscriptionType?.name,
  ];

  return (
    <>
      {props.schema.description ?
        <MarkdownContent type="description">{props.schema.description}</MarkdownContent>
        :
        <div>
          <TranslateText translationKey="plugin.documentation_explorer.root_type.default_description"/>
        </div>
      }
      <ExplorerSection title="Root Types">
        {queryType ? (
          <div>
            <span className="graphiql-doc-explorer-root-type">
              <TranslateText translationKey="plugin.documentation_explorer.root_type.query"/>
            </span>
            {': '}
            <TypeLink type={queryType} />
          </div>
        ) : null}
        {mutationType && (
          <div>
            <span className="graphiql-doc-explorer-root-type">
              <TranslateText translationKey="plugin.documentation_explorer.root_type.mutation"/>
            </span>
            {': '}
            <TypeLink type={mutationType} />
          </div>
        )}
        {subscriptionType && (
          <div>
            <span className="graphiql-doc-explorer-root-type">
              <TranslateText translationKey="plugin.documentation_explorer.root_type.subscription"/>
            </span>
            {': '}
            <TypeLink type={subscriptionType} />
          </div>
        )}
      </ExplorerSection>
      <ExplorerSection title="All Schema Types">
        {typeMap && (
          <div>
            {Object.values(typeMap).map(type => {
              if (
                ignoreTypesInAllSchema.includes(type.name) ||
                type.name.startsWith('__')
              ) {
                return null;
              }

              return (
                <div key={type.name}>
                  <TypeLink type={type} />
                </div>
              );
            })}
          </div>
        )}
      </ExplorerSection>
    </>
  );
}
