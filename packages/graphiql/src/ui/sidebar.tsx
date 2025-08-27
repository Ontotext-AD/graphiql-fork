import { FC, type MouseEventHandler, useContext, useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  cn,
  Dialog,
  isMacOs,
  KEY_MAP,
  KeyboardShortcutIcon,
  pick,
  ReloadIcon,
  SettingsIcon,
  Tooltip,
  UnStyledButton,
  useDragResize,
  useGraphiQL,
  useGraphiQLActions,
  VisuallyHidden,
  TranslationContext,
  TranslateText,
  LanguageSelector
} from '@graphiql/react';
import { ShortKeys } from './short-keys';

type ButtonHandler = MouseEventHandler<HTMLButtonElement>;

const LABEL = {
  refetchSchema: 'graphiql.sidebar.btn.refresh_graphql_schema',
  shortCutDialog: 'graphiql.sidebar.btn.open_short_keys_dialog',
  settingsDialogs: 'graphiql.sidebar.btn.open_settings_dialog',
};

const THEMES = ['light', 'dark', 'system'] as const;

interface SidebarProps {
  /**
   * `forcedTheme` allows enforcement of a specific theme for GraphiQL.
   * This is useful when you want to make sure that GraphiQL is always
   * rendered with a specific theme.
   */
  forcedTheme?: (typeof THEMES)[number];

  /**
   * Indicates if settings for persisting headers should appear in the
   * settings modal.
   */
  showPersistHeadersSettings?: boolean;

  setHiddenElement: ReturnType<typeof useDragResize>['setHiddenElement'];
}

