import React, { useState } from 'react';
import FormDialog from '../../../app/components/FormDialog';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button } from '@mui/material';
import type { StockItemDefaultValuesType, StockItemFormUsagePurposeType } from '../entity';
import StockItemForm, { useStockItemForm } from './StockItemForm';
import { addPropsToReactElement } from '../../entity';
import StockTutorial from '../../../../public/assets/images/stock_tutorial.png';
import FullScreenImage from '../../../components/FullscreenImage';

type StockItemDialogProps = {
  defaultValues?: Partial<StockItemDefaultValuesType>;
  openButton: React.ReactElement<{ onClick: (e: React.MouseEvent) => void }>;
  formUsagePurpose: StockItemFormUsagePurposeType;
};

export const StockItemDialog = (props: StockItemDialogProps) => {
  const { defaultValues, openButton, formUsagePurpose } = props;
  const [open, setOpen] = useState(false);
  const intl = useIntl();

  const {
    control,
    reset,
    handleSubmit,
    getValues,
    stocks,
    isLoading,
    isPurchaseStockItem,
    setIsPurchaseStockItem,
    stockItem: { unit, avgUnitPrice, lastPackageQuantity },
    createOrUpdateStockItemMutation,
  } = useStockItemForm(defaultValues);

  if (isLoading) {
    return null;
  }
  if (stocks && !stocks.length) {
    throw new Error(
      intl.formatMessage({
        defaultMessage: 'Nepodařilo se načíst sklad.',
        id: 'stockItem.stockNotFound',
      }),
    );
  }

  const handleClickOpen = () => {
    if (!defaultValues) {
      reset({});
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (data: StockItemDefaultValuesType) => {
    createOrUpdateStockItemMutation({ ...data, stockId: stocks![0].id });
    handleClose();
  };

  return (
    <FormDialog<StockItemDefaultValuesType>
      isOpen={open}
      onClose={handleClose}
      handleSubmit={() => handleSubmit(onSubmit)}
      actions={
        <>
          <FullScreenImage src={StockTutorial} />
          <Button onClick={handleClose}>
            <FormattedMessage id="formDialog.close" defaultMessage="Zavřít" />
          </Button>
          <Button type="submit">
            <FormattedMessage id="formDialog.save" defaultMessage="Uložit" />
          </Button>
        </>
      }
      formFields={
        <>
          <StockItemForm
            control={control}
            isPurchaseStockItem={isPurchaseStockItem}
            setIsPurchaseStockItem={setIsPurchaseStockItem}
            formUsagePurpose={formUsagePurpose}
            getValues={getValues}
            stockItem={{ lastPackageQuantity, unit, avgUnitPrice }}
          />
        </>
      }
      onOpenButton={addPropsToReactElement(openButton, {
        onClick: (e: React.MouseEvent) => {
          openButton.props.onClick?.(e);
          handleClickOpen();
        },
      })}
      title={intl.formatMessage({
        defaultMessage: 'Upravit skladovou zásobu',
        id: 'stockItem.editStockItem',
      })}
    />
  );
};
