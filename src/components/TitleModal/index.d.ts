import React from "react";

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  fullWidth?: boolean;
  width?: number;
  onClose?(e: React.MouseEvent<HTMLDivElement, MouseEvent>): void;
  title?: string;
  print?: boolean;
}
