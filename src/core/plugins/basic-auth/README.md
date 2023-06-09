# Basic Authentication

This plugin includes basic authentication with username / password.

When you create an account a recovery seed phrase (Similar to Bitcoin Wallets / Crypto Wallets) is generated.

The seed phrase is stored in SHA256 format in the database.

A seed phrase consists of `24` words which can be used to recover any account.

If a seed phrase provided matches the hashed version of the seed phrase, the account is recovered.

A new seed phrase is given to the recovered account.

## How Safe is the Recovery Phrase?

Here's some information based on a 12-word phrase.

```
Theoretically, there’s nothing to prevent two people from getting the same BIP39 seed phrase — it could happen. However, the chances of that actually occurring are exceptionally remote.

The BIP39 seed word list contains 2,048 words, so a 12-word seed phrase has about 2048^12 = 2^132  possible combinations, which is about 5.44 X 1039 in scientific notation. 

That’s an impossibly large number: For comparison, the known universe contains an estimated 70 x 1023 stars, and there are about 75 x 717 grains of sand on Earth.

The total number of cryptocurrency wallets is insignificant compared to the number of possible seed phrases. Put simply, it’s virtually impossible for two people to receive the same seed phrase. You would have a much better chance of winning the lottery several times in a row.
```

Source: https://datarecovery.com/rd/what-are-the-odds-of-someone-getting-the-same-bitcoin-seed-phrase/