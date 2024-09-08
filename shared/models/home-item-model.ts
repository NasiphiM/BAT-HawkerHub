import { EventTypes } from '../Enums/event-types';

export interface HomeItemModel {
  title: string;
  subTitle: string;
  description: string;
  date: Date | null;
  startTime: string;
  endTime: string;
  eventType: EventTypes;
  eventID: number | null;
  campaignID: number | null;
  surveyDone? : boolean | null;
}
