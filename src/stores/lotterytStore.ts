import { StateCreator, create } from 'zustand';
import {
  persist,
  createJSONStorage,
  PersistOptions,
  StateStorage,
} from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) ?? null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};
export interface IStraw {
  no: number;
  group: string;
  name: string;
}

export interface IAward {
  order: number;
  name: string;
  description: string;
  pic: string;
  quota: number;
}

export interface IWinner {
  award: IAward;
  straws: IStraw[];
}

interface ILotterytStore {
  straws: IStraw[];
  awards: IAward[];
  winners: IWinner[];
  lock: boolean;
  displaying: boolean;

  shuffledStraws?: IStraw[];
  awardsToDraw?: IAward[];

  setStraws: (straws: IStraw[]) => void;
  setAwards: (awards: IAward[]) => void;
  setWinner: (straws: IStraw[], award: IAward) => void;

  start: () => void;
  draw: () => void;
  nextAward: () => void;
  undoCurrentDraw: () => void;
  partialRedrawPrepare: (redrawIdxs: number[]) => void;
  partialRedraw: (redrawIdxs: number[]) => void;

  reset: () => void;
}

type LotteryPersist = (
  config: StateCreator<ILotterytStore>,
  options: PersistOptions<ILotterytStore>
) => StateCreator<ILotterytStore>;

const initState = {
  straws: [],
  awards: [],
  winners: [],
  lock: false,
  displaying: false,
  shuffledStraws: undefined,
  awardsToDraw: undefined,
};

function shuffle(array: IStraw[]) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export const useLotterytStore = create<ILotterytStore>(
  (persist as unknown as LotteryPersist)(
    (set, get) => ({
      ...initState,

      setStraws: (newStraws) =>
        set({ straws: newStraws.filter((val) => val.name) }),
      setAwards: (newAwards) => {
        newAwards.sort((a, b) => a.order - b.order);
        return set({ awards: newAwards.filter((val) => val.name) });
      },
      setWinner: (winners, award) => {
        const winner: IWinner = { straws: winners, award };
        return set({ winners: [...get().winners, winner] });
      },

      start: () => {
        let toShuffle = [...get().straws];
        shuffle(toShuffle);

        return set({
          lock: true,
          shuffledStraws: toShuffle,
          awardsToDraw: get().awards,
        });
      },
      draw: () => {
        const shuffledStraws = get().shuffledStraws;
        const awardsToDraw = get().awardsToDraw;

        if (shuffledStraws && awardsToDraw) {
          const currentAward = awardsToDraw[0];
          const currentWinner = shuffledStraws.slice(0, currentAward.quota);

          return set({
            shuffledStraws: shuffledStraws.slice(currentAward.quota),
            winners: [
              { award: currentAward, straws: currentWinner },
              ...get().winners,
            ],
            displaying: true,
          });
        }
      },
      nextAward: () => {
        const toDraw = get().awardsToDraw;
        toDraw && set({ awardsToDraw: toDraw.slice(1), displaying: false });
      },

      undoCurrentDraw: () => {
        const toRedraw = get().winners[0];
        let newStrawsToDraw = [...get().shuffledStraws!, ...toRedraw.straws];
        shuffle(newStrawsToDraw);

        return set({
          displaying: false,
          shuffledStraws: newStrawsToDraw,
          winners: get().winners.slice(1),
        });
      },
      // remove the need-to-redraw winners from previous winner list
      partialRedrawPrepare: (redrawIdxs: number[]) => {
        const winners = get().winners;

        const newWinners = winners.map((val, idx) => {
          if (idx === 0) {
            const newStraws = val.straws.filter(
              (_val, idx) => !redrawIdxs.includes(idx)
            );
            return { ...val, straws: newStraws };
          } else {
            return val;
          }
        });

        return set({
          winners: newWinners,
          displaying: false,
        });
      },

      partialRedraw: (redrawIdxs) => {
        const shuffledStraws = get().shuffledStraws;
        const winners = get().winners;

        if (shuffledStraws) {
          const currentWinner = shuffledStraws.slice(0, redrawIdxs.length);
          const newWinners = winners.map((val, idx) => {
            if (idx === 0) {
              const newStraws = [...val.straws, ...currentWinner];
              return { ...val, straws: newStraws };
            } else {
              return val;
            }
          });

          return set({
            shuffledStraws: shuffledStraws.slice(redrawIdxs.length),
            winners: newWinners,
            displaying: true,
          });
        }
      },

      reset: () => set({ ...initState }),
    }),
    {
      name: 'lottery-storage',
      storage: createJSONStorage(() => storage),
    }
  )
);
