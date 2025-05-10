import { cards } from '../../data/cards';
import { drawCard } from './card';

export const initBattle = () => {
  drawCard(0, cards['card-1']);
  drawCard(0, cards['card-2']);
  drawCard(0, cards['card-3']);
  drawCard(0, cards['card-4']);

  drawCard(1, cards['card-1']);
  drawCard(1, cards['card-2']);
  drawCard(1, cards['card-3']);
  drawCard(1, cards['card-4']);
};
