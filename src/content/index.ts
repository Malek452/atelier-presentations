import powers from '../../examples/powers';
import algebra from '../../examples/algebra';
import signs from '../../examples/signs';
import circle from '../../examples/circle';
import concepts from '../../examples/concepts';
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
