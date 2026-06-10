import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { composeProvider, ProviderComponent } from './index';

const wrap = (className: string): ProviderComponent => ({ children }) => (
    <div className={className}>{children}</div>
);

const A = wrap('a');
const B = wrap('b');
const C = wrap('c');

const render = (Composed: ProviderComponent) => renderToStaticMarkup(
    <Composed>
        <span>x</span>
    </Composed>,
);

const expected = '<div class="a"><div class="b"><div class="c"><span>x</span></div></div></div>';

describe('composeProvider', () => {
    it('composes providers passed as separate params', () => {
        expect(render(composeProvider(A, B, C))).toBe(expected);
    });

    it('composes providers passed as a single array', () => {
        expect(render(composeProvider([A, B, C]))).toBe(expected);
    });

    it('composes providers passed as a mix of arrays and params', () => {
        expect(render(composeProvider([A, B], C))).toBe(expected);
        expect(render(composeProvider(A, [B, C]))).toBe(expected);
    });

    it('nests with the first provider outermost', () => {
        expect(render(composeProvider(C, A))).toBe(
            '<div class="c"><div class="a"><span>x</span></div></div>',
        );
    });

    it('renders children unchanged when given a single provider', () => {
        expect(render(composeProvider(A))).toBe('<div class="a"><span>x</span></div>');
    });

    it('renders children unchanged when given no providers', () => {
        expect(render(composeProvider())).toBe('<span>x</span>');
    });
});
