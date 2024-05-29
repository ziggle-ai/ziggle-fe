import axios from 'axios';

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
