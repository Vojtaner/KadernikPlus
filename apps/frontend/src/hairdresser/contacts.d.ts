interface ContactPickerOptions {
  multiple?: boolean;
}
interface ContactPicker {
  name?: string[];
  email?: string[];
  tel?: string[];
  address?: string[];
  icon?: Blob[];
}

interface Navigator {
  contacts: {
    select(
      properties: (keyof ContactPicker)[],
      options?: ContactPickerOptions,
    ): Promise<ContactPicker[]>;
  };
}
