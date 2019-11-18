# nodejs-api-authentication-authorization-sample
## Autenticação utilizando JWT (JSON Web Token)

O JWT como o nome diz é um token utilizado para permitir o controle de acesso, ele é dividido em 3 partes divididas por um ponto (.), sendo a primeira parte o cabeçalho do token (***eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9***), o cabeçalho especifica informações como o algoritmo usado para gerar a assinatura (a terceira parte). 

O cabeçalho não muda muito pois geralmente se utiliza a mesma configuração, porém é possível configurá-lo de forma a atender as suas necessidade informando outro algoritmo e tipos.

A segunda parte é a carga útil do arquivo ou o corpo ( ***eyJfaWQiOiI1ZGNmNjk4ZWRhYjNlZjRiOTViMzg0ZDUiLCJleHAiOjE1NzM4ODA3NjMsInJiYWMiOlt7Il9pZCI6IjVkY2Y2M2I0NzE5YWY3NDRjODVmZTIxOCIsInByb2R1Y3QiOiJUZXN0ZUF1dGhvcml6YXRpb24iLCJhcGxpY2F0aW9uIjoiQXBsaWNhY2FvVGVzdGUiLCJyb2xlcyI6WyJhZG1pbi9tZW51Il19XSwiaWF0IjoxNTczODc3MTYzfQ***), que contém informações específicas do aplicativo, em nosso exemplo apresenta o id do usuário, as identificações das funções do usuário, juntamente com informações sobre a validade e validade do token. 

A terceira parte é a assinatura ( ***zOhDwQVEc640cxAi9H8w1ReXNpbvNBfg_VrZFK67KkY***) ela é gerada combinando o hash as duas primeiras partes, juntamente com uma chave secreta, com estas combinações é possível validar se o token é um token autêntico e não foi modificados por um terceiro.

## Autorizações do Usuário utilizando RBAC (Role-based Access Control)

Dado a carga útil do arquivo JWT, em nosso exemplo nos informando quais são as **roles (funções) ** do usuário que é formado por um id, descrição do produto, descrição da aplicação e um conjunto de perfis a qual o usuário pertence.

Podemos verificar a validade do token efetuando a analise da assinatura do mesmo, e com isso assumimos que quem gerou o JWT incluiu as funções do usuário, ou seja são as funções dadas ou permitidas no momento da autenticação. 

Uma vez que a carga util é autentica, podemos as funções que o usuário tem direito de consumo em uma API, ou em métodos utilizado em softwares, bem como configurações para filtrar os dados ou entregar apenas o que o perfil do usuário pode ter acesso.

## Prova de Conceito (POC)
#### nodejs-api-authentication-authorization-sample
Para efetuarmos nossa prova de conceito criei uma solução que apresenta como unir o poder do JWT com uma solução de RBAC de forma simples e de fácil entendimento. 

No momento da criação de nossa POC foi utilizado o NodeJs na versão v12.13.0 e o npm na versão 6.12.0. 
Verifique se você instalou o Node.js no seu computador, caso contrário navegue para https://nodejs.org, faça o download e instale a versão mais recente.

Após estes passos crie um diretório em seu computador e clone o repositório deste projeto, ele pode ser acessada através do github na seguinte url: https://github.com/leonardo-norbiato/nodejs-api-authentication-authorization-sample

### Estrutura do projeto
.\
├── config\
│   └── default.json\
├── controllers\
│   ├── auth.controller.js\
│   └── user.controller.js\
├── middleware\
│   └── auth.js\
├── migration\
│   ├── data\
│   │   ├── roles.json\
│   │   └── users.json\
│   └── migration.js\
├── models\
│   ├── role.model.js\
│   └── user.model.js\
├── package.json\
├── package-lock.json\
├── postman_collection\
│   └── nodejs-api-authentication-authorization-sample.postman_collection.json\
├── routes\
│   └── index.js\
├── services\
│   └── role.service.js\
├── util\
|   ├── index.js\
|   └── token.js\
├── LICENSE\
├── index.js\
└── README.md\

### Dependências usadas
Nosso projeto precisará de vários pacotes npm e abaixo está a lista desses pacotes e uma breve explicação sobre o que cada um desses pacotes nos ajudará a alcançar.

> **mongodb** - MongoDB é um software de banco de dados orientado a documentos, classificado como um programa de banco de dados NoSQL, o MongoDB usa documentos semelhantes a JSON.

> **config** - Permite definir um conjunto de parâmetros padrões e estendê-los para diferentes ambientes de implantação usado neste projeto para recuperar configurações de acesso ao mongo, secredo para assinar o JWT e configurações do projeto.

