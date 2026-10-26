import methodologie from './methodologie-modeles';
import production from './production-lineaire';
import croissance from './croissance-exponentielle';
// @new-lesson-import
import { definePresentation } from './define';

export const exercises = definePresentation([
  methodologie,
  production,
  croissance,
  // @new-lesson-entry
]);
export const activities = exercises.flatMap((section) => section.activities);
export const getActivity = (id: string) => activities.find((activity) => activity.id === id);
