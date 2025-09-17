import { useDispatch, useSelector } from "react-redux";

import React from "react";
import { getLanguage, setLanguage } from "../slices/LocalizationSlice";
import type { LanguageListEnum } from "../localizationModels";
import { DropDown } from "../../../components/base/DropDown";
import { languageList } from "../localization";


export const LanguageSelector: React.FC = () => {
    const dispatch = useDispatch();
    const language = useSelector(getLanguage);
    const onChange = React.useCallback((val: LanguageListEnum) => {
        dispatch(setLanguage(val));
    }, [dispatch]);

    return <DropDown<LanguageListEnum>
        id="language-selector"
        itemList={languageList}
        labelId="language-selector-label"
        onChange={onChange}
        value={language}
        title={""}
        selectClassName="selector"
        formClassName="language-selector-dropdown"
    />;
};