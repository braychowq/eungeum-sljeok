import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes
} from 'react';
import styles from './ProductField.module.css';

type ProductFieldSharedProps = {
  label: string;
  caption?: string;
  hint?: ReactNode;
  compact?: boolean;
  className?: string;
  controlClassName?: string;
};

type ProductInputFieldProps = ProductFieldSharedProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'children'> & {
    kind?: 'input';
  };

type ProductTextareaFieldProps = ProductFieldSharedProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> & {
    kind: 'textarea';
  };

type ProductSelectFieldProps = ProductFieldSharedProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    kind: 'select';
    children: ReactNode;
  };

export type ProductFieldProps =
  | ProductInputFieldProps
  | ProductTextareaFieldProps
  | ProductSelectFieldProps;

function getControlProps(props: ProductFieldProps) {
  const controlProps = { ...props } as Record<string, unknown>;
  delete controlProps.label;
  delete controlProps.caption;
  delete controlProps.hint;
  delete controlProps.compact;
  delete controlProps.className;
  delete controlProps.controlClassName;
  delete controlProps.kind;
  delete controlProps.children;
  return controlProps;
}

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export default function ProductField(props: ProductFieldProps) {
  const { label, caption, hint, compact = false, className, controlClassName } = props;
  const fieldClassName = cn(styles.field, compact && styles.compact, className);
  const controlClassNames = cn(styles.control, controlClassName);
  const controlProps = getControlProps(props);

  let control: ReactNode;

  if (props.kind === 'textarea') {
    control = (
      <textarea
        {...(controlProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        className={cn(controlClassNames, styles.textareaControl)}
      />
    );
  } else if (props.kind === 'select') {
    control = (
      <select
        {...(controlProps as SelectHTMLAttributes<HTMLSelectElement>)}
        className={cn(controlClassNames, styles.selectControl)}
      >
        {props.children}
      </select>
    );
  } else {
    control = (
      <input
        {...(controlProps as InputHTMLAttributes<HTMLInputElement>)}
        className={cn(controlClassNames, styles.inputControl)}
      />
    );
  }

  return (
    <label className={fieldClassName}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {caption ? <p className={styles.caption}>{caption}</p> : null}
      </div>
      {control}
      {hint ? <p className={styles.hint}>{hint}</p> : null}
    </label>
  );
}
