import { Meta, StoryFn } from '@storybook/react';
import dayjs from 'dayjs';

import { useTranslation } from '@/app/i18next/client';

import NoticeInfo from '.';

export default {
  title: 'organisms/NoticeInfo',
  component: NoticeInfo,
} as Meta<typeof NoticeInfo>;

const Template: StoryFn<typeof NoticeInfo> = (args) => {
  const { t } = useTranslation();

  return <NoticeInfo {...args} t={t} />;
};

const args = {
  title: '23년도 인포팀 신규 부원 모집',
  content: '인포팀에서는 23년도 신규 부원을 모집합니다. 많은 지원 바랍니다.',
  createdAt: dayjs('2023-02-14T11:57:18.740Z'),
  views: 110,
  author: '이정우',
  deadline: dayjs().add(1, 'd'),
  // organization: "INFOTEAM",
  tags: ['인포팀', '신규부원', '모집'],
};

export const Default = Template.bind({});
Default.args = { ...args };