> **joi** - O joi permite que você descreva seus dados usando uma linguagem simples, intuitiva e legível, descrevemos nossos modelos de dados para validação de entrada dos dados, podendo ser extendido para atender a validação da saída de dados.

> **express** - Uma estrutura node.js que facilita a criação de aplicativos da web.

> **mongoose** - Uma ferramenta de modelagem de objetos projetada para funcionar em um ambiente assíncrono. Usaremos o mongoose para definir esquemas de banco de dados e interagir com o banco de dados Mongo.

> **jsonwebtoken** - Uma implementação do JSON Web Token (JWT) que será usado para autenticação e autorização, podendo atender requisições assincronas e ou sincronas.

> **bcrypt** - Isso nos ajudará a criar senhas de usuário com hash antes de armazená-las no banco de dados.

> **role-acl** - Uma ferramenta para controle de acesso baseado em funções, atributos e condições para Node.js que permite mesclar as melhores características de dois mundos o RBAC e o ABAC, implementando os principios basicos do RBAC mas também se concentrando no recurso, atributos e condições de ação (ABAC - Attribute-based Access Control).


Instale as dependências do projeto executando o comando **npm i** no diretório em que foi clonado o projeto. Para o MongoDB pode-se utilizar o mesmo conteinerizado utilizando a solução docker, este por sua vez depende do docker estar instalado em seu computador.

### Facilitadores
Para facilitar os testes foi disponibilizado na pasta **postman_collection** uma coleção que poderá ser importado no Postman e utilizado para os testes da prova de conceito, por este motivo aconcelhamos instalar o **Postman**, caso contrário você deverá configurar as requisições em seu aplicativo de sua preferência.

Na pasta migration existe o arquivo **migration.js** que pode ser utilizado para ***criar as coleções basicas com os registros aplicados em nossos testes***, criando a coleção users e roles. ## Iniciando a APIVamos começar inicializando o servidor HTTP com as rotas necessárias no arquivo index.js arquivo, executando o seguinte comando "node ."

Após iniciar o servidor HTTP podemos efetuar nossa prova de conceito.

### Cenário a ser testado
**Contextualizando:**

Existem dois usuários cadastrados (caso voce tenha executado o migration.js, para este teste é extremamente aconselhável executá-lo, após entendimento do conceito do teste poderá ser ajustado para o cenário que melhor lhe agrade.). 
- **leonardo.norbiato** que tem em sua configuração de controle de acesso a função "usuario/operador".
- **lnorbiato** que tem em sua configuração de controle de acesso a função "admin/menu".

Existem duas configurações de controle de acesso, sendo: 
- **"usuario/operador"** que pode ter acesso ao recurso **"menu"** utilizando a ação **"read"** no contexto da aplicação **"AplicacaoTeste"**, com o atributo **"root"**. 
- **"admin/menu"** que pode ter acesso ao recurso **"menu"** utilizando a ação **"read"** no contexto da aplicação **"AplicacaoTeste"**, com o atributo **"root" ** e **"admin"**.

### Testes

1. **Efetuar GET verificando os dados do usuário conectado a api**
> **GET** em http://localhost:3000/api/users/current.\

É esperado receber o retorno de Acesso Negado, pois esta requisição foi efetuada sem um JWT válido.\
 
2. **Efetuar o POST fazendo o login do usuário, gerando um JWT válido:**
> **POST** em http://localhost:3000/api/auth/login\
> **body** -> JSON -> {"username":"leonardo.norbiato", "password": "S3cr#t123!@#"}\

 É esperado receber o um JSON como retorno contendo o email do usuário, e no header do retorno um parâmetro chamado x-auth-token contendo o JWT do login, este deverá ser utilizado nas próximas requisições.\

3. **Efetuar GET verificando os dados do usuário conectado.** 
> **GET** em http://localhost:3000/api/users/current \
> **Header** -> x-access-token ou Authorization contendo o JWT retornado no login.\

 É esperado receber um JSON contento todos os dados do usuário incluindo o nó que representa as funções do mesmo (rbac).\
	
4. **Efetuar o GET do menu do usuário informando o atributo admin.** 
> **GET** em http://localhost:3000/api/users/menu/admin \
> **Header** -> x-access-token ou Authorization contendo o JWT retornado no login. \
> **Header** -> x-api-context -> {"aplication":"AplicacaoTeste"}\

Neste teste estamos efetuando uma chamada HTTP utilizando o Verbo GET na api "api/users/menu/" sendo o ultimo parâmetro o atributo do menu que desejamos receber (ou permissão ou os links), o x-api-context é utilizado para informar ao nosso motor de regras que o usuário está efetuando a chamada utilizando a aplicação AplicacaoTeste. \
É esperado receber o retorno ERRO:Sem Menu para este usuário, informando que este usuário não tem acesso ao recurso menu, com o atributo admin, no contexto da aplicação AplicacaoTeste.\
	
