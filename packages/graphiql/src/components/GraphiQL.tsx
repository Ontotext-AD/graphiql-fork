/**
 *  Copyright (c) 2020 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import React, {
  ComponentType,
  Fragment,
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  ReactElement,
  useCallback,
  useState,
  useEffect,
  useMemo,
  useContext,
} from 'react';

import {
  Button,
  ButtonGroup,
  ChevronDownIcon,
  ChevronUpIcon,
  CopyIcon,
  Dialog,
  ExecuteButton,
  GraphiQLProvider,
  GraphiQLProviderProps,
  HeaderEditor,
  KeyboardShortcutIcon,
  MergeIcon,
  PlusIcon,
  PrettifyIcon,
  QueryEditor,
  ReloadIcon,
  ResponseEditor,
  SettingsIcon,
  Spinner,
  Tab,
  Tabs,
  Theme,
  ToolbarButton,
  Tooltip,
  UnStyledButton,
  useCopyQuery,
  useDragResize,
  useEditorContext,
  useExecutionContext,
  UseHeaderEditorArgs,
  useMergeQuery,
  usePluginContext,
  usePrettifyEditors,
  UseQueryEditorArgs,
  UseResponseEditorArgs,
  useSchemaContext,
  useStorageContext,
  useTheme,
  UseVariableEditorArgs,
  VariableEditor,
  WriteableEditorProps,
  isMacOs,
  TranslationProvider,
  TranslateText,
  LanguageSelector,
  TranslationContext,
} from '@graphiql/react';

const majorVersion = parseInt(React.version.slice(0, 2), 10);

if (majorVersion < 16) {
  throw new Error(
    [
      'GraphiQL 0.18.0 and after is not compatible with React 15 or below.',
      'If you are using a CDN source (jsdelivr, unpkg, etc), follow this example:',
      'https://github.com/graphql/graphiql/blob/master/examples/graphiql-cdn/index.html#L49',
    ].join('\n'),
  );
}

export type GraphiQLToolbarConfig = {
  /**
   * This content will be rendered after the built-in buttons of the toolbar.
   * Note that this will not apply if you provide a completely custom toolbar
   * (by passing `GraphiQL.Toolbar` as child to the `GraphiQL` component).
   */
  additionalContent?: React.ReactNode;

  /**
   * same as above, except a component with access to context
   */
  additionalComponent?: React.JSXElementConstructor<any>;
};

/**
 * API docs for this live here:
 *
 * https://graphiql-test.netlify.app/typedoc/modules/graphiql.html#graphiqlprops
 */
export type GraphiQLProps = Omit<GraphiQLProviderProps, 'children'> &
  GraphiQLInterfaceProps;

/**
 * The top-level React component for GraphiQL, intended to encompass the entire
 * browser viewport.
 *
 * @see https://github.com/graphql/graphiql#usage
 */
export function GraphiQL({
  dangerouslyAssumeSchemaIsValid,
  confirmCloseTab,
  defaultQuery,
  defaultTabs,
  externalFragments,
  fetcher,
  getDefaultFieldNames,
  headers,
  inputValueDeprecation,
  introspectionQueryName,
  maxHistoryLength,
  onEditOperationName,
  onSchemaChange,
  onTabChange,
  onTogglePluginVisibility,
  operationName,
  plugins,
  query,
  response,
  schema,
  schemaDescription,
  shouldPersistHeaders,
  storage,
  validationRules,
  variables,
  visiblePlugin,
  defaultHeaders,
  ...props
}: GraphiQLProps) {
  // Ensure props are correct
  if (typeof fetcher !== 'function') {
    throw new TypeError(
      'The `GraphiQL` component requires a `fetcher` function to be passed as prop.',
    );
  }

  return (
    <TranslationProvider {...props}>
    <GraphiQLProvider
      getDefaultFieldNames={getDefaultFieldNames}
      dangerouslyAssumeSchemaIsValid={dangerouslyAssumeSchemaIsValid}
      defaultQuery={defaultQuery}
      defaultHeaders={defaultHeaders}
      defaultTabs={defaultTabs}
      externalFragments={externalFragments}
      fetcher={fetcher}
      headers={headers}
      inputValueDeprecation={inputValueDeprecation}
      introspectionQueryName={introspectionQueryName}
      maxHistoryLength={maxHistoryLength}
      onEditOperationName={onEditOperationName}
      onSchemaChange={onSchemaChange}
      onTabChange={onTabChange}
      onTogglePluginVisibility={onTogglePluginVisibility}
      plugins={plugins}
      visiblePlugin={visiblePlugin}
      operationName={operationName}
      query={query}
      response={response}
      schema={schema}
      schemaDescription={schemaDescription}
      shouldPersistHeaders={shouldPersistHeaders}
      storage={storage}
      validationRules={validationRules}
      variables={variables}
    >
        
        <GraphiQLInterface
          confirmCloseTab={confirmCloseTab}
          showPersistHeadersSettings={shouldPersistHeaders !== false}
          disableTabs={props.disableTabs ?? false}
          forcedTheme={props.forcedTheme}
          {...props}
        />
    </GraphiQLProvider>
    </TranslationProvider>
  );
}

