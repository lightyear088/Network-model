export enum LanguageListEnum {
    ru = "ru",
    en = "en",
    zh = "zh"
}

export type LocalizationStringsType = "Registration" | "Welcome" | "Reset" | "Register"



type LanguageModelType = {
    translation: { [key in LocalizationStringsType]?: string; };
    name: string;
};

export type ResourcesType = {
    [key in LanguageListEnum]: LanguageModelType;
};
