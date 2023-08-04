import { createContext } from 'react';

const commonContext = createContext({});

const { Provider, Consumer } = commonContext;

export default commonContext;
export { Provider, Consumer };