export const Sidebar: FC<SidebarProps> = ({
  forcedTheme: $forcedTheme,
  showPersistHeadersSettings,
  setHiddenElement,
}) => {
  const forcedTheme =
    $forcedTheme && THEMES.includes($forcedTheme) ? $forcedTheme : undefined;
  const { setShouldPersistHeaders, introspect, setVisiblePlugin, setTheme } =
    useGraphiQLActions();
  const {
    shouldPersistHeaders,
    isIntrospecting,
    visiblePlugin,
    plugins,
    theme,
    storage,
  } = useGraphiQL(
    pick(
      'shouldPersistHeaders',
      'isIntrospecting',
      'visiblePlugin',
      'plugins',
      'theme',
      'storage',
    ),
  );

  const { currentLanguage, translationService } =
    useContext(TranslationContext);

  useEffect(() => {
    if (forcedTheme === 'system') {
      setTheme(null);
    } else if (forcedTheme === 'light' || forcedTheme === 'dark') {
      setTheme(forcedTheme);
    }
  }, [forcedTheme, setTheme]);

  const [showDialog, setShowDialog] = useState<
    'settings' | 'short-keys' | null
  >(null);
  const [clearStorageStatus, setClearStorageStatus] = useState<
    'success' | 'error' | undefined
  >();

  useEffect(() => {
    function openSettings(event: KeyboardEvent) {
      if ((isMacOs ? event.metaKey : event.ctrlKey) && event.key === ',') {
        event.preventDefault(); // prevent default browser settings dialog
        setShowDialog(prev => (prev === 'settings' ? null : 'settings'));
      }
    }

    window.addEventListener('keydown', openSettings);
    return () => {
      window.removeEventListener('keydown', openSettings);
    };
  }, []);

  function handleOpenShortKeysDialog(isOpen: boolean) {
    if (!isOpen) {
      setShowDialog(null);
    }
  }

  function handleOpenSettingsDialog(isOpen: boolean) {
    if (!isOpen) {
      setShowDialog(null);
      setClearStorageStatus(undefined);
    }
  }

  function handleClearData() {
    try {
      storage.clear();
      setClearStorageStatus('success');
    } catch {
      setClearStorageStatus('error');
    }
  }

  const handlePersistHeaders: ButtonHandler = event => {
    setShouldPersistHeaders(event.currentTarget.dataset.value === 'true');
  };

  const handleChangeTheme: ButtonHandler = event => {
    const selectedTheme = event.currentTarget.dataset.theme as
      | 'light'
      | 'dark'
      | undefined;
    setTheme(selectedTheme || null);
  };

  const handleShowDialog: ButtonHandler = event => {
    setShowDialog(
      event.currentTarget.dataset.value as 'short-keys' | 'settings',
    );
  };

  const handlePluginClick: ButtonHandler = event => {
    const pluginIndex = Number(event.currentTarget.dataset.index!);
    const plugin = plugins.find((_, index) => pluginIndex === index)!;
    const isVisible = plugin === visiblePlugin;
    if (isVisible) {
      setVisiblePlugin(null);
      setHiddenElement('first');
    } else {
      setVisiblePlugin(plugin);
      setHiddenElement(null);
    }
  };

  const refetchSchemaLabel = translationService.translate(
    LABEL.refetchSchema,
    currentLanguage,
    {key: `${KEY_MAP.refetchSchema.key}`}
  );
  const shortCutDialogLabel = translationService.translate(
    LABEL.shortCutDialog,
    currentLanguage
  );
  const settingsDialogsLabel = translationService.translate(
    LABEL.settingsDialogs,
    currentLanguage
  );

  return (
    <div className="graphiql-sidebar">
      {plugins.map((plugin, index) => {
        const isVisible = plugin === visiblePlugin;
        const pluginTitle = translationService.translate(`plugin.${plugin.id}.title`, currentLanguage);
        const labelKey = 'plugin.btn.' + (isVisible ? 'hide_plugin' : 'show_plugin');
        const label = translationService.translate(labelKey, currentLanguage, {pluginTitle});

        return (
          <Tooltip key={plugin.title} label={label}>
            <UnStyledButton
              type="button"
              className={cn(isVisible && 'active')}
              onClick={handlePluginClick}
              data-index={index}
              aria-label={label}
            >
              <plugin.icon aria-hidden="true" />
            </UnStyledButton>
          </Tooltip>
        );
      })}
      <Tooltip label={refetchSchemaLabel}>
        <UnStyledButton
          type="button"
          disabled={isIntrospecting}
          onClick={introspect}
          aria-label={refetchSchemaLabel}
          style={{ marginTop: 'auto' }}
        >
          <ReloadIcon
            className={cn(isIntrospecting && 'graphiql-spin')}
            aria-hidden="true"
          />
        </UnStyledButton>
      </Tooltip>
      <Tooltip label={shortCutDialogLabel}>
        <UnStyledButton
          type="button"
          data-value="short-keys"
          onClick={handleShowDialog}
          aria-label={shortCutDialogLabel}
        >
          <KeyboardShortcutIcon aria-hidden="true" />
        </UnStyledButton>
      </Tooltip>
      <Tooltip label={settingsDialogsLabel}>
        <UnStyledButton
          type="button"
          data-value="settings"
          onClick={handleShowDialog}
          aria-label={settingsDialogsLabel}
        >
          <SettingsIcon aria-hidden="true" />
        </UnStyledButton>
      </Tooltip>
      <Dialog
        open={showDialog === 'short-keys'}
        onOpenChange={handleOpenShortKeysDialog}
      >
        <div className="graphiql-dialog-header">
          <Dialog.Title className="graphiql-dialog-title">
            <TranslateText translationKey="dialog.short_keys.title" />
          </Dialog.Title>
          <VisuallyHidden>
            {/* Fixes Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent} */}
            <Dialog.Description>
              This modal provides a list of available keyboard shortcuts and
              their functions.
            </Dialog.Description>
          </VisuallyHidden>
          <Dialog.Close />
        </div>
        <div className="graphiql-dialog-section">
          <ShortKeys />
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
          <VisuallyHidden>
            {/* Fixes Warning: Missing `Description` or `aria-describedby={undefined}` for {DialogContent} */}
            <Dialog.Description>
              This modal lets you adjust header persistence, interface theme,
              and clear local storage.
            </Dialog.Description>
          </VisuallyHidden>
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
        {showPersistHeadersSettings ? (
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
                className={cn(shouldPersistHeaders && 'active')}
                data-value="true"
                onClick={handlePersistHeaders}
              >
                <TranslateText translationKey="dialog.settings.persisted_headers.btn.on" />
              </Button>
              <Button
                type="button"
                id="disable-persist-headers"
                className={cn(!shouldPersistHeaders && 'active')}
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
                className={cn(theme === null && 'active')}
                onClick={handleChangeTheme}
              >
                <TranslateText translationKey="dialog.settings.theme.btn.system" />
              </Button>
              <Button
                type="button"
                className={cn(theme === 'light' && 'active')}
                data-theme="light"
                onClick={handleChangeTheme}
              >
                <TranslateText translationKey="dialog.settings.theme.btn.light" />
              </Button>
              <Button
                type="button"
                className={cn(theme === 'dark' && 'active')}
                data-theme="dark"
                onClick={handleChangeTheme}
              >
                <TranslateText translationKey="dialog.settings.theme.btn.dark" />
              </Button>
            </ButtonGroup>
          </div>
        )}
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
            state={clearStorageStatus}
            disabled={clearStorageStatus === 'success'}
            onClick={handleClearData}
          >
            {clearStorageStatus === 'success' && (
              <TranslateText translationKey="dialog.settings.clear_storage.btn.cleared_data" />
            )}
            {clearStorageStatus === 'error' && (
              <TranslateText translationKey="dialog.settings.clear_storage.btn.error" />
            )}
            {!clearStorageStatus && (
              <TranslateText translationKey="dialog.settings.clear_storage.btn.clear_data" />
            )}
          </Button>
        </div>
      </Dialog>
    </div>
  );
};
