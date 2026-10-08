import type { ReactNode } from 'react';
import * as RD from '@radix-ui/react-dialog';
import './Dialog.css';

export interface DialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Element that opens the dialog. Omit to control it with `open`. */
  trigger?: ReactNode;
  /** Names the dialog for screen readers. Describe the action: "Delete route". */
  title: string;
  description?: string;
  children?: ReactNode;
  /** Action buttons. Put the primary action last. */
  footer?: ReactNode;
}

/** Wrap a footer button in DialogClose to close the dialog when it is pressed. */
export const DialogClose = RD.Close;

export function Dialog({ trigger, title, description, children, footer, ...root }: DialogProps) {
  return (
    <RD.Root {...root}>
      {trigger && <RD.Trigger asChild>{trigger}</RD.Trigger>}
      <RD.Portal>
        <RD.Overlay className="hb-dialog__overlay" />
        <RD.Content className="hb-dialog" {...(description ? {} : { 'aria-describedby': undefined })}>
          <RD.Title className="hb-dialog__title">{title}</RD.Title>
          {description && <RD.Description className="hb-dialog__desc">{description}</RD.Description>}
          {children}
          {footer && <div className="hb-dialog__footer">{footer}</div>}
          <RD.Close className="hb-dialog__close" aria-label="Close">×</RD.Close>
        </RD.Content>
      </RD.Portal>
    </RD.Root>
  );
}
