import { FC, Fragment } from 'react';
import { formatShortcutForOS, KEY_MAP, TranslateText } from '@graphiql/react';

const SHORT_KEYS = Object.entries({
  'dialog.short_keys.function.execute_query': formatShortcutForOS(KEY_MAP.runQuery.key),
  'dialog.short_keys.function.open_command_palette': 'F1',
  'dialog.short_keys.function.prettify_editors': KEY_MAP.prettify.key,
  'dialog.short_keys.function.copy_query': KEY_MAP.copyQuery.key,
  'dialog.short_keys.function.refresh_schema': KEY_MAP.refetchSchema.key,
  'dialog.short_keys.function.search_in_documentation': formatShortcutForOS(KEY_MAP.searchInDocs.key),
  'dialog.short_keys.function.search_in_editor': formatShortcutForOS(KEY_MAP.searchInEditor.key),
  'dialog.short_keys.function.merge_fragments_into_definition': KEY_MAP.mergeFragments.key,
});

export const ShortKeys: FC = () => {
  return (
    <div>
      <table className="graphiql-table">
        <thead>
          <tr>
            <th><TranslateText translationKey="dialog.short_keys.header.short_key" /></th>
            <th><TranslateText translationKey="dialog.short_keys.header.function" /></th>
          </tr>
        </thead>
        <tbody>
          {SHORT_KEYS.map(([title, keys]) => (
            <tr key={title}>
              <td>
                {keys.split('-').map((key, index, array) => (
                  <Fragment key={key}>
                    <code className="graphiql-key">{key}</code>
                    {index !== array.length - 1 && ' + '}
                  </Fragment>
                ))}
              </td>
              <td><TranslateText translationKey={title} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <TranslateText translationKey="dialog.short_keys.footer" />
      </p>
    </div>
  );
};
