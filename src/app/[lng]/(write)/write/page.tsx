'use client';

import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import 'react-datetime-picker/dist/DateTimePicker.css';

import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Swal from 'sweetalert2';
import { Editor } from 'tinymce';

import LogEvents from '@/api/log/log-events';
import sendLog from '@/api/log/send-log';
import Button from '@/app/components/atoms/Button';
import Toggle from '@/app/components/atoms/Toggle/Toggle';
import { PropsWithLng } from '@/app/i18next';
import { useTranslation } from '@/app/i18next/client';
import AddPhotoIcon from '@/assets/icons/add-photo.svg';
import ClockIcon from '@/assets/icons/clock.svg';
import GlobeIcon from '@/assets/icons/globe.svg';
import TagIcon from '@/assets/icons/tag.svg';
import TypeIcon from '@/assets/icons/type.svg';
import { NOTICE_LOCAL_STORAGE_KEY } from '@/utils/constants';

import AttachPhotoArea, { FileWithUrl } from './AttatchPhotoArea';
import DeepLButton from './DeepLButton';
import handleNoticeSubmit from './handle-notice-submit';
import LanguageTab from './LanguageTab';
import NoticeTypeSelector, { NoticeType } from './NoticeTypeSelector';
import TagInput, { Tag } from './TagInput';
import TitleAndContent from './TitleAndContent';

