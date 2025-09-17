import { resources } from "./localization";
import { LanguageListEnum, type LocalizationStringsType } from "./localizationModels";


export const localStorageKey = "language";

export const getLocalizationMethod = (language: LanguageListEnum) => {
    const translationStrings = resources[language];

    const localization = (key: LocalizationStringsType) => {
        if (!translationStrings || !translationStrings.translation || !translationStrings.translation[key]) {
            return key;
        }

        return translationStrings.translation[key] as string;
    };

    return localization;
};

export const saveLanguageToLocalStorage = (language: LanguageListEnum) => {
    localStorage.setItem(localStorageKey, language);
};

export const loadLanguageFromLocalStorage = () => {
    const result = localStorage.getItem(localStorageKey);

    if (result) {
        return result as LanguageListEnum;
    }

    return LanguageListEnum.ru;
};

export type LocalizationMethodType = (key: LocalizationStringsType) => string;
