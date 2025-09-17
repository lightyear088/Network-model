import { useDispatch, useSelector } from "react-redux";
import { LanguageListEnum } from "./localizationModels";
import { getLanguage, setLanguage } from "./slices/LocalizationSlice";
import React from "react";
import { languageList } from "./localization";
import { DropDown } from "../../components/base/DropDown";

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