export default function WritePage({
  params: { lng },
}: {
  params: PropsWithLng;
}) {
  const { t } = useTranslation(lng);
  const { push } = useRouter();

  const [koreanTitle, setKoreanTitle] = useState('');
  const [englishTitle, setEnglishTitle] = useState('');

  const [hasDeadline, setHasDeadline] = useState(false);
  const [deadline, setDeadline] = useState<Date | null>(new Date());
  const [selectedNoticeType, setSelectedNoticeType] =
    useState<NoticeType>('recruit');

  const [tags, setTags] = useState<Tag[]>([]);

  const [hasEnglishContent, setHasEnglishContent] = useState(false);
  const [writingTab, setWritingTab] = useState<'korean' | 'english'>('korean');

  const [photos, setPhotos] = useState<FileWithUrl[]>([]);

  const koreanEditorRef = useRef<Editor>(null);
  const englishEditorRef = useRef<Editor>(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkLocalStorage = async () => {
      if (localStorage.getItem(NOTICE_LOCAL_STORAGE_KEY)) {
        const { koreanTitle, englishTitle, koreanBody, englishBody } =
          JSON.parse(localStorage.getItem(NOTICE_LOCAL_STORAGE_KEY) ?? '{}');

        if (!koreanTitle && !englishTitle && !koreanBody && !englishBody)
          return;

        const confirm = await Swal.fire({
          text: t('write.hasSavedNotice'),
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: t('alertResponse.yes'),
          cancelButtonText: t('alertResponse.no'),
        });

        if (!confirm.isConfirmed) return;

        setKoreanTitle(koreanTitle);
        setEnglishTitle(englishTitle);
        if (englishTitle) {
          setHasEnglishContent(true);
        }

        if (koreanEditorRef.current) {
          koreanEditorRef.current.setContent(koreanBody);
        }
        if (englishEditorRef.current) {
          englishEditorRef.current.setContent(englishBody);
        }
      }
    };
    checkLocalStorage();
  }, [t]);

  const handleSubmit = async () => {
    if (isLoading) return;
    const koreanBody = koreanEditorRef.current?.getContent();
    const englishBody = englishEditorRef.current?.getContent();

    setIsLoading(true);
    const noticeId = await handleNoticeSubmit({
      title: koreanTitle,
      deadline: hasDeadline ? deadline ?? undefined : undefined,
      noticeLanguage: hasEnglishContent ? 'both' : 'ko',
      koreanBody,
      enTitle: englishTitle,
      englishBody,
      tags: [selectedNoticeType, ...tags.map((tag) => tag.name)],
      images: photos.map((image) => image.file),
      t,
    });
    if (!noticeId) {
      setIsLoading(false);
      return;
    }
    push(`/${lng}/notice/${noticeId}`);
  };

  return (
    <main className="flex flex-col items-center py-12">
      <div className="content flex max-w-[600px] flex-col">
        <div className={'flex justify-end'}>
          <p className={'text-sm text-primary'}>
            {t('write.autoSaveDescription')}
          </p>
        </div>

        <div className={'mb-10 mt-10 flex items-center gap-2'}>
          <GlobeIcon
            className={
              'w-5 md:w-6 ' +
              (hasEnglishContent
                ? 'stroke-text dark:stroke-dark_white'
                : 'stroke-grey dark:stroke-dark_grey')
            }
          />
          <p
            className={
              'mr-1 text-lg font-medium ' +
              (hasEnglishContent
                ? 'text-text dark:text-dark_white'
                : 'text-grey dark:text-dark_grey')
            }
          >
            {t('write.writeEnglishNotice')}
          </p>
          <Toggle
            isSwitched={hasEnglishContent}
            onSwitch={(e) => {
              setHasEnglishContent(e.target.checked);
              sendLog(LogEvents.noticeWritingPageCheckEnglish, {
                hasEnglishContent: e.target.checked,
              });
            }}
          />
        </div>

        <div className="mb-3 flex gap-[6px]">
          <TypeIcon className="w-5 stroke-text md:w-6 dark:stroke-dark_white" />
          <p className="font-medium">{t('write.noticeType')}</p>
        </div>

        <NoticeTypeSelector
          selectedNoticeType={selectedNoticeType}
          setNoticeType={setSelectedNoticeType}
          t={t}
        />

        {hasEnglishContent && (
          <div className="mt-10">
            <LanguageTab
              writingTab={writingTab}
              setWritingTab={setWritingTab}
              t={t}
            />
          </div>
        )}

        <div
          className={
            'flex flex-col justify-stretch ' +
            (writingTab !== 'korean' ? 'hidden' : '')
          }
        >
          <TitleAndContent
            editorRef={koreanEditorRef}
            title={koreanTitle}
            setTitle={setKoreanTitle}
            language="korean"
            t={t}
          />
        </div>

        <div
          className={
            'flex flex-col justify-stretch ' +
            (writingTab === 'korean' ? 'hidden' : '')
          }
        >
          <TitleAndContent
            editorRef={englishEditorRef}
            title={englishTitle}
            setTitle={setEnglishTitle}
            language="english"
            t={t}
          />
        </div>

        {hasEnglishContent && (
          <DeepLButton
            t={t}
            editorRef={
              writingTab === 'korean' ? koreanEditorRef : englishEditorRef
            }
            originalLanguage={writingTab === 'korean' ? 'korean' : 'english'}
          />
        )}

        <div className={'mb-3 mt-10 flex items-center gap-2'}>
          <ClockIcon
            className={'w-5 stroke-text md:w-6 dark:stroke-dark_white'}
          />

          <p className="text-lg font-medium">{t('write.setupDeadline')}</p>

          <Toggle
            isSwitched={hasDeadline}
            onSwitch={(e) => {
              setHasDeadline(e.target.checked);
              sendLog(LogEvents.noticeWritingPageCheckDeadline, {
                hasDeadline: e.target.checked,
              });
            }}
          />
        </div>

        <div className="mb-2 mt-10 flex gap-2">
          <TagIcon className="w-5 dark:fill-white md:w-6" />
          <p className="font-medium md:text-lg">{t('write.setupTags')}</p>
          <p className={'text-grey'}>{`(${t('common.optional')})`}</p>
        </div>

        <p className="font-regular mb-3 text-sm text-secondaryText">
          {t('write.writeTagsDescription')}
        </p>

        <TagInput tags={tags} setTags={setTags} t={t} />

        <div className="mb-1 mt-10 flex items-center gap-2">
          <AddPhotoIcon className="w-5 dark:fill-white md:w-6" />
          <p className="font-medium md:text-lg">{t('write.attachPhoto')}</p>
          <p className={'text-grey'}>{`(${t('common.optional')})`}</p>
        </div>
        <p className="font-regular mb-3 text-sm text-secondaryText">
          {t('write.photoDescription')}
        </p>

        <AttachPhotoArea t={t} photos={photos} setPhotos={setPhotos} />
      </div>

      <Button
        variant="contained"
        className="mb-4 mt-[10rem] w-60 rounded-[10px] py-2"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        <p className="mx-3 my-1 text-base font-bold">{t('write.submit')}</p>
      </Button>
      <p className="font-regular max-w-[70%] text-center text-sm text-secondaryText">
        {t('write.submitDescription')}
      </p>
    </main>
  );
}