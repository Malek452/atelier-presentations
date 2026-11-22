import exercice1 from './exercice1';
import exercice2 from './exercice2';
import exercice3 from './exercice3';
import exercice4 from './exercice4';
import exercice5 from './exercice5';
// @new-lesson-import
import { definePresentation } from './define';
export const exercises = definePresentation([
  exercice1, exercice2, exercice3, exercice4, exercice5,
  // @new-lesson-entry
]);
export const activities = exercises.flatMap((section) => section.activities);
export const getActivity = (id: string) => activities.find((activity) => activity.id === id);
