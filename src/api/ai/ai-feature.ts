import axios from 'axios';

import { Notices } from '../notice/notice';

export type DetectedNoticeType = {
  title: string;
  body: string;
};

export type CheckResultType = {
  mute: boolean;
  mute_content: DetectedNoticeType;
};

export const checkNotice = ({
  title,
  body,
}: {
  title: string;
  body: string;
}): Promise<CheckResultType> => {
  return fetch('/api/ai/mute_detection', {
    method: 'POST',
    body: JSON.stringify({
      title,
      body,
    }),
  }).then((res) => res.json());
};

const api = axios.create({
  baseURL: process.env.AI_PUBLIC_API_BASE_URL,
});

export const getsimilarNotice = ({
  body,
}: {
  body: string | undefined;
}): Promise<Notices> => {
  console.log('getsimilarNotice', body);
  return api
    .post<Notices>('similar_notices', {
      body,
    })
    .then((res) => {
      return res.data;
    });
};
