import { logExercises } from './td3-logs';
import { expTrigExercises } from './td3-exp-trig';
// @new-lesson-import
import { definePresentation } from './define';

export const exercises = definePresentation([
  ...logExercises,
  ...expTrigExercises,
  // @new-lesson-entry
]);
export const activities = exercises.flatMap((section) => section.activities);
export const getActivity = (id: string) => activities.find((activity) => activity.id === id);
