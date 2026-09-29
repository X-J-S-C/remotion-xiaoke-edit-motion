import React from 'react';
import {Composition} from 'remotion';
import {Main} from './Main';

export const Root = () => (
  <Composition id="Xiaoke" component={Main} durationInFrames={900} fps={30} width={1280} height={720} />
);