// Export main windows/panes to be used separately if desired.
GraphiQL.Logo = GraphiQLLogo;
GraphiQL.Toolbar = GraphiQLToolbar;
GraphiQL.Footer = GraphiQLFooter;

type AddSuffix<Obj extends Record<string, any>, Suffix extends string> = {
  [Key in keyof Obj as `${string & Key}${Suffix}`]: Obj[Key];
};

export type GraphiQLInterfaceProps = WriteableEditorProps &
  AddSuffix<Pick<UseQueryEditorArgs, 'onEdit'>, 'Query'> &
  Pick<UseQueryEditorArgs, 'onCopyQuery'> &
  AddSuffix<Pick<UseVariableEditorArgs, 'onEdit'>, 'Variables'> &
  AddSuffix<Pick<UseHeaderEditorArgs, 'onEdit'>, 'Headers'> &
  Pick<UseResponseEditorArgs, 'responseTooltip'> & {
    children?: ReactNode;
    /**
     * Set the default state for the editor tools.
     * - `false` hides the editor tools
     * - `true` shows the editor tools
     * - `'variables'` specifically shows the variables editor
     * - `'headers'` specifically shows the headers editor
     * By default the editor tools are initially shown when at least one of the
     * editors has contents.
     */
    defaultEditorToolsVisibility?: boolean | 'variables' | 'headers';
    /**
     * Toggle if the headers editor should be shown inside the editor tools.
     * @default true
     */
    isHeadersEditorEnabled?: boolean;
    /**
     * An object that allows configuration of the toolbar next to the query
     * editor.
     */
    toolbar?: GraphiQLToolbarConfig;
    /**
     * Indicates if settings for persisting headers should appear in the
     * settings modal.
     */
    showPersistHeadersSettings?: boolean;
    defaultTheme?: Theme;
    disableTabs?: boolean;
    /**
     * `forcedTheme` allows enforcement of a specific theme for GraphiQL.
     * This is useful when you want to make sure that GraphiQL is always
     * rendered with a specific theme.
     */
    forcedTheme?: (typeof THEMES)[number];
    /**
     * Additional class names which will be appended to the container element.
     */
    className?: string;
    /**
     * When the user clicks a close tab button, this function is invoked with
     * the index of the tab that is about to be closed. It can return a promise
     * that should resolve to `true` (meaning the tab may be closed) or `false`
     * (meaning the tab may not be closed).
     * @param index The index of the tab that should be closed.
     */
    confirmCloseTab?(index: number): Promise<boolean> | boolean;
  };

const THEMES = ['light', 'dark', 'system'] as const;

const TAB_CLASS_PREFIX = 'graphiql-session-tab-';

