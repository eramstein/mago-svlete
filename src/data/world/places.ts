import type { Place } from '@/lib/model/model-sim';
import { PLAYER_CONFIG } from '../npcs/player';

export const PLACES: Place[] = [
  {
    name: `${PLAYER_CONFIG.name}' home`,
    description: "A student's appartment.",
    zones: [
      {
        name: 'bedroom',
        description:
          'A simple and messy bedroom, with a bed, clothes lying around, and lots of games.',
      },
    ],
  },
  {
    name: 'The goblin cave',
    description: `
      The town's favorite place to buy and play board games, card games and role playing games.
      Situated in the city center. Cozy and welcoming. Owned by The Dude. 
      `,
    zones: [
      {
        name: 'counter',
        image: 'goblin_counter',
        description: 'A the entrance, cash register, where you can usually find staff.',
      },
      {
        name: 'playing room',
        image: 'goblin_game_room',
        description:
          'A large cosy room with large tables to play games, and shelves full of board games. Usually busy with various people chatting, trading cards and playing.',
      },
    ],
  },
  {
    name: 'University',
    description:
      'An old university specialized in cognitive sciences studies. Beautiful buildings from the early 1900s with a germanic style architecture.',
    zones: [
      {
        name: 'courtyard',
        image: 'uni_courtyard',
        description: 'A large courtyard with many trees, full of students at daytime.',
      },
      {
        name: 'class room',
        image: 'uni_classroom',
        description: 'A class room for cognitive sciences classes.',
      },
      {
        name: 'cafeteria',
        image: 'uni_cafeteria',
        description:
          'A simple large room with large tables, where students have their meals. You can buy food and drinks and eat them on site.',
      },
    ],
  },
].map((p, i) => ({
  index: i,
  ...p,
  zones: p.zones.map((z, j) => ({ index: j, place: i, ...z })),
}));
