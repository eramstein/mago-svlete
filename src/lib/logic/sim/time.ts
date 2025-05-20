import type { SimState } from '@/lib/model/model-sim';

export function passTime(sim: SimState, duration: number) {
  sim.time.ellapsedTime += duration;
}