export function GraphiQLInterface(props: GraphiQLInterfaceProps) {
  const isHeadersEditorEnabled = props.isHeadersEditorEnabled ?? true;
  const editorContext = useEditorContext({ nonNull: true });
  const executionContext = useExecutionContext({ nonNull: true });
  const schemaContext = useSchemaContext({ nonNull: true });
  const storageContext = useStorageContext();
  const pluginContext = usePluginContext();
  const forcedTheme = useMemo(
    () =>
      props.forcedTheme && THEMES.includes(props.forcedTheme)
        ? props.forcedTheme
        : undefined,
    [props.forcedTheme],
  );

  const copy = useCopyQuery({ onCopyQuery: props.onCopyQuery });
  const merge = useMergeQuery();
  const prettify = usePrettifyEditors();
  const { currentLanguage, translationService } =
    useContext(TranslationContext);

  const { theme, setTheme } = useTheme(props.defaultTheme);

  useEffect(() => {
    if (forcedTheme === 'system') {
      setTheme(null);
    } else if (forcedTheme === 'light' || forcedTheme === 'dark') {
      setTheme(forcedTheme);
    }
  }, [forcedTheme, setTheme]);

  const PluginContent = pluginContext?.visiblePlugin?.content;

  const pluginResize = useDragResize({
    defaultSizeRelation: 1 / 3,
    direction: 'horizontal',
    initiallyHidden: pluginContext?.visiblePlugin ? undefined : 'first',
    onHiddenElementChange(resizableElement) {
      if (resizableElement === 'first') {
        pluginContext?.setVisiblePlugin(null);
      }
    },
    sizeThresholdSecond: 200,
    storageKey: 'docExplorerFlex',
  });
  const editorResize = useDragResize({
    direction: 'horizontal',
    storageKey: 'editorFlex',
  });
  const editorToolsResize = useDragResize({
    defaultSizeRelation: 3,
    direction: 'vertical',
    initiallyHidden: (() => {
      if (
        props.defaultEditorToolsVisibility === 'variables' ||
        props.defaultEditorToolsVisibility === 'headers'
      ) {
        return;
      }

      if (typeof props.defaultEditorToolsVisibility === 'boolean') {
        return props.defaultEditorToolsVisibility ? undefined : 'second';
      }

      return editorContext.initialVariables || editorContext.initialHeaders
        ? undefined
        : 'second';
    })(),
    sizeThresholdSecond: 60,
    storageKey: 'secondaryEditorFlex',
  });

  const [activeSecondaryEditor, setActiveSecondaryEditor] = useState<
    'variables' | 'headers'
  >(() => {
    if (
      props.defaultEditorToolsVisibility === 'variables' ||
      props.defaultEditorToolsVisibility === 'headers'
    ) {
      return props.defaultEditorToolsVisibility;
    }
    return !editorContext.initialVariables &&
      editorContext.initialHeaders &&
      isHeadersEditorEnabled
      ? 'headers'
      : 'variables';
  });
  const [showDialog, setShowDialog] = useState<
    'settings' | 'short-keys' | null
  >(null);
  const [clearStorageStatus, setClearStorageStatus] = useState<
    'success' | 'error' | null
  >(null);

  const children = React.Children.toArray(props.children);

  const logo = children.find(child =>
    isChildComponentType(child, GraphiQL.Logo),
  ) || <GraphiQL.Logo />;

  const toolbar = children.find(child =>
    isChildComponentType(child, GraphiQL.Toolbar),
  ) || (
    <>
      <ToolbarButton
        onClick={prettify}
        labelKey="graphiql.toolbar.btn.prettify_query.tooltip"
      >
        <PrettifyIcon className="graphiql-toolbar-icon" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        onClick={merge}
        labelKey="graphiql.toolbar.btn.merge_fragment.tooltip"
      >
        <MergeIcon className="graphiql-toolbar-icon" aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton
        onClick={copy}
        labelKey="graphiql.toolbar.btn.copy_query.tooltip"
      >
        <CopyIcon className="graphiql-toolbar-icon" aria-hidden="true" />
      </ToolbarButton>
      {props.toolbar?.additionalContent}
      {props.toolbar?.additionalComponent && (
        <props.toolbar.additionalComponent />
      )}
    </>
  );

  const footer = children.find(child =>
    isChildComponentType(child, GraphiQL.Footer),
  );

  const onClickReference = useCallback(() => {
    if (pluginResize.hiddenElement === 'first') {
      pluginResize.setHiddenElement(null);
    }
  }, [pluginResize]);

  const handleClearData = useCallback(() => {
    try {
      storageContext?.clear();
      setClearStorageStatus('success');
    } catch {
      setClearStorageStatus('error');
    }
  }, [storageContext]);

  const handlePersistHeaders: MouseEventHandler<HTMLButtonElement> =
    useCallback(
      event => {
        editorContext.setShouldPersistHeaders(
          event.currentTarget.dataset.value === 'true',
        );
      },
      [editorContext],
    );

  const handleChangeTheme: MouseEventHandler<HTMLButtonElement> = useCallback(
    event => {
      const selectedTheme = event.currentTarget.dataset.theme as
        | 'light'
        | 'dark'
        | undefined;
      setTheme(selectedTheme || null);
    },
    [setTheme],
  );

  const handleAddTab = editorContext.addTab;
  const handleRefetchSchema = schemaContext.introspect;
  const handleReorder = editorContext.moveTab;

  const handleShowDialog: MouseEventHandler<HTMLButtonElement> = useCallback(
    event => {
      setShowDialog(
        event.currentTarget.dataset.value as 'short-keys' | 'settings',
      );
    },
    [],
  );

  const handlePluginClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    event => {
      const context = pluginContext!;
      const pluginIndex = Number(event.currentTarget.dataset.index!);
      const plugin = context.plugins.find((_, index) => pluginIndex === index)!;
      const isVisible = plugin === context.visiblePlugin;
      if (isVisible) {
        context.setVisiblePlugin(null);
        pluginResize.setHiddenElement('first');
      } else {
        context.setVisiblePlugin(plugin);
        pluginResize.setHiddenElement(null);
      }
    },
    [pluginContext, pluginResize],
  );

  const handleToolsTabClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    event => {
      if (editorToolsResize.hiddenElement === 'second') {
        editorToolsResize.setHiddenElement(null);
      }
      setActiveSecondaryEditor(
        event.currentTarget.dataset.name as 'variables' | 'headers',
      );
    },
    [editorToolsResize],
  );

  const toggleEditorTools: MouseEventHandler<HTMLButtonElement> =
    useCallback(() => {
      editorToolsResize.setHiddenElement(
        editorToolsResize.hiddenElement === 'second' ? null : 'second',
      );
    }, [editorToolsResize]);

  const handleOpenShortKeysDialog = useCallback((isOpen: boolean) => {
    if (!isOpen) {
      setShowDialog(null);
    }
  }, []);

  const handleOpenSettingsDialog = useCallback((isOpen: boolean) => {
    if (!isOpen) {
      setShowDialog(null);
      setClearStorageStatus(null);
    }
  }, []);

  const addTabLabel = translationService.translate(
    'graphiql.tab.btn.add_tab.tooltip',
    currentLanguage,
  );
  const addTab = (
    <Tooltip label={addTabLabel}>
      <UnStyledButton
        type="button"
        className="graphiql-tab-add"
        onClick={handleAddTab}
        aria-label={addTabLabel}
      >
        <PlusIcon aria-hidden="true" />
      </UnStyledButton>
    </Tooltip>
  );

  const className = props.className ? ` ${props.className}` : '';
  const confirmClose = props.confirmCloseTab;

  const handleTabClose: MouseEventHandler<HTMLButtonElement> = useCallback(
    async event => {
      const tabButton = event.currentTarget
        .previousSibling as HTMLButtonElement;
      const index = Number(tabButton.id.replace(TAB_CLASS_PREFIX, ''));

      /** TODO:
       * Move everything after into `editorContext.closeTab` once zustand will be used instead of
       * React context, since now we can't use execution context inside editor context, since editor
       * context is used in execution context.
       */
      const shouldCloseTab = confirmClose ? await confirmClose(index) : true;

      if (!shouldCloseTab) {
        return;
      }

      if (editorContext.activeTabIndex === index) {
        executionContext.stop();
      }
      editorContext.closeTab(index);
    },
    [confirmClose, editorContext, executionContext],
  );

  const handleTabClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    event => {
      const index = Number(
        event.currentTarget.id.replace(TAB_CLASS_PREFIX, ''),
      );
      /** TODO:
       * Move everything after into `editorContext.changeTab` once zustand will be used instead of
       * React context, since now we can't use execution context inside editor context, since editor
       * context is used in execution context.
       */
      executionContext.stop();
      editorContext.changeTab(index);
    },
    [editorContext, executionContext],
  );

  return (
    <Tooltip.Provider>
      <div
        data-testid="graphiql-container"
        className={`graphiql-container${className}`}
      >
        <div className="graphiql-sidebar">
          <div className="graphiql-sidebar-section">
            {pluginContext?.plugins.map((plugin, index) => {
              const isVisible = plugin === pluginContext.visiblePlugin;
              const pluginTitle = translationService.translate(`plugin.${plugin.id}.title`, currentLanguage);
              const labelKey = 'plugin.btn.' + (isVisible ? 'hide_plugin' : 'show_plugin');
              const label = translationService.translate(labelKey, currentLanguage, {pluginTitle});
              return (
                <Tooltip key={plugin.title} label={label}>
                  <UnStyledButton
                    type="button"
                    className={isVisible ? 'active' : ''}
                    onClick={handlePluginClick}
                    data-index={index}
                    aria-label={label}
                  >
                    <plugin.icon aria-hidden="true" />
                  </UnStyledButton>
                </Tooltip>
              );
            })}
          </div>
          <div className="graphiql-sidebar-section">
            <Tooltip
              label={
                <TranslateText translationKey="graphiql.sidebar.btn.refresh_graphql_schema" />
              }
            >
              <UnStyledButton
                type="button"
                disabled={schemaContext.isFetching}
                onClick={handleRefetchSchema}
                aria-label={translationService.translate(
                  'graphiql.sidebar.btn.refresh_graphql_schema',
                  currentLanguage,
                )}
              >
                <ReloadIcon
                  className={schemaContext.isFetching ? 'graphiql-spin' : ''}
                  aria-hidden="true"
                />
              </UnStyledButton>
            </Tooltip>
            <Tooltip
              label={
                <TranslateText translationKey="graphiql.sidebar.btn.open_short_keys_dialog" />
              }
            >
              <UnStyledButton
                type="button"
                data-value="short-keys"
                onClick={handleShowDialog}
                aria-label={translationService.translate(
                  'graphiql.sidebar.btn.open_short_keys_dialog',
                  currentLanguage,
                )}
              >
                <KeyboardShortcutIcon aria-hidden="true" />
              </UnStyledButton>
            </Tooltip>
            <Tooltip
              label={
                <TranslateText translationKey="graphiql.sidebar.btn.open_settings_dialog" />
              }
            >
              <UnStyledButton
                type="button"
                data-value="settings"
                onClick={handleShowDialog}
                aria-label={translationService.translate(
                  'graphiql.sidebar.btn.open_settings_dialog',
                  currentLanguage,
                )}
              >
                <SettingsIcon aria-hidden="true" />
              </UnStyledButton>
            </Tooltip>
          </div>
        </div>
        <div className="graphiql-main">
          <div
            ref={pluginResize.firstRef}
            style={{
              // Make sure the container shrinks when containing long
              // non-breaking texts
              minWidth: '200px',
            }}
          >
            <div className="graphiql-plugin">
              {PluginContent ? <PluginContent /> : null}
            </div>
          </div>
          {pluginContext?.visiblePlugin && (
            <div
              className="graphiql-horizontal-drag-bar"
              ref={pluginResize.dragBarRef}
            />
          )}
          <div ref={pluginResize.secondRef} className="graphiql-sessions">
            <div className="graphiql-session-header">
              {!props.disableTabs && (
                <Tabs
                  values={editorContext.tabs}
                  onReorder={handleReorder}
                  aria-label="Select active operation"
                >
                  {editorContext.tabs.length > 1 && (
                    <>
                      {editorContext.tabs.map((tab, index) => (
                        <Tab
                          key={tab.id}
                          value={tab}
                          isActive={index === editorContext.activeTabIndex}
                        >
                          <Tab.Button
                            aria-controls="graphiql-session"
                            id={`${TAB_CLASS_PREFIX}${index}`}
                            onClick={handleTabClick}
                          >
                            {tab.title}
                          </Tab.Button>
                          <Tab.Close onClick={handleTabClose} />
                        </Tab>
                      ))}
                      {addTab}
                    </>
                  )}
                </Tabs>
              )}
              <div className="graphiql-session-header-right">
                {editorContext.tabs.length === 1 && addTab}
                {logo}
              </div>
            </div>
            <div
              role="tabpanel"
              id="graphiql-session" // used by aria-controls="graphiql-session"
              className="graphiql-session"
              aria-labelledby={`${TAB_CLASS_PREFIX}${editorContext.activeTabIndex}`}
            >
              <div ref={editorResize.firstRef}>
                <div
                  className={`graphiql-editors${
                    editorContext.tabs.length === 1 ? ' full-height' : ''
                  }`}
                >
                  <div ref={editorToolsResize.firstRef}>
                    <section
                      className="graphiql-query-editor"
                      aria-label="Query Editor"
                    >
                      <QueryEditor
                        editorTheme={props.editorTheme}
                        keyMap={props.keyMap}
                        onClickReference={onClickReference}
                        onCopyQuery={props.onCopyQuery}
                        onEdit={props.onEditQuery}
                        readOnly={props.readOnly}
                      />
                      <div
                        className="graphiql-toolbar"
                        role="toolbar"
                        aria-label="Editor Commands"
                      >
                        <ExecuteButton />
                        {toolbar}
                      </div>
                    </section>
                  </div>

                  <div ref={editorToolsResize.dragBarRef}>
                    <div className="graphiql-editor-tools">
                      <UnStyledButton
                        type="button"
                        className={
                          activeSecondaryEditor === 'variables' &&
                          editorToolsResize.hiddenElement !== 'second'
                            ? 'active'
                            : ''
                        }
                        onClick={handleToolsTabClick}
                        data-name="variables"
                      >
                        <TranslateText translationKey="graphiql.editor.tools.btn.variables.label" />
                      </UnStyledButton>
                      {isHeadersEditorEnabled && (
                        <UnStyledButton
                          type="button"
                          className={
                            activeSecondaryEditor === 'headers' &&
                            editorToolsResize.hiddenElement !== 'second'
                              ? 'active'
                              : ''
                          }
                          onClick={handleToolsTabClick}
                          data-name="headers"
                        >
                          <TranslateText translationKey="graphiql.editor.tools.btn.headers.label" />
                        </UnStyledButton>
                      )}

                      <Tooltip
                        label={
                          editorToolsResize.hiddenElement === 'second' ? (
                            <TranslateText translationKey="graphiql.editor.tools.btn.open_editor.tooltip" />
                          ) : (
                            <TranslateText translationKey="graphiql.editor.tools.btn.close_editor.tooltip" />
                          )
                        }
                      >
                        <UnStyledButton
                          type="button"
                          onClick={toggleEditorTools}
                          aria-label={
                            editorToolsResize.hiddenElement === 'second'
                              ? 'Show editor tools'
                              : 'Hide editor tools'
                          }
                          className="graphiql-toggle-editor-tools"
                        >
                          {editorToolsResize.hiddenElement === 'second' ? (
                            <ChevronUpIcon
                              className="graphiql-chevron-icon"
                              aria-hidden="true"
                            />
                          ) : (
                            <ChevronDownIcon
                              className="graphiql-chevron-icon"
                              aria-hidden="true"
                            />
                          )}
                        </UnStyledButton>
                      </Tooltip>
                    </div>
                  </div>

                  <div ref={editorToolsResize.secondRef}>
                    <section
                      className="graphiql-editor-tool"
                      aria-label={
                        activeSecondaryEditor === 'variables'
                          ? 'Variables'
                          : 'Headers'
                      }
                    >
                      <VariableEditor
                        editorTheme={props.editorTheme}
                        isHidden={activeSecondaryEditor !== 'variables'}
                        keyMap={props.keyMap}
                        onEdit={props.onEditVariables}
                        onClickReference={onClickReference}
                        readOnly={props.readOnly}
                      />
                      {isHeadersEditorEnabled && (
                        <HeaderEditor
                          editorTheme={props.editorTheme}
                          isHidden={activeSecondaryEditor !== 'headers'}
                          keyMap={props.keyMap}
                          onEdit={props.onEditHeaders}
                          readOnly={props.readOnly}
                        />
                      )}
                    </section>
                  </div>
                </div>
              </div>

              <div
                className="graphiql-horizontal-drag-bar"
                ref={editorResize.dragBarRef}
              />

              <div ref={editorResize.secondRef}>
                <div className="graphiql-response">
                  {executionContext.isFetching ? <Spinner /> : null}
                  <ResponseEditor
                    editorTheme={props.editorTheme}
                    responseTooltip={props.responseTooltip}
                    keyMap={props.keyMap}
                  />
                  {footer}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Dialog
          open={showDialog === 'short-keys'}
          onOpenChange={handleOpenShortKeysDialog}
        >
          <div className="graphiql-dialog-header">
            <Dialog.Title className="graphiql-dialog-title">
              <TranslateText translationKey="dialog.short_keys.title" />
            </Dialog.Title>
            <Dialog.Close />
          </div>
          <div className="graphiql-dialog-section">
            <ShortKeys keyMap={props.keyMap || 'sublime'} />
          </div>
        </Dialog>
        <Dialog
          open={showDialog === 'settings'}
          onOpenChange={handleOpenSettingsDialog}
        >
          <div className="graphiql-dialog-header">
            <Dialog.Title className="graphiql-dialog-title">
              <TranslateText translationKey="dialog.settings.title" />
            </Dialog.Title>
            <Dialog.Close />
          </div>
          <div className="graphiql-dialog-section">
            <div>
              <div className="graphiql-dialog-section-title">
                <TranslateText translationKey="dialog.settings.language.title" />
              </div>
              <div className="graphiql-dialog-section-caption">
                <TranslateText translationKey="dialog.settings.language.description" />
              </div>
            </div>
            <LanguageSelector />
          </div>

          {props.showPersistHeadersSettings ? (
            <div className="graphiql-dialog-section">
              <div>
                <div className="graphiql-dialog-section-title">
                  <TranslateText translationKey="dialog.settings.persisted_headers.title" />
                </div>
                <div className="graphiql-dialog-section-caption">
                  <TranslateText translationKey="dialog.settings.persisted_headers.description" />
                </div>
              </div>
              <ButtonGroup>
                <Button
                  type="button"
                  id="enable-persist-headers"
                  className={editorContext.shouldPersistHeaders ? 'active' : ''}
                  data-value="true"
                  onClick={handlePersistHeaders}
                >
                  <TranslateText translationKey="dialog.settings.persisted_headers.btn.on" />
                </Button>
                <Button
                  type="button"
                  id="disable-persist-headers"
                  className={editorContext.shouldPersistHeaders ? '' : 'active'}
                  onClick={handlePersistHeaders}
                >
                  <TranslateText translationKey="dialog.settings.persisted_headers.btn.off" />
                </Button>
              </ButtonGroup>
            </div>
          ) : null}
          {!forcedTheme && (
            <div className="graphiql-dialog-section">
              <div>
                <div className="graphiql-dialog-section-title">
                  <TranslateText translationKey="dialog.settings.theme.title" />
                </div>
                <div className="graphiql-dialog-section-caption">
                  <TranslateText translationKey="dialog.settings.theme.description" />
                </div>
              </div>
              <ButtonGroup>
                <Button
                  type="button"
                  className={theme === null ? 'active' : ''}
                  onClick={handleChangeTheme}
                >
                  <TranslateText translationKey="dialog.settings.theme.btn.system" />
                </Button>
                <Button
                  type="button"
                  className={theme === 'light' ? 'active' : ''}
                  data-theme="light"
                  onClick={handleChangeTheme}
                >
                  <TranslateText translationKey="dialog.settings.theme.btn.light" />
                </Button>
                <Button
                  type="button"
                  className={theme === 'dark' ? 'active' : ''}
                  data-theme="dark"
                  onClick={handleChangeTheme}
                >
                  <TranslateText translationKey="dialog.settings.theme.btn.dark" />
                </Button>
              </ButtonGroup>
            </div>
          )}
          {storageContext ? (
            <div className="graphiql-dialog-section">
              <div>
                <div className="graphiql-dialog-section-title">
                  <TranslateText translationKey="dialog.settings.clear_storage.title" />
                </div>
                <div className="graphiql-dialog-section-caption">
                  <TranslateText translationKey="dialog.settings.clear_storage.description" />
                </div>
              </div>
              <Button
                type="button"
                state={clearStorageStatus || undefined}
                disabled={clearStorageStatus === 'success'}
                onClick={handleClearData}
              >
                {{
                  success: (
                    <TranslateText translationKey="dialog.settings.clear_storage.btn.cleared_data" />
                  ),
                  error: (
                    <TranslateText translationKey="dialog.settings.clear_storage.btn.error" />
                  ),
                }[clearStorageStatus!] || (
                  <TranslateText translationKey="dialog.settings.clear_storage.btn.clear_data" />
                )}
              </Button>
            </div>
          ) : null}
        </Dialog>
      </div>
    </Tooltip.Provider>
  );
}

