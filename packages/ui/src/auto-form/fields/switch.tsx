import { FormControl, FormItem } from '@meeting-baas/ui/form';
import { Switch } from '@meeting-baas/ui/switch';

import type { AutoFormInputComponentProps } from '../types';
import AutoFormLabel from '../common/label';
import AutoFormTooltip from '../common/tooltip';

export default function AutoFormSwitch({
  label,
  isRequired,
  field,
  fieldConfigItem,
  fieldProps,
}: AutoFormInputComponentProps) {
  return (
    <div>
      <FormItem>
        {/* <div className="flex items-center gap-3"> */}
        <div className="flex flex-row-reverse items-center justify-between py-1">
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} {...fieldProps} />
          </FormControl>
          <AutoFormLabel label={fieldConfigItem.label || label} isRequired={isRequired} />
        </div>
      </FormItem>
      <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
    </div>
  );
}
