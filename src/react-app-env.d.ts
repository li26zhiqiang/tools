/// <reference types="react-scripts" />

declare module '*';

// declare module '*.module.less' {
//     const classes: {
//         readonly [key: string]: string;
//     };
//     export default classes;
//     declare module '*.less';
// }

// /**
//  * declare告诉编译器知道Window是啥类型，并且和全局的Window类型自动合并
//  */
// export declare global {
//     interface Window {
//         req: any; //全局变量名
//     }
// }

// declare module '*.svg' {
//     import * as React from 'react';

//     export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;

//     const src: string;
//     export default src;
// }
