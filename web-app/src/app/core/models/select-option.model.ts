export interface SelectOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
}
