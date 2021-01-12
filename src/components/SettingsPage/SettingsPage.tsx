import React, { FC, useCallback, useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import PageContainer from '../PageContainer/PageContainer';
import StopwatchSettings from '../AucPage/Settings/StopwatchSettings/StopwatchSettings';
import { RootState } from '../../reducers';
import { setAucSettings, SettingFields } from '../../reducers/AucSettings/AucSettings';
import AucSettings from '../AucPage/Settings/AucSettings/AucSettings';
import './SettingsPage.scss';
import LoadingButton from '../LoadingButton/LoadingButton';
import withLoading from '../../decorators/withLoading';
import { updateSettings } from '../../api/userApi';

const SettingsPage: FC = () => {
  const dispatch = useDispatch();
  const { settings } = useSelector((root: RootState) => root.aucSettings);
  const { username } = useSelector((root: RootState) => root.user);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formMethods = useForm<SettingFields>({ defaultValues: settings });
  const {
    handleSubmit,
    formState: { isDirty },
    reset,
  } = formMethods;

  useEffect(() => {
    reset(settings);
  }, [reset, settings]);

  const handleReset = useCallback(() => reset(), [reset]);
  const onSubmit = useCallback(
    (data) =>
      withLoading(setIsSubmitting, async () => {
        if (username) {
          await updateSettings(data);
        }

        return dispatch(setAucSettings(data));
      })(),
    [dispatch, username],
  );

  return (
    <PageContainer title="Настройки" classes={{ root: 'settings' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <StopwatchSettings formMethods={formMethods} />
        <AucSettings formMethods={formMethods} />
        <div style={{ marginTop: 40 }}>
          <LoadingButton
            isLoading={isSubmitting}
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginRight: 20 }}
            disabled={!isDirty || isSubmitting}
          >
            Применить
          </LoadingButton>
          <Button onClick={handleReset} variant="outlined" disabled={!isDirty}>
            Отменить
          </Button>
        </div>
      </form>
    </PageContainer>
  );
};

export default SettingsPage;