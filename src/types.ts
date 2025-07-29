
export interface Option {
    id: number | string;
    name: string;
}

export interface FieldConfig {
    label: string;
    field: string;
    type: "text" | "autocomplete" | "number" | 'date';
    disabled: boolean;
    defaultValue: string;
    value?: any;
    required?: boolean;
    options?: Option[]
};