const modifier = isMacOs ? '⌘' : 'Ctrl';

const SHORT_KEYS = Object.entries({
  'dialog.short_keys.function.search_in_editor': [modifier, 'F'],
  'dialog.short_keys.function.search_in_documentation': [modifier, 'K'],
  'dialog.short_keys.function.execute_query': [modifier, 'Enter'],
  'dialog.short_keys.function.prettify_editors': ['Ctrl', 'Shift', 'P'],
  'dialog.short_keys.function.merge_fragments_into_definition': [
    'Ctrl',
    'Shift',
    'M',
  ],
  'dialog.short_keys.function.copy_query': ['Ctrl', 'Shift', 'C'],
  'dialog.short_keys.function.refresh_schema': ['Ctrl', 'Shift', 'R'],
});

function ShortKeys({ keyMap }: { keyMap: string }): ReactElement {
  return (
    <div>
      <table className="graphiql-table">
        <thead>
          <tr>
            <th>
              <TranslateText translationKey="dialog.short_keys.header.short_key" />
            </th>
            <th>
              <TranslateText translationKey="dialog.short_keys.header.function" />
            </th>
          </tr>
        </thead>
        <tbody>
          {SHORT_KEYS.map(([title, keys]) => (
            <tr key={title}>
              <td>
                {keys.map((key, index, array) => (
                  <Fragment key={key}>
                    <code className="graphiql-key">{key}</code>
                    {index !== array.length - 1 && ' + '}
                  </Fragment>
                ))}
              </td>
              <td>
                <TranslateText translationKey={title} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <TranslateText
          translationKey="dialog.short_keys.footer"
          translationParams={{ keyMap }}
        />
      </p>
    </div>
  );
}

// Configure the UI by providing this Component as a child of GraphiQL.
function GraphiQLLogo<TProps>(props: PropsWithChildren<TProps>) {
  return (
    <div className="graphiql-logo">
      {props.children || (
        <a
          className="graphiql-logo-link"
          href="https://github.com/graphql/graphiql"
          target="_blank"
          rel="noreferrer"
        >
          Graph
          <em>i</em>
          QL
        </a>
      )}
    </div>
  );
}

GraphiQLLogo.displayName = 'GraphiQLLogo';

// Configure the UI by providing this Component as a child of GraphiQL.
function GraphiQLToolbar<TProps>(props: PropsWithChildren<TProps>) {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{props.children}</>;
}

GraphiQLToolbar.displayName = 'GraphiQLToolbar';

// Configure the UI by providing this Component as a child of GraphiQL.
function GraphiQLFooter<TProps>(props: PropsWithChildren<TProps>) {
  return <div className="graphiql-footer">{props.children}</div>;
}

GraphiQLFooter.displayName = 'GraphiQLFooter';

// Determines if the React child is of the same type of the provided React component
function isChildComponentType<T extends ComponentType>(
  child: any,
  component: T,
): child is T {
  if (
    child?.type?.displayName &&
    child.type.displayName === component.displayName
  ) {
    return true;
  }

  return child.type === component;
}
