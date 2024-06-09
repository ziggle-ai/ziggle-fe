import axios from 'axios';
import { number } from 'prop-types';

import { Notice, Notices } from '../notice/notice';

export type DetectedNoticeType = {
  title: string;
  body: string;
  'similarity score': number;
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

export const postEdgecase = ({
  source_body,
  result_body,
  similarity_score,
}: {
  source_body: string;
  result_body: string;
  similarity_score: number;
}): Promise<void> => {
  return fetch('/api/ai/insert_mute_edge_case', {
    method: 'POST',
    body: JSON.stringify({
      source_body,
      result_body,
      similarity_score,
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
    .post<Notice[]>('similar_notices', {
      body,
    })
    .then((res) => {
      return {
        list: res.data,
        total: res.data.length,
      };
    });
};
