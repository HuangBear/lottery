import { StateCreator, create } from 'zustand';
import { persist, createJSONStorage, PersistOptions } from 'zustand/middleware';

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

  shuffledStraws?: IStraw[];
  awardsToDraw?: IAward[];

  setStraws: (straws: IStraw[]) => void;
  setAwards: (awards: IAward[]) => void;
  setWinner: (straws: IStraw[], award: IAward) => void;

  start: () => void;
  draw: () => void;

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
            awardsToDraw: awardsToDraw.slice(1),
            winners: [
              { award: currentAward, straws: currentWinner },
              ...get().winners,
            ],
          });
        }
      },

      reset: () => set({ ...initState }),
    }),
    {
      name: 'lottery-storage', // unique name
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
