# react-compose-provider

Compose many React providers into one and flatten the provider pyramid.

[![npm version](https://img.shields.io/npm/v/react-compose-provider.svg)](https://www.npmjs.com/package/react-compose-provider)
[![license](https://img.shields.io/npm/l/react-compose-provider.svg)](./LICENSE)

## Why?

Real apps accumulate context providers (theme, auth, query client, router, feature flags), and the root of the app ends up as a deeply nested pyramid:

```tsx
const App = () => (
    <ThemeProvider>
        <AuthProvider>
            <QueryProvider>
                <FeatureFlagProvider>
                    <Router />
                </FeatureFlagProvider>
            </QueryProvider>
        </AuthProvider>
    </ThemeProvider>
);
```

Every provider you add pushes your actual app one indent deeper, and reordering them means rewiring JSX. `composeProvider` collapses the pyramid into a flat, ordered list:

```tsx
const AppProviders = composeProvider(
    ThemeProvider,
    AuthProvider,
    QueryProvider,
    FeatureFlagProvider,
);

const App = () => (
    <AppProviders>
        <Router />
    </AppProviders>
);
```

That's the whole library: one function, zero dependencies, ~1 kB.

## Installation

```sh
npm install react-compose-provider
```

Requires React 18 or 19 (declared as a peer dependency).

## Usage

```tsx
import { composeProvider } from 'react-compose-provider';

const AppProviders = composeProvider(ProviderA, ProviderB, ProviderC);

const App = () => (
    <AppProviders>
        <YourApp />
    </AppProviders>
);
```

You can pass providers as separate arguments, as an array, or as a mix of both. All of these are equivalent:

```tsx
composeProvider(ProviderA, ProviderB, ProviderC);
composeProvider([ProviderA, ProviderB, ProviderC]);
composeProvider([ProviderA, ProviderB], ProviderC);
```

The array form is handy when you build the provider list dynamically or share it across entry points.

### Ordering

Providers nest in the order you list them: **first argument is outermost**. The example above renders as:

```tsx
<ProviderA>
    <ProviderB>
        <ProviderC>
            <YourApp />
        </ProviderC>
    </ProviderB>
</ProviderA>
```

So if `ProviderB` reads context from `ProviderA`, list `ProviderA` first, exactly as you would when nesting by hand.

### Providers that take props

`composeProvider` accepts components whose only prop is `children`. If a provider needs configuration, bind its props with a small wrapper:

```tsx
import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const AppProviders = composeProvider(
    ({ children }) => <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>,
    ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
    AuthProvider,
);
```

> Tip: define wrappers outside your component tree (at module scope, as above) so they keep a stable identity across renders.

### TypeScript

The package ships its own type declarations. The provider type is exported if you want to annotate your own wrappers:

```tsx
import { composeProvider, type ProviderComponent } from 'react-compose-provider';

const ThemedProvider: ProviderComponent = ({ children }) => (
    <ThemeProvider theme={darkTheme}>{children}</ThemeProvider>
);
```

## API

### `composeProvider(...providers: Array<ProviderComponent | ProviderComponent[]>)`

Returns a new component that renders `providers` nested left-to-right (first = outermost) around its `children`. Arguments may be individual provider components, arrays of them, or any mix; arrays are flattened one level, in place, at composition time.

### `ProviderComponent`

```ts
type ProviderComponent = React.FC<{ children: React.ReactNode }>;
```

### `ProviderArg`

```ts
type ProviderArg = ProviderComponent | ProviderComponent[];
```

## License

[MIT](./LICENSE) © Casey Kerr
