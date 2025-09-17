import { LanguageListEnum, type ResourcesType } from "./localizationModels";


export const resources: ResourcesType = {
    ru: {
        name: "Русский",
        translation: {
            Registration: "Регистрация",
            Welcome: "Добро пожаловать, ",
            Reset: "Сбросить",
            Register: "Зарегистрироваться",
        },
    },
    en: {
        name: "English",
        translation: {
            Registration: "Registration",
            Welcome: "Welcome, ",
            Reset: "Reset",
            Register: "Register",
        },
    },
    zh: {
        name: "中国人",
        translation: {
            Registration: "",
            Welcome: "",
            Reset: "",
            Register: "",
        },
    }
};

const getLanguageArray = () => {
    return Object.keys(resources).map(key => (
        [
            key,
            resources[key as LanguageListEnum].name,
        ]
    ));
};


export const languageList = getLanguageArray();
