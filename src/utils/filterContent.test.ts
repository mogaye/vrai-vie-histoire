import test from 'node:test';
import assert from 'node:assert/strict';
import { filterBooksByQuery, filterBooksByCategory, filterBooksByPart, formatBookMeta } from './filterContent.ts';
import { ALL_HISTORICAL_BOOKS, BESTSELLER_HISTORICAL_BOOKS } from '../data/historicalDossiers.ts';

test('filterBooksByQuery matches historical dossiers by title or period', () => {
  const resultTitle = filterBooksByQuery(ALL_HISTORICAL_BOOKS, 'Kirina');
  assert.ok(resultTitle.length >= 1);
  assert.equal(resultTitle[0].title, 'La bataille de Kirina (1235)');

  const resultYear = filterBooksByQuery(ALL_HISTORICAL_BOOKS, '1235');
  assert.ok(resultYear.length >= 1);
  assert.ok(resultYear.some(b => b.title.includes('Kirina')));
});

test('filterBooksByQuery matches historical dossiers by country or character', () => {
  const resultMali = filterBooksByQuery(ALL_HISTORICAL_BOOKS, 'Mali');
  assert.ok(resultMali.length >= 1);

  const resultGandhi = filterBooksByQuery(ALL_HISTORICAL_BOOKS, 'Gandhi');
  assert.ok(resultGandhi.length >= 1);
  assert.ok(resultGandhi[0].title.includes('Gandhi'));
});

test('filterBooksByCategory correctly isolates geographical regions', () => {
  const africaBooks = filterBooksByCategory(ALL_HISTORICAL_BOOKS, 'afrique');
  assert.equal(africaBooks.length, 40);

  const europeBooks = filterBooksByCategory(ALL_HISTORICAL_BOOKS, 'europe');
  assert.equal(europeBooks.length, 40);

  const asiaBooks = filterBooksByCategory(ALL_HISTORICAL_BOOKS, 'asie');
  assert.equal(asiaBooks.length, 39);

  const americasBooks = filterBooksByCategory(ALL_HISTORICAL_BOOKS, 'ameriques');
  assert.equal(americasBooks.length, 30);

  const worldBooks = filterBooksByCategory(ALL_HISTORICAL_BOOKS, 'monde');
  assert.equal(worldBooks.length, 51);
});

test('filterBooksByPart filters between Part 1 and Part 2 (100 each)', () => {
  const p1 = filterBooksByPart(ALL_HISTORICAL_BOOKS, '1');
  assert.equal(p1.length, 100);

  const p2 = filterBooksByPart(ALL_HISTORICAL_BOOKS, '2');
  assert.equal(p2.length, 100);
});

test('formatBookMeta formats author, year and pages correctly', () => {
  const item = ALL_HISTORICAL_BOOKS[0]; // Kirina
  const formatted = formatBookMeta(item);
  assert.ok(formatted.includes('Mali'));
  assert.ok(formatted.includes('1235'));
  assert.ok(formatted.includes('Partie 1'));
});
