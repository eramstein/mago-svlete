// Import all card images
export let images: Record<string, Record<string, { default: string }>> = $state({});

export function loadCardImages() {
  images.cards = import.meta.glob('../../../assets/images/cards/*.png', {
    eager: true,
  }) as Record<string, { default: string }>;
}

export function getCardImage(cardId: string) {
  return images.cards[`../../../assets/images/cards/${cardId}.png`]?.default;
}
