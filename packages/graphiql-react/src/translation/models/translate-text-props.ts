/**
 * Interface defining the properties for the {@link TranslateText} component.
 *
 */
export interface TranslateTextProps {
  /**
   * The key for the text to be translated.
   */
  translationKey: string;

  /**
   * Optional parameters for dynamic translation values.
   */
  translationParams?: Record<string, string>;
}
