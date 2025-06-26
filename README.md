# Lambda Email Sender

Este projeto permite enviar e-mails usando uma função AWS Lambda escrita em Node.js, com envio via Gmail SMTP.

---

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript utilizado para desenvolver a função Lambda.
- **AWS Lambda**: Serviço de computação serverless da AWS onde a função é executada.
- **nodemailer**: Biblioteca Node.js para envio de e-mails via SMTP.
- **dotenv**: Carrega variáveis de ambiente a partir de um arquivo `.env`.

---

## O que você vai precisar

- Conta na [AWS](https://aws.amazon.com/)
- Conta Gmail (de preferência só para este uso)
- [Node.js](https://nodejs.org/) instalado localmente
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) instalada e configurada

---

## Passo a Passo

### 1. Clonar o repositório

```bash
git clone https://github.com/rrafaelc/apaeventus-email-sender-cloud.git
cd apaeventus-email-sender-cloud
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie o arquivo de exemplo e preencha com seus dados:

```bash
cp .env.example .env
```

Edite o `.env` com:
- Seu e-mail e senha/app password do Gmail
- Suas credenciais AWS (Access Key, Secret Key, Região)
- O nome da função Lambda que você vai criar

**Exemplo:**
```
GMAIL_USER=seu_email@gmail.com
GMAIL_PASS=sua_senha_ou_app_password
AWS_ACCESS_KEY_ID=sua_access_key
AWS_SECRET_ACCESS_KEY=sua_secret_key
AWS_REGION=us-east-2
LAMBDA_FUNCTION_NAME=nome_da_sua_lambda
```

> **Dica:** Para Gmail, crie uma [App Password](https://support.google.com/accounts/answer/185833?hl=pt-BR) se a verificação em duas etapas estiver ativada.

---

### 4. Criar a função Lambda na AWS

1. Acesse o [AWS Lambda Console](https://console.aws.amazon.com/lambda/).
2. Clique em **Criar função**.
3. Escolha **Autor do zero**.
4. Dê um nome (ex: `minha-funcao-lamba`).
5. Em **Tempo de execução**, escolha **Node.js 18.x**.
6. Clique em **Criar função**.
7. Após criada, aumente o **Timeout** para pelo menos 30 segundos em **Configuração > Geral**.
8. Anote o nome da função para usar no `.env`.

---

### 5. Deploy da função Lambda

#### Manualmente via AWS CLI

1. Empacote o código:
   ```bash
   zip -r lambdaSendEmail.zip index.js node_modules package.json .env
   ```
2. Atualize o código na Lambda:
   ```bash
   aws lambda update-function-code --function-name NOME_DA_SUA_LAMBDA --zip-file fileb://lambdaSendEmail.zip
   ```
3. (Opcional) Ajuste o timeout:
   ```bash
   aws lambda update-function-configuration --function-name NOME_DA_SUA_LAMBDA --timeout 30
   ```

#### Ou via GitHub Actions

- Configure os segredos no seu repositório GitHub:
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_REGION`
  - `LAMBDA_FUNCTION_NAME`
  - `GMAIL_USER`
  - `GMAIL_PASS`
- Faça push para a branch `main` e o deploy será automático.

---

### 6. Chamando a Lambda de outro backend (exemplo NestJS)

Use o AWS SDK para chamar a Lambda:

```typescript
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';

const lambda = new LambdaClient({ region: process.env.AWS_REGION, credentials: { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY } });

const payload = {
  to: 'destinatario@email.com',
  subject: 'Assunto',
  text: 'Mensagem',
};

const command = new InvokeCommand({
  FunctionName: process.env.LAMBDA_FUNCTION_NAME,
  Payload: Buffer.from(JSON.stringify(payload)),
});

const response = await lambda.send(command);
```

---

## Dicas e Observações

- **Nunca compartilhe seu `.env`!**
- O envio via Gmail SMTP pode ser bloqueado pela AWS Lambda em alguns casos. Se não funcionar, tente outro serviço SMTP ou AWS SES.
- O custo da Lambda depende do tempo de execução e memória usada, não do timeout configurado.
- Se for usar em produção, considere usar filas (SQS) para garantir o envio dos e-mails.

---

## Problemas comuns

- **Timeout:** aumente o timeout da Lambda para 30 segundos.
- **Erro de autenticação AWS:** revise suas credenciais e permissões.
- **E-mail não chega:** verifique se o Gmail não bloqueou o acesso (veja alertas de segurança na conta).

---

## Licença

MIT
