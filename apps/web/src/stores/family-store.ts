import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Member, Location, Units } from '@weather/shared';

const DEFAULT_MEMBERS: Member[] = [
  {
    id: 'default-dad',
    kind: 'person',
    name: 'Dad',
    avatar: 'dad',
    sex: 'male',
    ageGroup: 'adult',
    workContext: 'office',
  },
  {
    id: 'default-mom',
    kind: 'person',
    name: 'Mom',
    avatar: 'mom',
    sex: 'female',
    ageGroup: 'adult',
    workContext: 'office',
  },
  {
    id: 'default-son',
    kind: 'person',
    name: 'Son',
    avatar: 'son',
    sex: 'male',
    ageGroup: 'kid',
    workContext: 'school',
  },
  {
    id: 'default-daughter',
    kind: 'person',
    name: 'Daughter',
    avatar: 'daughter',
    sex: 'female',
    ageGroup: 'kid',
    workContext: 'school',
  },
  {
    id: 'default-dog',
    kind: 'pet',
    name: 'Dog',
    avatar: 'dog',
    species: 'dog',
    size: 'medium',
    coat: 'short',
  },
];

interface FamilyState {
  members: Member[];
  location: Location | null;
  units: Units;
  activeMemberId: string | null;
  setLocation: (l: Location) => void;
  setUnits: (u: Units) => void;
  setActiveMember: (id: string | null) => void;
  resetToDefaults: () => void;
}

export const useFamilyStore = create<FamilyState>()(
  persist(
    (set) => ({
      members: DEFAULT_MEMBERS,
      location: null,
      units: 'metric',
      activeMemberId: DEFAULT_MEMBERS[0]?.id ?? null,
      setLocation: (location) => set({ location }),
      setUnits: (units) => set({ units }),
      setActiveMember: (activeMemberId) => set({ activeMemberId }),
      resetToDefaults: () =>
        set({
          members: DEFAULT_MEMBERS,
          location: null,
          activeMemberId: DEFAULT_MEMBERS[0]?.id ?? null,
        }),
    }),
    {
      name: 'weather-family',
      version: 2,
      migrate: (persisted: unknown, version: number) => {
        if (version < 2) {
          // v1 stored user-defined members; reset to defaults under the new model.
          return {
            members: DEFAULT_MEMBERS,
            location: (persisted as { location?: Location } | null)?.location ?? null,
            units: (persisted as { units?: Units } | null)?.units ?? 'metric',
            activeMemberId: DEFAULT_MEMBERS[0]?.id ?? null,
          };
        }
        return persisted as FamilyState;
      },
    },
  ),
);
