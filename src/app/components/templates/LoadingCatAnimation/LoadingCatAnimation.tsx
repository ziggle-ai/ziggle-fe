'use client';

import Lottie from 'lottie-react';

import { useTranslation } from '@/app/i18next/client';
import CatBounceAnimation from '@/assets/animations/cat-bounce.json';

const LoadingCatAnimation = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center">
      <div className="h-12" />
      <Lottie animationData={CatBounceAnimation} loop className="w-40" />
      <div className="text-secondaryText font-medium text-2xl">
        {t('loading')}
      </div>
    </div>
  );
};

export default LoadingCatAnimation;