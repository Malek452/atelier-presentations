import powers from './powers';
import algebra from './algebra';
import signs from './signs';
import circle from './circle';
import concepts from './concepts';
// @new-lesson-import
import { definePresentation } from './define';

export const exercises = definePresentation([
  powers,
  algebra,
  signs,
  circle,
  concepts,
  // @new-lesson-entry
]);
export const activities = exercises.flatMap((section) => section.activities);
export const getActivity = (id: string) => activities.find((activity) => activity.id === id);