5. **Efetuar o GET na api menu do usuário informando o atributo root.** 
> **GET** em http://localhost:3000/api/users/menu/root \
> **Header** -> x-access-token ou Authorization contendo o JWT retornado no login. \
> **Header** -> x-api-context -> {"aplication":"AplicacaoTeste"}\

Neste teste estamos efetuando uma chamada HTTP utilizando o Verbo GET na api "api/users/menu/" sendo o ultimo parâmetro o atributo do menu que desejamos receber (ou permissão ou os links), o x-api-context é utilizado para informar ao nosso motor de regras que o usuário está efetuando a chamada utilizando a aplicação AplicacaoTeste. \
É esperado receber o retorno SUCESSO- Tem Permissão, informando que este usuário tem acesso ao recurso menu, com o atributo admin, no contexto da aplicação AplicacaoTeste.\
	
6. **Efetuar o POST fazendo outro Login, trocando para o usuario lnorbiato.**
> **POST** em http://localhost:3000/api/auth/login \
> **body** -> JSON -> {"username":"lnorbiato", "password": "S3cr#t123!@#"}\

É esperado receber o um JSON como retorno contendo o e-mail do usuário, e no header do retorno um parâmetro chamado x-auth-token contendo o JWT do login, este deverá ser utilizado nas próximas requisições.\
	
7. **Efetuar GET verificando os dados do usuário conectado.** 
> **GET** em http://localhost:3000/api/users/current \
> **Header** -> x-access-token ou Authorization contendo o JWT retornado no login.\
 
É esperado receber um JSON contento todos os dados do usuário incluindo o nó que representa as funções do mesmo (rbac). \
Este por sua vez não tem em suas permissões o acesso ao atributo admin do menu, contendo apenas o acesso ao root.\
	
8. **Efetuar o GET do menu do usuário informando o atributo admin.** 
> **GET** em http://localhost:3000/api/users/menu/admin \
> **Header** -> x-access-token ou Authorization contendo o JWT retornado no login. \
> **Header** -> x-api-context -> {"aplication":"AplicacaoTeste"}\

Neste teste estamos efetuando uma chamada HTTP utilizando o Verbo GET na api "api/users/menu/" sendo o ultimo parâmetro o atributo do menu que desejamos receber (ou permissão ou os links), o x-api-context é utilizado para informar ao nosso motor de regras que o usuário está efetuando a chamada utilizando a aplicação AplicacaoTeste. \
É esperado receber o retorno SUCESSO- Tem Permissão, informando que este usuário não tem acesso ao recurso menu, com o atributo admin, no contexto da aplicação AplicacaoTeste.\
	
9. **Efetuar o GET na api menu do usuário informando o atributo root.** 
> **GET** em http://localhost:3000/api/users/menu/root \
> **Header** -> x-access-token ou Authorization contendo o JWT retornado no login. \
> **Header** -> x-api-context -> {"aplication":"AplicacaoTeste"}\

Neste teste estamos efetuando uma chamada HTTP utilizando o Verbo GET na api "api/users/menu/" sendo o ultimo parâmetro o atributo do menu que desejamos receber (ou permissão ou os links), o x-api-context é utilizado para informar ao nosso motor de regras que o usuário está efetuando a chamada utilizando a aplicação AplicacaoTeste. \
É esperado receber o retorno SUCESSO- Tem Permissão, informando que este usuário tem acesso ao recurso menu, com o atributo admin, no contexto da aplicação AplicacaoTeste.\
	 
###### Pode-se efetuar alterações como contexto da requisição afim de verificar se a POC está realmente levando em consideração o contexto informado.

10. **Efetuar o GET na api menu do usuário informando o atributo root.** 
> **GET** em http://localhost:3000/api/users/menu/root \
> **Header** -> x-access-token ou Authorization contendo o JWT retornado no login. \
> **Header** -> x-api-context -> {"aplication":"AplicacaoTeste2"}\

Neste teste estamos efetuando uma chamada HTTP utilizando o Verbo GET na api "api/users/menu/" sendo o ultimo parâmetro o atributo do menu que desejamos receber (ou permissão ou os links), o x-api-context é utilizado para informar ao nosso motor de regras que o usuário está efetuando a chamada utilizando a aplicação AplicacaoTeste2, sendo esta uma configuração que não foi configurada na aplicação.\
É esperado receber o retorno ERRO:Sem Menu para este usuário, informando que este usuário não tem acesso ao recurso menu, com o atributo admin, no contexto da aplicação AplicacaoTeste.\

##### Leonardo Norbiato
