/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/naming-convention */
declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';
declare module 'numeral';
declare module '@antv/data-set';
declare module 'mockjs';
declare module 'react-fittext';
declare module 'bizcharts-plugin-slider';

interface Window {
  reloadAuthorized: () => void;
}

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;

/**
 * @description 通用类型集合
 */
declare module g {
  type Object<V = unknown> = Record<string | number, V>;
  type Func = (...args: unknown[]) => unknown;
  type Extend<A, B> = B & Omit<A, keyof B>;

  /**
   * @description 通用的泛对象类型
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  type o<V = unknown> = Object<V>;

  /**
   * @description 通用的函数类型
   */
  type f = Func;

  /**
   * @description 从 A 中删除 B 中的已定义的属性，再与其联合
   */
  type e<A, B> = Extend<A, B>;
}
