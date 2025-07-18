import i18n from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(I18nextBrowserLanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: "Pt",
    returnObjects: true,
    resources: {
      En: {
        translation: {
          greeting: "Hello world",
          navbar: {
            forum: "Forum",
            messages: "Messages",
            ads: "Ads",
            myads: "My Ads",
            profile: "Profile",
            settings: "Settings",
            login: "Login",
            registo: "Register",
            logOut: "Logout",
            modalTitle: "Invalid Access",
            modalTitle1: "Success",
            modalVariation1: "Logout successful",
            modalVariation2:
              "It's mandatory to login with a landlord or tenant account to access the messages area",
            modalVariation3:
              "It's mandatory to login with a landlord or tenant account to access the forum",
          },
          homepage: {
            subtitle:"Your trusted platform for housing solutions",
            header1: "Landlord Area",
            paragraph1: "Area destined to publishing and editing ads",
            header2: "Explore",
            paragraph2:
              "Area destined to searching and checking out details of various ads",
            header3: "Forum",
            paragraph3:
              "Area destined to publicly sharing information between users",
            modalTitle: "Invalid Access",
            modalVariation1:
              "It's mandatory to login with a landlord account to access the landlord area",
            modalVariation2:
              "It's mandatory to login with a landlord or tennant account to access the Forum",
          },
          myads: {
            newAd: " New Ad",
            orderedBy: "Ordered by:",
            enabledTitle: "Enabled Ads:",
            disabledTitle: "Disabled Ads:",
            search: "Search",
            price: "Price",
            location: "Location",
            lastEdited: "Last Edited",
            edit: "Edit",
            delete: "Delete",
            modalTitle1: "Success",
            modalTitle2: "Error",
            modalVariation1: "Ad eliminated successfully",
            modalVariation2: "Failure with the ad's elimination",
            modalVariation3: "Operation successful",
            modalVariation4: "Operation has failed",
            enable: "Enable",
            disable: "Disable",
          },
          adFormPt1: {
            progress1: "Enter Data",
            progress2: "Confirm Data",
            progress3: "Submission",
            continue: "Continue",
            clearAll: "Clear All",
            validationTitle: "Invalid Form",
            description: "Description",
            location: "Location:",
            couples: "Couples:",
            addEditTags: "Add/Edit Tags",
            bathroom: "Bathroom:",
            gender: "Gender",
            price: "Price",
            name: "Name",
            available: "Available by",
            quantity: "Quantity",
            street: "Street or Avenue",
            accommodationDetails: "Accommodation Details",
            expenses: "Expenses included:",
            yes: "Yes",
            no: "No",
            male: "Male",
            female: "Female",
            indifferent: "Indifferent",
            shared: "Shared",
            private: "Private",
            lookingFor: "Who are you looking for:",
            selectCity: "Select City",
            selectDistrict: "Select District",
            age: "Age:",
            clickUpload: "Click to upload",
            addTags: "Add/Edit Tags",
            add: "Add",
            done: "Done",
            currentTags: "Current Tags:",
            enterTags: "Enter a tag",
            basicInfo: "Basic Information",
            locationInfo: "Location Details",
            targetInfo: "Target Audience",
          },
          adFormPt3: {
            adPreview: "Ad Preview",
            readyMessage: "Ready to submit?",
            goBack: "Go back",
            submit: "Submit Ad",
            modalTitle1: "Success",
            modalTitle2: "Error",
            modalVariation1: "Ad created successfully",
            modalVariation2: "Failure with the ad's submission",
            validationMessage1: "Please insert an image.",
            validationMessage2: "Please fill in the field: {{field}}",
            validationMessage3:
              "Invalid {{field}} field (Max age smaller than Min age).",
            validationMessage4: "Invalid {{field}} field.",
          },
          profile: {
            name: "Name",
            contact: "Contact",
            nationality: "Nationality",
            livedIn: "Has previously stayed in:",
            owns: "Landlord of the following listed accommodations:",
            reviews: "Other people's reviews:",
            message: "Message",
            edit: "Edit",
            enterRating: "Enter the rating (0-5):",
            enterComment: "Enter the comment:",
            validationMessage: "Rating has to be between 0 and 5",
            validationTitle: "Invalid Review",
          },
          loginPage: {
            name: "Name",
            signIn: "Sign In",
            signUp: "Sign Up",
            contact: "Contact",
            nationality: "Nacionality",
            confirm: "Confirm",
            terms:
              "Terms and conditions: by signing up you accept the Terms and Conditions for collecting, sharing, and using your data.",
            landlordAccount: "Landlord Account",
            tenantAccount: "Tenant Account",
            hideText: "Hide example accounts",
            showText: "Show example accounts",
            landlord: "Landlord",
            tenant: "Tenant",
            modalTitle1: "Success",
            modalVariation1: "Sign in successful",
          },
          messages: {
            title: "Messages",
            orderedBy: "Ordered by:",
            enabledTitle: "Active messages:",
            disabledTitle: "Archived messages:",
            search: "Search",
            name: "Name",
            lastEdited: "Last edited",
            archive: " Archive conversation",
            activate: " Activate conversation",
          },
          privateMessage: {
            type: "Type a message",
          },
          adsPage: {
            search: "Search",
            title: "Ads",
            details: "Details",
            message: "Message",
            orderedBy: "Ordered by:",
            addTag: "Add Tag",
            price: "Price",
            clean: "Remove all tags",
            location: "Location",
            lastEdited: "Last Edited",
            modalTitle2: "Error",
            cannot: "It is not allowed to message yourself",
            showFilter: "Show Filters",
            hideFilter: "Hide Filters",
            resetFilter: "Reset Filters",
            applyFilter: "Apply Filters",
            disclaimer: "Only filled in fields will be applied",
            couplesYes: "Couples: Yes",
            couplesNo: "Couples: No",
            ageMin: "Min Age",
            ageMax: "Max Age",
            gender: "Gender: Indifferent",
            male: "Gender: Male",
            female: "Gender: Female",
            priceMin: "Min Price",
            priceMax: "Max Price",
            available: "Available by (date)",
            expensesYes: "Expenses included:",
            expensesNo: "Expenses not included:",
            shared: "Bathroom: shared",
            private: "Bathroom: private",
            street: "Street or Avenue",
            selectCity: "City",
            selectDistrict: "District",
            warning: "Warning",
            warningMessage: "Feature not yet implemented",
            success: "Success",
            successMessage: "Filters applied",
            modalTitle: "Invalid Access",
            modalVariation2:
              "It's mandatory to login with a landlord or tenant account to access the messages area",
          },
          adInfo: {
            modalTitle2: "Error",
            cannot: "It is not allowed to message yourself",
            warning: "Warning",
            warningMessage: "Feature not yet implemented",
            errorMap: "Street not found – showing approximate location",
            years: "Years old",
            reviews: "Other people's reviews:",
          },
          forumThread: {
            type: "Type a message",
          },
        },
      },
      Pt: {
        translation: {
          greeting: "Olá mundo",
          navbar: {
            forum: "Fórum",
            messages: "Mensagens",
            ads: "Anúncios",
            myads: "Meus Anúncios",
            profile: "Perfil",
            settings: "Settings",
            login: "Login",
            registo: "Registo",
            logOut: "Logout",
            modalTitle: "Accesso Inválido",
            modalTitle1: "Sucesso",
            modalVariation1: "Logout bem sucedido",
            modalVariation2:
              "É necessário fazer login com conta de senhorio ou inquilino para aceder à secção de Mensagens",
            modalVariation3:
              "É necessário fazer login com conta de senhorio ou inquilino para aceder à secção de Fórum",
          },
          homepage: {
            subtitle:"A sua plataforma de procura de alojamento de confiança",
            header1: "Área de Senhorio",
            paragraph1: "Área destinada à publicação e edição de anúncios",
            header2: "Explorar",
            paragraph2:
              "Àrea destinada à procura de alojamento e consulta de detalhes dos mesmos",
            header3: "Fórum",
            paragraph3:
              "Àrea destinada à partilha pública de informação entre users",
            modalTitle: "Acesso Inválido",
            modalVariation1:
              "É necessário fazer login com conta de senhorio para aceder à secção de senhorio",
            modalVariation2:
              "É necessário fazer login com conta de senhorio ou inquilino para aceder à secção de Fórum",
          },
          myads: {
            newAd: " Novo Anúncio",
            orderedBy: "Ordenado por:",
            enabledTitle: "Anúncios ativos:",
            disabledTitle: "Anúncios inativos:",
            search: "Pesquisar",
            price: "Preço",
            location: "Localização",
            lastEdited: "Última Edição",
            edit: "Editar",
            delete: "Apagar",
            modalTitle1: "Sucesso",
            modalTitle2: "Erro",
            modalVariation1: "Anúncio eliminado com sucesso",
            modalVariation2: "Falha na eliminação do anúncio",
            modalVariation3: "Sucesso na operação",
            modalVariation4: "Falha na operação",
            enable: "Ativar",
            disable: "Desativar",
          },
          adFormPt1: {
            progress1: "Inserir Dados",
            progress2: "Confirmar Dados",
            progress3: "Submeter",
            continue: "Continuar",
            clearAll: "Limpar Campos",
            validationTitle: "Formulário Inválido",
            description: "Descrição",
            location: "Localização:",
            couples: "Casais:",
            addEditTags: "Adicionar/Editar Tags",
            bathroom: "Casa de banho:",
            gender: "Género",
            price: "Preço",
            name: "Nome",
            available: "Disponível em",
            quantity: "Quantidade",
            street: "Rua ou avenida",
            accommodationDetails: "Detalhes do alojamento",
            expenses: "Despesas incluídas:",
            yes: "Sim",
            no: "Não",
            male: "Homem",
            female: "Mulher",
            indifferent: "Indiferente",
            shared: "Partilhada",
            private: "Privativa",
            lookingFor: "A quem procura alugar:",
            selectCity: "Selecionar Cidade",
            selectDistrict: "Selecionar Distrito",
            age: "Idade:",
            clickUpload: "Clicar para carregar",
            addTags: "Adicionar/Editar Tags",
            add: "Adicionar",
            done: "Concluído",
            currentTags: "Tags Atuais:",
            enterTags: "Insira a tag",
            basicInfo: "Informação Geral",
            locationInfo: "Detalhes da Localização",
            targetInfo: "Público-alvo",
          },
          adFormPt3: {
            adPreview: "Preview do Anúncio",
            readyMessage: "Pronto para submeter?",
            goBack: "Retroceder",
            submit: "Submeter",
            modalTitle1: "Sucesso",
            modalTitle2: "Erro",
            modalVariation1: "Anúncio criado com sucesso",
            modalVariation2: "Falha na submissão do anúncio",
            validationMessage1: "Por favor insira uma imagem.",
            validationMessage2: "Por favor preencha o campo: {{field}}",
            validationMessage3:
              "Campo {{field}} inválido (Max age inferior a Min age).",
            validationMessage4: "Campo {{field}} inválido.",
          },
          profile: {
            name: "Nome",
            contact: "Contacto",
            nationality: "Nacionalidade",
            livedIn: "Já esteve alojado em:",
            owns: "Senhorio dos seguintes alojamentos listados:",
            reviews: "Reviews de outras pessoas:",
            medit: "Editar",
            message: "Mensagem",
            edit: "Editar",
            enterRating: "Insira o rating (0-5):",
            enterComment: "Insira o comentário:",
            validationMessage: "O rating tem que estar entre 0 e 5",
            validationTitle: "Invalid Review",
          },
          loginPage: {
            name: "Nome",
            signIn: "Iniciar Sessão",
            signUp: "Registar",
            contact: "Contacto",
            nationality: "Nacionalidade",
            confirm: "Confirmar",
            terms:
              "Termos e condições: ao aceitar dá consentimento para que os seus dados sejam coletados, compartilhados e utilizados.",
            landlordAccount: "Conta de Senhorio",
            tenantAccount: "Conta de inquilino",
            hideText: "Esconder contas-exemplo",
            showText: "Mostrar contas-exemplo",
            landlord: "Senhorio",
            tenant: "Inquilino",
            modalTitle1: "Sucesso",
            modalVariation1: "Início de sessão bem sucedido",
          },
          messages: {
            messages: "Mensagens",
            orderedBy: "Ordenado por:",
            enabledTitle: "Mensagens ativas:",
            disabledTitle: "Mensagens arquivadas:",
            search: "Pesquisar",
            name: "Nome",
            lastEdited: "Última Edição",
            archive: "Arquivar Conversa",
            activate: "Ativar conversa",
          },
          privateMessage: {
            type: "Escreva uma messagem",
          },
          adsPage: {
            search: "Pesquisar",
            title: "Anúncios",
            details: "Detalhes",
            message: "Mensagens",
            addTag: "Adicionar Tag",
            orderedBy: "Ordenado por:",
            price: "Preço",
            clean: "Remover todas as tags",
            location: "Localização",
            lastEdited: "Última Edição",
            modalTitle2: "Erro",
            cannot: "Não é possível enviar mensagem a si mesmo",
            showFilter: "Mostrar Filtros",
            hideFilter: "Esconder Filtros",
            resetFilter: "Reset Filtros",
            applyFilter: "Aplicar Filtros",
            disclaimer: "Apenas campos preenchidos serão aplicados",
            couplesYes: "Casais: Sim",
            couplesNo: "Casais: Não",
            ageMin: "Idade mínima",
            ageMax: "Idade máxima",
            gender: "Género: Indiferente",
            male: "Género: Masculino",
            female: "Género: Feminino",
            priceMin: "Preço mínimo",
            priceMax: "Preço máximo",
            available: "Disponível em (data)",
            expensesYes: "Despesas incluídas:",
            expensesNo: "Despesas não incluídas:",
            shared: "Casa de banho: partilhada",
            private: "Casa de banho: privativa",
            street: "Rua ou avenida",
            selectCity: "Cidade",
            selectDistrict: "Distrito",
            warning: "Aviso",
            warningMessage: "Feature ainda não implementada",
            success: "Sucesso",
            successMessage: "Filtros aplicados",
            modalTitle: "Accesso Inválido",
            modalVariation2:
              "É necessário fazer login com conta de senhorio ou inquilino para aceder à secção de Mensagens",
          },
          adInfo: {
            modalTitle2: "Erro",
            cannot: "Não é possível enviar mensagem a si mesmo",
            warning: "Aviso",
            warningMessage: "Feature ainda não implementada",
            errorMap: "Rua não encontrada – mostrando localização aproximada",
            years: "Anos",
            reviews: "Reviews de outras pessoas:",
          },
          forumThread: {
            type: "Escreva uma messagem",
          },
        },
      },
    },
  });
