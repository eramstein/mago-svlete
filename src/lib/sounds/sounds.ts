import cardDeploySound from '../../assets/sounds/card-deploy.mp3';
import cardAttackLightSound from '../../assets/sounds/attack-light.ogg';
import cardAttackHeavySound from '../../assets/sounds/attack-heavy.wav';

const deploySound = new Audio(cardDeploySound);
const attackLightSound = new Audio(cardAttackLightSound);
const attackHeavySound = new Audio(cardAttackHeavySound);

export function playDeploySound() {
  deploySound.currentTime = 0;
  deploySound.play().catch((err) => console.log('Error playing sound:', err));
}

export function playAttackLightSound() {
  attackLightSound.currentTime = 0;
  attackLightSound.play().catch((err) => console.log('Error playing sound:', err));
}

export function playAttackHeavySound() {
  attackHeavySound.currentTime = 0;
  attackHeavySound.play().catch((err) => console.log('Error playing sound:', err));
}
