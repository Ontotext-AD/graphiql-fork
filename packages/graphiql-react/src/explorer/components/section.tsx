import { ComponentType, ReactNode } from 'react';

import {
  ArgumentIcon,
  DeprecatedArgumentIcon,
  DeprecatedEnumValueIcon,
  DeprecatedFieldIcon,
  DirectiveIcon,
  EnumValueIcon,
  FieldIcon,
  ImplementsIcon,
  RootTypeIcon,
  TypeIcon,
} from '../../icons';

import './section.css';
import {TranslateText} from '../../translation';

type ExplorerSectionProps = {
  children: ReactNode;
  /**
   * The title of the section, which will also determine the icon rendered next
   * to the headline.
   */
  title:
    | 'Root Types'
    | 'Fields'
    | 'Deprecated Fields'
    | 'Type'
    | 'Arguments'
    | 'Deprecated Arguments'
    | 'Implements'
    | 'Implementations'
    | 'Possible Types'
    | 'Enum Values'
    | 'Deprecated Enum Values'
    | 'Directives'
    | 'All Schema Types';
};

export function ExplorerSection(props: ExplorerSectionProps) {
  const Icon = TYPE_TO_ICON[props.title];
  return (
    <div>
      <div className="graphiql-doc-explorer-section-title">
        <Icon />
        <TranslateText translationKey={`plugin.documentation_explorer.section.${normalizeJsonKey(props.title)}.title`}/>
      </div>
      <div className="graphiql-doc-explorer-section-content">
        {props.children}
      </div>
    </div>
  );
}

const TYPE_TO_ICON: Record<ExplorerSectionProps['title'], ComponentType> = {
  Arguments: ArgumentIcon,
  'Deprecated Arguments': DeprecatedArgumentIcon,
  'Deprecated Enum Values': DeprecatedEnumValueIcon,
  'Deprecated Fields': DeprecatedFieldIcon,
  Directives: DirectiveIcon,
  'Enum Values': EnumValueIcon,
  Fields: FieldIcon,
  Implements: ImplementsIcon,
  Implementations: TypeIcon,
  'Possible Types': TypeIcon,
  'Root Types': RootTypeIcon,
  Type: TypeIcon,
  'All Schema Types': TypeIcon,
};

/**
 * Converts a given string into a normalized JSON key by replacing spaces with underscores and converting it to lowercase.
 *
 * @param key - The input string to normalize.
 * @returns A normalized string suitable for use as a JSON key.
 *
 * @example
 * ```typescript
 * normalizeJsonKey("Root Types"); // "root_types"
 * normalizeJsonKey("Enum Values"); // "enum_values"
 * normalizeJsonKey("  Deprecated Fields  "); // "deprecated_fields"
 * ```
 */
const normalizeJsonKey = (key = ''): string => {
  return key.trim().replaceAll(' ', '_').toLowerCase();
};
