import React from 'react';
import { Container } from '@material-ui/core';
import SectionContent from '../../../components/common/SectionContent'

export default function WhatIs(props) {
    return (
        <>
            <Container>
                <SectionContent
                label="HSA.WhatIs.Label"
                detail="HSA.WhatIs.Detail" />
            </Container>
        </>
    );
};