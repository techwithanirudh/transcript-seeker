import { DatePicker } from '@meeting-baas/ui/date-picker';
import { FormControl, FormItem, FormMessage } from '@meeting-baas/ui/form';

import type { AutoFormInputComponentProps } from '../types';
import AutoFormLabel from '../common/label';
import AutoFormTooltip from '../common/tooltip';

export default function AutoFormDate({
  label,
  isRequired,
  field,
  fieldConfigItem,
  fieldProps,
}: AutoFormInputComponentProps) {
  return (
    <FormItem>
      <AutoFormLabel label={fieldConfigItem.label || label} isRequired={isRequired} />
      <FormControl>
        <DatePicker date={field.value} setDate={field.onChange} {...fieldProps} />
      </FormControl>
      <AutoFormTooltip fieldConfigItem={fieldConfigItem} />

      <FormMessage />
    </FormItem>
  );
}
