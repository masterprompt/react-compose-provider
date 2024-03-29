# React Compose Provider

Easily build a single `Provider` out of many!

## Installation

`npm install --save react-compose-provider`

## Usage


```
import { composeProvider } from 'react-compose-provider';

const SimpleProviderA = (props) => (<>{props.children}</>);
const SimpleProviderB = (props) => (<>{props.children}</>);

const MainProvider = composeProvider(SimpleProviderA, SimpleProviderB);

const MyApp = () => (
    <MainProvider>
        <div>Hello World</div>
    </MainProvider>
);

```