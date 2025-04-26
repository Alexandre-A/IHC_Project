import i18n from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n.use(I18nextBrowserLanguageDetector).use(initReactI18next).init({
    debug: true,
    fallbackLng: "Pt",
    returnObjects:true,
    resources:{
        En:{
            translation:{
                greeting: "Hello world",
                navbar:{
                    forum: "Forum",
                    messages: "Messages",
                    ads: "Ads",
                    myads: "My Ads",
                    profile: "Profile",
                    settings: "Settings",
                    login: "Login",
                    registo: "Register",
                },
                homepage:{
                    header1: "Landlord Area",
                    paragraph1: "Area destined to publishing and editing ads",
                    header2: "Explore",
                    paragraph2: "Area destined to searching and checking out details of various ads",
                    header3: "Forum",
                    paragraph3: "Area destined to publicly sharing information between users",
                    modalTitle:"Invalid Access",
                    modalVariation1: "It's mandatory to login with a landlord account to access the landlord area",
                    modalVariation2: "It's mandatory to login with a landlord or tennant account to access the Forum"
                },
                myads:{
                    newAd: " New Ad",
                    orderedBy: "Ordered by:",
                    search:"Search",
                    price: "Price",
                    location: "Location",
                    lastEdited: "Last Edited",
                    edit: "Edit",
                    delete: "Delete",
                    modalTitle1: "Success",
                    modalTitle2: "Error",
                    modalVariation1: "Ad eliminated successfully",
                    modalVariation2: "Failure with the ad's elimination",
                },
                adFormPt1: {
                    progress1: "Enter Data",
                    progress2: "Confirm Data",
                    progress3: "Submission",
                    continue: "Continue",
                    clearAll: "Clear All",
                    validationTitle: "Invalid Form",

                },
                adFormPt2: {

                },
                adFormPt3: {
                    adPreview:"Ad Preview",
                    readyMessage: "Ready to submit?",
                    goBack: "Go back",
                    submit: "Submit Ad",
                    modalTitle1: "Success",
                    modalTitle2: "Error",
                    modalVariation1: "Ad created successfully",
                    modalVariation2: "Failure with the ad's submission",
                    validationMessage1: "Please insert an image.",
                    validationMessage2: "Please fill in the field: {{field}}",
                    validationMessage3: "Invalid {{field}} field (Max age smaller than Min age).",
                    validationMessage4: "Invalid {{field}} field.",
                }, 
                profile:{
                    name: "Name",
                    contact: "Contact",
                    nationality: "Nationality",
                    livedIn: "Has previously stayed in:",
                    owns:"Landlord of the following listed accommodations:",
                    reviews: "Other people's reviews:",
                    message: "Message"
                },
            }
        },
        Pt:{
            translation:{
                greeting: "Olá mundo",
                navbar:{
                    forum: "Fórum",
                    messages: "Mensagens",
                    ads: "Anúncios",
                    myads: "Meus Anúncios",
                    profile: "Perfil",
                    settings: "Settings",
                    login: "Login",
                    registo: "Registo",
                },
                homepage:{
                    header1: "Área de Senhorio",
                    paragraph1: "Área destinada à publicação e edição de anúncios",
                    header2: "Explorar",
                    paragraph2: "Àrea destinada à procura de alojamento e consulta de detalhes dos mesmos",
                    header3: "Fórum",
                    paragraph3: "Àrea destinada à partilha pública de informação entre users",
                    modalTitle:"Acesso Inválido",
                    modalVariation1: "É necessário fazer login com conta de senhorio para aceder à secção Publicar Anúncio",
                    modalVariation2: "É necessário fazer login com conta de senhorio ou inquilino para aceder à secção de Fórum"
                },
                myads:{
                    newAd: " Novo Anúncio",
                    orderedBy: "Ordenado por:",
                    search:"Pesquisar",
                    price: "Preço",
                    location: "Localização",
                    lastEdited: "Última Edição",
                    edit: "Editar",
                    delete: "Apagar",
                    modalTitle1: "Sucesso",
                    modalTitle2: "Erro",
                    modalVariation1: "Anúncio eliminado com sucesso",
                    modalVariation2: "Falha na eliminação do anúncio",
                },
                adFormPt1: {
                    progress1: "Inserir Dados",
                    progress2: "Confirmar Dados",
                    progress3: "Submeter",
                    continue: "Continuar",
                    clearAll: "Limpar Campos",
                    validationTitle: "Formulário Inválido",
                },
                adFormPt2: {

                },
                adFormPt3: {
                    adPreview:"Preview do Anúncio",
                    readyMessage: "Pronto para submeter?",
                    goBack: "Retroceder",
                    submit: "Submeter",
                    modalTitle1: "Sucesso",
                    modalTitle2: "Erro",
                    modalVariation1: "Anúncio criado com sucesso",
                    modalVariation2: "Falha na submissão do anúncio",
                    validationMessage1: "Por favor insira uma imagem.",
                    validationMessage2: "Por favor preencha o campo: {{field}}",
                    validationMessage3: "Campo {{field}} inválido (Max age inferior a Min age).",
                    validationMessage4: "Campo {{field}} inválido.",
                },
                profile:{
                    name: "Nome",
                    contact: "Contacto",
                    nationality: "Nacionalidade",
                    livedIn: "Já esteve alojado em:",
                    owns:"Senhorio dos seguintes alojamentos listados:",
                    reviews: "Reviews de outras pessoas:",
                    message: "Mensagem"
                },
            }
        }
    }
})