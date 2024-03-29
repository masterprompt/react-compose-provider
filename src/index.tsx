import React from 'react';

export type ProviderComponent = React.FC<{ children: React.ReactNode }>;

interface Props {
    children: React.ReactNode;
}

export const composeProvider = (...providers: ProviderComponent[]) => (props: Props) => (
    <React.Fragment>
        {providers.reduceRight((children, Provider) => {
            return <Provider>{children}</Provider>;
        }, props.children)}
    </React.Fragment>
);