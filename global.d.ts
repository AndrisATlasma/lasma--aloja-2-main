declare namespace gsap {
  export const to = any;
  export const from = any;
}

declare namespace Handlebars {
  export const compile = any;
  export const registerHelper = any;
}

declare namespace MicroModal {
  export const init = any;
  export const close = any;
  export const show = any;
}

declare namespace Alpine {
  export const data = any;
}

declare function setTag(tag: string, value: any): void;
declare function getTag(tag: string): unknown;
declare function getSql(sql: string, options: any): string;
declare function setSql(sql: string, options: any): unknown;
declare function debugString(text: string): void;
declare async function runSqlSelect(sql: string, params: any): unknown;


export declare function setSqlCallBack(sql: string, options: any, callback: (err: Error | null, result?: any) => void): void;