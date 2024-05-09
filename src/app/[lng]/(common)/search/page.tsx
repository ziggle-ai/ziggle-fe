import SearchAnimation from '@/app/components/templates/SearchAnimation';
import { createTranslation, PropsWithLng } from '@/app/i18next';

import SearchResults from '../../../components/templates/SearchResults';

const ITEMS_PER_CALL = 10;

const SearchPage = async ({
  searchParams,
  params: { lng },
}: {
  params: PropsWithLng;
  searchParams: { query: string; tags: string; page: string };
}) => {
  const { query: search, tags: rawTags } = searchParams;
  const tags = rawTags?.split(',').filter(Boolean) ?? [];

  const { t } = await createTranslation(lng);

  return (
    <div className="content mx-auto">
      <div className="align-center flex flex-col">
        {search ? (
          <SearchResults
            logName="SearchPage"
            lng={lng}
            search={search}
            limit={ITEMS_PER_CALL}
            page={searchParams.page}
            tags={tags}
            orderBy="recent"
          />
        ) : (
          <div className="flex w-full justify-center">
            <div className="flex flex-col items-center">
              <SearchAnimation />
              <div className="h-[10px]" />
              <p className="mt-[-30px] pt-5 text-lg font-medium text-secondaryText md:text-2xl">
                {t('searchPage.prompt')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
