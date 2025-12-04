import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { DropdownOption } from '@/types';

/**
 * Hook to get translated health options while preserving API values.
 * This ensures that the `value` sent to the backend remains unchanged,
 * while only the `label` is translated for display.
 */
export const useHealthOptions = () => {
  const { t } = useTranslation();

  const cpOptions: DropdownOption[] = useMemo(() => [
    { label: t('health.options.chestPain.typicalAngina'), value: 1 },
    { label: t('health.options.chestPain.atypicalAngina'), value: 2 },
    { label: t('health.options.chestPain.nonAnginalPain'), value: 3 },
    { label: t('health.options.chestPain.asymptomatic'), value: 4 }
  ], [t]);

  const exangOptions: DropdownOption[] = useMemo(() => [
    { label: t('health.options.exerciseAngina.yes'), value: 1 },
    { label: t('health.options.exerciseAngina.no'), value: 0 }
  ], [t]);

  const sexOptions: DropdownOption[] = useMemo(() => [
    { label: t('health.options.sex.male'), value: 1 },
    { label: t('health.options.sex.female'), value: 0 }
  ], [t]);

  return {
    cpOptions,
    exangOptions,
    sexOptions,
  };
};

/**
 * Hook to get translated month names for the date picker.
 */
export const useMonthNames = () => {
  const { t } = useTranslation();

  const months = useMemo(() => [
    { label: t('health.months.january'), value: 1 },
    { label: t('health.months.february'), value: 2 },
    { label: t('health.months.march'), value: 3 },
    { label: t('health.months.april'), value: 4 },
    { label: t('health.months.may'), value: 5 },
    { label: t('health.months.june'), value: 6 },
    { label: t('health.months.july'), value: 7 },
    { label: t('health.months.august'), value: 8 },
    { label: t('health.months.september'), value: 9 },
    { label: t('health.months.october'), value: 10 },
    { label: t('health.months.november'), value: 11 },
    { label: t('health.months.december'), value: 12 },
  ], [t]);

  return months;
};
