import React from 'react';

export type ProviderComponent = React.FC<{ children: React.ReactNode }>;

export type ProviderArg = ProviderComponent | ProviderComponent[];

interface Props {
    children: React.ReactNode;
}

export const composeProvider = (...providers: ProviderArg[]) => {
    const flattened = ([] as ProviderComponent[]).concat(...providers);
    return (props: Props) => (
        <React.Fragment>
            {flattened.reduceRight((children, Provider) => {
                return <Provider>{children}</Provider>;
            }, props.children)}
        </React.Fragment>
    );
};
