'use client';

import { InfoIcon } from 'lucide-react';
import Link from 'next/link';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/cn';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import type { ReactNode } from 'react';

export function Info({ children }: { children: ReactNode }): ReactNode {
  return (
    <Popover>
      <PopoverTrigger>
        <InfoIcon className="size-4" />
      </PopoverTrigger>
      <PopoverContent className="prose max-h-[400px] min-w-[220px] max-w-[400px] overflow-auto text-sm prose-no-margin">
        {children}
      </PopoverContent>
    </Popover>
  );
}

interface ObjectType {
  /**
   * Additional description of the field
   */
  description?: ReactNode;
  type: string;
  typeDescription?: ReactNode;
  /**
   * Optional link to the type
   */
  typeDescriptionLink?: string;
  default?: string;
}

const th = cva('p-2 font-medium first:pl-0 last:pr-0');
const td = cva('p-2 first:pl-0 last:pr-0');
const field = cva('inline-flex flex-row items-center gap-1');
const code = cva(
  'rounded-md bg-fd-secondary p-1 text-fd-secondary-foreground',
  {
    variants: {
      color: { primary: 'bg-fd-primary/10 text-fd-primary' },
    },
  },
);

export function TypeTable({
  type,
}: {
  type: Record<string, ObjectType>;
}): React.ReactElement {
  return (
    <div className="not-prose overflow-auto whitespace-nowrap">
      <table className="my-4 w-full text-left text-sm text-fd-muted-foreground">
        <thead className="border-b">
          <tr>
            <th className={cn(th(), 'w-[45%]')}>Prop</th>
            <th className={cn(th(), 'w-[30%]')}>Type</th>
            <th className={cn(th(), 'w-1/4')}>Default</th>
          </tr>
        </thead>
        <tbody className="border-collapse divide-y divide-fd-border">
          {Object.entries(type).map(([key, value]) => (
            <tr key={key}>
              <td className={td()}>
                <div className={field()}>
                  <code className={cn(code({ color: 'primary' }))}>{key}</code>
                  {value.description ? <Info>{value.description}</Info> : null}
                </div>
              </td>
              <td className={td()}>
                <div className={field()}>
                  <code className={code()}>{value.type}</code>
                  {value.typeDescription ? (
                    <Info>{value.typeDescription}</Info>
                  ) : null}
                  {value.typeDescriptionLink ? (
                    <Link href={value.typeDescriptionLink}>
                      <InfoIcon className="size-4" />
                    </Link>
                  ) : null}
                </div>
              </td>
              <td className={td()}>
                {value.default ? (
                  <code className={code()}>{value.default}</code>
                ) : (
                  <span>-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}