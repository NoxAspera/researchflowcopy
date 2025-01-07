/**
 * CustomTheme.ts
 * @author Blake Stambaugh
 * 11/27/24
 * builds a custom EVA theme used on UI Kitten components
 */
import { dark } from '@eva-design/eva';
import customColors from '../custom-theme.json';

export const customTheme = {
  ...dark,
  ...customColors,
};
