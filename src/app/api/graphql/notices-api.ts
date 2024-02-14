import { RESTDataSource } from '@apollo/datasource-rest';

import {
  NoticeDetail,
  NoticePaginationParams,
  Notices,
  NoticeSearchParams,
} from '@/api/notice/notice';
import { Locale } from '@/app/i18next/settings';

export default class NoticesAPI extends RESTDataSource {
  override baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  async getNotices({
    offset,
    limit,
    tags = [],
    ...params // attach auth token if needed
  }: NoticeSearchParams & NoticePaginationParams = {}) {
    return this.get<Notices>('notice', {
      params: {
        ...params,
        offset: offset?.toString(),
        limit: limit?.toString(),
        tags: tags.length > 0 ? tags.join(',') : undefined,
      },
    });
  }

  async getNotice(data: { id: number }, token: string) {
    return this.get<NoticeDetail>(`notice/${data.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async createNotice(
    data: {
      title: string;
      body: string;
      deadline?: Date;
      tags?: number[] | null;
      images?: string[] | null;
    },
    token: string,
  ) {
    return this.post<NoticeDetail>('notice', {
      body: data,
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async attachInternationalNotice(
    data: {
      title: string;
      body: string;
      deadline?: Date;
      noticeId: number;
      contentId: number;
      lang: Locale;
    },
    token: string,
  ) {
    const { noticeId, contentId, ...body } = data;

    return this.post<NoticeDetail>(`notice/${noticeId}/${contentId}/foreign`, {
      body: body,
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async createAdditionalNotice(
    data: {
      title?: string;
      body: string;
      deadline?: Date;
      noticeId: number;
    },
    token: string,
  ) {
    const { noticeId, ...body } = data;

    return this.post<NoticeDetail>(`notice/${noticeId}/additional`, {
      body: body,
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async deleteNotice(id: number, token: string) {
    try {
      await this.delete(`notice/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  async addReaction(noticeId: number, emoji: string, token: string) {
    return this.post(`notice/${noticeId}/reaction`, {
      body: { emoji },
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async deleteReaction(noticeId: number, emoji: string, token: string) {
    return this.delete(`notice/${noticeId}/reaction`, {
      body: { emoji },
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
