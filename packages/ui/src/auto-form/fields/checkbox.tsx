import { Checkbox } from '@meeting-baas/ui/checkbox';
import { FormControl, FormItem } from '@meeting-baas/ui/form';

import type { AutoFormInputComponentProps } from '../types';
import AutoFormLabel from '../common/label';
import AutoFormTooltip from '../common/tooltip';

export default function AutoFormCheckbox({
  label,
  isRequired,
  field,
  fieldConfigItem,
  fieldProps,
}: AutoFormInputComponentProps) {
  return (
    <div>
      <FormItem>
        <div className="mb-3 flex items-center gap-3">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} {...fieldProps} />
          </FormControl>
          <AutoFormLabel label={fieldConfigItem.label || label} isRequired={isRequired} />
        </div>
      </FormItem>
      <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
    </div>
  );
}
