# Junior Eurovision 2023 voting BOT

### Don't judge me for the quality of the code, I wrote it in a few hours

### Usage/Installation guide

```npm i```

```cp .env.example .env```

### Define your API credentials

```
MATHPIX_APP_ID='Mathpix.com App ID'
MATHPIX_APP_KEY='Mathpix.com App Key'

GPT_API_KEY='OpenAI API Key'
```

[Create OpenAI API Key](https://platform.openai.com/api-keys)

[Create MATHPIX API Credentials](mathpix.com)

Run ``` node index.js ``` and the bot will do its job

### Background process step by step:

1. Open https://vote.junioreurovision.tv
2. It clicks: **"See video"**
3. Bot start to watch video, when video will finish it clicks **"Vote Now"**
4. After that bot selects the first of all: **Georgia** and then randomly other 2 countries and click: **Vote**
5. Then it displays math expression: 
   1. give **SVG** content, pass this into **mathpix.com**(OCR) and return math expression by text. For Example: **4+1**
   2. It sends to **OpenAI**(ChatGPT) API this math expression and give the result number. For example: 4 + 1 => **5**
6. It fills the received number result into **input** and then clicks finally: **Submit**

