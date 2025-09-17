import { useCallback } from "react";
import { useSelector } from "react-redux";

import { getLanguage } from "../slices/LocalizationSlice";
import { getLocalizationMethod } from "../localizationService";
import type { LocalizationStringsType } from "../localizationModels";

type useLocalizationType = {
    localization: (key: LocalizationStringsType) => string;
};

export const useLocalization = (): useLocalizationType => {
    const language = useSelector(getLanguage);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const localization = useCallback(getLocalizationMethod(language), [language]);

    return { localization };
};
