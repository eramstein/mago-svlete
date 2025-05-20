// Import all card images
export let images: Record<string, Record<string, { default: string }>> = $state({});

export function loadCardImages() {
  images.cards = import.meta.glob('../../../assets/images/cards/*.png', {
    eager: true,
  }) as Record<string, { default: string }>;
  images.characters = import.meta.glob('../../../assets/images/characters/*.png', {
    eager: true,
  }) as Record<string, { default: string }>;
  images.places = import.meta.glob('../../../assets/images/places/*.png', {
    eager: true,
  }) as Record<string, { default: string }>;
}

export function getCardImage(cardId: string) {
  return images.cards?.[`../../../assets/images/cards/${cardId}.png`]?.default;
}

export function getCharacterImage(characterId: string) {
  return images.characters?.[`../../../assets/images/characters/${characterId}.png`]?.default;
}

export function getPlaceImage(placeId: string) {
  return images.places?.[`../../../assets/images/places/${placeId}.png`]?.default;
}
