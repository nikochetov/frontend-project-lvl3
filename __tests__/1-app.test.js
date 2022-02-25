// import fs from 'fs';
// import path from 'path';
import { screen } from '@testing-library/dom';
// import userEventHelpers from '@testing-library/user-event';
import '@testing-library/jest-dom';

import app from '../src/index.js';

// const getFixture = (filename) => fs.readFileSync(path.join('__fixtures__', filename)).toString();

beforeEach(async () => {
  await app();
});

test('init application', async () => {
  expect(screen.getByRole('alert')).not.toBeInTheDocument();
});
