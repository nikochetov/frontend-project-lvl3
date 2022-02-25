// import fs from 'fs';
// import path from 'path';
import { screen } from '@testing-library/dom';
// import userEventHelpers from '@testing-library/user-event';
import '@testing-library/jest-dom';
import path from 'path';
import fs from 'fs';
import { URL } from 'url';
import app from '../src/index.js';

const index = path.join('..', 'index.html');
const initHtml = fs.readFileSync(new URL(index, import.meta.url), 'utf-8');

beforeEach(async () => {
  document.body.innerHTML = initHtml;

  await app();
});

test('init application', async () => {
  await expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  await expect(screen.getByLabelText('RSS link')).toBeInTheDocument();
});
